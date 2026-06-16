import { CATALOG_PRODUCTS } from "@/components/catalog/data";
import { db } from "@/lib/db";
import { MainLayout } from "@/components/common";
import { ProductDetailPage } from "@/components/detail/ProductDetailPage";
import { notFound } from "next/navigation";
import type { CatalogProduct, MaterialType, ProductUseCategory, ProductColor, StoneFinish, Thickness } from "@/components/catalog/types";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return CATALOG_PRODUCTS.map((p) => ({ id: p.id }));
}

// CSS gradients per material (mirrors products/page.tsx)
const MATERIAL_BG: Record<string, { bg: string; textLight: boolean }> = {
  marble:    { bg: "linear-gradient(165deg,#f7f4ef 0%,#ede8df 40%,#e2dbd0 70%,#ede8df 100%)", textLight: false },
  granite:   { bg: "linear-gradient(140deg,#1c1c1c 0%,#262626 55%,#161616 100%)", textLight: true  },
  quartz:    { bg: "linear-gradient(165deg,#f0ede8 0%,#e5e0da 50%,#ece8e3 100%)", textLight: false },
  sandstone: { bg: "linear-gradient(145deg,#d8c898 0%,#c8b880 40%,#e0d0a0 70%,#b8a870 100%)", textLight: false },
  onyx:      { bg: "linear-gradient(140deg,#0c0c0c 0%,#141414 52%,#080808 100%)", textLight: true  },
  limestone: { bg: "linear-gradient(175deg,#d4c8a8 0%,#c8ba94 30%,#ddd0b0 60%,#c0b08a 100%)", textLight: false },
  other:     { bg: "linear-gradient(145deg,#c8c0b4 0%,#b8b0a4 40%,#d0c8bc 70%,#a8a09a 100%)", textLight: false },
};

async function getDbProduct(id: string): Promise<CatalogProduct | null> {
  try {
    const { rows } = await db.query(
      `SELECT id, name, "materialType", category, color, finish, thickness,
              "warehouseCity", "pricePerUnit", unit, "stockQty", "isOutOfStock",
              views, "createdAt", "imageUrls"
       FROM products
       WHERE id = $1 AND status = 'APPROVED'
       LIMIT 1`,
      [id]
    );
    if (!rows[0]) return null;
    const r = rows[0];
    const mat = r.materialType?.toLowerCase() ?? "other";
    const style = MATERIAL_BG[mat] ?? MATERIAL_BG.other;
    const price = Number(r.pricePerUnit) || 0;
    const isOOS = r.isOutOfStock || r.stockQty === 0;

    return {
      id: r.id,
      name: r.name,
      materialType: (mat as MaterialType),
      category: (r.category as ProductUseCategory) ?? "Flooring",
      color: (r.color as ProductColor) ?? "White",
      finish: (r.finish as StoneFinish) ?? "Polished",
      thickness: (r.thickness as Thickness) ?? "2cm",
      location: r.warehouseCity ?? "India",
      status: isOOS ? "limited" : "in-stock",
      priceRange: `₹${price.toLocaleString("en-IN")}/${r.unit ?? "sqft"}`,
      priceMin: price,
      priceMax: price,
      popularity: Math.min(100, (Number(r.views) || 0) * 2 + 50),
      createdAt: Math.floor(new Date(r.createdAt).getTime() / 1000),
      origin: r.warehouseCity ? `${r.warehouseCity}, India` : "India",
      bg: style.bg,
      textLight: style.textLight,
      imageUrl: Array.isArray(r.imageUrls) && r.imageUrls.length > 0
        ? r.imageUrls[0]
        : undefined,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = CATALOG_PRODUCTS.find((p) => p.id === id) ?? await getDbProduct(id);
  if (!product) return { title: "Stone Not Found — Stonamart" };
  return {
    title: `${product.name} — Stonamart`,
    description: `Buy ${product.name} — ${product.materialType}, ${product.finish}, ${product.thickness} slab. Available in ${product.location}. Price range: ${product.priceRange}.`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = CATALOG_PRODUCTS.find((p) => p.id === id) ?? await getDbProduct(id);
  if (!product) notFound();

  return (
    <MainLayout>
      <ProductDetailPage product={product} />
    </MainLayout>
  );
}
