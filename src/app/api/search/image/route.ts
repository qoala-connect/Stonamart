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

/** Popular static products used as fallback when DB is empty */
function staticFallback(exclude: Set<string>, limit: number): ImageSearchResult[] {
  return CATALOG_PRODUCTS
    .filter((p) => !exclude.has(p.id))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
    .map((p, i) => ({
      ...p,
      matchScore: Math.max(5, 12 - i * 1),
      matchLabel: "Explore this",
    }));
}

// ── Free color analysis using sharp (no API key needed) ──────────────────────
interface StoneAttrs {
  materialType: string;
  color:        string;
  finish:       string;
}

async function analyzeImageColor(buffer: Buffer): Promise<StoneAttrs | null> {
  try {
    // Dynamic import so Next.js doesn't bundle sharp on the client
    const sharp = (await import("sharp")).default;

    // Resize to 20×20 for fast average-color computation
    const { data, info } = await sharp(buffer)
      .resize(20, 20, { fit: "fill" })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    let rSum = 0, gSum = 0, bSum = 0;
    let rSqSum = 0, gSqSum = 0, bSqSum = 0;
    const pixelCount = info.width * info.height;
    const channels   = info.channels;

    for (let i = 0; i < data.length; i += channels) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      rSum += r; gSum += g; bSum += b;
      rSqSum += r * r; gSqSum += g * g; bSqSum += b * b;
    }

    const avgR = rSum / pixelCount;
    const avgG = gSum / pixelCount;
    const avgB = bSum / pixelCount;
    const brightness = (avgR + avgG + avgB) / 3;

    // Variance across pixels → high variance = veined/patterned (marble-like)
    const varR = rSqSum / pixelCount - avgR * avgR;
    const varG = gSqSum / pixelCount - avgG * avgG;
    const varB = bSqSum / pixelCount - avgB * avgB;
    const variance = (varR + varG + varB) / 3;

    // ── Map average RGB to stone color category ──────────────────────────────
    let color: string;
    if (brightness > 215) {
      color = "white";
    } else if (brightness > 185) {
      color = avgR > avgB + 15 ? "cream" : "white";
    } else if (brightness > 145) {
      if (avgR > avgG + 20 && avgR > avgB + 30) color = "brown";
      else if (avgG > avgR + 15 && avgG > avgB + 10) color = "green";
      else if (avgB > avgR + 15) color = "blue";
      else if (avgR > avgB + 12) color = "beige";
      else color = "beige";
    } else if (brightness > 90) {
      if (avgR > avgB + 30) color = "brown";
      else if (Math.abs(avgR - avgG) < 18 && Math.abs(avgG - avgB) < 18) color = "gray";
      else if (avgG > avgR + 12) color = "green";
      else color = "gray";
    } else if (brightness > 40) {
      color = "black";
    } else {
      color = "black";
    }

    // ── Heuristic material type from brightness + variance ───────────────────
    let materialType: string;
    if (brightness < 55) {
      materialType = avgR > avgB + 5 ? "onyx" : "granite";
    } else if (brightness < 100) {
      materialType = variance > 500 ? "granite" : "granite";
    } else if (brightness > 185 && variance > 300) {
      materialType = "marble";  // light + high variance → veined marble
    } else if (brightness > 185) {
      materialType = "marble";
    } else if (color === "brown" || color === "beige" || color === "cream") {
      materialType = variance > 400 ? "limestone" : "sandstone";
    } else if (variance > 600) {
      materialType = "marble";
    } else {
      materialType = "quartz";
    }

    return { materialType, color, finish: "polished" };
  } catch {
    return null;
  }
}

