/**
 * POST /api/admin/embed-products
 *
 * Generates CLIP embeddings for all approved products that have images
 * but no embedding yet. Run this once after enabling pgvector, then it
 * runs automatically on each new product approval.
 *
 * Protected by ADMIN_SETUP_KEY (same key used to create the admin account).
 *
 * Body: { secret: "<ADMIN_SETUP_KEY>" }
 * Returns: { processed: N, skipped: M, errors: [...] }
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface EmbedResult {
  id: string;
  name: string;
  ok: boolean;
  error?: string;
}

export async function POST(request: NextRequest) {
  // ── Auth: require admin setup key ─────────────────────────────────────────
  let secret = "";
  try {
    const body = await request.json();
    secret = body?.secret ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const expectedKey = process.env.ADMIN_SETUP_KEY ?? "stonamart-setup-2024";
  if (secret !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Fetch products needing embeddings ──────────────────────────────────────
  let rows: { id: string; name: string; imageUrls: string[] }[] = [];
  try {
    const result = await db.query<{ id: string; name: string; imageUrls: string[] }>(
      `SELECT id, name, "imageUrls"
       FROM products
       WHERE status = 'APPROVED'
         AND embedding IS NULL
         AND "imageUrls" IS NOT NULL
         AND array_length("imageUrls", 1) > 0
       ORDER BY "createdAt" DESC
       LIMIT 100`
    );
    rows = result.rows;
  } catch (err) {
    return NextResponse.json(
      { error: "DB query failed — make sure pgvector is enabled and embedding column exists.", detail: String(err) },
      { status: 500 }
    );
  }

  if (rows.length === 0) {
    return NextResponse.json({
      message: "All approved products already have embeddings.",
      processed: 0,
      skipped: 0,
      errors: [],
    });
  }

  // ── Generate embeddings one by one ────────────────────────────────────────
  const results: EmbedResult[] = [];
  const { embedImageUrl, toVectorLiteral } = await import("@/lib/clip");

  for (const row of rows) {
    const imageUrl = row.imageUrls[0];
    try {
      const embedding = await embedImageUrl(imageUrl);
      await db.query(
        `UPDATE products SET embedding = $1::vector WHERE id = $2`,
        [toVectorLiteral(embedding), row.id]
      );
      results.push({ id: row.id, name: row.name, ok: true });
    } catch (err) {
      results.push({ id: row.id, name: row.name, ok: false, error: String(err) });
    }
  }

  const processed = results.filter((r) => r.ok).length;
  const errors    = results.filter((r) => !r.ok);

  return NextResponse.json({
    processed,
    skipped: rows.length - processed,
    errors: errors.map((e) => `${e.name}: ${e.error}`),
  });
}
