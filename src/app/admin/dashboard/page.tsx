import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-actions";
import { getPendingVendors, getPendingProducts } from "@/lib/admin-actions";
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

  const [pendingVendors, pendingProducts] = await Promise.all([
    getPendingVendors(),
    getPendingProducts(),
  ]);

  return (
    <AdminPortal
      pendingVendors={pendingVendors}
      pendingProducts={pendingProducts}
      adminName={session.user.name}
    />
  );
}
