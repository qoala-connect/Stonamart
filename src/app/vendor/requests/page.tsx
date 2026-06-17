import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-actions";
import { getOpenRequestsForVendor } from "@/lib/request-actions";
import { MainLayout } from "@/components/common";
import { VendorRequestsPanel } from "@/components/vendor/VendorRequestsPanel";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sourcing Requests — Stonamart Vendor",
};

export default async function VendorRequestsPage() {
  const session = await getServerSession();

  if (!session) redirect("/login?from=/vendor/requests");
  if (session.user.role !== "VENDOR") redirect("/");
  if (session.user.status === "INACTIVE") redirect("/suspended");
  if (session.user.status === "PENDING") redirect("/vendor/pending");

  const openRequests = await getOpenRequestsForVendor();

  return (
    <MainLayout>
      <VendorRequestsPanel initialRequests={openRequests} />
    </MainLayout>
  );
}
