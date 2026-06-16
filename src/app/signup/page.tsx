import { AuthLayout } from "@/components/auth/AuthLayout";
import { UnifiedSignupForm } from "@/components/auth/UnifiedSignupForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account — Stonamart",
  description: "Join Stonamart as a customer, vendor, or admin.",
};

export default function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  return (
    <AuthLayout
      headline={"Your stone journey\nstarts here."}
      subline="Join India's largest curated natural stone marketplace — whether you buy, sell, or manage."
      quote="Every space deserves a stone that tells a story."
      quoteAttrib="Stonamart"
    >
      <UnifiedSignupForm searchParams={searchParams} />
    </AuthLayout>
  );
}
