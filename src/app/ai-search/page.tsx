"use client";

import React, {
  useState, useRef, useCallback, useEffect, DragEvent, useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Upload, Camera, Heart, ScanSearch, Sparkles,
  RotateCcw, ChevronDown, CheckCircle2, Loader2,
  Shield, Truck, Package, BadgeCheck,
  Target, Layers, Globe, ArrowRight,
} from "lucide-react";
import type {
  ImageSearchResult,
  ImageSearchAttributes,
} from "@/app/api/search/image/route";

// ── Types ──────────────────────────────────────────────────────────────────────
type Phase = "idle" | "analyzing" | "results";

interface Filters {
  materials: string[];   // selected material types (empty = all)
  colorKey:  string;     // '' = all
  priceMax:  number;
  origin:    string;     // '' = all
}

// ── Constants ─────────────────────────────────────────────────────────────────
const ANALYSIS_STEPS = [
  { label: "Analyzing color palette",    icon: "🎨", ms: 900 },
  { label: "Detecting texture pattern",  icon: "🔬", ms: 850 },
  { label: "Identifying stone features", icon: "💎", ms: 800 },
  { label: "Matching catalog stones",    icon: "🔍", ms: 750 },
];

const COLOR_SWATCHES = [
  { key: "white",  hex: "#F8F6F2", match: ["white","ivory","cream","snow"] },
  { key: "cream",  hex: "#EDE0C8", match: ["beige","champagne","sand","warm"] },
  { key: "gold",   hex: "#C9A84C", match: ["gold","yellow","honey","amber"] },
  { key: "gray",   hex: "#9E9E9E", match: ["gray","grey","silver","ash"] },
  { key: "black",  hex: "#2D2D2D", match: ["black","dark","nero","onyx"]  },
];

const MATERIAL_BG: Record<string, string> = {
  marble:    "linear-gradient(145deg,#f7f4ef 0%,#ede8df 45%,#e2dbd0 100%)",
  granite:   "linear-gradient(140deg,#1c1c1c 0%,#282828 55%,#161616 100%)",
  quartz:    "linear-gradient(145deg,#f0ede8 0%,#e5e0da 55%,#ece8e3 100%)",
  sandstone: "linear-gradient(145deg,#d8c898 0%,#c8b880 45%,#e0d0a0 100%)",
  onyx:      "linear-gradient(140deg,#0c0c0c 0%,#141414 55%,#080808 100%)",
  limestone: "linear-gradient(145deg,#d4c8a8 0%,#c8ba94 40%,#ddd0b0 100%)",
  other:     "linear-gradient(145deg,#c8c0b4 0%,#b8b0a4 45%,#d0c8bc 100%)",
};

const TRUST_ITEMS = [
  { icon: Shield,   title: "Premium Quality",  desc: "Handpicked from the best quarries" },
  { icon: Target,   title: "Accurate Match",   desc: "AI powered similarity detection"   },
  { icon: Layers,   title: "Multiple Options", desc: "Compare and choose the perfect stone" },
  { icon: Globe,    title: "Global Collection",desc: "Stones from Italy, Greece, Turkey & more" },
];

const BOTTOM_TRUST = [
  { icon: BadgeCheck, label: "100% Natural Stone"  },
  { icon: Truck,      label: "Worldwide Shipping"  },
  { icon: Package,    label: "Secure Packaging"    },
  { icon: Shield,     label: "Quality Assured"     },
];

