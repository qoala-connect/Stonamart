"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  AlertTriangle,
  Eye,
  Edit3,
  Search,
  Filter,
} from "lucide-react";
import type { VendorListing, ListingStatus } from "./types";

// ─── Status badge config ──────────────────────────────────────────────────────
const STATUS_CFG: Record<
  ListingStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  DRAFT: {
    label: "Draft",
    bg: "bg-stone-dark/6",
    text: "text-stone-dark/55",
    border: "border-stone-dark/12",
    dot: "bg-stone-dark/35",
  },
  PENDING_APPROVAL: {
    label: "Pending Review",
    bg: "bg-amber-500/10",
    text: "text-amber-700",
    border: "border-amber-400/30",
    dot: "bg-amber-500",
  },
  CHANGES_REQUESTED: {
    label: "Changes Requested",
    bg: "bg-orange-500/10",
    text: "text-orange-700",
    border: "border-orange-400/30",
    dot: "bg-orange-500",
  },
  APPROVED: {
    label: "Approved",
    bg: "bg-emerald-500/10",
    text: "text-emerald-700",
    border: "border-emerald-400/25",
    dot: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-red-500/10",
    text: "text-red-700",
    border: "border-red-400/25",
    dot: "bg-red-500",
  },
  INACTIVE: {
    label: "Inactive",
    bg: "bg-slate-500/7",
    text: "text-slate-500",
    border: "border-slate-400/20",
    dot: "bg-slate-400",
  },
};

const NOISE_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")";

