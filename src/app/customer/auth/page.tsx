import { AuthLayout } from "@/components/auth/AuthLayout";
import { CustomerAuthTabs } from "@/components/auth/CustomerAuthTabs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Customer Login — Stonamart" };

export default function CustomerAuthPage() {
  return (
    <AuthLayout
      headline="Welcome Back!"
      subline=""
      // 👇 Updated to match your exact file path and name
      panelPhoto="/images/cust_login.png" 
      panelFeatures={[
        "Premium Quality Stones",
        "Secure Payments",
        "Fast & Reliable Delivery"
      ]}
      panelTheme="dark"
      panelAccent="#B8865A"
    >
      <CustomerAuthTabs />
    </AuthLayout>
  );
}