"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio, CheckCircle2, Clock, MapPin, Tag, Package,
  MessageCircle, Loader2, AlertCircle, ChevronDown, Film, ImageIcon,
} from "lucide-react";
import {
  submitVendorResponse,
} from "@/lib/request-actions";
import type { ProductRequest } from "@/lib/request-actions";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function fmtBudget(req: ProductRequest) {
  if (req.budgetMin && req.budgetMax) {
    return `₹${Number(req.budgetMin).toLocaleString("en-IN")} – ₹${Number(req.budgetMax).toLocaleString("en-IN")} / ${req.unit}`;
  }
  if (req.budgetMin) return `from ₹${Number(req.budgetMin).toLocaleString("en-IN")} / ${req.unit}`;
  return "Negotiable";
}

const AVAILABILITY_OPTIONS = [
  "In stock — can ship in 3–5 days",
  "In stock — can ship in 1–2 weeks",
  "Available to order — 2–4 weeks",
  "Limited quantity available",
  "Will confirm stock shortly",
];

// ── ResponseForm ──────────────────────────────────────────────────────────────
function ResponseForm({
  requestId,
  unit,
  onSuccess,
  onCancel,
}: {
  requestId: string;
  unit: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    price: "",
    unit,
    availability: AVAILABILITY_OPTIONS[0],
    message: "",
  });

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await submitVendorResponse(requestId, form);
      if (!result.ok) {
        setError(result.error ?? "Failed to submit. Please try again.");
        return;
      }
      onSuccess();
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className="border-t border-gray-100 mt-4 pt-4"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <p className="font-sans font-semibold text-[13px] text-gray-800 mb-3">
          Your Response
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.08em] mb-1.5">
              Your Price (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 95"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              className="w-full px-3 py-2.5 text-[13px] font-sans border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-gold/30 bg-white placeholder:text-gray-300"
            />
          </div>
          <div>
            <label className="block text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.08em] mb-1.5">
              Per Unit
            </label>
            <select
              value={form.unit}
              onChange={(e) => set("unit", e.target.value)}
              className="w-full px-3 py-2.5 text-[13px] font-sans border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-gold/30 bg-white appearance-none cursor-pointer"
            >
              {["sqft", "sqm", "running ft", "pieces", "slabs", "kg", "tons"].map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.08em] mb-1.5">
            Availability
          </label>
          <div className="relative">
            <select
              value={form.availability}
              onChange={(e) => set("availability", e.target.value)}
              className="w-full px-3 py-2.5 text-[13px] font-sans border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-gold/30 bg-white appearance-none cursor-pointer pr-8"
            >
              {AVAILABILITY_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.08em] mb-1.5">
            Message (optional)
          </label>
          <textarea
            placeholder="Dimensions available, minimum order quantity, sample options, delivery terms…"
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 text-[13px] font-sans border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-gold/30 resize-none placeholder:text-gray-300 bg-white transition-all"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-[12px] text-red-600 bg-red-50 rounded-xl px-3 py-2">
            <AlertCircle size={13} />
            {error}
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-[13px] font-sans font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-[2] flex items-center justify-center gap-2 py-2.5 bg-amber-gold text-white rounded-xl text-[13px] font-sans font-semibold hover:bg-amber-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <><Loader2 size={13} className="animate-spin" /> Sending…</>
            ) : (
              <><CheckCircle2 size={13} /> I Have This — Send Response</>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// ── RequestCard ───────────────────────────────────────────────────────────────
function RequestCard({ request }: { request: ProductRequest }) {
  const [open, setOpen] = useState(false);
  const [responded, setResponded] = useState(false);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-bold text-[16px] text-gray-900 leading-tight mb-1">
            {request.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-sans text-gray-400">
            <span className="flex items-center gap-1">
              <Tag size={10} />
              {request.category}
            </span>
            {request.targetCity && (
              <span className="flex items-center gap-1">
                <MapPin size={10} />
                {request.targetCity}
              </span>
            )}
            {request.quantity && (
              <span className="flex items-center gap-1">
                <Package size={10} />
                {request.quantity} {request.unit}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {fmtDate(request.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="font-sans font-bold text-[14px] text-amber-gold whitespace-nowrap">
            {fmtBudget(request)}
          </p>
        </div>
      </div>

      {/* Description */}
      {request.description && (
        <p className="font-sans text-[12px] text-gray-500 leading-relaxed bg-gray-50 rounded-xl px-3 py-2.5 mb-3">
          {request.description}
        </p>
      )}

      {/* Reference media */}
      {request.mediaUrls && request.mediaUrls.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] font-sans font-semibold text-gray-400 uppercase tracking-[0.08em] mb-1.5 flex items-center gap-1">
            <ImageIcon size={10} />
            Reference Photos
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {request.mediaUrls.map((url, i) => {
              const isVideo = /\.(mp4|mov|webm)$/i.test(url);
              return isVideo ? (
                <div
                  key={i}
                  className="w-16 h-16 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-200"
                >
                  <Film size={16} className="text-amber-gold/70" />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt={`ref ${i + 1}`}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Action */}
      <AnimatePresence mode="wait">
        {responded ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 py-2.5 px-4 bg-emerald-50 border border-emerald-100 rounded-xl text-[13px] font-sans font-semibold text-emerald-700"
          >
            <CheckCircle2 size={15} />
            Response sent! Stonamart will contact you shortly.
          </motion.div>
        ) : open ? (
          <ResponseForm
            key="form"
            requestId={request.id}
            unit={request.unit}
            onSuccess={() => { setOpen(false); setResponded(true); }}
            onCancel={() => setOpen(false)}
          />
        ) : (
          <motion.button
            key="cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-gold/10 hover:bg-amber-gold text-amber-gold hover:text-white border border-amber-gold/25 rounded-xl text-[13px] font-sans font-semibold transition-all duration-200 active:scale-[0.98]"
          >
            <MessageCircle size={14} />
            I Have This Product
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main VendorRequestsPanel ──────────────────────────────────────────────────
export function VendorRequestsPanel({
  initialRequests,
}: {
  initialRequests: ProductRequest[];
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-amber-gold/12 border border-amber-gold/20 flex items-center justify-center">
            <Radio size={16} className="text-amber-gold" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-gray-900">Sourcing Requests</h1>
            <p className="font-sans text-[12px] text-gray-400">
              Products customers are looking for right now
            </p>
          </div>
        </div>
      </div>

      {/* Requests list */}
      {initialRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-300">
          <Radio size={40} strokeWidth={1} />
          <p className="font-sans text-base text-gray-400">No open sourcing requests</p>
          <p className="font-sans text-[12px] text-gray-300">
            When customers request products, they will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {initialRequests.map((req) => (
            <RequestCard key={req.id} request={req} />
          ))}
        </div>
      )}
    </div>
  );
}
