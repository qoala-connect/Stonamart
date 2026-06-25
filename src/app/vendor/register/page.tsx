import { AuthLayout } from "@/components/auth/AuthLayout";
import { VendorRegisterForm } from "@/components/auth/VendorRegisterForm";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Vendor Portal — Stonamart" };
export default function VendorRegisterPage() {
  return (
    <AuthLayout
      headline="Vendor Portal"
      subline="Manage your products, orders and business all in one place."
      panelPhoto="https://images.unsplash.com/photo-1699982759850-22dbbd9676b7?w=1200&q=85"
      panelFeatures={["Manage Products","Track Orders","Grow Your Business"]}
      panelTheme="dark"
      panelAccent="#B8865A"
    >
      <VendorRegisterForm />
    </AuthLayout>
  );
}
