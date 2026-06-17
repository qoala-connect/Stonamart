"use client";

import React, { useState, useCallback, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Plus, BadgeCheck, MapPin, LogOut,
  X, ChevronLeft, ChevronRight, Play, Video, Edit3, ImageIcon,
} from "lucide-react";
import { Container } from "@/components/ui";
import { signOutAction } from "@/lib/auth-actions";
import { KPICards } from "./KPICards";
import { ListingsTable } from "./ListingsTable";
import { ProductSubmissionForm } from "./ProductSubmissionForm";
import { BG_FOR_MATERIAL } from "./data";
import { submitProduct, uploadProductImages, createVideoUploadUrl } from "@/lib/vendor-actions";
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

// ─── Status config (mirrors ListingsTable) ────────────────────────────────────
const STATUS_CFG: Record<
  ListingStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  DRAFT:             { label: "Draft",             bg: "bg-stone-100",      text: "text-stone-500",    border: "border-stone-200",    dot: "bg-stone-400"  },
  PENDING_APPROVAL:  { label: "Pending Review",    bg: "bg-amber-50",       text: "text-amber-700",    border: "border-amber-200",    dot: "bg-amber-500"  },
  CHANGES_REQUESTED: { label: "Changes Requested", bg: "bg-orange-50",      text: "text-orange-700",   border: "border-orange-200",   dot: "bg-orange-500" },
  APPROVED:          { label: "Approved",          bg: "bg-emerald-50",     text: "text-emerald-700",  border: "border-emerald-200",  dot: "bg-emerald-500"},
  REJECTED:          { label: "Rejected",          bg: "bg-red-50",         text: "text-red-700",      border: "border-red-200",      dot: "bg-red-500"    },
  INACTIVE:          { label: "Inactive",          bg: "bg-slate-50",       text: "text-slate-500",    border: "border-slate-200",    dot: "bg-slate-400"  },
};

