import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-actions";
import { getCustomerInquiries } from "@/lib/inquiry-actions";
import { AccountTabs } from "@/components/account/AccountTabs";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Account — Stonamart",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login?from=/account");
  }

  const { user } = session;

  // Role-based redirect — admin and vendor have dedicated dashboards
  if (user.role === "ADMIN")  redirect("/admin/dashboard");
  if (user.role === "VENDOR") {
    if (user.status === "PENDING") redirect("/vendor/pending");
    redirect("/vendor/dashboard");
  }

  const [inquiries, params] = await Promise.all([
    getCustomerInquiries(),
    searchParams,
  ]);

  const defaultTab = params.tab === "inquiries" ? "inquiries" : "overview";

  return (
    <AccountTabs
      user={{
        name: user.name,
        email: user.email,
        city: (user as { city?: string }).city ?? null,
        role: user.role,
      }}
      inquiries={inquiries}
      defaultTab={defaultTab}
    />
  );
}
