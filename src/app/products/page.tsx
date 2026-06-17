import { MainLayout } from "@/components/common";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { db } from "@/lib/db";
import type { CatalogProduct, MaterialType, ProductUseCategory, ProductColor, StoneFinish, Thickness } from "@/components/catalog/types";
import type { Metadata } from "next";

export const revalidate = 60; // ISR — rebuild catalog every 60 s

export const metadata: Metadata = {
  title: "Stone Catalog — Stonamart",
  description:
    "Browse 20+ premium marble, granite, quartz, sandstone, and onyx stones. Filter by color, finish, thickness, city, and category.",
};

// CSS gradients per material (for vendor-submitted products)
const MATERIAL_BG: Record<string, { bg: string; textLight: boolean }> = {
  marble:    { bg: "linear-gradient(165deg,#f7f4ef 0%,#ede8df 40%,#e2dbd0 70%,#ede8df 100%)", textLight: false },
  granite:   { bg: "linear-gradient(140deg,#1c1c1c 0%,#262626 55%,#161616 100%)", textLight: true  },
  quartz:    { bg: "linear-gradient(165deg,#f0ede8 0%,#e5e0da 50%,#ece8e3 100%)", textLight: false },
  sandstone: { bg: "linear-gradient(145deg,#d8c898 0%,#c8b880 40%,#e0d0a0 70%,#b8a870 100%)", textLight: false },
  onyx:      { bg: "linear-gradient(140deg,#0c0c0c 0%,#141414 52%,#080808 100%)", textLight: true  },
  limestone: { bg: "linear-gradient(175deg,#d4c8a8 0%,#c8ba94 30%,#ddd0b0 60%,#c0b08a 100%)", textLight: false },
  other:     { bg: "linear-gradient(145deg,#c8c0b4 0%,#b8b0a4 40%,#d0c8bc 70%,#a8a09a 100%)", textLight: false },
};

async function getApprovedDbProducts(): Promise<CatalogProduct[]> {
  try {
    const { rows } = await db.query(`
      SELECT id, name, "materialType", category, color, finish, thickness,
             "warehouseCity", "pricePerUnit", unit, "stockQty", "isOutOfStock",
             views, "createdAt", "imageUrls"
      FROM products
      WHERE status = 'APPROVED'
      ORDER BY "createdAt" DESC
    `);

    return rows.map((r) => {
      const mat = r.materialType?.toLowerCase() ?? "other";
      const style = MATERIAL_BG[mat] ?? MATERIAL_BG.other;
      const price = Number(r.pricePerUnit) || 0;
      const isOOS = r.isOutOfStock || r.stockQty === 0;
      const status = isOOS ? "limited" : "in-stock";

      return {
        id: r.id,
        name: r.name,
        materialType: (mat as MaterialType),
        category: (r.category as ProductUseCategory) ?? "Flooring",
        color: (r.color as ProductColor) ?? "White",
        finish: (r.finish as StoneFinish) ?? "Polished",
        thickness: (r.thickness as Thickness) ?? "2cm",
        location: r.warehouseCity ?? "India",
        status,
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
      } satisfies CatalogProduct;
    });
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const dbProducts = await getApprovedDbProducts();

  return (
    <MainLayout>
      <CatalogPage dbProducts={dbProducts} />
    </MainLayout>
  );
}
