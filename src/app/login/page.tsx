import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Sign In — Stonamart" };
export default function LoginPage() {
  return (
    <AuthLayout
      headline="Welcome Back!"
      subline="Discover premium stones for your dream spaces."
      panelPhoto="https://images.unsplash.com/photo-1633119713175-c53c29479984?w=1200&q=85"
      panelFeatures={["Premium Quality Stones","Secure Payments","Fast & Reliable Delivery"]}
      panelTheme="dark"
      panelAccent="#B8865A"
    >
      <LoginForm />
    </AuthLayout>
  );
}
