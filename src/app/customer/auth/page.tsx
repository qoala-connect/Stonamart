import { AuthLayout } from "@/components/auth/AuthLayout";
import { CustomerAuthTabs } from "@/components/auth/CustomerAuthTabs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Portal — Stonamart",
  description: "Sign in or create your Stonamart customer account.",
};

export default function CustomerAuthPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  return (
    <AuthLayout
      headline={"Your stone journey\nstarts here."}
      subline="Browse 1,200+ verified stones from India's finest suppliers — compare, enquire, and get quotes in minutes."
      quote="Every space deserves a stone that tells a story."
      quoteAttrib="Stonamart"
    >
      <CustomerAuthTabs />
    </AuthLayout>
  );
}