// ── Upload Zone ───────────────────────────────────────────────────────────────
function UploadZone({
  onFile, dragging, setDragging,
}: {
  onFile: (f: File) => void;
  dragging: boolean;
  setDragging: (v: boolean) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const onDragOver  = (e: DragEvent) => { e.preventDefault(); setDragging(true);  };
  const onDragLeave = ()              => setDragging(false);
  const onDrop      = (e: DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11.5px] font-semibold uppercase tracking-widest mb-5">
            <Sparkles size={11} /> AI Visual Search
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            Search by Image
          </h1>
          <p className="text-[15px] text-gray-500 font-sans">
            Upload any stone image — our AI will find visually similar matches from our catalog.
          </p>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => ref.current?.click()}
          className="cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center py-16 px-8 text-center"
          style={{
            borderColor: dragging ? "rgba(201,169,97,0.8)" : "rgba(201,169,97,0.4)",
            background:  dragging
              ? "rgba(201,169,97,0.07)"
              : "rgba(255,255,255,0.85)",
            boxShadow: dragging
              ? "0 0 0 6px rgba(201,169,97,0.12), 0 20px 60px rgba(201,169,97,0.15)"
              : "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ background: "linear-gradient(145deg, rgba(201,169,97,0.15), rgba(201,169,97,0.06))", border: "1.5px solid rgba(201,169,97,0.3)" }}
          >
            <Upload size={30} className="text-amber-500" strokeWidth={1.5} />
          </motion.div>

          <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
            {dragging ? "Drop your image here" : "Drop your stone image here"}
          </h3>
          <p className="text-[13.5px] text-gray-500 font-sans mb-6">
            Upload a marble, granite, or any stone image to find similar products
          </p>

          <div className="flex items-center gap-3 mb-6">
            {["JPG", "PNG", "WEBP"].map((f) => (
              <span key={f} className="px-2.5 py-1 rounded border text-[10.5px] font-bold tracking-wider font-sans"
                style={{ background: "rgba(201,169,97,0.08)", borderColor: "rgba(201,169,97,0.3)", color: "rgba(160,125,50,0.9)" }}>
                {f}
              </span>
            ))}
            <span className="text-[11px] text-gray-400 font-sans">· Up to 15 MB</span>
          </div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); ref.current?.click(); }}
            className="flex items-center gap-2 px-7 py-3 rounded-xl text-[13.5px] font-semibold font-sans text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#c9960a 0%,#e0a820 100%)", boxShadow: "0 4px 16px rgba(201,169,97,0.40)" }}
          >
            <Camera size={16} /> Browse Image
          </button>
        </div>

        <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }} />
      </div>
    </div>
  );
}

