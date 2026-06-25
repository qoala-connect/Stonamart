import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-actions";
import { getPendingVendors, getAdminProducts, getRegisteredVendors } from "@/lib/admin-actions";
import { getAdminInquiries } from "@/lib/inquiry-actions";
import { AdminPortal } from "@/components/admin/AdminPortal";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard — Stonamart",
};

export default async function AdminDashboardPage() {
  const session = await getServerSession();

  if (!session) redirect("/login?from=/admin/dashboard");
  if (session.user.role !== "ADMIN") redirect("/");

  const [pendingVendors, allProducts, registeredVendors, adminInquiries] = await Promise.all([
    getPendingVendors(),
    getAdminProducts("all"),
    getRegisteredVendors(),
    getAdminInquiries(),
  ]);

  return (
    <AdminPortal
      pendingVendors={pendingVendors}
      allProducts={allProducts}
      registeredVendors={registeredVendors}
      adminName={session.user.name}
      adminEmail={session.user.email}
      adminInquiries={adminInquiries}
    />
  );
}
