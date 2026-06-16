"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Building,
  Phone,
  MapPin,
  FileText,
  Clock,
  AlertTriangle,
  RefreshCw,
  Layers,
} from "lucide-react";
import { approveVendor, rejectVendor } from "@/lib/admin-actions";
import type { VendorApplication } from "@/lib/admin-actions";

// ─── Reject modal ──────────────────────────────────────────────────────────────
function RejectModal({
  vendor,
  onConfirm,
  onCancel,
  isLoading,
}: {
  vendor: VendorApplication;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [reason, setReason] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 8 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <XCircle size={18} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-stone-950 text-sm leading-tight">
              Reject Application
            </h3>
            <p className="font-sans text-xs text-stone-dark/40 mt-0.5">
              {vendor.companyName ?? vendor.name}
            </p>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-stone-dark/40 mb-2">
            Reason for rejection{" "}
            <span className="text-red-400 normal-case tracking-normal">
              (required)
            </span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Explain why this application is being rejected. This message will be emailed to the vendor."
            className="w-full px-4 py-3 font-sans text-sm bg-stone-50 border border-stone-dark/10 rounded-xl text-stone-950 placeholder:text-stone-dark/25 focus:outline-none focus:border-amber-gold/40 focus:ring-2 focus:ring-amber-gold/10 resize-none transition-all"
          />
          <p className="text-[10px] font-sans text-stone-dark/30 mt-1.5">
            Will be sent to <span className="text-stone-dark/50">{vendor.email}</span>
          </p>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 font-sans text-sm font-semibold border border-stone-dark/10 text-stone-dark/55 rounded-xl hover:bg-stone-dark/4 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={!reason.trim() || isLoading}
            className="flex-1 px-4 py-2.5 font-sans text-sm font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <RefreshCw size={13} className="animate-spin" />
            ) : (
              <XCircle size={13} />
            )}
            {isLoading ? "Rejecting…" : "Confirm Reject"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Vendor card ───────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

function VendorCard({
  vendor,
  onApprove,
  onReject,
  approving,
}: {
  vendor: VendorApplication;
  onApprove: () => void;
  onReject: () => void;
  approving: boolean;
}) {
  const details = [
    { Icon: Phone,    label: vendor.phone ?? "—" },
    { Icon: MapPin,   label: vendor.city ?? "—" },
    { Icon: FileText, label: vendor.gstNumber ? `GST: ${vendor.gstNumber}` : "No GST provided" },
    { Icon: Building, label: vendor.businessAddress ?? "No address provided" },
  ];

  return (
    <motion.div
      layout
      exit={{ opacity: 0, scale: 0.95, y: -6 }}
      transition={{ duration: 0.22 }}
      className="bg-white rounded-2xl border border-stone-dark/7 p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Building size={13} className="text-amber-gold flex-shrink-0" />
            <h3 className="font-sans font-bold text-stone-950 text-[14px] truncate">
              {vendor.companyName ?? "—"}
            </h3>
          </div>
          <p className="font-sans text-[11px] text-stone-dark/40 truncate">
            {vendor.name} · {vendor.email}
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1 text-stone-dark/30">
          <Clock size={10} />
          <span className="font-sans text-[10px]">{timeAgo(vendor.createdAt)}</span>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 mb-4">
        {details.map(({ Icon, label }, i) => (
          <div key={i} className="flex items-start gap-1.5 min-w-0">
            <Icon size={10} className="text-stone-dark/25 mt-0.5 flex-shrink-0" />
            <span className="font-sans text-[10.5px] text-stone-dark/50 truncate">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3.5 border-t border-stone-dark/6">
        <button
          onClick={onReject}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 font-sans text-xs font-semibold border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors"
        >
          <XCircle size={12} />
          Reject
        </button>
        <button
          onClick={onApprove}
          disabled={approving}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 font-sans text-xs font-semibold bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 transition-colors"
        >
          {approving ? (
            <RefreshCw size={12} className="animate-spin" />
          ) : (
            <CheckCircle size={12} />
          )}
          {approving ? "Approving…" : "Approve"}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main section ──────────────────────────────────────────────────────────────
export function VendorApprovalSection({
  initialVendors,
}: {
  initialVendors: VendorApplication[];
}) {
  const [vendors, setVendors] = useState(initialVendors);
  const [rejectTarget, setRejectTarget] = useState<VendorApplication | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [, startTransition] = useTransition();

  function showToast(msg: string, type: "ok" | "err") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleApprove(userId: string) {
    setApprovingId(userId);
    startTransition(async () => {
      const res = await approveVendor(userId);
      if (res.ok) {
        setVendors((v) => v.filter((x) => x.userId !== userId));
        showToast("Vendor approved — they can now log in", "ok");
      } else {
        showToast(res.error ?? "Failed to approve", "err");
      }
      setApprovingId(null);
    });
  }

  function handleRejectConfirm(reason: string) {
    if (!rejectTarget) return;
    const userId = rejectTarget.userId;
    setRejectingId(userId);
    startTransition(async () => {
      const res = await rejectVendor(userId, reason);
      if (res.ok) {
        setVendors((v) => v.filter((x) => x.userId !== userId));
        showToast("Vendor rejected and notified by email", "ok");
      } else {
        showToast(res.error ?? "Failed to reject", "err");
      }
      setRejectTarget(null);
      setRejectingId(null);
    });
  }

  return (
    <div className="flex-1 overflow-y-auto px-7 py-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-sans text-sm font-bold text-stone-950">
            Pending Applications
          </h3>
          <p className="font-sans text-xs text-stone-dark/38 mt-0.5">
            {vendors.length === 0
              ? "No pending applications right now"
              : `${vendors.length} vendor${vendors.length !== 1 ? "s" : ""} awaiting review`}
          </p>
        </div>
        {vendors.length > 0 && (
          <span className="px-3 py-1 bg-amber-gold/15 text-amber-gold text-[11px] font-sans font-bold rounded-full">
            {vendors.length} pending
          </span>
        )}
      </div>

      {/* Empty state */}
      {vendors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-stone-dark/20">
          <CheckCircle size={44} strokeWidth={1} className="text-emerald-300 mb-3" />
          <p className="font-sans text-sm font-semibold text-stone-dark/35">
            All caught up
          </p>
          <p className="font-sans text-xs text-stone-dark/25 mt-1">
            New applications will appear here automatically
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {vendors.map((v) => (
              <VendorCard
                key={v.userId}
                vendor={v}
                onApprove={() => handleApprove(v.userId)}
                onReject={() => setRejectTarget(v)}
                approving={approvingId === v.userId}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Reject modal */}
      <AnimatePresence>
        {rejectTarget && (
          <RejectModal
            vendor={rejectTarget}
            onConfirm={handleRejectConfirm}
            onCancel={() => setRejectTarget(null)}
            isLoading={rejectingId === rejectTarget.userId}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 6, x: "-50%" }}
            className={`fixed bottom-6 left-1/2 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-sans font-semibold pointer-events-none ${
              toast.type === "ok"
                ? "bg-emerald-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.type === "ok" ? (
              <CheckCircle size={15} />
            ) : (
              <AlertTriangle size={15} />
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
