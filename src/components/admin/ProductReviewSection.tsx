"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Check, X, MapPin, Tag, Layers, ChevronDown, ChevronUp } from "lucide-react";
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
      >
        <h3 className="font-serif text-lg font-bold text-stone-950 mb-1">
          Reject listing
        </h3>
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
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-stone-dark/12 rounded-xl text-sm font-sans font-medium text-stone-dark/55 hover:bg-stone-dark/4 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={!reason.trim()}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-sans font-semibold hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Reject listing
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Single product card ───────────────────────────────────────────────────────
function ProductCard({
  product,
  onApprove,
  onReject,
}: {
  product: PendingProduct;
  onApprove: () => void;
  onReject: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const timeAgo = (() => {
    const diff = Date.now() - new Date(product.createdAt).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  })();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-white rounded-2xl border border-stone-dark/8 overflow-hidden"
    >
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-amber-50 border border-amber-200/60 rounded-full text-[10px] font-sans font-semibold text-amber-700 capitalize">
                {product.materialType}
              </span>
              <span className="text-[10px] font-sans text-stone-dark/35">{timeAgo}</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-950 leading-snug">
              {product.name}
            </h3>
            <p className="font-sans text-xs text-stone-dark/50 mt-0.5">
              by {product.companyName ?? product.vendorName}
            </p>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="font-sans text-xl font-bold text-stone-950">
              ₹{Number(product.pricePerUnit).toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] font-sans text-stone-dark/40">
              per {product.unit}
            </p>
          </div>
        </div>

        {/* Quick chips */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {[
            product.category,
            product.color,
            product.finish,
            product.thickness,
          ].map((v) => (
            <span
              key={v}
              className="px-2 py-0.5 bg-stone-dark/4 rounded-full text-[10px] font-sans font-medium text-stone-dark/60"
            >
              {v}
            </span>
          ))}
        </div>

        {/* Expand details */}
        <button
          onClick={() => setExpanded((x) => !x)}
          className="mt-3 flex items-center gap-1 text-[11px] font-sans text-stone-dark/40 hover:text-amber-gold transition-colors"
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? "Less details" : "More details"}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-stone-dark/6 grid grid-cols-2 gap-2 text-[11px] font-sans text-stone-dark/60">
                <div className="flex items-center gap-1.5">
                  <Layers size={11} className="text-stone-dark/30" />
                  <span>Dimensions: {product.dimensions || "—"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag size={11} className="text-stone-dark/30" />
                  <span>Stock: {product.stockQty} units</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <MapPin size={11} className="text-stone-dark/30" />
                  <span>Warehouse: {product.warehouseCity}, India</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action bar */}
      <div className="px-5 py-3.5 bg-stone-dark/2 border-t border-stone-dark/6 flex gap-3">
        <button
          onClick={onApprove}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-sans font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Check size={14} />
          Approve
        </button>
        <button
          onClick={onReject}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-sans font-semibold rounded-xl transition-colors"
        >
          <X size={14} />
          Reject
        </button>
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
  const [rejectTarget, setRejectTarget] = useState<PendingProduct | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [, startTransition] = useTransition();

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleApprove = (product: PendingProduct) => {
    // Remove immediately — restore only if server call fails
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-5 right-5 z-40 max-w-sm px-4 py-3 rounded-xl shadow-lg text-sm font-sans font-medium ${
              toast.ok
                ? "bg-emerald-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {toast.msg}
          </motion.div>
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 gap-3 text-stone-dark/20"
        >
          <Package size={48} strokeWidth={1} />
          <p className="font-sans text-sm">No products pending review</p>
        </motion.div>
      ) : (
        <>
          <p className="font-sans text-xs text-stone-dark/40 mb-5">
            {products.length} listing{products.length !== 1 ? "s" : ""} awaiting
            review — approve to publish in the catalog, or reject with feedback.
          </p>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onApprove={() => handleApprove(p)}
                  onReject={() => setRejectTarget(p)}
                />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
