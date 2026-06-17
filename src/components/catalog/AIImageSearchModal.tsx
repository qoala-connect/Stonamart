"use client";

import React, { useState, useEffect, useRef, useCallback, DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Camera, Upload, CheckCircle2, Sparkles,
  RotateCcw, ArrowRight, Loader2, ExternalLink, ImageOff,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ImageSearchResult, ImageSearchAttributes } from "@/app/api/search/image/route";

type ModalState = "idle" | "processing" | "results";

const ANALYSIS_STEPS = [
  { label: "Analyzing color palette",    detail: "Extracting dominant tones & gradients" },
  { label: "Detecting texture pattern",  detail: "Identifying surface roughness & grain" },
  { label: "Identifying stone features", detail: "Mapping vein thickness & mineral composition" },
  { label: "Matching catalog stones",    detail: "Searching verified stone inventory" },
];
const STEP_DURATIONS = [950, 900, 850, 750];
const TOTAL_ANIM_MS  = STEP_DURATIONS.reduce((a, b) => a + b, 0) + 300;

interface AIImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchComplete?: (ids: string[]) => void;
}

export function AIImageSearchModal({
  isOpen,
  onClose,
  onSearchComplete,
}: AIImageSearchModalProps) {
  const router = useRouter();
  const [modalState,    setModalState]    = useState<ModalState>("idle");
  const [imagePreview,  setImagePreview]  = useState<string | null>(null);
  const [isDragging,    setIsDragging]    = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep,   setCurrentStep]   = useState(0);

  // real API data
  const [apiResults,    setApiResults]    = useState<ImageSearchResult[]>([]);
  const [attributes,    setAttributes]    = useState<ImageSearchAttributes | null>(null);
  const [animDone,      setAnimDone]      = useState(false);
  const [apiDone,       setApiDone]       = useState(false);
  const [apiError,      setApiError]      = useState<string | null>(null); // kept for reset logic

  const fileRef = useRef<HTMLInputElement>(null);

  // Transition to results only when BOTH animation and API are complete
  useEffect(() => {
    if (animDone && apiDone && modalState === "processing") {
      // Always go to results — API route now always returns products (with fallback)
      setModalState("results");
      if (onSearchComplete && apiResults.length > 0) {
        onSearchComplete(apiResults.map((p) => p.id));
      }
    }
  }, [animDone, apiDone, modalState, apiError, apiResults, onSearchComplete]);

  // Reset on close
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

  // Animation step machine
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
      // Network / server error — results will be empty, show empty results state
    } finally {
      setApiDone(true);
    }
  }, []);

  const handleFile = useCallback(
    (file: File) => {
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
    },
    [imagePreview, runApiSearch]
  );

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

  const topMatch  = apiResults[0] ?? null;
  const moreMatches = apiResults.slice(1, 5);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-stone-dark/70 backdrop-blur-sm z-50"
            onClick={modalState === "idle" ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-auto px-4"
          >
            <div className="bg-white rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.25)] overflow-hidden max-h-[90vh] overflow-y-auto">

              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-stone-dark/6 sticky top-0 bg-white z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-stone-950 rounded-lg flex items-center justify-center">
                    <Camera size={14} className="text-amber-gold" />
                  </div>
                  <div>
                    <p className="font-serif text-base font-semibold text-stone-950 leading-tight">
                      AI Image Search
                    </p>
                    <p className="text-[10px] font-sans text-stone-dark/40 leading-none mt-0.5">
                      {attributes ? attributes.description || "Find visually similar stones" : "Find visually similar stones"}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-stone-dark/6 transition-colors"
                  whileTap={{ scale: 0.92 }}
                >
                  <X size={16} className="text-stone-dark/50" />
                </motion.button>
              </div>

              <AnimatePresence mode="wait">

                {/* ── IDLE ── */}
                {modalState === "idle" && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }} className="p-6">
                    <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={handleFileInput} />
                    <motion.div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                      animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
                      className={cn(
                        "relative flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200",
                        isDragging ? "border-amber-gold bg-amber-gold/5" : "border-stone-dark/15 hover:border-amber-gold/50 hover:bg-stone-dark/3"
                      )}
                    >
                      <motion.div
                        className="w-14 h-14 bg-stone-dark/5 rounded-2xl flex items-center justify-center"
                        animate={isDragging ? { scale: 1.1 } : { scale: [1, 1.04, 1] }}
                        transition={isDragging ? { duration: 0.2 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Upload size={22} className={cn(isDragging ? "text-amber-gold" : "text-stone-dark/40")} />
                      </motion.div>
                      <div className="text-center">
                        <p className="font-sans text-sm font-semibold text-stone-950 mb-1">
                          {isDragging ? "Drop it here" : "Drop a stone image here"}
                        </p>
                        <p className="text-xs font-sans text-stone-dark/45">
                          or{" "}
                          <span className="text-amber-gold font-medium underline-offset-2 hover:underline">click to browse</span>
                          {" "}· JPG, PNG, WebP
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2 mt-1">
                        {["Color match", "Texture analysis", "Material type"].map((f) => (
                          <span key={f} className="px-2.5 py-1 bg-stone-dark/5 rounded-full text-[10px] font-sans text-stone-dark/55">{f}</span>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* ── PROCESSING ── */}
                {modalState === "processing" && (
                  <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
                    <div className="flex gap-5">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-stone-dark/10">
                          {imagePreview && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={imagePreview} alt="Analyzing" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            className="w-24 h-24 rounded-full border-2 border-transparent"
                            style={{ borderTopColor: "#c9a961", borderRightColor: "rgba(201,169,97,0.3)" }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                          />
                        </div>
                      </div>
                      <div className="flex-1 space-y-3">
                        {ANALYSIS_STEPS.map((step, i) => {
                          const isCompleted = completedSteps.includes(i);
                          const isCurrent = currentStep === i && !isCompleted;
                          return (
                            <div key={i} className="space-y-1">
                              <div className="flex items-center gap-2">
                                {isCompleted ? (
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }}>
                                    <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                                  </motion.div>
                                ) : isCurrent ? (
                                  <Loader2 size={13} className="text-amber-gold animate-spin flex-shrink-0" />
                                ) : (
                                  <div className="w-3 h-3 rounded-full border border-stone-dark/20 flex-shrink-0" />
                                )}
                                <p className={cn("text-xs font-sans leading-tight",
                                  isCompleted || isCurrent ? "text-stone-950 font-medium" : "text-stone-dark/35")}>
                                  {step.label}
                                </p>
                              </div>
                              {(isCurrent || isCompleted) && (
                                <div className="ml-5 h-1 bg-stone-dark/6 rounded-full overflow-hidden">
                                  <motion.div
                                    className={cn("h-full rounded-full", isCompleted ? "bg-emerald-400" : "bg-amber-gold")}
                                    initial={{ width: isCompleted ? "100%" : "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={isCompleted ? { duration: 0 } : { duration: STEP_DURATIONS[i] / 1000, ease: "linear" }}
                                  />
                                </div>
                              )}
                              {isCurrent && <p className="ml-5 text-[10px] font-sans text-stone-dark/40">{step.detail}</p>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* Overall progress */}
                    <div className="mt-5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-sans text-stone-dark/40 uppercase tracking-wider">
                          {animDone && !apiDone ? "Finalizing results…" : "Analysis progress"}
                        </span>
                        <span className="text-[10px] font-sans font-semibold text-stone-950">
                          {Math.round(((completedSteps.length + (currentStep < ANALYSIS_STEPS.length ? 0.5 : 0)) / ANALYSIS_STEPS.length) * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-stone-dark/6 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-amber-gold to-amber-gold/70 rounded-full"
                          animate={{ width: `${((completedSteps.length + (currentStep < ANALYSIS_STEPS.length ? 0.5 : 0)) / ANALYSIS_STEPS.length) * 100}%` }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── RESULTS ── */}
                {modalState === "results" && (
                  <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }} className="p-6 space-y-5">

                    {/* Results header */}
                    <div className="flex items-center gap-3">
                      {imagePreview && (
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-stone-dark/10 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imagePreview} alt="Your search" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <Sparkles size={14} className="text-amber-gold" />
                          <p className="font-serif text-base font-semibold text-stone-950">
                            {apiResults.length > 0
                              ? `${apiResults.length} Similar Stones Found`
                              : "No matches yet"}
                          </p>
                        </div>
                        {attributes && (
                          <p className="text-[10px] font-sans text-stone-dark/45 mt-0.5">
                            {attributes.materialType} · {attributes.color} tone · {attributes.finish}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ── TOP MATCH (hero card) ── */}
                    {topMatch && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05, duration: 0.35 }}
                      >
                        <p className="text-[9px] font-sans font-bold uppercase tracking-[0.18em] text-amber-gold mb-2">
                          Top Match
                        </p>
                        <Link href={`/products/${topMatch.id}`} onClick={onClose}>
                          <motion.div
                            className="relative rounded-2xl overflow-hidden border border-stone-dark/8 hover:border-amber-gold/40 transition-colors cursor-pointer group"
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.2 }}
                          >
                            {/* Image */}
                            <div className="relative h-44 w-full bg-stone-100">
                              {topMatch.imageUrl ? (
                                <Image
                                  src={topMatch.imageUrl}
                                  alt={topMatch.name}
                                  fill
                                  className="object-cover"
                                  sizes="480px"
                                />
                              ) : (
                                <div className="absolute inset-0" style={{ background: topMatch.bg }} />
                              )}
                              {/* Match badge */}
                              <div className="absolute top-3 right-3 px-2.5 py-1 bg-stone-950/75 backdrop-blur-sm rounded-full">
                                <span className="text-[10px] font-sans font-semibold text-amber-gold">{topMatch.matchLabel}</span>
                              </div>
                              {/* Bottom scrim */}
                              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                              <div className="absolute bottom-3.5 left-4 right-4">
                                <p className="font-serif text-lg font-bold text-white leading-tight">{topMatch.name}</p>
                                <p className="text-[11px] font-sans text-white/65 mt-0.5">
                                  {topMatch.materialType} · {topMatch.finish} · {topMatch.location}
                                </p>
                              </div>
                            </div>
                            {/* Footer */}
                            <div className="flex items-center justify-between px-4 py-3 bg-stone-50 border-t border-stone-dark/6">
                              <span className="font-serif text-sm font-semibold text-amber-gold">{topMatch.priceRange}</span>
                              <span className="flex items-center gap-1 text-[11px] font-sans font-semibold text-stone-950 group-hover:text-amber-gold transition-colors">
                                View Stone <ExternalLink size={11} />
                              </span>
                            </div>
                          </motion.div>
                        </Link>
                      </motion.div>
                    )}

                    {/* ── MORE SIMILAR (2–4 smaller cards) ── */}
                    {moreMatches.length > 0 && (
                      <div>
                        <p className="text-[9px] font-sans font-bold uppercase tracking-[0.18em] text-stone-dark/40 mb-2.5">
                          Also Similar
                        </p>
                        <div className="grid grid-cols-2 gap-2.5">
                          {moreMatches.map((p, i) => (
                            <motion.div
                              key={p.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 + i * 0.07, duration: 0.28 }}
                            >
                              <Link href={`/products/${p.id}`} onClick={onClose}>
                                <motion.div
                                  className="relative rounded-xl overflow-hidden border border-stone-dark/8 hover:border-amber-gold/35 transition-colors cursor-pointer group"
                                  whileHover={{ y: -2 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="relative h-24 bg-stone-100">
                                    {p.imageUrl ? (
                                      <Image
                                        src={p.imageUrl}
                                        alt={p.name}
                                        fill
                                        className="object-cover"
                                        sizes="220px"
                                      />
                                    ) : (
                                      <div className="absolute inset-0" style={{ background: p.bg }} />
                                    )}
                                    {!p.imageUrl && (
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <ImageOff size={16} className="text-stone-dark/20" />
                                      </div>
                                    )}
                                    {/* Match badge */}
                                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-black/55 backdrop-blur-sm rounded-full">
                                      <span className="text-[9px] font-sans font-semibold text-amber-gold">{p.matchLabel}</span>
                                    </div>
                                  </div>
                                  <div className="px-2.5 py-2 bg-white">
                                    <p className="font-serif text-[12px] font-semibold text-stone-950 leading-tight truncate">{p.name}</p>
                                    <p className="text-[9.5px] font-sans text-stone-dark/45 truncate mt-0.5">{p.materialType} · {p.location}</p>
                                    <p className="font-serif text-[11px] font-semibold text-amber-gold mt-1">{p.priceRange}</p>
                                  </div>
                                </motion.div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA row */}
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <motion.button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 text-xs font-sans font-medium text-stone-dark/50 hover:text-stone-950 transition-colors"
                        whileHover={{ scale: 1.03 }}
                      >
                        <RotateCcw size={12} /> Search again
                      </motion.button>
                      <motion.button
                        onClick={handleViewInCatalog}
                        whileHover={{ scale: 1.03, x: 2 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-stone-950 text-white font-sans text-xs font-semibold rounded-xl hover:bg-stone-dark/85 transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
                      >
                        View all in Catalog <ArrowRight size={13} />
                      </motion.button>
                    </div>

                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
