"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, User, Package, Phone, Mail, Clock,
  ChevronRight, Loader2, CheckCircle2, X, Filter, ExternalLink,
} from "lucide-react";
import type { CustomerInquiry, InquiryStatus } from "@/lib/inquiry-actions";
import { updateInquiryStatus } from "@/lib/inquiry-actions";

const STATUS_META: Record<InquiryStatus, { label: string; color: string; dot: string }> = {
  NEW:       { label: "New",       color: "bg-blue-50 text-blue-700 border-blue-200",     dot: "bg-blue-500"  },
  CONTACTED: { label: "Contacted", color: "bg-amber-50 text-amber-700 border-amber-200",  dot: "bg-amber-500" },
  CLOSED:    { label: "Closed",    color: "bg-stone-100 text-stone-500 border-stone-200", dot: "bg-stone-400" },
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
  try { return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return iso; }
}

// ─── Inquiry Detail Slide-over ────────────────────────────────────────────────
function InquiryDetail({
  inquiry, onClose, onStatusChange,
}: {
  inquiry: CustomerInquiry;
  onClose: () => void;
  onStatusChange: (id: string, status: InquiryStatus) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [localStatus, setLocalStatus] = useState<InquiryStatus>(inquiry.status);

  function handleStatusUpdate(status: InquiryStatus) {
    if (status === localStatus) return;
    startTransition(async () => {
      const res = await updateInquiryStatus(inquiry.id, status);
      if (res.ok) { setLocalStatus(status); onStatusChange(inquiry.id, status); }
    });
  }

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
          {/* Product info */}
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
                  <StatusBadge status={localStatus} />
                  {inquiry.productId && (
                    <Link
                      href={`/products/${inquiry.productId}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-[11px] font-sans text-amber-600 hover:text-amber-700"
                    >
                      View product <ExternalLink size={10} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Customer info */}
          <div className="px-6 py-4 border-b border-stone-100 space-y-2.5">
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-stone-400">Customer</p>
            <div className="flex items-center gap-2 text-[13px] font-sans text-stone-700">
              <User size={13} className="text-stone-400 flex-shrink-0" />
              {inquiry.customerName || "—"}
            </div>
            <div className="flex items-center gap-2 text-[13px] font-sans text-stone-700">
              <Mail size={13} className="text-stone-400 flex-shrink-0" />
              {inquiry.customerEmail}
            </div>
            {inquiry.customerPhone && (
              <div className="flex items-center gap-2 text-[13px] font-sans text-stone-700">
                <Phone size={13} className="text-stone-400 flex-shrink-0" />
                {inquiry.customerPhone}
              </div>
            )}
          </div>

          {/* Message */}
          <div className="px-6 py-4 border-b border-stone-100 space-y-2">
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-stone-400">Message</p>
            <p className="text-[13px] font-sans text-stone-700 leading-relaxed">{inquiry.message}</p>
          </div>

          {/* Date */}
          <div className="px-6 py-3 border-b border-stone-100">
            <span className="flex items-center gap-1.5 text-[12px] font-sans text-stone-400">
              <Clock size={12} /> Received {formatDate(inquiry.createdAt)}
            </span>
          </div>

          {/* Status controls */}
          <div className="px-6 py-5 space-y-3">
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-stone-400">Update Status</p>
            <div className="flex gap-2 flex-wrap">
              {(["NEW", "CONTACTED", "CLOSED"] as InquiryStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusUpdate(s)}
                  disabled={isPending || localStatus === s}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-sans font-semibold border transition-all disabled:cursor-not-allowed ${
                    localStatus === s
                      ? `${STATUS_META[s].color} opacity-100`
                      : "border-stone-200 text-stone-500 hover:border-stone-300 hover:bg-stone-50 opacity-70 hover:opacity-100"
                  }`}
                >
                  {isPending && localStatus !== s ? <Loader2 size={11} className="animate-spin" /> : localStatus === s ? <CheckCircle2 size={11} /> : null}
                  {STATUS_META[s].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Inquiry Card ──────────────────────────────────────────────────────────────
function InquiryCard({ inquiry, onSelect }: { inquiry: CustomerInquiry; onSelect: () => void }) {
  return (
    <motion.button
      onClick={onSelect} layout
      className="w-full text-left bg-white border border-stone-100 rounded-2xl px-5 py-4 hover:border-stone-200 hover:shadow-sm transition-all duration-150 flex items-center gap-4 group"
    >
      {inquiry.productImageUrl ? (
        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100">
          <Image src={inquiry.productImageUrl} alt={inquiry.productName} width={48} height={48} className="w-full h-full object-cover" unoptimized />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0">
          <Package size={18} className="text-stone-300" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-[13.5px] font-sans font-semibold text-stone-800 truncate">
            {inquiry.productName || "Product Inquiry"}
          </p>
          <StatusBadge status={inquiry.status} />
        </div>
        <div className="flex items-center gap-3 text-[11.5px] font-sans text-stone-400">
          <span className="flex items-center gap-1"><User size={10} />{inquiry.customerName || inquiry.customerEmail}</span>
          <span className="w-px h-3 bg-stone-200" />
          <span className="flex items-center gap-1"><Clock size={10} />{formatDate(inquiry.createdAt)}</span>
        </div>
        <p className="text-[12px] font-sans text-stone-500 mt-1 line-clamp-1">{inquiry.message}</p>
      </div>
      <ChevronRight size={14} className="text-stone-300 group-hover:text-stone-500 flex-shrink-0 transition-colors" />
    </motion.button>
  );
}

// ─── Main InquirySection ──────────────────────────────────────────────────────
type FilterTab = "all" | "NEW" | "CONTACTED" | "CLOSED";

export function InquirySection({ initialInquiries }: { initialInquiries: CustomerInquiry[] }) {
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(initialInquiries);
  const [selected, setSelected]   = useState<CustomerInquiry | null>(null);
  const [filter, setFilter]       = useState<FilterTab>("all");

  const counts = {
    all:       inquiries.length,
    NEW:       inquiries.filter(i => i.status === "NEW").length,
    CONTACTED: inquiries.filter(i => i.status === "CONTACTED").length,
    CLOSED:    inquiries.filter(i => i.status === "CLOSED").length,
  };

  const filtered = filter === "all" ? inquiries : inquiries.filter(i => i.status === filter);

  function handleStatusChange(id: string, status: InquiryStatus) {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : prev);
  }

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all",       label: `All (${counts.all})`             },
    { key: "NEW",       label: `New (${counts.NEW})`             },
    { key: "CONTACTED", label: `Contacted (${counts.CONTACTED})` },
    { key: "CLOSED",    label: `Closed (${counts.CLOSED})`       },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Filter bar */}
      <div className="flex-shrink-0 flex items-center gap-2 px-7 py-3 border-b border-gray-100 bg-white/80 overflow-x-auto">
        <Filter size={12} className="text-stone-400 flex-shrink-0" />
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-sans font-medium transition-all ${
              filter === tab.key
                ? "bg-amber-500/10 text-amber-700 border border-amber-500/20"
                : "text-stone-500 hover:bg-stone-50 hover:text-stone-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-7 py-5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-stone-300 py-20">
            <MessageSquare size={36} strokeWidth={1} />
            <p className="font-sans text-sm text-stone-400">
              No inquiries{filter !== "all" ? ` with status "${filter}"` : ""}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(inquiry => (
              <InquiryCard key={inquiry.id} inquiry={inquiry} onSelect={() => setSelected(inquiry)} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <InquiryDetail inquiry={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />
        )}
      </AnimatePresence>
    </div>
  );
}
