"use client";

import React, { useState, useEffect, useRef, useCallback, DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Camera, Upload, CheckCircle2, Sparkles,
  RotateCcw, ArrowRight, Loader2, ExternalLink,
  ScanSearch, Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ImageSearchResult, ImageSearchAttributes } from "@/app/api/search/image/route";

type ModalState = "idle" | "processing" | "results";

const ANALYSIS_STEPS = [
  { label: "Analyzing color palette",    detail: "Extracting dominant tones & gradients",      icon: "🎨" },
  { label: "Detecting texture pattern",  detail: "Identifying surface roughness & grain",       icon: "🔬" },
  { label: "Identifying stone features", detail: "Mapping veins & mineral composition",         icon: "💎" },
  { label: "Matching catalog stones",    detail: "Searching verified stone inventory",          icon: "🔍" },
];
const STEP_DURATIONS = [950, 900, 850, 750];
const TOTAL_ANIM_MS  = STEP_DURATIONS.reduce((a, b) => a + b, 0) + 300;

interface AIImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchComplete?: (ids: string[]) => void;
}

export function AIImageSearchModal({ isOpen, onClose, onSearchComplete }: AIImageSearchModalProps) {
  const router = useRouter();
  const [modalState,      setModalState]      = useState<ModalState>("idle");
  const [imagePreview,    setImagePreview]    = useState<string | null>(null);
  const [isDragging,      setIsDragging]      = useState(false);
  const [completedSteps,  setCompletedSteps]  = useState<number[]>([]);
  const [currentStep,     setCurrentStep]     = useState(0);
  const [apiResults,      setApiResults]      = useState<ImageSearchResult[]>([]);
  const [attributes,      setAttributes]      = useState<ImageSearchAttributes | null>(null);
  const [animDone,        setAnimDone]        = useState(false);
  const [apiDone,         setApiDone]         = useState(false);
  const [apiError,        setApiError]        = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (animDone && apiDone && modalState === "processing") {
      setModalState("results");
      if (onSearchComplete && apiResults.length > 0) {
        onSearchComplete(apiResults.map((p) => p.id));
      }
    }
  }, [animDone, apiDone, modalState, apiError, apiResults, onSearchComplete]);

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setModalState("idle");
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        setCompletedSteps([]);
        setCurrentStep(0);
        setApiResults([]);
        setAttributes(null);
        setAnimDone(false);
        setApiDone(false);
        setApiError(null);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen, imagePreview]);

  useEffect(() => {
    if (modalState !== "processing") return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let cum = 0;
    STEP_DURATIONS.forEach((dur, i) => {
      timers.push(setTimeout(() => setCurrentStep(i), cum));
      timers.push(setTimeout(() => setCompletedSteps((p) => [...p, i]), cum + dur));
      cum += dur;
    });
    timers.push(setTimeout(() => setAnimDone(true), cum + 300));
    return () => timers.forEach(clearTimeout);
  }, [modalState]);

  const runApiSearch = useCallback(async (file: File) => {
    setApiDone(false);
    setApiError(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res  = await fetch("/api/search/image", { method: "POST", body: fd });
      const data = await res.json();
      setApiResults(data.products ?? []);
      setAttributes(data.attributes ?? null);
    } catch {
      // fallback to empty results
    } finally {
      setApiDone(true);
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
    setCompletedSteps([]);
    setCurrentStep(0);
    setAnimDone(false);
    setApiDone(false);
    setApiError(null);
    setModalState("processing");
    runApiSearch(file);
  }, [imagePreview, runApiSearch]);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleReset = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setCompletedSteps([]);
    setCurrentStep(0);
    setAnimDone(false);
    setApiDone(false);
    setApiError(null);
    setApiResults([]);
    setAttributes(null);
    setModalState("idle");
  };

  const handleViewInCatalog = () => {
    if (apiResults.length > 0) {
      const ids = apiResults.map((p) => p.id).join(",");
      onClose();
      router.push(`/products?aiIds=${ids}`);
    } else {
      onClose();
      router.push("/products");
    }
  };

  const topMatch    = apiResults[0]       ?? null;
  const moreMatches = apiResults.slice(1, 7);
  const progressPct = Math.round(
    ((completedSteps.length + (currentStep < ANALYSIS_STEPS.length ? 0.5 : 0)) / ANALYSIS_STEPS.length) * 100
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            onClick={modalState === "idle" ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-auto px-4"
          >
            <div className="bg-[#0f0f0f] rounded-3xl shadow-[0_32px_100px_rgba(0,0,0,0.7)] overflow-hidden max-h-[92vh] flex flex-col">

              {/* ── Header ── */}
              <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/8">
                {/* Subtle gradient bar at top */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-gold/50 to-transparent" />
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-gold/20 to-amber-gold/5 border border-amber-gold/25 flex items-center justify-center">
                      <Camera size={16} className="text-amber-gold" />
                    </div>
                    <motion.div
                      className="absolute -inset-0.5 rounded-xl border border-amber-gold/30"
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <p className="font-serif text-[15px] font-semibold text-white leading-tight">
                      AI Visual Search
                    </p>
                    <p className="text-[10px] font-sans text-white/35 leading-none mt-0.5 tracking-wide">
                      {attributes
                        ? `${attributes.materialType} · ${attributes.color} · ${attributes.finish}`
                        : "Discover stones by photo"
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-gold/10 border border-amber-gold/20">
                    <Zap size={9} className="text-amber-gold" />
                    <span className="text-[9px] font-sans font-bold text-amber-gold uppercase tracking-widest">Powered by AI</span>
                  </div>
                  <motion.button
                    onClick={onClose}
                    className="w-8 h-8 rounded-xl bg-white/6 hover:bg-white/12 border border-white/8 flex items-center justify-center transition-colors"
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={14} className="text-white/60" />
                  </motion.button>
                </div>
              </div>

              {/* ── Body ── */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">

                  {/* ════ IDLE ════ */}
                  {modalState === "idle" && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                      className="p-6"
                    >
                      <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={handleFileInput} />

                      {/* Drop zone */}
                      <motion.div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileRef.current?.click()}
                        animate={isDragging ? { scale: 1.015 } : { scale: 1 }}
                        className={cn(
                          "relative flex flex-col items-center justify-center gap-5 py-14 px-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300",
                          isDragging
                            ? "border-amber-gold bg-amber-gold/6"
                            : "border-white/12 hover:border-amber-gold/40 hover:bg-white/3"
                        )}
                      >
                        {/* Background texture hint */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,169,97,0.04),transparent_70%)]" />
                        </div>

                        {/* Icon */}
                        <motion.div
                          className="relative"
                          animate={isDragging ? { scale: 1.15, rotate: 5 } : {}}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 flex items-center justify-center">
                            <motion.div
                              animate={isDragging ? {} : { y: [0, -4, 0] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <ScanSearch size={32} className={cn(isDragging ? "text-amber-gold" : "text-white/40")} />
                            </motion.div>
                          </div>
                          {/* Glow ring */}
                          <motion.div
                            className="absolute -inset-2 rounded-3xl border border-amber-gold/20"
                            animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.04, 1] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                          />
                        </motion.div>

                        <div className="text-center relative z-10">
                          <p className="font-serif text-lg font-semibold text-white mb-1.5">
                            {isDragging ? "Release to analyze" : "Upload a stone image"}
                          </p>
                          <p className="text-[12px] font-sans text-white/40 leading-relaxed">
                            {isDragging ? (
                              "Drop your image to start AI analysis"
                            ) : (
                              <>
                                Drag & drop or{" "}
                                <span className="text-amber-gold font-medium">click to browse</span>
                                {" "}· JPG, PNG, WebP
                              </>
                            )}
                          </p>
                        </div>

                        {/* Feature pills */}
                        <div className="flex flex-wrap justify-center gap-2 relative z-10">
                          {["Color Matching", "Texture Analysis", "Vein Detection", "Material ID"].map((f) => (
                            <span key={f} className="px-3 py-1 bg-white/5 border border-white/8 rounded-full text-[10px] font-sans text-white/40 font-medium">
                              {f}
                            </span>
                          ))}
                        </div>
                      </motion.div>

                      {/* Tips */}
                      <p className="text-center text-[10px] font-sans text-white/20 mt-4 leading-relaxed">
                        Best results with clear, well-lit photos · Granite, marble, quartz, quartzite & more
                      </p>
                    </motion.div>
                  )}

                  {/* ════ PROCESSING ════ */}
                  {modalState === "processing" && (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-6"
                    >
                      {/* Top section: image + progress ring */}
                      <div className="flex gap-5 mb-6">
                        {/* Image preview with scanning effect */}
                        <div className="relative flex-shrink-0">
                          <div className="w-28 h-28 rounded-2xl overflow-hidden border border-white/12">
                            {imagePreview && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={imagePreview} alt="Analyzing" className="w-full h-full object-cover" />
                            )}
                          </div>
                          {/* Scanning line animation */}
                          <motion.div
                            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-gold to-transparent opacity-80"
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                          {/* Spin ring */}
                          <div className="absolute -inset-1.5 rounded-3xl">
                            <motion.div
                              className="w-full h-full rounded-3xl border-2"
                              style={{ borderColor: "transparent", borderTopColor: "#c9a961", borderRightColor: "rgba(201,169,97,0.2)" }}
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                          </div>
                        </div>

                        {/* Right: heading + progress */}
                        <div className="flex-1 pt-1">
                          <p className="font-serif text-lg font-semibold text-white mb-1">
                            Analyzing your stone…
                          </p>
                          <p className="text-[11px] font-sans text-white/35 mb-4">
                            Our AI is identifying visual characteristics to find exact matches
                          </p>
                          {/* Overall progress bar */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-sans text-white/30 uppercase tracking-widest">
                                {animDone && !apiDone ? "Finalizing…" : "Progress"}
                              </span>
                              <span className="text-[11px] font-sans font-bold text-amber-gold">{progressPct}%</span>
                            </div>
                            <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-amber-gold via-amber-gold/80 to-amber-gold/60"
                                animate={{ width: `${progressPct}%` }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Step list */}
                      <div className="space-y-2.5">
                        {ANALYSIS_STEPS.map((step, i) => {
                          const isCompleted = completedSteps.includes(i);
                          const isCurrent   = currentStep === i && !isCompleted;
                          return (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className={cn(
                                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all duration-300",
                                isCompleted
                                  ? "bg-emerald-500/8 border-emerald-500/15"
                                  : isCurrent
                                  ? "bg-amber-gold/6 border-amber-gold/20"
                                  : "bg-white/3 border-white/6"
                              )}
                            >
                              {/* Status icon */}
                              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                {isCompleted ? (
                                  <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 20 }}>
                                    <CheckCircle2 size={16} className="text-emerald-400" />
                                  </motion.div>
                                ) : isCurrent ? (
                                  <Loader2 size={14} className="text-amber-gold animate-spin" />
                                ) : (
                                  <div className="w-3.5 h-3.5 rounded-full border border-white/15" />
                                )}
                              </div>
                              {/* Step emoji */}
                              <span className="text-sm">{step.icon}</span>
                              {/* Labels */}
                              <div className="flex-1 min-w-0">
                                <p className={cn("text-[12px] font-sans font-medium leading-tight",
                                  isCompleted ? "text-emerald-300" : isCurrent ? "text-white" : "text-white/30"
                                )}>
                                  {step.label}
                                </p>
                                {isCurrent && (
                                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="text-[10px] font-sans text-amber-gold/60 mt-0.5">
                                    {step.detail}
                                  </motion.p>
                                )}
                              </div>
                              {/* Step progress bar */}
                              {(isCurrent || isCompleted) && (
                                <div className="w-14 h-1 bg-white/8 rounded-full overflow-hidden flex-shrink-0">
                                  <motion.div
                                    className={cn("h-full rounded-full", isCompleted ? "bg-emerald-400" : "bg-amber-gold")}
                                    initial={{ width: isCompleted ? "100%" : "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={isCompleted ? { duration: 0 } : { duration: STEP_DURATIONS[i] / 1000, ease: "linear" }}
                                  />
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* ════ RESULTS ════ */}
                  {modalState === "results" && (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.28 }}
                    >
                      {/* Results summary bar */}
                      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/6 bg-white/2">
                        {imagePreview && (
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/12 flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imagePreview} alt="Query" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <Sparkles size={12} className="text-amber-gold flex-shrink-0" />
                            <p className="font-serif text-[14px] font-semibold text-white">
                              {apiResults.length > 0 ? `${apiResults.length} Similar Stones Found` : "No exact matches"}
                            </p>
                          </div>
                          {attributes && (
                            <div className="flex flex-wrap gap-1.5">
                              {[attributes.materialType, attributes.color, attributes.finish]
                                .filter(Boolean)
                                .map((tag) => (
                                  <span key={tag} className="px-2 py-0.5 bg-amber-gold/12 border border-amber-gold/20 rounded-full text-[9px] font-sans font-medium text-amber-gold uppercase tracking-wide">
                                    {tag}
                                  </span>
                                ))
                              }
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-6 space-y-5">

                        {/* ── TOP MATCH (hero) ── */}
                        {topMatch && (
                          <motion.div
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <div className="h-px flex-1 bg-gradient-to-r from-amber-gold/40 to-transparent" />
                              <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-amber-gold">Top Match</span>
                              <div className="h-px flex-1 bg-gradient-to-l from-amber-gold/40 to-transparent" />
                            </div>
                            <Link href={`/products/${topMatch.id}`} onClick={onClose}>
                              <motion.div
                                className="group relative rounded-2xl overflow-hidden border border-white/8 hover:border-amber-gold/50 transition-all duration-300 cursor-pointer"
                                whileHover={{ y: -3, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
                                transition={{ duration: 0.2 }}
                              >
                                {/* Image */}
                                <div className="relative h-52 w-full bg-neutral-900">
                                  {topMatch.imageUrl ? (
                                    <Image
                                      src={topMatch.imageUrl}
                                      alt={topMatch.name}
                                      fill
                                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                                      sizes="640px"
                                    />
                                  ) : (
                                    <div className="absolute inset-0" style={{ background: topMatch.bg }} />
                                  )}
                                  {/* Match score pill */}
                                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-gold rounded-full shadow-lg">
                                    <span className="text-[10px] font-sans font-bold text-stone-950">{topMatch.matchLabel}</span>
                                  </div>
                                  {/* Bottom scrim */}
                                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent" />
                                  <div className="absolute bottom-4 left-4 right-4">
                                    <p className="font-serif text-xl font-bold text-white leading-tight drop-shadow-lg">{topMatch.name}</p>
                                    <p className="text-[11px] font-sans text-white/55 mt-1 drop-shadow">
                                      {topMatch.materialType} · {topMatch.finish} · {topMatch.location}
                                    </p>
                                  </div>
                                </div>
                                {/* Footer */}
                                <div className="flex items-center justify-between px-4 py-3 bg-[#161616] border-t border-white/6">
                                  <span className="font-serif text-sm font-semibold text-amber-gold">{topMatch.priceRange}</span>
                                  <span className="flex items-center gap-1.5 text-[11px] font-sans font-semibold text-white/50 group-hover:text-amber-gold transition-colors">
                                    View Details <ExternalLink size={11} />
                                  </span>
                                </div>
                              </motion.div>
                            </Link>
                          </motion.div>
                        )}

                        {/* ── MORE MATCHES (grid) ── */}
                        {moreMatches.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.18, duration: 0.3 }}
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <div className="h-px flex-1 bg-white/6" />
                              <span className="text-[9px] font-sans font-bold uppercase tracking-[0.18em] text-white/30">Also Similar</span>
                              <div className="h-px flex-1 bg-white/6" />
                            </div>
                            <div className="grid grid-cols-3 gap-2.5">
                              {moreMatches.map((p, i) => (
                                <motion.div
                                  key={p.id}
                                  initial={{ opacity: 0, scale: 0.92 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.22 + i * 0.06, duration: 0.25 }}
                                >
                                  <Link href={`/products/${p.id}`} onClick={onClose}>
                                    <motion.div
                                      className="group relative rounded-xl overflow-hidden border border-white/8 hover:border-amber-gold/40 cursor-pointer transition-all duration-200"
                                      whileHover={{ y: -2, boxShadow: "0 12px_40px_rgba(0,0,0,0.4)" }}
                                      transition={{ duration: 0.18 }}
                                    >
                                      <div className="relative h-[88px] bg-neutral-900">
                                        {p.imageUrl ? (
                                          <Image
                                            src={p.imageUrl}
                                            alt={p.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="200px"
                                          />
                                        ) : (
                                          <div className="absolute inset-0" style={{ background: p.bg }} />
                                        )}
                                        {/* Match badge */}
                                        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-black/70 backdrop-blur-sm rounded-full">
                                          <span className="text-[8px] font-sans font-semibold text-amber-gold">{p.matchLabel}</span>
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/80 to-transparent" />
                                      </div>
                                      <div className="px-2 py-1.5 bg-[#161616]">
                                        <p className="font-serif text-[11px] font-semibold text-white leading-tight truncate">{p.name}</p>
                                        <p className="text-[9px] font-sans text-white/35 truncate mt-0.5">{p.materialType}</p>
                                        <p className="font-serif text-[10px] font-semibold text-amber-gold mt-0.5">{p.priceRange}</p>
                                      </div>
                                    </motion.div>
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {/* ── Empty state ── */}
                        {apiResults.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center">
                              <ScanSearch size={22} className="text-white/20" />
                            </div>
                            <p className="font-serif text-base text-white/60">No matches found</p>
                            <p className="text-[11px] font-sans text-white/25 max-w-xs">
                              Try a clearer image with better lighting or a different angle
                            </p>
                          </div>
                        )}

                        {/* ── CTA row ── */}
                        <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/6">
                          <motion.button
                            onClick={handleReset}
                            className="flex items-center gap-1.5 text-[11px] font-sans font-medium text-white/35 hover:text-white/70 transition-colors"
                            whileHover={{ scale: 1.02 }}
                          >
                            <RotateCcw size={11} /> Search again
                          </motion.button>
                          <motion.button
                            onClick={handleViewInCatalog}
                            whileHover={{ scale: 1.03, x: 2 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-amber-gold text-stone-950 font-sans text-[12px] font-bold rounded-xl shadow-[0_4px_20px_rgba(201,169,97,0.35)] hover:shadow-[0_4px_28px_rgba(201,169,97,0.5)] transition-all"
                          >
                            View all in Catalog <ArrowRight size={13} />
                          </motion.button>
                        </div>

                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
