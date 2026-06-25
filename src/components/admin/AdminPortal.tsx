"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, CheckCircle2, XCircle, MessageSquare,
  ShieldCheck, Users, BarChart3, Settings, FileText, Radio, Layers,
  TrendingUp, Clock, AlertCircle, Loader,
} from "lucide-react";
import dynamic from "next/dynamic";
import { DashboardShell, type NavItem } from "@/components/dashboard/DashboardShell";
import { LeadPipeline } from "./crm/LeadPipeline";
import { LeadDetailCard } from "./crm/LeadDetailCard";
import { VendorApprovalSection } from "./VendorApprovalSection";
import { ProductReviewSection } from "./ProductReviewSection";
import { InquirySection } from "./InquirySection";

const QuotationGenerator = dynamic(
  () => import("./quotation/QuotationGenerator").then((m) => ({ default: m.QuotationGenerator })),
  { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center p-20"><Loader size={18} className="animate-spin text-amber-500" /></div> }
);
const ProductRequestBroadcast = dynamic(
  () => import("./ProductRequestBroadcast").then((m) => ({ default: m.ProductRequestBroadcast })),
  { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center p-20"><Loader size={18} className="animate-spin text-amber-500" /></div> }
);

import { MOCK_LEADS } from "./data";
import type { Lead, LeadStage } from "./types";
import type { VendorApplication, PendingProduct } from "@/lib/admin-actions";
import type { CustomerInquiry } from "@/lib/inquiry-actions";

type NavId =
  | "overview"
  | "products"
  | "approved"
  | "rejected"
  | "inquiries"
  | "crm"
  | "quotations"
  | "sourcing"
  | "vendors"
  | "customers"
  | "analytics"
  | "settings";

const PAGE_META: Record<NavId, { title: string; subtitle: string }> = {
  overview:   { title: "Dashboard",            subtitle: "Platform overview and key metrics"                           },
  products:   { title: "Product Reviews",      subtitle: "Approve or request changes to vendor listings"               },
  approved:   { title: "Approved Products",    subtitle: "Products live on the marketplace"                            },
  rejected:   { title: "Rejected Products",    subtitle: "Products that failed review"                                 },
  inquiries:  { title: "Customer Inquiries",   subtitle: "Manage customer product inquiries and track follow-ups"      },
  crm:        { title: "CRM Lead Pipeline",    subtitle: "Track and manage every customer inquiry across all stages"   },
  quotations: { title: "Quotation Generator",  subtitle: "Build, price, and dispatch professional quotations"          },
  sourcing:   { title: "Sourcing Broadcast",   subtitle: "Request products from all vendors — they reply if available" },
  vendors:    { title: "Vendor Management",    subtitle: "Review applications and manage verified stone suppliers"      },
  customers:  { title: "Customers",            subtitle: "Registered customer accounts"                                },
  analytics:  { title: "Analytics",            subtitle: "Sales performance, pipeline velocity, and trends"            },
  settings:   { title: "Settings",             subtitle: "Configure platform preferences and team access"              },
};

// ─── Overview stats dashboard ─────────────────────────────────────────────────
function OverviewSection({
  allProducts,
  pendingVendors,
  adminInquiries,
  onNavigate,
}: {
  allProducts: PendingProduct[];
  pendingVendors: VendorApplication[];
  adminInquiries: CustomerInquiry[];
  onNavigate: (id: NavId) => void;
}) {
  const pending   = allProducts.filter((p) => p.status === "PENDING_APPROVAL").length;
  const approved  = allProducts.filter((p) => p.status === "APPROVED").length;
  const rejected  = allProducts.filter((p) => p.status === "REJECTED").length;
  const newInq    = adminInquiries.filter((i) => i.status === "NEW").length;

  const stats = [
    { label: "Pending Reviews",   value: pending,              icon: Clock,       color: "bg-amber-50 text-amber-600 border-amber-100",   nav: "products"  as NavId },
    { label: "Approved Products", value: approved,             icon: CheckCircle2,color: "bg-emerald-50 text-emerald-600 border-emerald-100", nav: "approved" as NavId },
    { label: "Rejected Products", value: rejected,             icon: XCircle,     color: "bg-red-50 text-red-500 border-red-100",         nav: "rejected"  as NavId },
    { label: "Total Products",    value: allProducts.length,   icon: Package,     color: "bg-stone-50 text-stone-600 border-stone-200",   nav: "products"  as NavId },
    { label: "Pending Vendors",   value: pendingVendors.length,icon: ShieldCheck, color: "bg-blue-50 text-blue-600 border-blue-100",      nav: "vendors"   as NavId },
    { label: "New Inquiries",     value: newInq,               icon: MessageSquare,color:"bg-violet-50 text-violet-600 border-violet-100",nav: "inquiries" as NavId },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color, nav }, i) => (
          <motion.button
            key={label}
            onClick={() => onNavigate(nav)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`group text-left p-5 rounded-2xl border ${color} bg-white hover:shadow-md transition-all duration-200`}
          >
            <div className={`w-10 h-10 rounded-xl border ${color} flex items-center justify-center mb-3`}>
              <Icon size={18} />
            </div>
            <p className="font-serif text-3xl font-bold text-stone-900 leading-none mb-1">{value}</p>
            <p className="font-sans text-[12.5px] text-stone-500">{label}</p>
            <p className="font-sans text-[11px] text-stone-400 mt-1 group-hover:translate-x-0.5 transition-transform">
              View all →
            </p>
          </motion.button>
        ))}
      </div>

      {/* Quick info */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
        <h3 className="font-sans text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-4">
          Quick Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[
            { label: "Total Products",  value: allProducts.length,    sub: "all statuses"   },
            { label: "Total Inquiries", value: adminInquiries.length, sub: "from customers" },
            { label: "Vendors",         value: pendingVendors.length, sub: "pending approval" },
          ].map(({ label, value, sub }) => (
            <div key={label} className="p-4 bg-stone-50 rounded-xl">
              <p className="font-serif text-2xl font-bold text-stone-900">{value}</p>
              <p className="font-sans text-[12.5px] font-semibold text-stone-700 mt-0.5">{label}</p>
              <p className="font-sans text-[11px] text-stone-400">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CRM section ───────────────────────────────────────────────────────────────
function CRMSection({ leads, onLeadsChange }: { leads: Lead[]; onLeadsChange: (l: Lead[]) => void }) {
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
      onLeadsChange(leads.map((l) => (l.id === id ? { ...l, followUpDate: date, followUpNote: note } : l)));
      setSelectedLead((prev) => prev?.id === id ? { ...prev, followUpDate: date, followUpNote: note } : prev);
    },
    [leads, onLeadsChange]
  );

  return (
    <div className="flex flex-col h-full overflow-hidden p-6">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-1.5 text-[11px] font-sans text-stone-400">
          <Layers size={12} /> <span>{leads.length} leads</span>
        </div>
        {[
          { label: "Active",    count: leads.filter((l) => !["DELIVERED","CLOSED"].includes(l.stage)).length, cls: "bg-blue-50 text-blue-600 border-blue-100"    },
          { label: "Urgent",    count: leads.filter((l) => l.priority === "urgent").length,                   cls: "bg-red-50 text-red-600 border-red-100"       },
          { label: "Confirmed", count: leads.filter((l) => ["CONFIRMED","PROCUREMENT"].includes(l.stage)).length, cls: "bg-emerald-50 text-emerald-600 border-emerald-100" },
        ].map((pill) => (
          <span key={pill.label} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-sans font-semibold border ${pill.cls}`}>
            {pill.count} {pill.label}
          </span>
        ))}
      </div>
      <div className="flex-1 overflow-hidden min-h-0">
        <LeadPipeline leads={leads} onSelectLead={setSelectedLead} />
      </div>
      <LeadDetailCard lead={selectedLead} onClose={() => setSelectedLead(null)} onStageChange={handleStageChange} onFollowUpSave={handleFollowUpSave} />
    </div>
  );
}

// ─── Coming soon ──────────────────────────────────────────────────────────────
function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-3 text-stone-300 p-8">
      <BarChart3 size={40} strokeWidth={1} />
      <p className="font-sans text-sm text-stone-400">{label} — coming soon</p>
    </div>
  );
}

// ─── Admin Portal ──────────────────────────────────────────────────────────────
export function AdminPortal({
  pendingVendors,
  allProducts,
  registeredVendors,
  adminName,
  adminEmail = "",
  adminInquiries = [],
}: {
  pendingVendors: VendorApplication[];
  allProducts: PendingProduct[];
  registeredVendors: VendorApplication[];
  adminName: string;
  adminEmail?: string;
  adminInquiries?: CustomerInquiry[];
}) {
  const [active, setActive] = useState<NavId>("overview");
  const [leads, setLeads]   = useState<Lead[]>(MOCK_LEADS);

  const urgentCount        = leads.filter((l) => l.priority === "urgent" && !["DELIVERED","CLOSED"].includes(l.stage)).length;
  const pendingProductCount = allProducts.filter((p) => p.status === "PENDING_APPROVAL").length;
  const newInquiryCount    = adminInquiries.filter((i) => i.status === "NEW").length;

  const navItems: NavItem[] = [
    { id: "overview",   label: "Dashboard",          icon: LayoutDashboard                          },
    { id: "products",   label: "Product Reviews",    icon: Package,     badge: pendingProductCount  },
    { id: "approved",   label: "Approved Products",  icon: CheckCircle2                             },
    { id: "rejected",   label: "Rejected Products",  icon: XCircle                                  },
    { id: "inquiries",  label: "Customer Inquiries", icon: MessageSquare, badge: newInquiryCount    },
    { id: "crm",        label: "CRM Leads",          icon: TrendingUp,  badge: urgentCount, group: "Business" },
    { id: "quotations", label: "Quotations",         icon: FileText,    group: "Business"           },
    { id: "sourcing",   label: "Sourcing",           icon: Radio,       group: "Business"           },
    { id: "vendors",    label: "Vendors",            icon: ShieldCheck, group: "Management"         },
    { id: "customers",  label: "Customers",          icon: Users,       group: "Management", disabled: true },
    { id: "analytics",  label: "Analytics",          icon: BarChart3,   group: "System",    disabled: true },
    { id: "settings",   label: "Settings",           icon: Settings,    group: "System",    disabled: true },
  ];

  const meta = PAGE_META[active];

  const filteredProducts = (status: string) =>
    allProducts.filter((p) => p.status === status);

  return (
    <DashboardShell
      navItems={navItems}
      activeNav={active}
      onNavChange={(id) => setActive(id as NavId)}
      user={{ name: adminName, email: adminEmail, role: "ADMIN" }}
      pageTitle={meta.title}
      pageSubtitle={meta.subtitle}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="h-full flex flex-col"
        >
          {active === "overview" && (
            <OverviewSection
              allProducts={allProducts}
              pendingVendors={pendingVendors}
              adminInquiries={adminInquiries}
              onNavigate={setActive}
            />
          )}

          {active === "products" && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <ProductReviewSection initialProducts={allProducts.filter((p) => p.status === "PENDING_APPROVAL")} />
            </div>
          )}

          {active === "approved" && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <ProductReviewSection initialProducts={filteredProducts("APPROVED")} />
            </div>
          )}

          {active === "rejected" && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <ProductReviewSection initialProducts={filteredProducts("REJECTED")} />
            </div>
          )}

          {active === "inquiries" && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <InquirySection initialInquiries={adminInquiries} />
            </div>
          )}

          {active === "crm" && (
            <CRMSection leads={leads} onLeadsChange={setLeads} />
          )}

          {active === "quotations" && (
            <div className="flex-1 overflow-y-auto p-6">
              <QuotationGenerator />
            </div>
          )}

          {active === "sourcing" && (
            <div className="flex-1 overflow-y-auto">
              <ProductRequestBroadcast />
            </div>
          )}

          {active === "vendors" && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <VendorApprovalSection initialVendors={pendingVendors} registeredVendors={registeredVendors} />
            </div>
          )}

          {active === "customers"  && <ComingSoon label="Customers" />}
          {active === "analytics"  && <ComingSoon label="Analytics" />}
          {active === "settings"   && <ComingSoon label="Settings"  />}
        </motion.div>
      </AnimatePresence>
    </DashboardShell>
  );
}
