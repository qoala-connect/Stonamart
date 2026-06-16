import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-actions";
import { getVendorProfile, getVendorProducts } from "@/lib/vendor-actions";
import { MainLayout } from "@/components/common";
import { VendorPortal } from "@/components/vendor/VendorPortal";
import { BG_FOR_MATERIAL } from "@/components/vendor/data";
import type { VendorListing } from "@/components/vendor/types";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vendor Dashboard — Stonamart",
};

export default async function VendorDashboardPage() {
  const session = await getServerSession();

  if (!session) redirect("/login?from=/vendor/dashboard");
  if (session.user.role !== "VENDOR") redirect("/");
  if (session.user.status === "INACTIVE") redirect("/suspended");
  if (session.user.status === "PENDING") redirect("/vendor/pending");

  const [vendorProfile, productRows] = await Promise.all([
    getVendorProfile(),
    getVendorProducts(),
  ]);

  // Map DB rows to VendorListing shape (adds UI-only bg/textLight fields)
  const initialListings: VendorListing[] = productRows.map((row) => {
    const mat = BG_FOR_MATERIAL[row.materialType] ?? BG_FOR_MATERIAL.other;
    return {
      id: row.id,
      name: row.name,
      materialType: row.materialType,
      category: row.category,
      color: row.color ?? "",
      finish: row.finish ?? "",
      thickness: row.thickness ?? "",
      dimensions: row.dimensions ?? "",
      warehouseCity: row.warehouseCity ?? "",
      pricePerUnit: Number(row.pricePerUnit),
      unit: (row.unit as VendorListing["unit"]) ?? "sq ft",
      stockQty: row.stockQty ?? 0,
      isOutOfStock: row.isOutOfStock ?? false,
      status: (row.status as VendorListing["status"]) ?? "DRAFT",
      views: row.views ?? 0,
      createdAt: Math.floor(new Date(row.createdAt).getTime() / 1000),
      bg: mat.bg,
      textLight: mat.textLight,
    };
  });

  return (
    <MainLayout>
      <VendorPortal
        vendorProfile={vendorProfile}
        initialListings={initialListings}
      />
    </MainLayout>
  );
}