// Score how well a DB row matches detected attrs (0–100)
function attributeScore(r: Record<string, unknown>, attrs: StoneAttrs): number {
  let score = 0;
  const mat    = (r.materialType as string)?.toLowerCase() ?? "";
  const color  = (r.color       as string)?.toLowerCase() ?? "";
  const finish = (r.finish      as string)?.toLowerCase() ?? "";

  if (mat   === attrs.materialType.toLowerCase()) score += 55;
  if (color === attrs.color.toLowerCase())        score += 35;
  if (finish === attrs.finish.toLowerCase())      score += 10;
  return score;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const imageFile = formData.get("image") as File | null;
  if (!imageFile) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const buffer   = Buffer.from(await imageFile.arrayBuffer());
  const mimeType = imageFile.type || "image/jpeg";

  // ── 1. Free color analysis + optional CLIP (in parallel) ─────────────────────
  const [colorResult, vecLiteralResult] = await Promise.allSettled([
    analyzeImageColor(buffer),
    (async () => {
      const { embedImageBuffer, toVectorLiteral } = await import("@/lib/clip");
      const embedding = await embedImageBuffer(buffer, mimeType);
      return toVectorLiteral(embedding);
    })(),
  ]);

  const attrs:      StoneAttrs | null = colorResult.status === "fulfilled" ? colorResult.value : null;
  const vecLiteral: string    | null  = vecLiteralResult.status === "fulfilled" ? vecLiteralResult.value : null;

  // ── 2. Vector similarity search (CLIP pgvector) ───────────────────────────────
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
      dbResults = rows.map((r) => {
        const clipScore = Number(r.similarity ?? 0.5);
        // Blend CLIP score with attribute score when color analysis succeeded
        const finalScore = attrs
          ? Math.min(100, Math.round(clipScore * 40) + attributeScore(r, attrs) * 0.6)
          : Math.max(0, Math.min(100, Math.round(clipScore * 100)));
        return mapDbRow(r, finalScore / 100);
      });
    } catch {
      // pgvector not enabled — fall through
    }
  }

  // ── 3. Attribute-matched DB products (color analysis path) ───────────────────
  let attrResults: ImageSearchResult[] = [];
  if (attrs) {
    try {
      const existingIds = new Set(dbResults.map((p) => p.id));
      const { rows } = await db.query<Record<string, unknown>>(
        `SELECT id, name, "materialType", category, color, finish, thickness,
                "warehouseCity", "pricePerUnit", unit, "stockQty", "isOutOfStock",
                views, "createdAt", "imageUrls"
         FROM products
         WHERE status = 'APPROVED'
           AND (
             LOWER("materialType") = LOWER($1)
             OR LOWER(color)       = LOWER($2)
           )
         ORDER BY views DESC
         LIMIT 20`,
        [attrs.materialType, attrs.color]
      );
      attrResults = rows
        .filter((r) => !existingIds.has(r.id as string))
        .map((r)  => mapDbRow(r, attributeScore(r, attrs) / 100))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 8 - dbResults.length);
    } catch {
      // DB unavailable
    }
  }

  // ── 4. Popular fallback for remaining slots ───────────────────────────────────
  let dbNoEmbed: ImageSearchResult[] = [];
  const primaryCount = dbResults.length + attrResults.length;
  if (primaryCount < 4) {
    try {
      const existingIds = new Set([
        ...dbResults.map((p) => p.id),
        ...attrResults.map((p) => p.id),
      ]);
      const { rows } = await db.query<Record<string, unknown>>(
        `SELECT id, name, "materialType", category, color, finish, thickness,
                "warehouseCity", "pricePerUnit", unit, "stockQty", "isOutOfStock",
                views, "createdAt", "imageUrls"
         FROM products
         WHERE status = 'APPROVED'
         ORDER BY views DESC, "createdAt" DESC
         LIMIT 12`
      );
      dbNoEmbed = rows
        .filter((r) => !existingIds.has(r.id as string))
        // Cap fallback scores at 18 so they never outrank real color/CLIP matches
        .map((r, i) => mapDbRow(r, Math.max(0.05, 0.18 - i * 0.01)))
        .slice(0, 8 - primaryCount);
    } catch {
      // DB unavailable
    }
  }

  // ── 5. Merge, sort by matchScore, fill static fallback ───────────────────────
  const seen   = new Set<string>();
  const merged: ImageSearchResult[] = [];

  for (const p of [...dbResults, ...attrResults, ...dbNoEmbed]) {
    if (!seen.has(p.id)) { seen.add(p.id); merged.push(p); }
  }
  for (const p of staticFallback(seen, 8 - merged.length)) {
    if (!seen.has(p.id)) { seen.add(p.id); merged.push(p); }
  }

  // Best match always first
  merged.sort((a, b) => b.matchScore - a.matchScore);

  const top    = merged.slice(0, 8);
  const topMat = attrs?.materialType ?? top[0]?.materialType ?? "stone";
  const topColor = attrs?.color ?? top[0]?.color ?? "";

  return NextResponse.json({
    products:   top,
    attributes: {
      materialType: topMat,
      color:        topColor,
      finish:       attrs?.finish ?? top[0]?.finish ?? "",
      description:  attrs
        ? `${topMat.charAt(0).toUpperCase() + topMat.slice(1)} · ${topColor}`
        : vecLiteral ? "Visually similar stones" : "Popular stones",
    } satisfies ImageSearchAttributes,
  });
}
