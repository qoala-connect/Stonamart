"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, FileText, ShieldCheck, BarChart3, Settings,
  Package, ChevronRight, Bell, Search, Layers, LogOut, Gem, Radio, Loader,
} from "lucide-react";
import dynamic from "next/dynamic";
import { signOutAction } from "@/lib/auth-actions";
import { LeadPipeline } from "./crm/LeadPipeline";
import { LeadDetailCard } from "./crm/LeadDetailCard";
import { VendorApprovalSection } from "./VendorApprovalSection";
import { ProductReviewSection } from "./ProductReviewSection";

const QuotationGenerator = dynamic(
  () => import("./quotation/QuotationGenerator").then((m) => ({ default: m.QuotationGenerator })),
  { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center"><Loader size={18} className="animate-spin text-amber-gold" /></div> }
);
const ProductRequestBroadcast = dynamic(
  () => import("./ProductRequestBroadcast").then((m) => ({ default: m.ProductRequestBroadcast })),
  { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center"><Loader size={18} className="animate-spin text-amber-gold" /></div> }
);
import { MOCK_LEADS } from "./data";
import type { Lead, LeadStage } from "./types";
import type { VendorApplication, PendingProduct } from "@/lib/admin-actions";

type NavId = "crm" | "quotations" | "products" | "vendors" | "sourcing" | "analytics" | "settings";

const NAV_ITEMS: {
  id: NavId;
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
}[] = [
  { id: "crm",        label: "CRM Leads",     icon: Users      },
  { id: "quotations", label: "Quotations",     icon: FileText   },
  { id: "products",   label: "Product Review", icon: Package    },
  { id: "vendors",    label: "Vendors",        icon: ShieldCheck },
  { id: "sourcing",   label: "Sourcing",       icon: Radio      },
  { id: "analytics",  label: "Analytics",      icon: BarChart3, disabled: true },
  { id: "settings",   label: "Settings",       icon: Settings,  disabled: true },
];

// ─── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({
  active,
  onNavigate,
  leadCount,
  vendorCount,
  productCount,
  adminName,
}: {
  active: NavId;
  onNavigate: (id: NavId) => void;
  leadCount: number;
  vendorCount: number;
  productCount: number;
  adminName: string;
}) {
  const initials = adminName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="flex-shrink-0 w-60 bg-white border-r border-gray-100 flex flex-col min-h-screen shadow-sm">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-gold/12 border border-amber-gold/25 flex items-center justify-center">
            <Gem size={14} className="text-amber-gold" />
          </div>
          <div>
            <h1 className="font-serif text-[1.1rem] font-bold text-gray-900 tracking-tight leading-none">
              Stonamart
            </h1>
            <p className="text-[9px] font-sans font-semibold text-gray-400 uppercase tracking-[0.18em] mt-0.5">
              Admin Console
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          const badge =
            item.id === "crm"
              ? leadCount
              : item.id === "vendors"
              ? vendorCount
              : item.id === "products"
              ? productCount
              : undefined;

          return (
            <button
              key={item.id}
              onClick={() => !item.disabled && onNavigate(item.id)}
              disabled={item.disabled}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                item.disabled
                  ? "opacity-35 cursor-not-allowed"
                  : isActive
                  ? "bg-amber-gold/8 text-gray-900"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActive"
                  className="absolute inset-0 rounded-xl bg-amber-gold/8 border border-amber-gold/15"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Icon
                size={15}
                className={`relative z-10 flex-shrink-0 transition-colors ${
                  isActive ? "text-amber-gold" : ""
                }`}
              />
              <span className={`relative z-10 text-[13px] font-sans font-medium flex-1 ${isActive ? "text-gray-900" : ""}`}>
                {item.label}
              </span>
              {badge && badge > 0 ? (
                <span className="relative z-10 flex items-center justify-center h-5 min-w-[20px] px-1.5 bg-amber-gold text-white text-[9px] font-bold rounded-full">
                  {badge}
                </span>
              ) : item.disabled ? (
                <ChevronRight size={11} className="relative z-10 opacity-25" />
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Admin profile + sign out */}
      <div className="px-4 py-4 border-t border-gray-100 space-y-3">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-gold/30 to-amber-gold/10 border border-amber-gold/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-sans font-bold text-amber-gold">
              {initials}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-sans font-semibold text-gray-800 truncate">
              {adminName}
            </p>
            <p className="text-[10px] font-sans text-gray-400">Administrator</p>
          </div>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all text-left"
          >
            <LogOut size={13} />
            <span className="text-[12px] font-sans font-medium">Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}

// ─── Top bar ───────────────────────────────────────────────────────────────────
function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-white">
      <div>
        <h2 className="font-serif text-xl font-bold text-gray-900 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="font-sans text-[12px] text-gray-400 mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors">
          <Search size={16} />
        </button>
        <button className="relative p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors">
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-gold" />
        </button>
      </div>
    </div>
  );
}

