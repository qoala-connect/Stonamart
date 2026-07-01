/**
 * CLIP image embedding — @xenova/transformers (Transformers.js).
 * Model: Xenova/clip-vit-base-patch32 — 768-dim vision encoder output.
 * No API key required. Model (~85 MB quantized) downloads once, cached locally.
 */

import { pipeline, env } from "@xenova/transformers";
import path from "path";

// Absolute cache path — works in both dev and production
env.cacheDir = path.join(process.cwd(), ".transformers-cache");
env.allowLocalModels = false;

const CLIP_DISABLED =
  process.env.VERCEL === "1" ||
  process.env.DISABLE_CLIP_EMBEDDING === "1";

export const CLIP_DIM = 768;

type TransformersPipeline = ReturnType<typeof pipeline> extends Promise<infer T> ? T : never;

let _extractor: TransformersPipeline | null = null;

async function getExtractor(): Promise<TransformersPipeline | null> {
  if (CLIP_DISABLED) return null;
  if (_extractor) return _extractor;

  try {
    const pipelinePromise = pipeline(
      "image-feature-extraction",
      "Xenova/clip-vit-base-patch32",
      { quantized: true }
    );
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("CLIP model load timed out")), 15000);
    });

    _extractor = (await Promise.race([pipelinePromise, timeoutPromise])) as TransformersPipeline;
    return _extractor;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn("[clip] CLIP embedding unavailable:", message);
    _extractor = null;
    return null;
  }
}

function l2Normalize(arr: number[]): number[] {
  const norm = Math.sqrt(arr.reduce((s, v) => s + v * v, 0));
  return norm > 0 ? arr.map((v) => v / norm) : arr;
}

interface TensorLike {
  data: Float32Array;
  dims: number[];
}

function tensorToEmbedding(output: TensorLike): number[] {
  const { data, dims } = output;
  // [1, 50, 768] → take CLS token (first patch = 768-dim)
  // [1, 768]     → use directly
  if (dims.length === 3) {
    return l2Normalize(Array.from(data.slice(0, dims[2])));
  }
  return l2Normalize(Array.from(data));
}

/** Embed an image from a raw Buffer (e.g. multipart upload). */
export async function embedImageBuffer(buffer: Buffer, mimeType: string): Promise<number[] | null> {
  const ext = await getExtractor();
  if (!ext) return null;

  const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
  // Transformers.js pipeline is callable as a function
  const output = await (ext as unknown as (input: string, opts: Record<string, unknown>) => Promise<TensorLike>)(dataUrl, { pool: true });
  return tensorToEmbedding(output);
}

/** Embed an image from a public URL (e.g. Supabase Storage). */
export async function embedImageUrl(url: string): Promise<number[] | null> {
  const ext = await getExtractor();
  if (!ext) return null;

  const output = await (ext as unknown as (input: string, opts: Record<string, unknown>) => Promise<TensorLike>)(url, { pool: true });
  return tensorToEmbedding(output);
}

/** Format embedding as pgvector literal: '[0.1,0.2,...]' */
export function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}