// ── Analyzing Screen ──────────────────────────────────────────────────────────
function AnalyzingScreen({
  previewUrl, step, done,
}: {
  previewUrl: string; step: number; done: number[];
}) {
  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          {/* Image preview */}
          <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-7"
            style={{ border: "1px solid rgba(201,169,97,0.3)" }}>
            <Image src={previewUrl} alt="Analyzing" fill className="object-cover" />
            {/* Scan line */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{ y: ["-100%", "300%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute", left: 0, right: 0, height: "3px",
                  background: "linear-gradient(90deg, transparent, rgba(201,169,97,0.9), transparent)",
                }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/30 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
                <ScanSearch size={14} className="text-amber-400" />
                <span className="text-white text-[12px] font-semibold">Analyzing…</span>
              </div>
            </div>
          </div>

          <h2 className="font-serif text-xl font-bold text-gray-900 text-center mb-6">
            Finding Similar Stones
          </h2>

          <div className="space-y-3.5">
            {ANALYSIS_STEPS.map((s, i) => {
              const isDone   = done.includes(i);
              const isActive = step === i && !isDone;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-all duration-300 ${
                    isDone   ? "bg-amber-500 text-white" :
                    isActive ? "bg-amber-50 border-2 border-amber-400" : "bg-gray-100"
                  }`}>
                    {isDone ? <CheckCircle2 size={15} /> : s.icon}
                  </div>
                  <span className={`font-sans text-[13px] flex-1 transition-colors ${
                    isDone ? "text-gray-400 line-through" :
                    isActive ? "text-amber-700 font-semibold" : "text-gray-400"
                  }`}>{s.label}</span>
                  {isActive && <Loader2 size={13} className="text-amber-500 animate-spin flex-shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({
  item, wishlisted, onWishlist, idx,
}: {
  item: ImageSearchResult; wishlisted: boolean;
  onWishlist: (id: string) => void; idx: number;
}) {
  const bg = MATERIAL_BG[item.materialType?.toLowerCase()] ?? MATERIAL_BG.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: idx * 0.05 }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative w-full" style={{ paddingBottom: "62%" }}>
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill
            className="object-cover" sizes="(max-width:768px) 50vw,25vw" />
        ) : (
          <div className="absolute inset-0" style={{ background: bg }} />
        )}
        {/* Match badge */}
        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[11px] font-bold font-sans text-white"
          style={{ background: "rgba(20,18,16,0.88)", backdropFilter: "blur(6px)" }}>
          {item.matchLabel ?? `${item.matchScore}% Match`}
        </div>
        {/* Wishlist */}
        <button
          onClick={() => onWishlist(item.id)}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)",
            border: "1px solid rgba(220,215,205,0.6)",
          }}
        >
          <Heart size={14}
            className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-sans font-bold text-[14.5px] text-gray-900 leading-snug mb-1">
          {item.name}
        </h3>
        <p className="text-[12.5px] font-sans text-gray-500 mb-2 capitalize">
          {item.materialType} · {item.origin ?? item.location}
        </p>
        <p className="text-[13.5px] font-semibold font-sans text-gray-800 mb-3 mt-auto">
          {item.priceRange}
        </p>
        <Link
          href={`/products/${item.id}`}
          className="w-full flex items-center justify-center py-2.5 rounded-xl text-[13px] font-semibold font-sans text-white transition-opacity hover:opacity-90"
          style={{ background: "#111111" }}
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}

// ── Results Page ──────────────────────────────────────────────────────────────
function ResultsPage({
  previewUrl, results, attributes, onReset,
}: {
  previewUrl: string;
  results: ImageSearchResult[];
  attributes: ImageSearchAttributes | null;
  onReset: () => void;
}) {
  const [filters, setFilters] = useState<Filters>(() => {
    const prices = results.map((r) => r.priceMax ?? r.priceMin ?? 0);
    return {
      materials: [],
      colorKey:  "",
      priceMax:  Math.max(...prices, 1000),
      origin:    "",
    };
  });
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [originOpen, setOriginOpen] = useState(false);

  const toggleWishlist = useCallback((id: string) =>
    setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]),
  []);

  // Derive filter options
  const allMaterials = useMemo(() =>
    [...new Set(results.map((r) => r.materialType?.toLowerCase()).filter(Boolean))],
  [results]);

  const allOrigins = useMemo(() =>
    ["All Countries", ...new Set(results.map((r) => r.origin ?? r.location).filter(Boolean))],
  [results]);

  const maxPrice = useMemo(() =>
    Math.max(...results.map((r) => r.priceMax ?? r.priceMin ?? 0), 1000),
  [results]);

  // Apply filters
  const filtered = useMemo(() => results.filter((r) => {
    if (filters.materials.length > 0 &&
        !filters.materials.includes(r.materialType?.toLowerCase())) return false;
    if (filters.colorKey) {
      const swatch = COLOR_SWATCHES.find((s) => s.key === filters.colorKey);
      if (swatch && !swatch.match.some((m) => r.color?.toLowerCase().includes(m))) return false;
    }
    const price = r.priceMin ?? 0;
    if (price > filters.priceMax) return false;
    if (filters.origin && filters.origin !== "All Countries") {
      if (!(r.origin ?? r.location)?.includes(filters.origin)) return false;
    }
    return true;
  }), [results, filters]);

  const totalCount = filtered.length;

  const toggleMaterial = (m: string) =>
    setFilters((f) => ({
      ...f,
      materials: f.materials.includes(m)
        ? f.materials.filter((x) => x !== m)
        : [...f.materials, m],
    }));

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* Page header */}
      <div className="bg-[#f8f7f4] border-b border-gray-100 py-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="font-serif text-4xl font-bold text-gray-900 mb-1.5"
        >
          Reverse Image Search Results
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="font-sans text-[14.5px] text-gray-500"
        >
          We found visually similar stones for you
        </motion.p>
      </div>

      {/* Body */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6 items-start">

          {/* ── SIDEBAR ── */}
          <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 gap-4">

            {/* Uploaded image */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-1.5 mb-3">
                <Camera size={12} className="text-gray-400" />
                <span className="text-[11px] font-bold font-sans uppercase tracking-wider text-gray-500">
                  Uploaded Image
                </span>
              </div>
              <div className="relative w-full rounded-xl overflow-hidden border border-gray-100"
                style={{ paddingBottom: "72%" }}>
                <Image src={previewUrl} alt="Uploaded" fill className="object-cover" />
              </div>
              <button
                onClick={onReset}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12.5px] font-semibold font-sans text-white hover:opacity-90 transition-opacity"
                style={{ background: "#111111" }}
              >
                <Camera size={13} /> Search Another Image
              </button>
            </div>

            {/* Refine Results */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <h3 className="font-sans font-bold text-[13px] text-gray-900 mb-4">
                Refine Results
              </h3>

              {/* Material */}
              <div className="mb-5">
                <p className="text-[11px] font-bold font-sans uppercase tracking-wider text-gray-500 mb-2.5">
                  Material
                </p>
                <div className="space-y-2">
                  {allMaterials.map((mat) => {
                    const checked = filters.materials.length === 0 ||
                      filters.materials.includes(mat);
                    return (
                      <label key={mat}
                        className="flex items-center gap-2.5 cursor-pointer group">
                        <div
                          onClick={() => toggleMaterial(mat)}
                          className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors"
                          style={{
                            borderColor: checked ? "#c9960a" : "#d1d5db",
                            background:  checked ? "#c9960a" : "white",
                          }}
                        >
                          {checked && <CheckCircle2 size={10} className="text-white" strokeWidth={3} />}
                        </div>
                        <span className="text-[12.5px] font-sans capitalize text-gray-700">
                          {mat}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Color */}
              <div className="mb-5">
                <p className="text-[11px] font-bold font-sans uppercase tracking-wider text-gray-500 mb-2.5">
                  Color
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {COLOR_SWATCHES.map((sw) => (
                    <button
                      key={sw.key}
                      onClick={() => setFilters((f) => ({
                        ...f, colorKey: f.colorKey === sw.key ? "" : sw.key,
                      }))}
                      className="w-7 h-7 rounded-full border-2 transition-all"
                      style={{
                        background: sw.hex,
                        borderColor: filters.colorKey === sw.key
                          ? "#c9960a" : "rgba(0,0,0,0.12)",
                        boxShadow: filters.colorKey === sw.key
                          ? "0 0 0 3px rgba(201,150,10,0.25)" : "none",
                      }}
                      title={sw.key}
                    />
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="mb-5">
                <p className="text-[11px] font-bold font-sans uppercase tracking-wider text-gray-500 mb-2.5">
                  Price Range (per sq.ft)
                </p>
                <input
                  type="range" min={0} max={maxPrice} step={50}
                  value={filters.priceMax}
                  onChange={(e) => setFilters((f) => ({ ...f, priceMax: +e.target.value }))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    accentColor: "#c9960a",
                    background: `linear-gradient(to right, #c9960a 0%, #c9960a ${(filters.priceMax / maxPrice) * 100}%, #e5e7eb ${(filters.priceMax / maxPrice) * 100}%, #e5e7eb 100%)`,
                  }}
                />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] text-gray-500 font-sans">₹ 0</span>
                  <span className="text-[11px] text-gray-500 font-sans">
                    ₹ {filters.priceMax.toLocaleString("en-IN")}
                    {filters.priceMax >= maxPrice ? "+" : ""}
                  </span>
                </div>
              </div>

              {/* Origin */}
              <div>
                <p className="text-[11px] font-bold font-sans uppercase tracking-wider text-gray-500 mb-2.5">
                  Origin
                </p>
                <div className="relative">
                  <button
                    onClick={() => setOriginOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 text-[12.5px] font-sans text-gray-700 bg-white hover:border-gray-300 transition-colors"
                  >
                    <span>{filters.origin || "All Countries"}</span>
                    <ChevronDown size={13} className={`text-gray-400 transition-transform ${originOpen ? "rotate-180" : ""}`} />
                  </button>
                  {originOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-20 overflow-hidden">
                      {allOrigins.map((o) => (
                        <button
                          key={o}
                          onClick={() => {
                            setFilters((f) => ({ ...f, origin: o === "All Countries" ? "" : o }));
                            setOriginOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-[12.5px] font-sans text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* ── MAIN RESULTS ── */}
          <div className="flex-1 min-w-0">

            {filtered.length > 0 && (
              <>
                {/* Count bar */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-500" />
                    <h2 className="font-sans font-bold text-[16px] text-gray-900">
                      {totalCount} Similar Stone{totalCount !== 1 ? "s" : ""} Found
                    </h2>
                  </div>
                </div>

                {/* ── BEST MATCH — large hero ── */}
                {filtered[0] && (() => {
                  const item = filtered[0];
                  const bg = MATERIAL_BG[item.materialType?.toLowerCase()] ?? MATERIAL_BG.other;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="mb-6"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold font-sans uppercase tracking-widest text-white"
                          style={{ background: "linear-gradient(135deg,#c9960a,#e0a820)" }}>
                          ★ Best Match
                        </span>
                        <span className="text-[12px] font-sans text-gray-400">
                          Highest visual similarity to your image
                        </span>
                      </div>
                      <Link href={`/products/${item.id}`}>
                        <div className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col sm:flex-row">
                          {/* Image — large */}
                          <div className="relative sm:w-[55%] flex-shrink-0" style={{ minHeight: 260 }}>
                            {item.imageUrl ? (
                              <Image src={item.imageUrl} alt={item.name} fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                sizes="(max-width:640px) 100vw, 50vw" />
                            ) : (
                              <div className="absolute inset-0" style={{ background: bg }} />
                            )}
                            {/* Match pill */}
                            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-[11px] font-bold font-sans text-white shadow-lg"
                              style={{ background: "rgba(20,18,16,0.85)", backdropFilter: "blur(6px)" }}>
                              {item.matchLabel ?? `${item.matchScore}% Match`}
                            </div>
                          </div>
                          {/* Info */}
                          <div className="flex-1 p-6 flex flex-col justify-between">
                            <div>
                              <p className="text-[11px] font-bold font-sans uppercase tracking-widest text-amber-600 mb-2">
                                {item.materialType}
                              </p>
                              <h3 className="font-serif text-2xl font-bold text-gray-900 leading-tight mb-2">
                                {item.name}
                              </h3>
                              <p className="text-[13px] font-sans text-gray-500 mb-4">
                                {item.finish} · {item.origin ?? item.location}
                              </p>
                            </div>
                            <div>
                              <p className="font-serif text-xl font-bold text-gray-900 mb-4">
                                {item.priceRange}
                              </p>
                              <span className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-[13.5px] font-semibold font-sans text-white group-hover:opacity-90 transition-opacity"
                                style={{ background: "#111111" }}>
                                View Details <ArrowRight size={14} />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })()}

                {/* ── SIMILAR — 2nd and 3rd only ── */}
                {filtered.slice(1, 3).length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="mb-8"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="font-sans font-bold text-[15px] text-gray-700">Similar Stones</h2>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {filtered.slice(1, 3).map((item, i) => (
                        <ProductCard
                          key={item.id} item={item} idx={i + 1}
                          wishlisted={wishlist.includes(item.id)}
                          onWishlist={toggleWishlist}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── REST — 4th+ ── */}
                {filtered.slice(3).length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.25 }}
                    className="mb-8"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="font-sans font-bold text-[15px] text-gray-700">More Options</h2>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filtered.slice(3).map((item, i) => (
                        <ProductCard
                          key={item.id} item={item} idx={i + 3}
                          wishlisted={wishlist.includes(item.id)}
                          onWishlist={toggleWishlist}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 font-sans mb-4">No results match your current filters.</p>
                <button
                  onClick={() => setFilters({ materials: [], colorKey: "", priceMax: maxPrice, origin: "" })}
                  className="text-amber-600 font-semibold text-sm hover:text-amber-700 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Not finding CTA banner */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                  <Shield size={18} className="text-gray-500" />
                </div>
                <div>
                  <p className="font-sans font-bold text-[14.5px] text-gray-900 mb-0.5">
                    Not finding what you&apos;re looking for?
                  </p>
                  <p className="font-sans text-[13px] text-gray-500">
                    Our team can help you find the perfect match from our exclusive collection.
                  </p>
                </div>
              </div>
              <Link
                href="/#contact"
                className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl text-[13px] font-semibold font-sans text-white hover:opacity-90 transition-opacity whitespace-nowrap"
                style={{ background: "#111111" }}
              >
                Contact Our Expert <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom trust bar */}
      <div className="border-t border-gray-100 bg-white mt-8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
            {BOTTOM_TRUST.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-2.5 py-4">
                <Icon size={15} className="text-amber-500 flex-shrink-0" />
                <span className="font-sans text-[12.5px] font-semibold text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AISearchPage() {
  const [phase,       setPhase]       = useState<Phase>("idle");
  const [dragging,    setDragging]    = useState(false);
  const [previewUrl,  setPreviewUrl]  = useState<string | null>(null);
  const [results,     setResults]     = useState<ImageSearchResult[]>([]);
  const [attributes,  setAttributes]  = useState<ImageSearchAttributes | null>(null);
  const [step,        setStep]        = useState(0);
  const [donesteps,   setDoneSteps]   = useState<number[]>([]);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.match(/image\/(jpeg|png|webp)/i)) return;
    if (file.size > 15 * 1024 * 1024) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPhase("analyzing");
    setStep(0); setDoneSteps([]);

    // Run animation timers
    let cum = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    ANALYSIS_STEPS.forEach((s, i) => {
      timers.push(setTimeout(() => setStep(i), cum));
      timers.push(setTimeout(() => setDoneSteps((p) => [...p, i]), cum + s.ms));
      cum += s.ms;
    });

    // Fire API
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res  = await fetch("/api/search/image", { method: "POST", body: fd });
      const data = await res.json();
      const wait = Math.max(0, cum + 300 - Date.now());
      await new Promise((r) => setTimeout(r, wait));
      timers.forEach(clearTimeout);
      setDoneSteps([0,1,2,3]);
      setResults(data.products ?? []);
      setAttributes(data.attributes ?? null);
      setPhase("results");
    } catch {
      timers.forEach(clearTimeout);
      setPhase("idle");
    }
  }, []);

  const reset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPhase("idle");
    setResults([]);
    setAttributes(null);
    setStep(0); setDoneSteps([]);
  }, [previewUrl]);

  // Auto-search if navigated here from homepage camera button
  useEffect(() => {
    const pending = sessionStorage.getItem("pending_search_image");
    if (!pending) return;
    sessionStorage.removeItem("pending_search_image");
    // Convert base64 data URL → Blob → File then search
    fetch(pending)
      .then((r) => r.blob())
      .then((blob) => {
        const mime = blob.type || "image/jpeg";
        const ext  = mime.split("/")[1] ?? "jpg";
        handleFile(new File([blob], `search.${ext}`, { type: mime }));
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence mode="wait">
      {phase === "idle" && (
        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <UploadZone onFile={handleFile} dragging={dragging} setDragging={setDragging} />
        </motion.div>
      )}
      {phase === "analyzing" && previewUrl && (
        <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <AnalyzingScreen previewUrl={previewUrl} step={step} done={donesteps} />
        </motion.div>
      )}
      {phase === "results" && previewUrl && (
        <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ResultsPage
            previewUrl={previewUrl}
            results={results}
            attributes={attributes}
            onReset={reset}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
