import { AuthLayout } from "@/components/auth/AuthLayout";
import { AdminAuthTabs } from "@/components/auth/AdminAuthTabs";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Admin Access — Stonamart" };
export default function AdminAuthPage() {
  return (
    <AuthLayout
      headline="Admin Access"
      subline="Secure login to manage the platform efficiently."
      panelPhoto="https://images.unsplash.com/photo-1758873268745-dd2cf0d677b5?w=1200&q=85"
      panelFeatures={["User Management","Order Management","Reports & Analytics","System Settings"]}
      panelTheme="dark"
      panelAccent="#94a3b8"
    >
      <AdminAuthTabs />
    </AuthLayout>
  );
}
