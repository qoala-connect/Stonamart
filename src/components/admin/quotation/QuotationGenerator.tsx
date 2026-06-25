"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Trash2, AlertTriangle, ChevronRight,
  ChevronLeft, Download, Send, CheckCircle2, Building2,
  Package, FileText, Calculator,
} from "lucide-react";
import { CATALOG_PRODUCTS } from "@/components/catalog/data";
import { VENDOR_PRODUCTS } from "../data";
import type { QuotationLineItem, QuotationMeta } from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const uid = () => Math.random().toString(36).slice(2, 9);

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEPS = [
  { n: 1, label: "Product Selection" },
  { n: 2, label: "Pricing Override" },
  { n: 3, label: "Costs & Margins" },
  { n: 4, label: "PDF Preview" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done = step.n < current;
        const active = step.n === current;
        return (
          <React.Fragment key={step.n}>
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  backgroundColor: done ? "#B8865A" : active ? "#3a2f26" : "transparent",
                  borderColor: done || active ? (done ? "#B8865A" : "#3a2f26") : "#3a2f2622",
                  color: done || active ? "#ffffff" : "#3a2f2655",
                }}
                transition={{ duration: 0.25 }}
                className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-sans font-bold"
              >
                {done ? <CheckCircle2 size={12} /> : step.n}
              </motion.div>
              <span className={`text-[10px] font-sans font-semibold whitespace-nowrap hidden sm:block ${active ? "text-stone-950" : done ? "text-amber-gold" : "text-stone-dark/30"}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <motion.div
                animate={{ backgroundColor: done ? "#B8865A" : "#3a2f2614" }}
                transition={{ duration: 0.3 }}
                className="h-0.5 flex-1 mx-2 mb-4 min-w-[24px]"
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Stone texture swatch ─────────────────────────────────────────────────────
function Swatch({ bg, size = 10 }: { bg: string; size?: number }) {
  return (
    <div
      className="flex-shrink-0 rounded"
      style={{ width: size, height: size, background: bg, border: "1px solid rgba(58,47,38,0.12)" }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Product Selection
// ─────────────────────────────────────────────────────────────────────────────
function Step1({
  items,
  onAdd,
  onRemove,
  onQtyChange,
}: {
  items: QuotationLineItem[];
  onAdd: (item: QuotationLineItem) => void;
  onRemove: (id: string) => void;
  onQtyChange: (id: string, qty: number) => void;
}) {
  const [catQ, setCatQ] = useState("");
  const [venQ, setVenQ] = useState("");

  const addedIds = useMemo(() => new Set(items.map((i) => i.sourceId)), [items]);

  const catResults = useMemo(() => {
    const q = catQ.toLowerCase().trim();
    if (!q) return CATALOG_PRODUCTS.slice(0, 8);
    return CATALOG_PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.materialType.toLowerCase().includes(q) || p.color.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [catQ]);

  const venResults = useMemo(() => {
    const q = venQ.toLowerCase().trim();
    if (!q) return VENDOR_PRODUCTS.slice(0, 8);
    return VENDOR_PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.materialType.toLowerCase().includes(q) || p.color.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [venQ]);

  const addCatalog = (p: (typeof CATALOG_PRODUCTS)[0]) => {
    onAdd({
      id: uid(), sourceId: p.id,
      name: p.name, materialType: p.materialType, color: p.color,
      finish: p.finish, thickness: p.thickness ?? "2cm",
      origin: p.origin ?? "India", unit: "sq ft", qty: 1,
      vendorPrice: 0, adminPrice: 0,
      bg: p.bg, textLight: p.textLight ?? false,
    });
  };

  const addVendor = (p: (typeof VENDOR_PRODUCTS)[0]) => {
    onAdd({
      id: uid(), sourceId: p.id,
      name: p.name, materialType: p.materialType, color: p.color,
      finish: p.finish, thickness: p.thickness, origin: p.origin,
      unit: p.unit, qty: 1,
      vendorPrice: p.vendorPrice, adminPrice: p.vendorPrice,
      bg: p.bg, textLight: p.textLight,
    });
  };

  return (
    <div className="space-y-6">
      {/* Dual-panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Public catalog */}
        <div className="bg-white rounded-xl border border-stone-dark/8 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-stone-dark/6 bg-stone-dark/2">
            <Building2 size={13} className="text-stone-dark/40" />
            <span className="text-[11px] font-sans font-semibold text-stone-dark/60 uppercase tracking-wider">
              Public Catalog
            </span>
          </div>
          <div className="p-3 border-b border-stone-dark/6">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-dark/30" />
              <input
                value={catQ} onChange={(e) => setCatQ(e.target.value)}
                placeholder="Search by name, material, colour…"
                className="w-full pl-8 pr-3 py-2 text-[12px] font-sans border border-stone-dark/10 rounded-lg focus:outline-none focus:border-amber-gold/50 placeholder:text-stone-dark/25"
              />
            </div>
          </div>
          <div className="divide-y divide-stone-dark/5 max-h-80 overflow-y-auto">
            {catResults.map((p) => {
              const added = addedIds.has(p.id);
              return (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-stone-dark/2 transition-colors">
                  <Swatch bg={p.bg} size={28} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-sans font-semibold text-stone-950 truncate">{p.name}</p>
                    <p className="text-[11px] font-sans text-stone-dark/40">{p.materialType} · {p.color} · {p.finish}</p>
                  </div>
                  <button
                    onClick={() => !added && addCatalog(p)}
                    disabled={added}
                    className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-sans font-semibold transition-all ${
                      added
                        ? "bg-emerald-500/10 text-emerald-600 cursor-default"
                        : "bg-stone-950 text-white hover:bg-stone-dark"
                    }`}
                  >
                    {added ? <CheckCircle2 size={11} /> : <Plus size={11} />}
                    {added ? "Added" : "Add"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vendor inventory */}
        <div className="bg-white rounded-xl border border-stone-dark/8 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-stone-dark/6 bg-amber-500/4">
            <Package size={13} className="text-amber-700/60" />
            <span className="text-[11px] font-sans font-semibold text-amber-700/80 uppercase tracking-wider">
              Vendor Inventory
            </span>
            <span className="ml-auto text-[9px] font-sans font-bold text-amber-700/50 uppercase tracking-wide">
              Admin Only
            </span>
          </div>
          <div className="p-3 border-b border-stone-dark/6">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-dark/30" />
              <input
                value={venQ} onChange={(e) => setVenQ(e.target.value)}
                placeholder="Search vendor inventory…"
                className="w-full pl-8 pr-3 py-2 text-[12px] font-sans border border-stone-dark/10 rounded-lg focus:outline-none focus:border-amber-gold/50 placeholder:text-stone-dark/25"
              />
            </div>
          </div>
          <div className="divide-y divide-stone-dark/5 max-h-80 overflow-y-auto">
            {venResults.map((p) => {
              const added = addedIds.has(p.id);
              return (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-stone-dark/2 transition-colors">
                  <Swatch bg={p.bg} size={28} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-sans font-semibold text-stone-950 truncate">{p.name}</p>
                    <p className="text-[11px] font-sans text-stone-dark/40">{p.materialType} · {p.color} · {p.city}</p>
                  </div>
                  <button
                    onClick={() => !added && addVendor(p)}
                    disabled={added}
                    className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-sans font-semibold transition-all ${
                      added
                        ? "bg-emerald-500/10 text-emerald-600 cursor-default"
                        : "bg-amber-gold text-stone-950 hover:bg-amber-gold/85"
                    }`}
                  >
                    {added ? <CheckCircle2 size={11} /> : <Plus size={11} />}
                    {added ? "Added" : "Add"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected items */}
      {items.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-dark/8 overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-dark/6 flex items-center justify-between">
            <span className="text-[11px] font-sans font-semibold text-stone-dark/50 uppercase tracking-wider">
              Selected Items ({items.length})
            </span>
          </div>
          <div className="divide-y divide-stone-dark/5">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                <Swatch bg={item.bg} size={24} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-sans font-semibold text-stone-950 truncate">{item.name}</p>
                  <p className="text-[11px] text-stone-dark/40 font-sans">{item.finish} · {item.thickness}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <label className="text-[11px] font-sans text-stone-dark/45">Qty</label>
                  <input
                    type="number" min={1}
                    value={item.qty}
                    onChange={(e) => onQtyChange(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-2 py-1 text-center text-[12px] font-sans border border-stone-dark/12 rounded-lg focus:outline-none focus:border-amber-gold/50"
                  />
                  <span className="text-[11px] text-stone-dark/40 font-sans">{item.unit}</span>
                </div>
                <button onClick={() => onRemove(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/8 text-stone-dark/25 hover:text-red-500 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-stone-dark/30">
          <Package size={32} strokeWidth={1} />
          <p className="mt-3 font-sans text-sm">Add products from the panels above</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Pricing Override
// ─────────────────────────────────────────────────────────────────────────────
function Step2({
  items,
  onChange,
}: {
  items: QuotationLineItem[];
  onChange: (id: string, adminPrice: number) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 p-3 bg-amber-500/6 border border-amber-400/20 rounded-xl">
        <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-[12px] font-sans text-amber-800">
          Vendor cost prices shown below are <strong>strictly confidential</strong> and internal only. They will <strong>never appear</strong> on customer-facing quotations or PDFs.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-stone-dark/8 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_100px_110px_110px_100px] gap-0 px-4 py-2.5 border-b border-stone-dark/8 bg-stone-dark/2">
          {["Stone", "Spec", "Qty", "Vendor Cost ⚠", "Admin Price", "Line Total"].map((h) => (
            <span key={h} className="text-[10px] font-sans font-semibold text-stone-dark/40 uppercase tracking-wide first:col-span-1">
              {h}
            </span>
          ))}
        </div>

        <div className="divide-y divide-stone-dark/5">
          {items.map((item) => {
            const lineTotal = item.qty * item.adminPrice;
            return (
              <div key={item.id} className="grid grid-cols-[1fr_100px_110px_110px_100px] gap-0 px-4 py-3.5 items-center">
                {/* Stone */}
                <div className="flex items-center gap-2.5 pr-4">
                  <Swatch bg={item.bg} size={26} />
                  <div>
                    <p className="text-[12.5px] font-sans font-semibold text-stone-950 leading-tight">{item.name}</p>
                    <p className="text-[10.5px] font-sans text-stone-dark/40">{item.origin}</p>
                  </div>
                </div>

                {/* Spec */}
                <div>
                  <p className="text-[11px] font-sans text-stone-dark/50">{item.finish}</p>
                  <p className="text-[11px] font-sans text-stone-dark/40">{item.thickness}</p>
                </div>

                {/* Qty */}
                <p className="text-[12.5px] font-sans font-semibold text-stone-950 tabular-nums">
                  {item.qty} {item.unit}
                </p>

                {/* Vendor cost (confidential) */}
                <div className="flex items-center gap-1.5">
                  <p className="text-[12px] font-sans text-stone-dark/35 tabular-nums line-through">
                    {item.vendorPrice > 0 ? fmt(item.vendorPrice) : "—"}
                  </p>
                </div>

                {/* Admin price override */}
                <div className="flex items-center gap-1 pr-2">
                  <span className="text-[12px] text-stone-dark/40 font-sans">₹</span>
                  <input
                    type="number" min={0}
                    value={item.adminPrice || ""}
                    onChange={(e) => onChange(item.id, parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-2 py-1.5 text-[12.5px] font-sans font-semibold text-stone-950 border border-stone-dark/12 rounded-lg focus:outline-none focus:border-amber-gold/60 tabular-nums"
                  />
                </div>

                {/* Line total */}
                <p className="text-[13px] font-sans font-bold text-stone-950 tabular-nums">
                  {fmt(lineTotal)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Subtotal row */}
        <div className="flex items-center justify-end gap-4 px-4 py-3 bg-stone-dark/2 border-t border-stone-dark/8">
          <span className="text-[12px] font-sans font-semibold text-stone-dark/50 uppercase tracking-wide">
            Item Subtotal
          </span>
          <span className="text-[15px] font-sans font-bold text-stone-950 tabular-nums">
            {fmt(items.reduce((s, i) => s + i.qty * i.adminPrice, 0))}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — Costs & Margins
// ─────────────────────────────────────────────────────────────────────────────
function Step3({
  items,
  transport,
  margin,
  onTransportChange,
  onMarginChange,
}: {
  items: QuotationLineItem[];
  transport: number;
  margin: number;
  onTransportChange: (v: number) => void;
  onMarginChange: (v: number) => void;
}) {
  const subtotal = items.reduce((s, i) => s + i.qty * i.adminPrice, 0);
  const marginAmt = (subtotal * margin) / 100;
  const grand = subtotal + transport + marginAmt;

  const Row = ({ label, value, muted = false, large = false }: { label: string; value: string; muted?: boolean; large?: boolean }) => (
    <div className={`flex justify-between items-center py-3 border-b border-stone-dark/6 last:border-0 ${large ? "pt-4" : ""}`}>
      <span className={`font-sans ${muted ? "text-stone-dark/40 text-[12px]" : large ? "text-[14px] font-semibold text-stone-950" : "text-[13px] text-stone-950"}`}>
        {label}
      </span>
      <span className={`font-sans tabular-nums ${muted ? "text-stone-dark/40 text-[12px]" : large ? "text-[18px] font-bold text-stone-950" : "text-[13px] font-semibold text-stone-950"}`}>
        {value}
      </span>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Transport cost */}
        <div className="bg-white rounded-xl border border-stone-dark/8 p-5">
          <label className="block text-[10px] font-sans font-semibold text-stone-dark/40 uppercase tracking-[0.12em] mb-3">
            Flat Transport Cost (₹)
          </label>
          <div className="flex items-center gap-2">
            <span className="text-stone-dark/40 font-sans text-[16px]">₹</span>
            <input
              type="number" min={0}
              value={transport || ""}
              onChange={(e) => onTransportChange(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="flex-1 px-3 py-2.5 text-[15px] font-sans font-semibold border border-stone-dark/12 rounded-lg focus:outline-none focus:border-amber-gold/60 tabular-nums"
            />
          </div>
        </div>

        {/* Margin % */}
        <div className="bg-white rounded-xl border border-stone-dark/8 p-5">
          <label className="block text-[10px] font-sans font-semibold text-stone-dark/40 uppercase tracking-[0.12em] mb-3">
            Margin % (on item subtotal)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number" min={0} max={100} step={0.5}
              value={margin || ""}
              onChange={(e) => onMarginChange(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="flex-1 px-3 py-2.5 text-[15px] font-sans font-semibold border border-stone-dark/12 rounded-lg focus:outline-none focus:border-amber-gold/60 tabular-nums"
            />
            <span className="text-stone-dark/40 font-sans text-[16px]">%</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl border border-stone-dark/8 px-6 py-2">
        <Row label="Item Subtotal" value={fmt(subtotal)} />
        <Row label="Transport Cost" value={fmt(transport)} muted={transport === 0} />
        <Row label={`Margin (${margin}% on subtotal)`} value={fmt(marginAmt)} muted={margin === 0} />
        <Row label="Grand Total" value={fmt(grand)} large />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — PDF Preview
// ─────────────────────────────────────────────────────────────────────────────
function PDFPreview({
  items,
  meta,
  transport,
  margin,
}: {
  items: QuotationLineItem[];
  meta: QuotationMeta;
  transport: number;
  margin: number;
}) {
  const subtotal = items.reduce((s, i) => s + i.qty * i.adminPrice, 0);
  const marginAmt = (subtotal * margin) / 100;
  const grand = subtotal + transport + marginAmt;
  const quoteNo = `STN-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const validity = new Date(Date.now() + parseInt(meta.validityDays || "30") * 86400000)
    .toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="bg-white rounded-xl border border-stone-dark/10 shadow-xl overflow-hidden text-stone-950 font-sans">
      {/* Letterhead */}
      <div className="relative bg-stone-950 px-8 py-6">
        {/* Marble texture overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <filter id="pdftex">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#pdftex)" />
        </svg>
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-amber-gold font-sans text-[9px] font-bold uppercase tracking-[0.22em] mb-1">
              Premium Natural Stone
            </p>
            <h1 className="font-serif text-3xl font-bold text-white tracking-tight">
              Stonamart
            </h1>
            <p className="text-stone-light/40 text-[10px] mt-0.5">India&apos;s Curated Stone Marketplace</p>
          </div>
          <div className="text-right">
            <p className="text-stone-light/40 text-[10px]">QUOTATION</p>
            <p className="font-mono text-amber-gold text-[13px] font-bold mt-0.5">{quoteNo}</p>
            <p className="text-stone-light/40 text-[10px] mt-1">Date: {today}</p>
            <p className="text-stone-light/40 text-[10px]">Valid till: {validity}</p>
          </div>
        </div>
        {/* Gold divider */}
        <div className="mt-4 h-[1px] bg-gradient-to-r from-transparent via-amber-gold/50 to-transparent" />
        <div className="mt-3 grid grid-cols-2 gap-6 text-[10px] text-stone-light/50">
          <div>
            <p className="text-amber-gold/70 font-semibold mb-1 uppercase tracking-wide text-[9px]">Stonamart HQ</p>
            <p>Plot 12, MIDC Andheri East, Mumbai 400093</p>
            <p>support@stonamart.in · +91 022 4567 8900</p>
          </div>
          <div className="text-right">
            <p className="text-amber-gold/70 font-semibold mb-1 uppercase tracking-wide text-[9px]">Prepared For</p>
            <p className="font-semibold text-stone-light/80">{meta.customerName || "—"}</p>
            <p className="text-stone-light/45 leading-snug whitespace-pre-wrap">{meta.customerAddress || "—"}</p>
          </div>
        </div>
      </div>

      {/* Items table */}
      <div className="px-8 py-6">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="border-b-2 border-stone-dark/10">
              <th className="text-left pb-2.5 font-semibold text-stone-dark/50 uppercase tracking-wide text-[10px] pr-4">#</th>
              <th className="text-left pb-2.5 font-semibold text-stone-dark/50 uppercase tracking-wide text-[10px] pr-4">Stone</th>
              <th className="text-left pb-2.5 font-semibold text-stone-dark/50 uppercase tracking-wide text-[10px] pr-4">Spec</th>
              <th className="text-right pb-2.5 font-semibold text-stone-dark/50 uppercase tracking-wide text-[10px] pr-4">Qty</th>
              <th className="text-right pb-2.5 font-semibold text-stone-dark/50 uppercase tracking-wide text-[10px] pr-4">Unit Price</th>
              <th className="text-right pb-2.5 font-semibold text-stone-dark/50 uppercase tracking-wide text-[10px]">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id} className={i % 2 === 0 ? "bg-stone-dark/[0.015]" : ""}>
                <td className="py-2.5 pr-4 text-stone-dark/35 tabular-nums">{i + 1}</td>
                <td className="py-2.5 pr-4">
                  <div className="flex items-center gap-2">
                    <Swatch bg={item.bg} size={18} />
                    <span className="font-semibold text-stone-950">{item.name}</span>
                  </div>
                </td>
                <td className="py-2.5 pr-4 text-stone-dark/50">
                  {item.finish} · {item.thickness} · {item.origin}
                </td>
                <td className="py-2.5 pr-4 text-right tabular-nums">{item.qty} {item.unit}</td>
                <td className="py-2.5 pr-4 text-right tabular-nums">{fmt(item.adminPrice)}</td>
                <td className="py-2.5 text-right font-semibold tabular-nums">{fmt(item.qty * item.adminPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="border-t border-stone-dark/10 mt-4 pt-4 ml-auto w-full max-w-xs space-y-1.5">
          <div className="flex justify-between text-[12px]">
            <span className="text-stone-dark/50">Item Subtotal</span>
            <span className="tabular-nums">{fmt(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[12px]">
            <span className="text-stone-dark/50">Transport</span>
            <span className="tabular-nums">{fmt(transport)}</span>
          </div>
          {margin > 0 && (
            <div className="flex justify-between text-[12px]">
              <span className="text-stone-dark/50">Margin ({margin}%)</span>
              <span className="tabular-nums">{fmt(marginAmt)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-stone-dark/10 pt-2 mt-2">
            <span className="font-bold text-[14px] text-stone-950">Grand Total</span>
            <span className="font-bold text-[14px] tabular-nums">{fmt(grand)}</span>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-6 pt-4 border-t border-stone-dark/8 grid grid-cols-2 gap-6 text-[11px] text-stone-dark/50">
          <div>
            <p className="font-semibold text-stone-dark/70 mb-1">Payment Terms</p>
            <p>{meta.paymentTerms || "50% advance, 50% before delivery"}</p>
          </div>
          <div>
            <p className="font-semibold text-stone-dark/70 mb-1">Notes</p>
            <p className="leading-relaxed">{meta.notes || "All prices are inclusive of GST. Sizes ±5% tolerance."}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-[10px] text-stone-dark/30 border-t border-stone-dark/8 pt-4">
          This quotation is valid for {meta.validityDays || 30} days from date of issue. Stonamart acts as a marketplace facilitator.
          <br />© 2026 Stonamart Marketplace Pvt. Ltd. · CIN: U74999MH2022PTC123456
        </div>
      </div>
    </div>
  );
}

function Step4({
  items,
  meta,
  transport,
  margin,
  onMetaChange,
}: {
  items: QuotationLineItem[];
  meta: QuotationMeta;
  transport: number;
  margin: number;
  onMetaChange: (m: Partial<QuotationMeta>) => void;
}) {
  const [sent, setSent] = useState(false);

  const Field = ({
    label, field, placeholder, type = "text", as,
  }: {
    label: string; field: keyof QuotationMeta; placeholder: string; type?: string; as?: "textarea";
  }) => (
    <div>
      <label className="block text-[10px] font-sans font-semibold text-stone-dark/40 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          rows={3}
          value={meta[field]}
          onChange={(e) => onMetaChange({ [field]: e.target.value })}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-[12.5px] font-sans border border-stone-dark/12 rounded-lg resize-none focus:outline-none focus:border-amber-gold/50 placeholder:text-stone-dark/20"
        />
      ) : (
        <input
          type={type}
          value={meta[field]}
          onChange={(e) => onMetaChange({ [field]: e.target.value })}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-[12.5px] font-sans border border-stone-dark/12 rounded-lg focus:outline-none focus:border-amber-gold/50 placeholder:text-stone-dark/20"
        />
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
      {/* Left: customer form + actions */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-stone-dark/8 p-5 space-y-4">
          <p className="text-[10px] font-sans font-semibold text-stone-dark/40 uppercase tracking-wider">
            Customer Details
          </p>
          <Field label="Customer Name" field="customerName" placeholder="Arjun Mehta" />
          <Field label="Address" field="customerAddress" placeholder="123 MG Road, Bangalore…" as="textarea" />
          <Field label="Email" field="customerEmail" placeholder="arjun@example.com" type="email" />
          <Field label="Validity (days)" field="validityDays" placeholder="30" type="number" />
          <Field label="Payment Terms" field="paymentTerms" placeholder="50% advance, 50% on delivery" />
          <Field label="Notes / Remarks" field="notes" placeholder="Sizes ±5% tolerance…" as="textarea" />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setSent(true); setTimeout(() => setSent(false), 3000); }}
            className="flex items-center justify-center gap-2 w-full py-3 bg-stone-950 text-white font-sans font-semibold text-[13px] rounded-xl hover:bg-stone-dark transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.span key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400" /> Quotation Sent!
                </motion.span>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <Send size={15} /> Send Quotation
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-stone-dark/12 text-stone-950 font-sans font-semibold text-[13px] rounded-xl hover:border-stone-dark/25 transition-colors"
          >
            <Download size={15} /> Download PDF
          </motion.button>
        </div>
      </div>

      {/* Right: PDF preview */}
      <div className="overflow-auto max-h-[700px] rounded-xl border border-stone-dark/10">
        <PDFPreview items={items} meta={meta} transport={transport} margin={margin} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Quotation Generator
// ─────────────────────────────────────────────────────────────────────────────
export function QuotationGenerator() {
  const [step, setStep] = useState(1);
  const [items, setItems] = useState<QuotationLineItem[]>([]);
  const [transport, setTransport] = useState(0);
  const [margin, setMargin] = useState(0);
  const [meta, setMeta] = useState<QuotationMeta>({
    customerName: "", customerAddress: "", customerEmail: "",
    validityDays: "30", paymentTerms: "50% advance, 50% before delivery",
    notes: "All prices inclusive of GST. Sizes ±5% tolerance.",
  });

  const handleAdd = useCallback((item: QuotationLineItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.sourceId === item.sourceId)) return prev;
      return [...prev, item];
    });
  }, []);

  const handleRemove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const handleQtyChange = useCallback((id: string, qty: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  }, []);

  const handlePriceChange = useCallback((id: string, adminPrice: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, adminPrice } : i)));
  }, []);

  const handleMetaChange = useCallback((patch: Partial<QuotationMeta>) => {
    setMeta((prev) => ({ ...prev, ...patch }));
  }, []);

  const canNext =
    step === 1 ? items.length > 0 :
    step === 2 ? items.every((i) => i.adminPrice > 0) :
    true;

  return (
    <div className="space-y-8">
      <StepIndicator current={step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.22 }}
        >
          {step === 1 && (
            <Step1
              items={items}
              onAdd={handleAdd}
              onRemove={handleRemove}
              onQtyChange={handleQtyChange}
            />
          )}
          {step === 2 && (
            <Step2 items={items} onChange={handlePriceChange} />
          )}
          {step === 3 && (
            <Step3
              items={items}
              transport={transport}
              margin={margin}
              onTransportChange={setTransport}
              onMarginChange={setMargin}
            />
          )}
          {step === 4 && (
            <Step4
              items={items}
              meta={meta}
              transport={transport}
              margin={margin}
              onMetaChange={handleMetaChange}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-stone-dark/8">
        <motion.button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          whileHover={step > 1 ? { x: -2 } : {}}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-sans font-semibold transition-all ${
            step === 1
              ? "text-stone-dark/20 cursor-default"
              : "text-stone-950 hover:bg-stone-dark/6"
          }`}
        >
          <ChevronLeft size={15} />
          Back
        </motion.button>

        <span className="text-[11px] font-sans text-stone-dark/30 tabular-nums">
          Step {step} of {STEPS.length}
        </span>

        {step < 4 ? (
          <motion.button
            onClick={() => canNext && setStep((s) => Math.min(4, s + 1))}
            disabled={!canNext}
            whileHover={canNext ? { x: 2 } : {}}
            whileTap={canNext ? { scale: 0.97 } : {}}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-sans font-semibold transition-all ${
              canNext
                ? "bg-stone-950 text-white hover:bg-stone-dark shadow-sm"
                : "bg-stone-dark/10 text-stone-dark/30 cursor-not-allowed"
            }`}
          >
            Continue
            <ChevronRight size={15} />
          </motion.button>
        ) : (
          <div className="w-24" /> // spacer when on final step
        )}
      </div>
    </div>
  );
}
