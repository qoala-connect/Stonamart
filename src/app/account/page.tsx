import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-actions";

export const dynamic = "force-dynamic";
import { MainLayout } from "@/components/common";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account — Stonamart",
};

export default async function AccountPage() {
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

  return (
    <MainLayout>
      <div className="min-h-[60vh] bg-cream-50 py-16">
        <div className="max-w-2xl mx-auto px-6">
          <div className="mb-8">
            <p className="text-[10px] font-sans font-bold text-amber-gold/70 uppercase tracking-[0.2em] mb-1">
              My Account
            </p>
            <h1 className="font-serif text-3xl font-bold text-stone-950">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
          </div>

          {/* Account card */}
          <div className="bg-white rounded-2xl border border-stone-dark/8 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-stone-dark/6">
              <h2 className="font-sans text-[11px] font-bold text-stone-dark/40 uppercase tracking-wider">
                Profile
              </h2>
            </div>
            <div className="px-8 py-6 divide-y divide-stone-dark/5">
              {[
                { label: "Full Name", value: user.name },
                { label: "Email", value: user.email },
                { label: "City", value: user.city ?? "—" },
                { label: "Account Type", value: user.role },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-3">
                  <span className="font-sans text-[12px] text-stone-dark/45">{label}</span>
                  <span className="font-sans text-[13.5px] font-semibold text-stone-950">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
