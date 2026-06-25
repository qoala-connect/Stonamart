"use client";

import React, { useState, useCallback, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Plus, Clock, CheckCircle2, XCircle,
  Layers, Package, User, Settings, AlertTriangle,
  Eye, TrendingUp,
} from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard/DashboardShell";
import { KPICards } from "./KPICards";
import { ListingsTable } from "./ListingsTable";
import { ProductSubmissionForm } from "./ProductSubmissionForm";
import { BG_FOR_MATERIAL } from "./data";
import { submitProduct, updateProduct, deleteProduct } from "@/lib/vendor-actions";
import type {
  VendorListing,
  ListingStatus,
  FormStep1,
  FormStep2,
  FormStep3,
} from "./types";
import type { VendorProfileData } from "@/lib/vendor-actions";

type NavId =
  | "overview"
  | "add"
  | "all"
  | "pending"
  | "approved"
  | "rejected"
  | "profile"
  | "settings";

const PAGE_META: Record<NavId, { title: string; subtitle: string }> = {
  overview:  { title: "Dashboard",            subtitle: "Your products at a glance"                          },
  add:       { title: "Add New Product",      subtitle: "Submit a new stone listing for admin review"       },
  all:       { title: "My Products",          subtitle: "All your product listings"                          },
  pending:   { title: "Pending Reviews",      subtitle: "Products waiting for admin approval"                },
  approved:  { title: "Approved Products",    subtitle: "Products live on the marketplace"                   },
  rejected:  { title: "Rejected Products",    subtitle: "Products that need changes before resubmission"     },
  profile:   { title: "Vendor Profile",       subtitle: "Your business information"                          },
  settings:  { title: "Settings",             subtitle: "Account preferences"                                },
};

