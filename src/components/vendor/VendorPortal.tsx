"use client";

import React, { useState, useCallback, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Plus, BadgeCheck, MapPin, LogOut } from "lucide-react";
import { Container } from "@/components/ui";
import { signOutAction } from "@/lib/auth-actions";
import { KPICards } from "./KPICards";
import { ListingsTable } from "./ListingsTable";
import { ProductSubmissionForm } from "./ProductSubmissionForm";
import { BG_FOR_MATERIAL } from "./data";
import { submitProduct, uploadProductImages } from "@/lib/vendor-actions";
import type {
  VendorListing,
  ListingStatus,
  FormStep1,
  FormStep2,
  FormStep3,
} from "./types";
import type { VendorProfileData } from "@/lib/vendor-actions";

type Tab = "overview" | "submit";

// ─── Tab bar ───────────────────────────────────────────────────────────────────
function TabBar({
  active,
  onChange,
  pendingCount,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
  pendingCount: number;
}) {
  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "submit", label: "Add New Listing", icon: Plus },
  ];

  return (
    <div className="flex items-center gap-1 border-b border-gray-200 mb-8">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative flex items-center gap-2 px-4 py-3.5 text-sm font-sans font-semibold transition-colors duration-200 focus:outline-none"
          >
            <Icon
              size={14}
              className={isActive ? "text-amber-gold" : "text-gray-400"}
            />
            <span className={isActive ? "text-gray-900" : "text-gray-400"}>
              {tab.label}
            </span>
            {tab.id === "overview" && pendingCount > 0 && (
              <span className="flex items-center justify-center w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full">
                {pendingCount}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="tabUnderline"
                className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-gold rounded-t-full"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main vendor portal ────────────────────────────────────────────────────────
export function VendorPortal({
  vendorProfile,
  initialListings = [],
}: {
  vendorProfile: VendorProfileData | null;
  initialListings?: VendorListing[];
}) {
  const [listings, setListings] = useState<VendorListing[]>(initialListings);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [editData, setEditData] = useState<{
    step1: FormStep1;
    step2: FormStep2;
  } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const companyName = vendorProfile?.companyName ?? "My Store";
  const city = vendorProfile?.city ?? "";

  // ── OOS toggle ──
  const handleToggleOOS = useCallback((id: string) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, isOutOfStock: !l.isOutOfStock } : l
      )
    );
  }, []);

  // ── Open edit for a CHANGES_REQUESTED listing ──
  const handleEditListing = useCallback(
    (id: string) => {
      const listing = listings.find((l) => l.id === id);
      if (!listing) return;
      setEditData({
        step1: {
          name: listing.name,
          materialType: listing.materialType,
          category: listing.category,
          stockQty: String(listing.stockQty),
          pricePerUnit: String(listing.pricePerUnit),
          unit: listing.unit,
        },
        step2: {
          color: listing.color,
          finish: listing.finish,
          thickness: listing.thickness,
          dimensions: listing.dimensions,
          warehouseCity: listing.warehouseCity,
        },
      });
      setActiveTab("submit");
    },
    [listings]
  );

  // ── Submit / save to DB ──
  const handleFormSubmit = useCallback(
    (
      action: "draft" | "review",
      data: { step1: FormStep1; step2: FormStep2; step3: FormStep3 }
    ) => {
      const { step1, step2 } = data;
      const mat = BG_FOR_MATERIAL[step1.materialType] ?? BG_FOR_MATERIAL.other;
      setSubmitError(null);

      // Optimistically add to the list
      const tempId = `tmp-${Date.now()}`;
      const newListing: VendorListing = {
        id: tempId,
        name: step1.name,
        materialType: step1.materialType,
        category: step1.category,
        color: step2.color,
        finish: step2.finish,
        thickness: step2.thickness,
        dimensions: step2.dimensions,
        warehouseCity: step2.warehouseCity,
        pricePerUnit: parseFloat(step1.pricePerUnit) || 0,
        unit: step1.unit,
        stockQty: parseInt(step1.stockQty) || 0,
        isOutOfStock: false,
        status: (action === "draft" ? "DRAFT" : "PENDING_APPROVAL") as ListingStatus,
        views: 0,
        createdAt: Math.floor(Date.now() / 1000),
        bg: mat.bg,
        textLight: mat.textLight,
      };

      setListings((prev) => [newListing, ...prev]);
      setEditData(null);
      setTimeout(() => setActiveTab("overview"), 2500);

      // Upload images then persist to DB in background
      startTransition(async () => {
        // Upload any images first, then save product with their URLs
        let imageUrls: string[] = [];
        const imageFiles = data.step3.files.slice(0, 6).filter(Boolean) as File[];
        if (imageFiles.length > 0) {
          try {
            const fd = new FormData();
            imageFiles.forEach((f) => fd.append("files", f));
            const { urls } = await uploadProductImages(fd);
            imageUrls = urls;
          } catch {
            // Upload failed — product saves without images
          }
        }

        const result = await submitProduct({
          name: step1.name,
          materialType: step1.materialType,
          category: step1.category,
          color: step2.color,
          finish: step2.finish,
          thickness: step2.thickness,
          dimensions: step2.dimensions,
          warehouseCity: step2.warehouseCity,
          pricePerUnit: parseFloat(step1.pricePerUnit) || 0,
          unit: step1.unit,
          stockQty: parseInt(step1.stockQty) || 0,
          status: action === "draft" ? "DRAFT" : "PENDING_APPROVAL",
          imageUrls,
        });

        if (result.ok && result.id) {
          // Replace temp id with real DB id
          setListings((prev) =>
            prev.map((l) => (l.id === tempId ? { ...l, id: result.id! } : l))
          );
        } else if (!result.ok) {
          setSubmitError(result.error ?? "Failed to save listing.");
        }
      });
    },
    []
  );

  const pendingCount = listings.filter(
    (l) => l.status === "PENDING_APPROVAL" || l.status === "CHANGES_REQUESTED"
  ).length;

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-6 shadow-sm">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between gap-4 flex-wrap"
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-gold/20 to-amber-gold/8 border border-amber-gold/20 flex items-center justify-center flex-shrink-0">
                <span className="font-serif text-lg font-bold text-amber-gold leading-none">
                  {companyName[0]?.toUpperCase() ?? "V"}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-sans text-[10px] font-semibold text-gray-400 uppercase tracking-[0.16em]">
                    Vendor Portal
                  </p>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded-full">
                    <BadgeCheck size={9} className="text-emerald-500" />
                    <span className="text-[9px] font-sans font-semibold text-emerald-600">
                      Verified
                    </span>
                  </div>
                </div>
                <h1 className="font-serif text-2xl font-bold text-gray-900 leading-tight">
                  {companyName}
                </h1>
                {city && (
                  <div className="flex items-center gap-1.5 mt-0.5 text-gray-400 text-xs font-sans">
                    <MapPin size={10} className="text-amber-gold" />
                    {city}, India
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <motion.button
                onClick={() => {
                  setEditData(null);
                  setActiveTab("submit");
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-gold text-white font-sans font-semibold text-sm rounded-xl hover:bg-amber-gold/90 transition-colors shadow-sm"
              >
                <Plus size={15} />
                Add New Listing
              </motion.button>

              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50 rounded-xl text-xs font-sans font-semibold transition-all"
                >
                  <LogOut size={13} />
                  Sign Out
                </button>
              </form>
            </div>
          </motion.div>
        </Container>
      </div>

      {/* Page body */}
      <div className="bg-gray-50 min-h-screen">
        <Container>
          <div className="py-8">
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3.5 bg-red-50 border border-red-200/60 rounded-xl"
              >
                <p className="font-sans text-sm text-red-600">{submitError}</p>
              </motion.div>
            )}

            <TabBar
              active={activeTab}
              onChange={(t) => {
                setActiveTab(t);
                if (t === "submit") setEditData(null);
              }}
              pendingCount={pendingCount}
            />

            <AnimatePresence mode="wait">
              {activeTab === "overview" ? (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  <KPICards listings={listings} />
                  <div className="border-t border-stone-dark/7" />
                  <ListingsTable
                    listings={listings}
                    onToggleOOS={handleToggleOOS}
                    onEditListing={handleEditListing}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="submit"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {editData && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-2xl mx-auto mb-5 p-3.5 bg-orange-50 border border-orange-200/60 rounded-xl flex items-center gap-2.5"
                    >
                      <span className="text-orange-500 text-sm">⚠</span>
                      <p className="font-sans text-xs text-orange-700 font-medium">
                        Editing a listing with admin feedback — address all
                        comments before resubmitting.
                      </p>
                    </motion.div>
                  )}
                  <ProductSubmissionForm
                    onSubmit={handleFormSubmit}
                    editListing={editData}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Container>
      </div>
    </>
  );
}