// ─── OOS Toggle ───────────────────────────────────────────────────────────────
function OOSToggle({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      title={checked ? "Mark as In Stock" : "Mark as Out of Stock"}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-gold/40 ${
        checked ? "bg-red-500/75" : "bg-emerald-500"
      }`}
    >
      <motion.span
        animate={{ x: checked ? 17 : 2 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
        className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow"
      />
    </button>
  );
}

// ─── Feedback Expander ────────────────────────────────────────────────────────
function FeedbackPanel({
  feedback,
  status,
  onEdit,
}: {
  feedback: string;
  status: ListingStatus;
  onEdit: () => void;
}) {
  const isRejected = status === "REJECTED";
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ overflow: "hidden" }}
    >
      <div
        className={`mx-4 mb-3 p-4 rounded-xl border text-sm font-sans leading-relaxed ${
          isRejected
            ? "bg-red-50 border-red-200/60 text-red-800"
            : "bg-orange-50 border-orange-200/60 text-orange-800"
        }`}
      >
        <div className="flex items-start gap-2.5">
          <AlertTriangle
            size={14}
            className={`flex-shrink-0 mt-0.5 ${isRejected ? "text-red-500" : "text-orange-500"}`}
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold mb-1 text-xs uppercase tracking-wide opacity-70">
              {isRejected ? "Rejection Reason" : "Admin Feedback"}
            </p>
            <p className="text-[13px]">{feedback}</p>
          </div>
        </div>
        {!isRejected && (
          <div className="mt-3 flex justify-end">
            <motion.button
              onClick={onEdit}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Edit3 size={11} />
              Edit &amp; Resubmit
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Table Row ────────────────────────────────────────────────────────────────
function ListingRow({
  listing,
  isExpanded,
  onToggleExpand,
  onToggleOOS,
  onEdit,
  onView,
  index,
}: {
  listing: VendorListing;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleOOS: () => void;
  onEdit: () => void;
  onView: () => void;
  index: number;
}) {
  const sc = STATUS_CFG[listing.status];
  const hasAlert =
    listing.status === "CHANGES_REQUESTED" || listing.status === "REJECTED";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.04, 0.28),
        duration: 0.38,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      layout
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
        isExpanded
          ? hasAlert && listing.status === "CHANGES_REQUESTED"
            ? "border-orange-300/60 shadow-[0_0_0_3px_rgba(249,115,22,0.06)]"
            : listing.status === "REJECTED"
            ? "border-red-300/60 shadow-[0_0_0_3px_rgba(239,68,68,0.06)]"
            : "border-stone-dark/14"
          : "border-stone-dark/8 hover:border-stone-dark/16"
      }`}
    >
      {/* Main row */}
      <div className="flex items-center gap-4 px-4 py-3.5 min-w-0">
        {/* Stone thumbnail */}
        <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border border-stone-dark/8">
          <div className="absolute inset-0" style={{ background: listing.bg }} />
          <div
            className="absolute inset-0 opacity-15 mix-blend-overlay"
            style={{ backgroundImage: NOISE_URI, backgroundSize: "64px 64px" }}
          />
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <p className="font-sans text-sm font-semibold text-stone-950 truncate leading-tight">
            {listing.name}
          </p>
          <p className="font-sans text-[10px] text-stone-dark/42 mt-0.5 capitalize">
            {listing.materialType} · {listing.category} · {listing.warehouseCity}
          </p>
        </div>

        {/* Status badge */}
        <div className="flex-shrink-0 hidden sm:flex">
          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-sans font-semibold whitespace-nowrap ${sc.bg} ${sc.text} ${sc.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {sc.label}
          </span>
        </div>

        {/* Views */}
        <div className="flex-shrink-0 hidden md:flex items-center gap-1 text-stone-dark/45 w-16 justify-end">
          <Eye size={11} />
          <span className="font-sans text-xs font-medium">
            {listing.views.toLocaleString()}
          </span>
        </div>

        {/* Price */}
        <div className="flex-shrink-0 hidden lg:block w-24 text-right">
          <p className="font-sans text-xs font-semibold text-stone-950">
            ₹{listing.pricePerUnit}
          </p>
          <p className="font-sans text-[9px] text-stone-dark/38">
            / {listing.unit}
          </p>
        </div>

        {/* Stock qty */}
        <div className="flex-shrink-0 hidden lg:block w-20 text-right">
          <p
            className={`font-sans text-xs font-semibold ${
              listing.isOutOfStock ? "text-stone-dark/35 line-through" : "text-stone-950"
            }`}
          >
            {listing.stockQty.toLocaleString()}
          </p>
          <p className="font-sans text-[9px] text-stone-dark/38">units</p>
        </div>

        {/* OOS toggle */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          <OOSToggle checked={listing.isOutOfStock} onToggle={onToggleOOS} />
          <span className="font-sans text-[8px] text-stone-dark/35 uppercase tracking-wide">
            OOS
          </span>
        </div>

        {/* View details button */}
        <motion.button
          onClick={onView}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          title="View Details"
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-stone-dark/5 text-stone-dark/40 hover:bg-amber-gold/10 hover:text-amber-gold transition-colors"
        >
          <Eye size={13} />
        </motion.button>

        {/* Action: expand alert */}
        {hasAlert ? (
          <motion.button
            onClick={onToggleExpand}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
              listing.status === "REJECTED"
                ? "bg-red-100 text-red-500 hover:bg-red-200"
                : "bg-orange-100 text-orange-500 hover:bg-orange-200"
            }`}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} />
            </motion.div>
          </motion.button>
        ) : (
          <div className="flex-shrink-0 w-7 h-7" />
        )}
      </div>

      {/* Expandable feedback */}
      <AnimatePresence>
        {hasAlert && isExpanded && listing.adminFeedback && (
          <FeedbackPanel
            key="feedback"
            feedback={listing.adminFeedback}
            status={listing.status}
            onEdit={onEdit}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Table Component ─────────────────────────────────────────────────────
interface ListingsTableProps {
  listings: VendorListing[];
  onToggleOOS: (id: string) => void;
  onEditListing: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "PENDING_APPROVAL", label: "Pending Review" },
  { value: "CHANGES_REQUESTED", label: "Changes Requested" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "INACTIVE", label: "Inactive" },
];

export function ListingsTable({
  listings,
  onToggleOOS,
  onEditListing,
  onViewDetails,
}: ListingsTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filtered = useMemo(() => {
    return listings
      .filter((l) => {
        const matchSearch =
          !search ||
          l.name.toLowerCase().includes(search.toLowerCase()) ||
          l.materialType.toLowerCase().includes(search.toLowerCase());
        const matchStatus =
          statusFilter === "all" || l.status === statusFilter;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [listings, search, statusFilter]);

  return (
    <div>
      {/* Table header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <p className="text-amber-gold font-sans text-[11px] font-semibold uppercase tracking-[0.16em] mb-0.5">
            My Listings
          </p>
          <h2 className="font-serif text-xl font-bold text-stone-950">
            {filtered.length} Stone{filtered.length !== 1 ? "s" : ""}
          </h2>
        </div>

        {/* Search + Filter controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-dark/35 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stones…"
              className="pl-8 pr-3.5 py-2 text-xs font-sans bg-white border border-stone-dark/10 rounded-xl text-stone-950 placeholder:text-stone-dark/30 focus:outline-none focus:border-amber-gold/45 focus:ring-2 focus:ring-amber-gold/10 w-44 transition-all"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <Filter
              size={12}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-dark/35 pointer-events-none"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-8 pr-7 py-2 text-xs font-sans bg-white border border-stone-dark/10 rounded-xl text-stone-950 appearance-none focus:outline-none focus:border-amber-gold/45 focus:ring-2 focus:ring-amber-gold/10 transition-all cursor-pointer"
            >
              {STATUS_FILTER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={11}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-dark/35 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Column headers (desktop only) */}
      <div className="hidden lg:flex items-center gap-4 px-4 pb-2 text-[9px] font-sans font-semibold uppercase tracking-[0.12em] text-stone-dark/35">
        <div className="w-11 flex-shrink-0" />
        <div className="flex-1">Stone</div>
        <div className="hidden sm:block w-32 flex-shrink-0">Status</div>
        <div className="hidden md:block w-16 text-right flex-shrink-0">Views</div>
        <div className="hidden lg:block w-24 text-right flex-shrink-0">Price</div>
        <div className="hidden lg:block w-20 text-right flex-shrink-0">Stock</div>
        <div className="w-12 text-center flex-shrink-0">OOS</div>
        <div className="w-7 flex-shrink-0" />
      </div>

      {/* Rows */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-12 h-12 bg-stone-dark/5 rounded-2xl flex items-center justify-center mb-3 text-xl">
            🔍
          </div>
          <p className="font-serif text-lg font-semibold text-stone-950 mb-1">
            No listings found
          </p>
          <p className="font-sans text-sm text-stone-dark/45">
            Try adjusting your search or filter
          </p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {filtered.map((listing, i) => (
            <ListingRow
              key={listing.id}
              listing={listing}
              index={i}
              isExpanded={expandedIds.has(listing.id)}
              onToggleExpand={() => toggleExpand(listing.id)}
              onToggleOOS={() => onToggleOOS(listing.id)}
              onEdit={() => onEditListing(listing.id)}
              onView={() => onViewDetails(listing.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