// ─── Profile card ──────────────────────────────────────────────────────────────
function VendorProfileCard({ profile }: { profile: VendorProfileData | null }) {
  if (!profile) {
    return (
      <div className="p-8 flex flex-col items-center text-stone-400">
        <User size={32} strokeWidth={1} className="mb-3" />
        <p className="font-sans text-sm">No profile found</p>
      </div>
    );
  }
  const rows = [
    { label: "Company Name",    value: profile.companyName     },
    { label: "Contact Person",  value: profile.contactPerson   },
    { label: "Phone",           value: profile.phone           },
    { label: "City",            value: profile.city            },
  ];
  return (
    <div className="p-8 max-w-xl">
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-stone-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <span className="font-serif text-2xl font-bold text-blue-500">
              {profile.companyName[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">{profile.companyName}</h3>
            <p className="font-sans text-xs text-stone-400 mt-0.5">{profile.city}, India</p>
          </div>
        </div>
        <div className="px-6 py-2 divide-y divide-stone-100">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-3.5">
              <span className="font-sans text-[12px] text-stone-400">{label}</span>
              <span className="font-sans text-[13.5px] font-semibold text-stone-800">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Overview dashboard ────────────────────────────────────────────────────────
function OverviewContent({
  listings,
  onNavigate,
}: {
  listings: VendorListing[];
  onNavigate: (id: NavId) => void;
}) {
  const pending  = listings.filter((l) => l.status === "PENDING_APPROVAL").length;
  const approved = listings.filter((l) => l.status === "APPROVED").length;
  const rejected = listings.filter((l) => l.status === "REJECTED" || l.status === "CHANGES_REQUESTED").length;
  const views    = listings.reduce((s, l) => s + l.views, 0);

  const quickStats = [
    { label: "Pending Review", value: pending,  icon: Clock,         color: "bg-amber-50 border-amber-100 text-amber-600", navId: "pending"  as NavId },
    { label: "Approved",       value: approved, icon: CheckCircle2,  color: "bg-emerald-50 border-emerald-100 text-emerald-600", navId: "approved" as NavId },
    { label: "Rejected",       value: rejected, icon: XCircle,       color: "bg-red-50 border-red-100 text-red-500",       navId: "rejected" as NavId },
    { label: "Total Views",    value: views,    icon: Eye,           color: "bg-blue-50 border-blue-100 text-blue-500",    navId: "all"      as NavId },
  ];

  return (
    <div className="p-6 space-y-6">
      <KPICards listings={listings} />

      {/* Quick-nav status cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map(({ label, value, icon: Icon, color, navId }) => (
          <button
            key={label}
            onClick={() => onNavigate(navId)}
            className={`group text-left p-4 rounded-2xl border ${color} hover:shadow-md transition-all duration-200 bg-white/80`}
          >
            <div className={`w-9 h-9 rounded-xl border ${color} flex items-center justify-center mb-3`}>
              <Icon size={16} />
            </div>
            <p className="font-serif text-2xl font-bold text-stone-900 leading-none">{value}</p>
            <p className="font-sans text-[12px] text-stone-500 mt-1">{label}</p>
            <p className="font-sans text-[10.5px] text-stone-400 mt-0.5 group-hover:translate-x-0.5 transition-transform">
              View all →
            </p>
          </button>
        ))}
      </div>

      {/* Recent listings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-sans text-[13px] font-bold text-stone-700 uppercase tracking-wider">
            Recent Products
          </h3>
          <button
            onClick={() => onNavigate("all")}
            className="font-sans text-[12px] text-amber-600 hover:text-amber-700"
          >
            View all →
          </button>
        </div>
        <ListingsTable listings={listings.slice(0, 6)} onToggleOOS={() => {}} onEditListing={() => {}} onDeleteListing={() => {}} />
      </div>
    </div>
  );
}

// ─── Settings placeholder ──────────────────────────────────────────────────────
function SettingsPlaceholder() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[320px] text-stone-300">
      <Settings size={40} strokeWidth={1} className="mb-3" />
      <p className="font-sans text-sm text-stone-400">Settings — coming soon</p>
    </div>
  );
}

// ─── Main VendorPortal ─────────────────────────────────────────────────────────
export function VendorPortal({
  vendorProfile,
  initialListings = [],
  vendorUser,
}: {
  vendorProfile: VendorProfileData | null;
  initialListings?: VendorListing[];
  vendorUser: { name: string; email: string };
}) {
  const [listings, setListings]       = useState<VendorListing[]>(initialListings);
  const [activeNav, setActiveNav]     = useState<NavId>("overview");
  const [editData, setEditData]       = useState<{ step1: FormStep1; step2: FormStep2 } | null>(null);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [, startTransition]           = useTransition();

  const companyName = vendorProfile?.companyName ?? "My Store";

  const pendingCount   = listings.filter((l) => l.status === "PENDING_APPROVAL" || l.status === "CHANGES_REQUESTED").length;
  const approvedCount  = listings.filter((l) => l.status === "APPROVED").length;
  const rejectedCount  = listings.filter((l) => l.status === "REJECTED" || l.status === "CHANGES_REQUESTED").length;

  // ── Build nav items ──
  const navItems: NavItem[] = [
    { id: "overview",  label: "Dashboard",        icon: LayoutDashboard  },
    { id: "add",       label: "Add Product",       icon: Plus             },
    { id: "all",       label: "My Products",       icon: Layers,  badge: listings.length },
    { id: "pending",   label: "Pending Reviews",   icon: Clock,   badge: pendingCount    },
    { id: "approved",  label: "Approved Products", icon: CheckCircle2, badge: approvedCount   },
    { id: "rejected",  label: "Rejected Products", icon: XCircle, badge: rejectedCount   },
    { id: "profile",   label: "Profile",           icon: User,    group: "Account"       },
    { id: "settings",  label: "Settings",          icon: Settings, group: "Account", disabled: true },
  ];

  // ── OOS toggle ──
  const handleToggleOOS = useCallback((id: string) => {
    setListings((prev) => prev.map((l) => l.id === id ? { ...l, isOutOfStock: !l.isOutOfStock } : l));
  }, []);

  // ── Edit ──
  const handleEditListing = useCallback((id: string) => {
    const listing = listings.find((l) => l.id === id);
    if (!listing) return;
    setEditingId(id);
    setEditData({
      step1: {
        name: listing.name, materialType: listing.materialType,
        category: listing.category, stockQty: String(listing.stockQty),
        pricePerUnit: String(listing.pricePerUnit), unit: listing.unit,
      },
      step2: {
        color: listing.color, finish: listing.finish, thickness: listing.thickness,
        dimensions: listing.dimensions, warehouseCity: listing.warehouseCity,
      },
    });
    setActiveNav("add");
  }, [listings]);

  // ── Delete ──
  const handleDeleteListing = useCallback((id: string) => {
    const listing = listings.find((l) => l.id === id);
    if (!listing) return;
    setListings((prev) => prev.filter((l) => l.id !== id));
    startTransition(async () => {
      const result = await deleteProduct(id);
      if (!result.ok) {
        setListings((prev) => [listing, ...prev]);
        setSubmitError(result.error ?? "Failed to delete listing.");
      }
    });
  }, [listings]);

  // ── Submit / Save ──
  const handleFormSubmit = useCallback(
    (action: "draft" | "review", data: { step1: FormStep1; step2: FormStep2; step3: FormStep3 }) => {
      const { step1, step2 } = data;
      const mat = BG_FOR_MATERIAL[step1.materialType] ?? BG_FOR_MATERIAL.other;
      const targetId = editingId;
      const newStatus = (action === "draft" ? "DRAFT" : "PENDING_APPROVAL") as ListingStatus;
      setSubmitError(null);

      const imageUrls = (data.step3.uploadedUrls ?? [])
        .slice(0, 6)
        .filter((u): u is string => typeof u === "string" && u.length > 0);
      const videoUrl = (data.step3.uploadedUrls?.[6] as string | null | undefined) ?? null;

      const updatedFields: Partial<VendorListing> = {
        name: step1.name, materialType: step1.materialType, category: step1.category,
        color: step2.color, finish: step2.finish, thickness: step2.thickness,
        dimensions: step2.dimensions, warehouseCity: step2.warehouseCity,
        pricePerUnit: parseFloat(step1.pricePerUnit) || 0, unit: step1.unit,
        stockQty: parseInt(step1.stockQty) || 0, status: newStatus,
        adminFeedback: undefined, bg: mat.bg, textLight: mat.textLight,
      };

      if (targetId) {
        const originalListing = listings.find((l) => l.id === targetId);
        setListings((prev) => prev.map((l) => (l.id === targetId ? { ...l, ...updatedFields } : l)));
        startTransition(async () => {
          const result = await updateProduct(targetId, {
            name: step1.name, materialType: step1.materialType, category: step1.category,
            color: step2.color, finish: step2.finish, thickness: step2.thickness,
            dimensions: step2.dimensions, warehouseCity: step2.warehouseCity,
            pricePerUnit: parseFloat(step1.pricePerUnit) || 0, unit: step1.unit,
            stockQty: parseInt(step1.stockQty) || 0,
            status: action === "draft" ? "DRAFT" : "PENDING_APPROVAL",
            imageUrls, videoUrl,
          });
          if (!result.ok) {
            if (originalListing) setListings((prev) => prev.map((l) => (l.id === targetId ? originalListing : l)));
            setSubmitError(result.error ?? "Failed to update listing.");
          }
        });
      } else {
        const tempId = `tmp-${Date.now()}`;
        setListings((prev) => [{
          id: tempId, isOutOfStock: false, views: 0, createdAt: Math.floor(Date.now() / 1000),
          ...updatedFields,
        } as VendorListing, ...prev]);
        startTransition(async () => {
          const result = await submitProduct({
            name: step1.name, materialType: step1.materialType, category: step1.category,
            color: step2.color, finish: step2.finish, thickness: step2.thickness,
            dimensions: step2.dimensions, warehouseCity: step2.warehouseCity,
            pricePerUnit: parseFloat(step1.pricePerUnit) || 0, unit: step1.unit,
            stockQty: parseInt(step1.stockQty) || 0,
            status: action === "draft" ? "DRAFT" : "PENDING_APPROVAL",
            imageUrls, videoUrl,
          });
          if (result.ok && result.id) {
            setListings((prev) => prev.map((l) => (l.id === tempId ? { ...l, id: result.id! } : l)));
          } else if (!result.ok) {
            setListings((prev) => prev.filter((l) => l.id !== tempId));
            setSubmitError(result.error ?? "Failed to save listing. Please try again.");
          }
        });
      }

      setEditingId(null);
      setEditData(null);
      setTimeout(() => setActiveNav("overview"), 2000);
    },
    [editingId, listings]
  );

  // ── Filter helper ──
  const filteredByStatus = (statuses: ListingStatus[]) =>
    listings.filter((l) => statuses.includes(l.status));

  const meta = PAGE_META[activeNav];

  // ── Add button in header ──
  const headerRight = (
    <button
      onClick={() => { setEditData(null); setEditingId(null); setActiveNav("add"); }}
      className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white font-sans font-semibold text-[13px] rounded-xl hover:bg-stone-800 transition-colors"
    >
      <Plus size={14} />
      Add Product
    </button>
  );

  return (
    <DashboardShell
      navItems={navItems}
      activeNav={activeNav}
      onNavChange={(id) => {
        if (id !== "add") { setEditData(null); setEditingId(null); }
        setActiveNav(id as NavId);
      }}
      user={{
        name: vendorUser.name,
        email: vendorUser.email,
        role: "VENDOR",
        subtitle: companyName,
      }}
      pageTitle={meta.title}
      pageSubtitle={meta.subtitle}
      headerRight={activeNav !== "add" ? headerRight : undefined}
    >
      {/* Error banner */}
      <AnimatePresence>
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-6 mt-4 p-3.5 bg-red-50 border border-red-200/60 rounded-xl flex items-center gap-2"
          >
            <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
            <p className="font-sans text-sm text-red-600">{submitError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeNav}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="h-full"
        >
          {activeNav === "overview" && (
            <OverviewContent listings={listings} onNavigate={setActiveNav} />
          )}

          {activeNav === "add" && (
            <div className="p-6">
              {editData && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-2xl mx-auto mb-5 p-3.5 bg-orange-50 border border-orange-200/60 rounded-xl flex items-center gap-2.5"
                >
                  <span className="text-orange-500 text-sm">⚠</span>
                  <p className="font-sans text-xs text-orange-700 font-medium">
                    Editing a listing with admin feedback — address all comments before resubmitting.
                  </p>
                </motion.div>
              )}
              <ProductSubmissionForm onSubmit={handleFormSubmit} editListing={editData} />
            </div>
          )}

          {activeNav === "all" && (
            <div className="p-6">
              <ListingsTable
                listings={listings}
                onToggleOOS={handleToggleOOS}
                onEditListing={handleEditListing}
                onDeleteListing={handleDeleteListing}
              />
            </div>
          )}

          {activeNav === "pending" && (
            <div className="p-6">
              <ListingsTable
                listings={filteredByStatus(["PENDING_APPROVAL", "CHANGES_REQUESTED"])}
                onToggleOOS={handleToggleOOS}
                onEditListing={handleEditListing}
                onDeleteListing={handleDeleteListing}
              />
            </div>
          )}

          {activeNav === "approved" && (
            <div className="p-6">
              <ListingsTable
                listings={filteredByStatus(["APPROVED"])}
                onToggleOOS={handleToggleOOS}
                onEditListing={handleEditListing}
                onDeleteListing={handleDeleteListing}
              />
            </div>
          )}

          {activeNav === "rejected" && (
            <div className="p-6">
              <ListingsTable
                listings={filteredByStatus(["REJECTED", "DRAFT"])}
                onToggleOOS={handleToggleOOS}
                onEditListing={handleEditListing}
                onDeleteListing={handleDeleteListing}
              />
            </div>
          )}

          {activeNav === "profile" && (
            <VendorProfileCard profile={vendorProfile} />
          )}

          {activeNav === "settings" && <SettingsPlaceholder />}
        </motion.div>
      </AnimatePresence>
    </DashboardShell>
  );
}
