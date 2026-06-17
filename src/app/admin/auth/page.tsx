import { AuthLayout } from "@/components/auth/AuthLayout";
import { AdminAuthTabs } from "@/components/auth/AdminAuthTabs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal — Stonamart",
  description: "Sign in or set up the Stonamart admin account.",
};

export default function AdminAuthPage() {
  return (
    <AuthLayout
      headline={"Manage India's\npremium stone\nmarketplace."}
      subline="Approve vendors, review listings, and oversee all platform operations from one secure portal."
      quote="Great platforms are built on trust, transparency, and rigorous oversight."
      quoteAttrib="Stonamart Operations"
    >
      <AdminAuthTabs />
    </AuthLayout>
  );
}
