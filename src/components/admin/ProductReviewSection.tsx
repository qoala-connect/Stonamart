"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Check, X, MapPin, Tag, Layers, Building,
  Phone, Mail, ChevronLeft, ChevronRight, Play,
  IndianRupee, Box, Ruler, Palette, Sparkles, Clock,
  CheckCircle2, Film,
} from "lucide-react";
import Image from "next/image";
import { approveProduct, rejectProduct } from "@/lib/admin-actions";
import type { PendingProduct } from "@/lib/admin-actions";

// ─── Reject modal ──────────────────────────────────────────────────────────────
function RejectModal({
  product,
  onClose,
  onConfirm,
}: {
  product: PendingProduct;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-serif text-lg font-bold text-stone-950 mb-1">Reject Listing</h3>
        <p className="font-sans text-xs text-stone-dark/50 mb-4">
          &ldquo;{product.name}&rdquo; — {product.companyName ?? product.vendorName}
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Explain why this product was rejected (the vendor will be notified)…"
          rows={4}
          className="w-full p-3 text-sm font-sans border border-stone-dark/15 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-red-300/60 placeholder:text-stone-dark/30"
        />
        <div className="flex gap-3 mt-4">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-stone-dark/12 rounded-xl text-sm font-sans font-medium text-stone-dark/55 hover:bg-stone-dark/4 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={!reason.trim()}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-sans font-semibold hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Reject Listing
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Image gallery inside the detail modal ────────────────────────────────────
function ImageGallery({ urls, videoUrl }: { urls: string[]; videoUrl: string | null }) {
  const [active, setActive] = useState(0);
  const allMedia = [...urls, ...(videoUrl ? ["__video__"] : [])];

  if (allMedia.length === 0) {
    return (
      <div className="aspect-[4/3] bg-stone-100 rounded-2xl flex items-center justify-center">
        <Package size={40} className="text-stone-300" />
      </div>
    );
  }

  const isVideo = allMedia[active] === "__video__";

  return (
    <div className="space-y-2">
      {/* Main view */}
      <div className="relative aspect-[4/3] bg-stone-100 rounded-2xl overflow-hidden">
        {isVideo && videoUrl ? (
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-contain bg-black"
          />
        ) : urls[active] ? (
          <Image
            src={urls[active]}
            alt={`Product image ${active + 1}`}
            fill
            className="object-cover"
            sizes="560px"
          />
        ) : null}

        {/* Nav arrows */}
        {allMedia.length > 1 && (
          <>
            <button
              onClick={() => setActive((i) => (i - 1 + allMedia.length) % allMedia.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setActive((i) => (i + 1) % allMedia.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/50 rounded-full text-[10px] font-sans text-white">
          {active + 1} / {allMedia.length}
        </div>
      </div>

      {/* Thumbnails */}
      {allMedia.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allMedia.map((m, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                active === i ? "border-amber-gold" : "border-transparent hover:border-stone-dark/20"
              }`}
            >
              {m === "__video__" ? (
                <div className="w-full h-full bg-stone-800 flex items-center justify-center">
                  <Play size={14} className="text-amber-gold" />
                </div>
              ) : (
                <Image src={m} alt="" fill className="object-cover" sizes="56px" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Full detail modal ─────────────────────────────────────────────────────────
function ProductDetailModal({
  product,
  onClose,
  onApprove,
  onReject,
}: {
  product: PendingProduct;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const timeAgo = (() => {
    const diff = Date.now() - new Date(product.createdAt).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  })();

  const specs = [
    { icon: Palette,      label: "Material",   value: product.materialType },
    { icon: Tag,          label: "Category",   value: product.category },
    { icon: Sparkles,     label: "Color",      value: product.color },
    { icon: Layers,       label: "Finish",     value: product.finish },
    { icon: Ruler,        label: "Thickness",  value: product.thickness },
    { icon: Ruler,        label: "Dimensions", value: product.dimensions || "—" },
    { icon: MapPin,       label: "Warehouse",  value: product.warehouseCity },
    { icon: Box,          label: "Stock",      value: `${product.stockQty} ${product.unit}` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm overflow-y-auto flex items-start justify-center p-4 pt-16"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-7 pt-6 pb-4 border-b border-stone-dark/8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200/60 rounded-full text-[10px] font-sans font-bold text-amber-700 uppercase tracking-wide">
                {product.materialType}
              </span>
              <span className="text-[10px] font-sans text-stone-dark/35">{timeAgo}</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-950 leading-tight">{product.name}</h2>
            <p className="font-sans text-xs text-stone-dark/45 mt-1">
              by {product.companyName ?? product.vendorName}
            </p>
          </div>
          <div className="flex items-start gap-3 flex-shrink-0">
            <div className="text-right">
              <p className="font-sans text-2xl font-bold text-stone-950">
                ₹{Number(product.pricePerUnit).toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] font-sans text-stone-dark/40">per {product.unit}</p>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-xl bg-stone-dark/5 hover:bg-stone-dark/10 flex items-center justify-center transition-colors">
              <X size={15} className="text-stone-dark/50" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left: media */}
          <div className="p-6 border-r border-stone-dark/6">
            <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-dark/35 mb-3">
              Media ({(product.imageUrls?.length ?? 0)}{product.videoUrl ? " + 1 video" : ""})
            </p>
            <ImageGallery urls={product.imageUrls ?? []} videoUrl={product.videoUrl ?? null} />
          </div>

          {/* Right: specs + vendor */}
          <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
            {/* Pricing */}
            <div className="p-4 bg-amber-gold/6 border border-amber-gold/20 rounded-2xl flex items-center gap-4">
              <IndianRupee size={20} className="text-amber-gold flex-shrink-0" />
              <div>
                <p className="text-[10px] font-sans text-stone-dark/40 uppercase tracking-wide">Price per {product.unit}</p>
                <p className="font-serif text-2xl font-bold text-stone-950">
                  ₹{Number(product.pricePerUnit).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[10px] font-sans text-stone-dark/40 uppercase tracking-wide">Stock</p>
                <p className="font-sans text-lg font-bold text-stone-950">{product.stockQty}</p>
                <p className="text-[10px] font-sans text-stone-dark/40">{product.unit}</p>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-dark/35 mb-3">
                Specifications
              </p>
              <div className="grid grid-cols-2 gap-2">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5 px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-dark/6">
                    <Icon size={13} className="text-amber-gold flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-[9px] font-sans text-stone-dark/40 uppercase tracking-wide">{label}</p>
                      <p className="text-[12px] font-sans font-semibold text-stone-950 mt-0.5 truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Media summary */}
            <div>
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-dark/35 mb-3">
                Media Uploaded
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded-xl border border-stone-dark/6">
                  <Layers size={13} className="text-amber-gold" />
                  <span className="font-sans text-[12px] font-semibold text-stone-950">
                    {product.imageUrls?.length ?? 0} image{(product.imageUrls?.length ?? 0) !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                  product.videoUrl
                    ? "bg-purple-50 border-purple-200"
                    : "bg-stone-50 border-stone-dark/6"
                }`}>
                  <Film size={13} className={product.videoUrl ? "text-purple-500" : "text-stone-dark/25"} />
                  <span className={`font-sans text-[12px] font-semibold ${product.videoUrl ? "text-purple-700" : "text-stone-dark/35"}`}>
                    {product.videoUrl ? "Video uploaded" : "No video"}
                  </span>
                </div>
              </div>
            </div>

            {/* Vendor info */}
            <div>
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-dark/35 mb-3">
                Vendor
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-dark/6">
                  <Building size={13} className="text-amber-gold flex-shrink-0" />
                  <div>
                    <p className="text-[9px] font-sans text-stone-dark/40 uppercase tracking-wide">Company</p>
                    <p className="text-[12px] font-sans font-semibold text-stone-950">{product.companyName ?? product.vendorName}</p>
                  </div>
                </div>
                {product.vendorEmail && (
                  <a href={`mailto:${product.vendorEmail}`}
                    className="flex items-center gap-2.5 px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-dark/6 hover:border-amber-gold/30 transition-colors group">
                    <Mail size={13} className="text-amber-gold flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[9px] font-sans text-stone-dark/40 uppercase tracking-wide">Email</p>
                      <p className="text-[12px] font-sans font-semibold text-stone-950 truncate group-hover:text-amber-gold transition-colors">{product.vendorEmail}</p>
                    </div>
                  </a>
                )}
                {product.vendorPhone && (
                  <a href={`tel:${product.vendorPhone}`}
                    className="flex items-center gap-2.5 px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-dark/6 hover:border-amber-gold/30 transition-colors group">
                    <Phone size={13} className="text-amber-gold flex-shrink-0" />
                    <div>
                      <p className="text-[9px] font-sans text-stone-dark/40 uppercase tracking-wide">Phone</p>
                      <p className="text-[12px] font-sans font-semibold text-stone-950 group-hover:text-amber-gold transition-colors">{product.vendorPhone}</p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="px-7 py-5 bg-stone-50 border-t border-stone-dark/8 rounded-b-3xl flex items-center gap-3">
          <button onClick={onReject}
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-red-200 text-red-600 font-sans text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors">
            <X size={15} /> Reject Listing
          </button>
          <button onClick={onApprove}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-sm font-semibold rounded-xl transition-colors shadow-sm">
            <Check size={15} /> Approve & Publish
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Compact summary card ──────────────────────────────────────────────────────
function ProductCard({
  product,
  onClick,
}: {
  product: PendingProduct;
  onClick: () => void;
}) {
  const timeAgo = (() => {
    const diff = Date.now() - new Date(product.createdAt).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  })();

  const heroImage = product.imageUrls?.[0] ?? null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      onClick={onClick}
      className="bg-white rounded-2xl border border-stone-dark/8 overflow-hidden hover:shadow-md hover:border-amber-gold/30 transition-all cursor-pointer group"
    >
      {/* Hero image */}
      <div className="relative h-44 bg-stone-100">
        {heroImage ? (
          <Image src={heroImage} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="400px" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package size={32} className="text-stone-300" />
          </div>
        )}
        {/* Media count badge */}
        <div className="absolute top-2 right-2 flex gap-1">
          {(product.imageUrls?.length ?? 0) > 0 && (
            <span className="px-2 py-0.5 bg-black/55 backdrop-blur-sm rounded-full text-[9px] font-sans font-bold text-white">
              {product.imageUrls.length} 📷
            </span>
          )}
          {product.videoUrl && (
            <span className="px-2 py-0.5 bg-purple-600/80 backdrop-blur-sm rounded-full text-[9px] font-sans font-bold text-white flex items-center gap-0.5">
              <Film size={8} /> Vid
            </span>
          )}
        </div>
        {/* Material type */}
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[9px] font-sans font-bold text-stone-800 capitalize">
            {product.materialType}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="font-serif text-base font-bold text-stone-950 leading-tight truncate">{product.name}</h3>
            <p className="font-sans text-[11px] text-stone-dark/45 mt-0.5">by {product.companyName ?? product.vendorName}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-sans text-sm font-bold text-stone-950">₹{Number(product.pricePerUnit).toLocaleString("en-IN")}</p>
            <p className="text-[9px] font-sans text-stone-dark/35">/{product.unit}</p>
          </div>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-1 mb-3">
          {[product.color, product.finish, product.thickness].map((v) => (
            <span key={v} className="px-2 py-0.5 bg-stone-dark/4 rounded-full text-[9px] font-sans font-medium text-stone-dark/55">{v}</span>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-2.5 border-t border-stone-dark/6">
          <div className="flex items-center gap-1 text-stone-dark/35">
            <Clock size={10} />
            <span className="font-sans text-[10px]">{timeAgo}</span>
          </div>
          <span className="flex items-center gap-1 font-sans text-[10.5px] font-semibold text-amber-gold group-hover:gap-2 transition-all">
            <CheckCircle2 size={11} /> Review Details →
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main section ──────────────────────────────────────────────────────────────
export function ProductReviewSection({
  initialProducts,
}: {
  initialProducts: PendingProduct[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [detailProduct, setDetailProduct] = useState<PendingProduct | null>(null);
  const [rejectTarget, setRejectTarget] = useState<PendingProduct | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [, startTransition] = useTransition();

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleApprove = (product: PendingProduct) => {
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    setDetailProduct(null);
    startTransition(async () => {
      const res = await approveProduct(product.id);
      if (res.ok) {
        showToast(`"${product.name}" approved and added to catalog.`, true);
      } else {
        setProducts((prev) => [product, ...prev]);
        showToast(res.error ?? "Failed to approve.", false);
      }
    });
  };

  const handleReject = (reason: string) => {
    if (!rejectTarget) return;
    const target = rejectTarget;
    setRejectTarget(null);
    setDetailProduct(null);
    setProducts((prev) => prev.filter((p) => p.id !== target.id));
    startTransition(async () => {
      const res = await rejectProduct(target.id, reason);
      if (res.ok) {
        showToast(`"${target.name}" rejected. Vendor notified.`, true);
      } else {
        setProducts((prev) => [target, ...prev]);
        showToast(res.error ?? "Failed to reject.", false);
      }
    });
  };

  return (
    <div className="flex-1 overflow-y-auto px-7 py-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className={`fixed top-5 right-5 z-40 max-w-sm px-4 py-3 rounded-xl shadow-lg text-sm font-sans font-medium ${
              toast.ok ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail modal */}
      <AnimatePresence>
        {detailProduct && (
          <ProductDetailModal
            product={detailProduct}
            onClose={() => setDetailProduct(null)}
            onApprove={() => handleApprove(detailProduct)}
            onReject={() => setRejectTarget(detailProduct)}
          />
        )}
      </AnimatePresence>

      {/* Reject modal */}
      <AnimatePresence>
        {rejectTarget && (
          <RejectModal
            product={rejectTarget}
            onClose={() => setRejectTarget(null)}
            onConfirm={handleReject}
          />
        )}
      </AnimatePresence>

      {/* Empty state */}
      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 gap-3 text-stone-dark/20"
        >
          <Package size={48} strokeWidth={1} />
          <p className="font-sans text-sm">No products pending review</p>
        </motion.div>
      ) : (
        <>
          <p className="font-sans text-xs text-stone-dark/40 mb-5">
            {products.length} listing{products.length !== 1 ? "s" : ""} awaiting review — click any card to view all details, images, and video
          </p>
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onClick={() => setDetailProduct(p)}
                />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
