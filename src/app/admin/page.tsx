import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Stonamart",
};

export default function AdminPage() {
  redirect("/admin/dashboard");
}
