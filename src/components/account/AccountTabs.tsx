"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, User, MessageSquare, Settings, Package,
  Clock, CheckCircle2, TrendingUp, ChevronRight, Mail, MapPin, ShieldCheck,
  X, ExternalLink,
} from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard/DashboardShell";
import type { CustomerInquiry, InquiryStatus } from "@/lib/inquiry-actions";

// ─── Status helpers ────────────────────────────────────────────────────────────
const STATUS_META: Record<InquiryStatus, { label: string; color: string; dot: string }> = {
  NEW:       { label: "New",       color: "bg-blue-50 text-blue-700 border-blue-100",     dot: "bg-blue-500"   },
  CONTACTED: { label: "Contacted", color: "bg-amber-50 text-amber-700 border-amber-100",  dot: "bg-amber-500"  },
  CLOSED:    { label: "Closed",    color: "bg-stone-100 text-stone-500 border-stone-200", dot: "bg-stone-400"  },
};

function StatusBadge({ status }: { status: InquiryStatus }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans font-semibold border ${m.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch { return iso; }
}

// ─── Customer overview ─────────────────────────────────────────────────────────
function OverviewSection({
  user,
  inquiries,
  onNavigate,
}: {
  user: { name: string; email: string; city: string | null };
  inquiries: CustomerInquiry[];
  onNavigate: (id: string) => void;
}) {
  const newCount       = inquiries.filter((i) => i.status === "NEW").length;
  const contactedCount = inquiries.filter((i) => i.status === "CONTACTED").length;
  const closedCount    = inquiries.filter((i) => i.status === "CLOSED").length;

  const stats = [
    { label: "Total Inquiries", value: inquiries.length, icon: MessageSquare, color: "bg-violet-50 text-violet-600 border-violet-100" },
    { label: "New",             value: newCount,         icon: Clock,         color: "bg-blue-50 text-blue-600 border-blue-100"       },
    { label: "Contacted",       value: contactedCount,   icon: TrendingUp,    color: "bg-amber-50 text-amber-600 border-amber-100"    },
    { label: "Closed",          value: closedCount,      icon: CheckCircle2,  color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome card */}
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent border border-amber-200/50 rounded-2xl p-6">
        <p className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600/70 mb-1">
          Welcome back
        </p>
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-0.5">
          {user.name}
        </h2>
        <p className="font-sans text-[13px] text-stone-500">
          {user.email}
          {user.city ? ` · ${user.city}` : ""}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <button
            key={label}
            onClick={() => onNavigate("inquiries")}
            className={`group text-left p-4 rounded-2xl border ${color} bg-white hover:shadow-md transition-all duration-200`}
          >
            <div className={`w-9 h-9 rounded-xl border ${color} flex items-center justify-center mb-3`}>
              <Icon size={16} />
            </div>
            <p className="font-serif text-2xl font-bold text-stone-900 leading-none">{value}</p>
            <p className="font-sans text-[12px] text-stone-500 mt-1">{label}</p>
          </button>
        ))}
      </div>

      {/* Recent inquiries preview */}
      {inquiries.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-sans text-[13px] font-bold text-stone-700 uppercase tracking-wider">
              Recent Inquiries
            </h3>
            <button
              onClick={() => onNavigate("inquiries")}
              className="font-sans text-[12px] text-amber-600 hover:text-amber-700"
            >
              View all →
            </button>
          </div>
          <div className="space-y-2">
            {inquiries.slice(0, 3).map((inq) => (
              <div key={inq.id} className="bg-white rounded-xl border border-stone-100 shadow-sm p-4 flex items-center gap-3">
                {inq.productImageUrl ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100">
                    <Image src={inq.productImageUrl} alt={inq.productName} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0">
                    <Package size={16} className="text-stone-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[13px] font-sans font-semibold text-stone-800 truncate">{inq.productName}</p>
                    <StatusBadge status={inq.status} />
                  </div>
                  <p className="text-[11px] font-sans text-stone-400 mt-0.5">{formatDate(inq.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Profile section ───────────────────────────────────────────────────────────
function ProfileSection({
  user,
}: {
  user: { name: string; email: string; city: string | null; role: string };
}) {
  return (
    <div className="p-6 max-w-xl">
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-stone-100">
          <h2 className="font-sans text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            Profile Details
          </h2>
        </div>
        <div className="px-6 py-2 divide-y divide-stone-100">
          {[
            { label: "Full Name",    value: user.name,        icon: User       },
            { label: "Email",        value: user.email,       icon: Mail       },
            { label: "City",         value: user.city ?? "—", icon: MapPin     },
            { label: "Account Type", value: user.role,        icon: ShieldCheck },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center justify-between py-4 gap-3">
              <span className="flex items-center gap-2 font-sans text-[12.5px] text-stone-400">
                <Icon size={12} className="text-stone-300" />
                {label}
              </span>
              <span className="font-sans text-[13.5px] font-semibold text-stone-900">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Customer Inquiry Detail Slide-over ───────────────────────────────────────
function InquiryDetail({ inquiry, onClose }: { inquiry: CustomerInquiry; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex">
      <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[4px]" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 34 }}
        className="ml-auto relative w-full max-w-md bg-white shadow-[0_0_60px_rgba(0,0,0,0.18)] flex flex-col h-full overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div>
            <p className="text-[10px] font-sans font-bold text-amber-600 uppercase tracking-[0.18em]">Inquiry Detail</p>
            <h3 className="font-serif text-[1.05rem] font-bold text-stone-900 mt-0.5 line-clamp-1">
              {inquiry.productName || "Product Inquiry"}
            </h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl border border-stone-200 text-stone-400 hover:bg-stone-100 transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Product */}
          <div className="px-6 py-4 border-b border-stone-100">
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-stone-400 mb-3">Product</p>
            <div className="flex items-center gap-3">
              {inquiry.productImageUrl ? (
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100">
                  <Image src={inquiry.productImageUrl} alt={inquiry.productName} width={64} height={64} className="w-full h-full object-cover" unoptimized />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0">
                  <Package size={22} className="text-stone-300" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-sans font-semibold text-stone-800">{inquiry.productName || "—"}</p>
                {inquiry.productCategory && (
                  <p className="text-[12px] font-sans text-stone-400 mt-0.5">{inquiry.productCategory}</p>
                )}
                <div className="flex items-center gap-2 mt-1.5">
                  <StatusBadge status={inquiry.status} />
                  {inquiry.productId && (
                    <Link href={`/products/${inquiry.productId}`} className="inline-flex items-center gap-1 text-[11px] font-sans text-amber-600 hover:text-amber-700">
                      View product <ExternalLink size={10} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="px-6 py-4 border-b border-stone-100 space-y-2">
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-stone-400">Your Message</p>
            <p className="text-[13px] font-sans text-stone-700 leading-relaxed">{inquiry.message}</p>
          </div>

          {/* Date */}
          <div className="px-6 py-4">
            <span className="flex items-center gap-1.5 text-[12px] font-sans text-stone-400">
              <Clock size={12} /> Submitted {formatDate(inquiry.createdAt)}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Inquiries section ─────────────────────────────────────────────────────────
function InquiriesSection({ inquiries }: { inquiries: CustomerInquiry[] }) {
  const [selected, setSelected] = useState<CustomerInquiry | null>(null);

  if (inquiries.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
          <MessageSquare size={22} className="text-stone-300" />
        </div>
        <h3 className="font-serif text-lg font-bold text-stone-800 mb-1">No inquiries yet</h3>
        <p className="font-sans text-[13px] text-stone-400 max-w-xs">
          When you inquire about a product, it will appear here so you can track the status.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-2">
      {inquiries.map((inquiry) => (
        <motion.button
          key={inquiry.id}
          layout
          onClick={() => setSelected(inquiry)}
          className="w-full text-left bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex items-center gap-4 hover:border-stone-200 hover:shadow-md transition-all group"
        >
          {inquiry.productImageUrl ? (
            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100">
              <Image src={inquiry.productImageUrl} alt={inquiry.productName} width={56} height={56} className="w-full h-full object-cover" unoptimized />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0">
              <Package size={20} className="text-stone-300" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <p className="text-[13.5px] font-sans font-semibold text-stone-800 truncate">
                {inquiry.productName || "Product Inquiry"}
              </p>
              <StatusBadge status={inquiry.status} />
            </div>
            {inquiry.productCategory && (
              <p className="text-[11.5px] font-sans text-stone-400 mb-1">{inquiry.productCategory}</p>
            )}
            <p className="text-[12px] font-sans text-stone-500 line-clamp-1">{inquiry.message}</p>
            <span className="flex items-center gap-1 text-[11px] font-sans text-stone-400 mt-1">
              <Clock size={10} /> {formatDate(inquiry.createdAt)}
            </span>
          </div>
          <ChevronRight size={14} className="text-stone-300 group-hover:text-stone-500 flex-shrink-0 transition-colors" />
        </motion.button>
      ))}

      <AnimatePresence>
        {selected && <InquiryDetail inquiry={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ─── Customer AccountTabs (now a full dashboard) ───────────────────────────────
type CustomerNavId = "overview" | "profile" | "inquiries" | "settings";

export function AccountTabs({
  user,
  inquiries,
  defaultTab = "overview",
}: {
  user: { name: string; email: string; city: string | null; role: string };
  inquiries: CustomerInquiry[];
  defaultTab?: string;
}) {
  const [activeNav, setActiveNav] = useState<CustomerNavId>(
    (defaultTab as CustomerNavId) || "overview"
  );

  const navItems: NavItem[] = [
    { id: "overview",   label: "Dashboard",    icon: LayoutDashboard                        },
    { id: "profile",    label: "My Profile",   icon: User                                   },
    { id: "inquiries",  label: "My Inquiries", icon: MessageSquare, badge: inquiries.filter(i => i.status === "NEW").length || undefined },
    { id: "settings",   label: "Settings",     icon: Settings,      disabled: true          },
  ];

  const PAGE_META: Record<CustomerNavId, { title: string; subtitle: string }> = {
    overview:  { title: "My Dashboard",   subtitle: `Welcome back, ${user.name.split(" ")[0]}`        },
    profile:   { title: "My Profile",     subtitle: "Your personal account information"               },
    inquiries: { title: "My Inquiries",   subtitle: "Track your product inquiries and their status"   },
    settings:  { title: "Settings",       subtitle: "Account preferences and notifications"           },
  };

  const meta = PAGE_META[activeNav];

  return (
    <DashboardShell
      navItems={navItems}
      activeNav={activeNav}
      onNavChange={(id) => setActiveNav(id as CustomerNavId)}
      user={{ name: user.name, email: user.email, role: "CUSTOMER", subtitle: user.city ?? undefined }}
      pageTitle={meta.title}
      pageSubtitle={meta.subtitle}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeNav}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
        >
          {activeNav === "overview" && (
            <OverviewSection user={user} inquiries={inquiries} onNavigate={(id) => setActiveNav(id as CustomerNavId)} />
          )}
          {activeNav === "profile" && <ProfileSection user={user} />}
          {activeNav === "inquiries" && <InquiriesSection inquiries={inquiries} />}
          {activeNav === "settings" && (
            <div className="p-8 flex flex-col items-center justify-center min-h-[320px] text-stone-300">
              <Settings size={40} strokeWidth={1} className="mb-3" />
              <p className="font-sans text-sm text-stone-400">Settings — coming soon</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </DashboardShell>
  );
}
