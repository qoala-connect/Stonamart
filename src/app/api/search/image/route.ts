import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CATALOG_PRODUCTS } from "@/components/catalog/data";
import type {
  CatalogProduct,
  MaterialType,
  ProductUseCategory,
  ProductColor,
  StoneFinish,
  Thickness,
} from "@/components/catalog/types";

export interface ImageSearchResult extends CatalogProduct {
  matchScore: number;
  matchLabel: string;
}

export interface ImageSearchAttributes {
  materialType: string;
  color: string;
  finish: string;
  description: string;
}

const MATERIAL_BG: Record<string, { bg: string; textLight: boolean }> = {
  marble:    { bg: "linear-gradient(165deg,#f7f4ef 0%,#ede8df 40%,#e2dbd0 70%,#ede8df 100%)", textLight: false },
  granite:   { bg: "linear-gradient(140deg,#1c1c1c 0%,#262626 55%,#161616 100%)", textLight: true  },
  quartz:    { bg: "linear-gradient(165deg,#f0ede8 0%,#e5e0da 50%,#ece8e3 100%)", textLight: false },
  sandstone: { bg: "linear-gradient(145deg,#d8c898 0%,#c8b880 40%,#e0d0a0 70%,#b8a870 100%)", textLight: false },
  onyx:      { bg: "linear-gradient(140deg,#0c0c0c 0%,#141414 52%,#080808 100%)", textLight: true  },
  limestone: { bg: "linear-gradient(175deg,#d4c8a8 0%,#c8ba94 30%,#ddd0b0 60%,#c0b08a 100%)", textLight: false },
  other:     { bg: "linear-gradient(145deg,#c8c0b4 0%,#b8b0a4 40%,#d0c8bc 70%,#a8a09a 100%)", textLight: false },
};

function scoreToLabel(score: number): string {
  if (score >= 85) return `${score}% match`;
  if (score >= 70) return `${score}% match`;
  if (score >= 50) return "Similar style";
  return "Explore this";
}

function mapDbRow(r: Record<string, unknown>, similarity: number): ImageSearchResult {
  const mat   = (r.materialType as string)?.toLowerCase() ?? "other";
  const style = MATERIAL_BG[mat] ?? MATERIAL_BG.other;
  const price = Number(r.pricePerUnit) || 0;
  const isOOS = r.isOutOfStock || r.stockQty === 0;
  const score = Math.max(0, Math.min(100, Math.round(similarity * 100)));
  return {
    id:           r.id as string,
    name:         r.name as string,
    materialType: mat as MaterialType,
    category:     (r.category as ProductUseCategory) ?? "Flooring",
    color:        (r.color as ProductColor) ?? "White",
    finish:       (r.finish as StoneFinish) ?? "Polished",
    thickness:    (r.thickness as Thickness) ?? "2cm",
    location:     (r.warehouseCity as string) ?? "India",
    status:       isOOS ? "limited" : "in-stock",
    priceRange:   `₹${price.toLocaleString("en-IN")}/${(r.unit as string) ?? "sqft"}`,
    priceMin:     price,
    priceMax:     price,
    popularity:   Math.min(100, (Number(r.views) || 0) * 2 + 50),
    createdAt:    Math.floor(new Date(r.createdAt as string).getTime() / 1000),
    origin:       r.warehouseCity ? `${r.warehouseCity}, India` : "India",
    bg:           style.bg,
    textLight:    style.textLight,
    imageUrl:     Array.isArray(r.imageUrls) && (r.imageUrls as string[]).length > 0
                    ? (r.imageUrls as string[])[0]
                    : undefined,
    imageUrls:    Array.isArray(r.imageUrls) ? (r.imageUrls as string[]) : [],
    matchScore:   score,
    matchLabel:   scoreToLabel(score),
  };
}

/** Popular static products used as fallback when CLIP or pgvector isn't ready */
function staticFallback(exclude: Set<string>, limit: number): ImageSearchResult[] {
  return CATALOG_PRODUCTS
    .filter((p) => !exclude.has(p.id))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
    .map((p, i) => ({
      ...p,
      matchScore: Math.max(20, 55 - i * 5),
      matchLabel: "Explore this",
    }));
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const imageFile = formData.get("image") as File | null;
  if (!imageFile) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const buffer   = Buffer.from(await imageFile.arrayBuffer());
  const mimeType = imageFile.type || "image/jpeg";

  // ── 1. Try CLIP embedding (may fail on first load while model downloads) ────
  let vecLiteral: string | null = null;
  try {
    const { embedImageBuffer, toVectorLiteral } = await import("@/lib/clip");
    const embedding = await embedImageBuffer(buffer, mimeType);
    vecLiteral = toVectorLiteral(embedding);
  } catch {
    // Model not ready yet — will use fallback below
  }

  // ── 2. Vector similarity search in DB ────────────────────────────────────────
  let dbResults: ImageSearchResult[] = [];
  if (vecLiteral) {
    try {
      const { rows } = await db.query<Record<string, unknown>>(
        `SELECT id, name, "materialType", category, color, finish, thickness,
                "warehouseCity", "pricePerUnit", unit, "stockQty", "isOutOfStock",
                views, "createdAt", "imageUrls",
                1 - (embedding <=> $1::vector) AS similarity
         FROM products
         WHERE status = 'APPROVED' AND embedding IS NOT NULL
         ORDER BY embedding <=> $1::vector
         LIMIT 8`,
        [vecLiteral]
      );
      dbResults = rows.map((r) => mapDbRow(r, Number(r.similarity ?? 0.5)));
    } catch {
      // pgvector not enabled yet — fall through to static fallback
    }
  }

  // ── 3. DB products without embeddings (recent approved, no vector search) ────
  let dbNoEmbed: ImageSearchResult[] = [];
  if (dbResults.length < 4) {
    try {
      const { rows } = await db.query<Record<string, unknown>>(
        `SELECT id, name, "materialType", category, color, finish, thickness,
                "warehouseCity", "pricePerUnit", unit, "stockQty", "isOutOfStock",
                views, "createdAt", "imageUrls"
         FROM products
         WHERE status = 'APPROVED'
         ORDER BY views DESC, "createdAt" DESC
         LIMIT 12`
      );
      const existingIds = new Set(dbResults.map((p) => p.id));
      dbNoEmbed = rows
        .filter((r) => !existingIds.has(r.id as string))
        .map((r, i) => mapDbRow(r, 0.45 - i * 0.02))
        .slice(0, 8 - dbResults.length);
    } catch {
      // DB unavailable
    }
  }

  // ── 4. Merge: vector results → DB popular → static catalog ──────────────────
  const seen    = new Set<string>();
  const merged: ImageSearchResult[] = [];

  for (const p of [...dbResults, ...dbNoEmbed]) {
    if (!seen.has(p.id)) { seen.add(p.id); merged.push(p); }
  }

  // Fill up to 8 with static products
  for (const p of staticFallback(seen, 8 - merged.length)) {
    if (!seen.has(p.id)) { seen.add(p.id); merged.push(p); }
  }

  const top = merged.slice(0, 8);
  const topMat = top[0]?.materialType ?? "stone";

  return NextResponse.json({
    products:   top,
    attributes: {
      materialType: topMat,
      color:        top[0]?.color  ?? "",
      finish:       top[0]?.finish ?? "",
      description:  vecLiteral ? "Visually similar stones" : "Popular stones",
    } satisfies ImageSearchAttributes,
  });
}