// ─── CRM section ───────────────────────────────────────────────────────────────
function CRMSection({
  leads,
  onLeadsChange,
}: {
  leads: Lead[];
  onLeadsChange: (l: Lead[]) => void;
}) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleStageChange = useCallback(
    (id: string, stage: LeadStage) => {
      onLeadsChange(leads.map((l) => (l.id === id ? { ...l, stage } : l)));
      setSelectedLead((prev) => (prev?.id === id ? { ...prev, stage } : prev));
    },
    [leads, onLeadsChange]
  );

  const handleFollowUpSave = useCallback(
    (id: string, date: string, note: string) => {
      onLeadsChange(
        leads.map((l) =>
          l.id === id ? { ...l, followUpDate: date, followUpNote: note } : l
        )
      );
      setSelectedLead((prev) =>
        prev?.id === id
          ? { ...prev, followUpDate: date, followUpNote: note }
          : prev
      );
    },
    [leads, onLeadsChange]
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Summary pills */}
      <div className="flex-shrink-0 flex items-center gap-2 px-7 py-3 border-b border-gray-100 bg-gray-50/60 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-[11px] font-sans text-gray-400 mr-2">
          <Layers size={12} />
          <span>{leads.length} leads</span>
        </div>
        {[
          {
            label: "Active",
            count: leads.filter((l) => !["DELIVERED", "CLOSED"].includes(l.stage)).length,
            color: "bg-blue-50 text-blue-600 border border-blue-100",
          },
          {
            label: "Urgent",
            count: leads.filter((l) => l.priority === "urgent").length,
            color: "bg-red-50 text-red-600 border border-red-100",
          },
          {
            label: "Confirmed",
            count: leads.filter((l) => l.stage === "CONFIRMED" || l.stage === "PROCUREMENT").length,
            color: "bg-emerald-50 text-emerald-600 border border-emerald-100",
          },
        ].map((pill) => (
          <span
            key={pill.label}
            className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-sans font-semibold ${pill.color}`}
          >
            {pill.count} {pill.label}
          </span>
        ))}
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-hidden px-7 py-5">
        <LeadPipeline leads={leads} onSelectLead={setSelectedLead} />
      </div>

      <LeadDetailCard
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onStageChange={handleStageChange}
        onFollowUpSave={handleFollowUpSave}
      />
    </div>
  );
}

// ─── Coming soon placeholder ───────────────────────────────────────────────────
function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-300">
      <Layers size={40} strokeWidth={1} />
      <p className="font-sans text-sm text-gray-400">{label} — coming soon</p>
    </div>
  );
}

// ─── Admin Portal ──────────────────────────────────────────────────────────────
export function AdminPortal({
  pendingVendors,
  pendingProducts,
  adminName,
}: {
  pendingVendors: VendorApplication[];
  pendingProducts: PendingProduct[];
  adminName: string;
}) {
  const [active, setActive] = useState<NavId>("crm");
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);

  const urgentCount = leads.filter(
    (l) => l.priority === "urgent" && !["DELIVERED", "CLOSED"].includes(l.stage)
  ).length;

  const PAGE_META: Record<NavId, { title: string; subtitle?: string }> = {
    crm:       { title: "CRM Lead Pipeline",    subtitle: "Track and manage every customer inquiry across all stages" },
    quotations:{ title: "Quotation Generator",  subtitle: "Build, price, and dispatch professional quotations" },
    products:  { title: "Product Review",       subtitle: "Approve or request changes to vendor listings" },
    vendors:   { title: "Vendor Management",    subtitle: "Review applications and manage verified stone suppliers" },
    sourcing:  { title: "Sourcing Broadcast",   subtitle: "Request products from all vendors — they reply if they have it in stock" },
    analytics: { title: "Analytics",            subtitle: "Sales performance, pipeline velocity, and trends" },
    settings:  { title: "Settings",             subtitle: "Configure platform preferences and team access" },
  };

  const meta = PAGE_META[active];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
      <Sidebar
        active={active}
        onNavigate={setActive}
        leadCount={urgentCount}
        vendorCount={pendingVendors.length}
        productCount={pendingProducts.length}
        adminName={adminName}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title={meta.title} subtitle={meta.subtitle} />

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-hidden flex flex-col"
          >
            {active === "crm" && (
              <CRMSection leads={leads} onLeadsChange={setLeads} />
            )}
            {active === "quotations" && (
              <div className="flex-1 overflow-y-auto px-7 py-6">
                <QuotationGenerator />
              </div>
            )}
            {active === "vendors" && (
              <VendorApprovalSection initialVendors={pendingVendors} />
            )}
            {active === "products" && (
              <ProductReviewSection initialProducts={pendingProducts} />
            )}
            {active === "sourcing"  && <ProductRequestBroadcast />}
            {active === "analytics" && <ComingSoon label="Analytics" />}
            {active === "settings"  && <ComingSoon label="Settings" />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