// ─── Vendor product detail modal ───────────────────────────────────────────────
function VendorProductDetailModal({
  listing,
  onClose,
  onEdit,
}: {
  listing: VendorListing;
  onClose: () => void;
  onEdit: () => void;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const images = listing.imageUrls ?? [];
  const hasVideo = !!listing.videoUrl;
  const sc = STATUS_CFG[listing.status];

  const prevImg = () => setImgIdx((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setImgIdx((i) => (i + 1) % images.length);

  const SPECS = [
    { label: "Material",   value: listing.materialType },
    { label: "Category",   value: listing.category },
    { label: "Color",      value: listing.color },
    { label: "Finish",     value: listing.finish },
    { label: "Thickness",  value: listing.thickness },
    { label: "Dimensions", value: listing.dimensions },
    { label: "Warehouse",  value: listing.warehouseCity },
    { label: "Views",      value: listing.views.toLocaleString() },
  ];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="min-h-full flex items-start justify-center px-4 pt-24 pb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
            <div>
              <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.16em] text-amber-gold mb-1">
                Product Details
              </p>
              <h2 className="font-serif text-xl font-bold text-gray-900 leading-tight">
                {listing.name}
              </h2>
              <p className="font-sans text-xs text-gray-400 mt-0.5 capitalize">
                {listing.materialType} · {listing.category}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-sans font-semibold whitespace-nowrap ${sc.bg} ${sc.text} ${sc.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                {sc.label}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body — two-column on md+ */}
          <div className="flex flex-col md:flex-row">
            {/* Left: image gallery */}
            <div className="p-5 md:w-[52%] flex-shrink-0">
              {/* Main image / video */}
              {showVideo && hasVideo ? (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-900">
                  <video
                    src={listing.videoUrl!}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : images.length > 0 ? (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={images[imgIdx]}
                    alt={listing.name}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImg}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                      >
                        <ChevronLeft size={14} className="text-gray-600" />
                      </button>
                      <button
                        onClick={nextImg}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                      >
                        <ChevronRight size={14} className="text-gray-600" />
                      </button>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/50 text-white text-[10px] font-sans rounded-full">
                        {imgIdx + 1} / {images.length}
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-2xl bg-gray-50 flex flex-col items-center justify-center gap-2 text-gray-300">
                  <ImageIcon size={36} strokeWidth={1} />
                  <p className="text-xs font-sans">No images uploaded</p>
                </div>
              )}

              {/* Thumbnails + video thumb */}
              {(images.length > 1 || hasVideo) && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {images.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => { setImgIdx(i); setShowVideo(false); }}
                      className={`flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                        i === imgIdx && !showVideo
                          ? "border-amber-gold shadow-sm"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {hasVideo && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className={`flex-shrink-0 w-12 h-12 rounded-xl border-2 transition-all flex items-center justify-center bg-gray-800 ${
                        showVideo ? "border-amber-gold" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Play size={16} className="text-white" fill="white" />
                    </button>
                  )}
                </div>
              )}

              {/* Media summary */}
              <div className="mt-3 flex items-center gap-3 text-[11px] font-sans text-gray-400">
                {images.length > 0 && (
                  <span>{images.length} photo{images.length !== 1 ? "s" : ""}</span>
                )}
                {hasVideo && (
                  <span className="flex items-center gap-1 text-purple-500">
                    <Video size={11} /> Video attached
                  </span>
                )}
                {images.length === 0 && !hasVideo && (
                  <span>No media uploaded</span>
                )}
              </div>
            </div>

            {/* Right: info */}
            <div className="flex-1 p-5 md:border-l border-gray-100">
              {/* Price block */}
              <div className="mb-5 p-4 bg-amber-gold/5 rounded-2xl border border-amber-gold/15">
                <p className="text-[9px] font-sans font-semibold uppercase tracking-[0.14em] text-amber-gold/80 mb-1">
                  Your Price
                </p>
                <p className="font-serif text-2xl font-bold text-gray-900">
                  ₹{listing.pricePerUnit.toLocaleString()}
                  <span className="font-sans text-sm font-normal text-gray-400 ml-1.5">
                    / {listing.unit}
                  </span>
                </p>
                <p
                  className={`text-xs font-sans font-semibold mt-2 ${
                    listing.isOutOfStock ? "text-red-500" : "text-emerald-600"
                  }`}
                >
                  {listing.isOutOfStock
                    ? "Out of Stock"
                    : `${listing.stockQty.toLocaleString()} units in stock`}
                </p>
              </div>

              {/* Spec grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
                {SPECS.map(({ label, value }) =>
                  value ? (
                    <div key={label}>
                      <p className="text-[9px] font-sans font-semibold uppercase tracking-[0.12em] text-gray-400 mb-0.5">
                        {label}
                      </p>
                      <p className="font-sans text-sm font-medium text-gray-800 capitalize leading-snug">
                        {value}
                      </p>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/60">
            <p className="text-[11px] font-sans text-gray-400">
              Listed {new Date(listing.createdAt * 1000).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-sans font-semibold text-gray-500 hover:text-gray-800 transition-colors rounded-xl hover:bg-gray-100"
              >
                Close
              </button>
              <motion.button
                onClick={() => { onClose(); onEdit(); }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2 bg-amber-gold text-white font-sans font-semibold text-sm rounded-xl hover:bg-amber-gold/90 transition-colors shadow-sm"
              >
                <Edit3 size={14} />
                Edit Listing
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
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
  const [detailListingId, setDetailListingId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const detailListing = detailListingId
    ? listings.find((l) => l.id === detailListingId) ?? null
    : null;

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

      // Upload images + video then persist to DB in background
      startTransition(async () => {
        let imageUrls: string[] = [];
        let videoUrl: string | null = null;

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

        const videoFile = data.step3.files[6];
        if (videoFile) {
          try {
            // Get a signed upload URL from server, then upload directly from
            // browser to Supabase — avoids the 1 MB server-action body limit.
            const { signedUrl, publicUrl } = await createVideoUploadUrl(videoFile.name);
            if (signedUrl && publicUrl) {
              const res = await fetch(signedUrl, {
                method: "PUT",
                body: videoFile,
                headers: { "Content-Type": videoFile.type || "video/mp4" },
              });
              if (res.ok) videoUrl = publicUrl;
            }
          } catch {
            // Video upload failed — proceed without it
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
          videoUrl,
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
                    onViewDetails={(id) => setDetailListingId(id)}
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

      {/* Product detail modal */}
      <AnimatePresence>
        {detailListing && (
          <VendorProductDetailModal
            key={detailListing.id}
            listing={detailListing}
            onClose={() => setDetailListingId(null)}
            onEdit={() => handleEditListing(detailListing.id)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
