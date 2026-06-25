import { AuthLayout } from "@/components/auth/AuthLayout";
import { CustomerAuthTabs } from "@/components/auth/CustomerAuthTabs";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Customer Login — Stonamart" };
export default function CustomerAuthPage() {
  return (
    <AuthLayout
      headline="Welcome Back!"
      subline="Discover premium stones for your dream spaces."
      panelPhoto="https://images.unsplash.com/photo-1633119713175-c53c29479984?w=1200&q=85"
      panelFeatures={["Premium Quality Stones","Secure Payments","Fast & Reliable Delivery"]}
      panelTheme="dark"
      panelAccent="#B8865A"
    >
      <CustomerAuthTabs />
    </AuthLayout>
  );
}
