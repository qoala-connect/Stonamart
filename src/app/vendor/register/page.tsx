import { AuthLayout } from "@/components/auth/AuthLayout";
import { VendorRegisterForm } from "@/components/auth/VendorRegisterForm";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Vendor Portal — Stonamart" };
export default function VendorRegisterPage() {
  return (
    <AuthLayout
      headline="Vendor Portal"
      subline="Manage your products, orders and business all in one place."
       panelPhoto="/images/vendor_login.png"
      panelFeatures={["Manage Products","Track Orders","Grow Your Business"]}
      // panelTheme="dark"
      panelAccent="#B8865A"
    >
      <VendorRegisterForm />
    </AuthLayout>
  );
}
