"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronDown,
  UploadCloud,
  Image as ImageIcon,
  Film,
  X,
  Star,
  Cpu,
  CheckCircle2,
  Save,
  Send,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Play,
  Maximize2,
  AlertCircle,
} from "lucide-react";
import { FORM_OPTIONS } from "./data";
import type {
  FormStep1,
  FormStep2,
  FormStep3,
  UnitType,
} from "./types";
import { emptyStep3 } from "./types";
import { getVideoUploadUrl, getImageUploadUrl } from "@/lib/vendor-actions";

// ─── Shared field styles ──────────────────────────────────────────────────────
const inputCls =
  "w-full px-3.5 py-2.5 text-sm font-sans bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-gold/60 focus:ring-2 focus:ring-amber-gold/12 transition-all";
const selectCls = `${inputCls} appearance-none cursor-pointer`;
const labelCls =
  "block text-[10px] font-sans font-semibold uppercase tracking-[0.12em] text-stone-dark/42 mb-1.5";
const errorCls = "text-[10px] font-sans text-red-500 mt-1";

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {error && <p className={errorCls}>{error}</p>}
    </div>
  );
}

// ─── Select field ─────────────────────────────────────────────────────────────
function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
  error?: string;
}) {
  return (
    <Field label={label} error={error}>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={selectCls}
        >
          <option value="">{placeholder ?? `Select ${label.toLowerCase()}`}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          size={13}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-dark/35 pointer-events-none"
        />
      </div>
    </Field>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEP_LABELS = ["Basic Info", "Specifications", "Media & Submit"];

function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center mb-8">
      {STEP_LABELS.map((label, i) => {
        const step = (i + 1) as 1 | 2 | 3;
        const done = current > step;
        const active = current === step;
        return (
          <React.Fragment key={label}>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{
                  backgroundColor: done
                    ? "#10b981"
                    : active
                    ? "#B8865A"
                    : "transparent",
                  borderColor: done ? "#10b981" : active ? "#B8865A" : "rgba(58,47,38,0.18)",
                }}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              >
                {done ? (
                  <Check size={13} className="text-white" />
                ) : (
                  <span
                    className={`text-xs font-sans font-bold ${
                      active ? "text-white" : "text-stone-dark/35"
                    }`}
                  >
                    {step}
                  </span>
                )}
              </motion.div>
              <span
                className={`text-xs font-sans font-semibold hidden sm:block ${
                  active
                    ? "text-amber-gold"
                    : done
                    ? "text-emerald-600"
                    : "text-stone-dark/35"
                }`}
              >
                {label}
              </span>
            </div>
            {i < 2 && (
              <div className="flex-1 mx-3 h-px bg-stone-dark/10 relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-emerald-500"
                  animate={{ width: current > step ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Image fullscreen preview modal ──────────────────────────────────────────
function ImagePreviewModal({ url, onClose }: { url: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/85 flex items-center justify-center p-4 cursor-zoom-out"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="relative max-w-4xl max-h-[88vh] flex items-center justify-center cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt="Preview"
          className="max-w-full max-h-[88vh] object-contain rounded-2xl shadow-2xl"
        />
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X size={14} className="text-gray-700" />
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Video preview modal ──────────────────────────────────────────────────────
function VideoPreviewModal({ url, onClose }: { url: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="relative w-full max-w-3xl cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          src={url}
          controls
          autoPlay
          className="w-full rounded-2xl bg-black shadow-2xl"
          style={{ maxHeight: "75vh" }}
        />
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X size={14} className="text-gray-700" />
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Media slot ───────────────────────────────────────────────────────────────
type UploadState = "idle" | "uploading" | "done" | "error";

function MediaSlot({
  idx,
  isVideo,
  file,
  objectUrl,
  uploadState,
  isHero,
  onSelect,
  onClear,
  onSetHero,
  onPreview,
}: {
  idx: number;
  isVideo: boolean;
  file: File | null;
  objectUrl: string | null;
  uploadState: UploadState;
  isHero: boolean;
  onSelect: () => void;
  onClear: () => void;
  onSetHero: () => void;
  onPreview: () => void;
}) {
  const hasFile = file !== null;
  const isUploading = uploadState === "uploading";
  const isDone = uploadState === "done";
  const isError = uploadState === "error";

  return (
    <div className="flex flex-col gap-1">
      {/* Slot tile */}
      <div
        className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
          hasFile
            ? isError
              ? "border-red-400/60"
              : isDone
              ? isHero
                ? "border-amber-gold shadow-[0_0_0_3px_rgba(184,134,90,0.18)]"
                : "border-emerald-400/50"
              : "border-stone-dark/12"
            : "border-dashed border-stone-dark/15 hover:border-amber-gold/40 hover:bg-amber-gold/4"
        }`}
        style={{ aspectRatio: "1/1" }}
        onClick={!hasFile ? onSelect : objectUrl ? onPreview : undefined}
      >
        {hasFile ? (
          <>
            {/* Content */}
            {isVideo ? (
              <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center gap-1">
                {isDone ? (
                  <div
                    onClick={(e) => { e.stopPropagation(); onPreview(); }}
                    className="w-9 h-9 bg-amber-gold/90 rounded-full flex items-center justify-center hover:bg-amber-gold transition-colors cursor-pointer"
                  >
                    <Play size={15} fill="white" className="text-white ml-0.5" />
                  </div>
                ) : (
                  <Film
                    size={18}
                    className={
                      isUploading
                        ? "text-amber-400"
                        : isError
                        ? "text-red-400"
                        : "text-gray-500"
                    }
                  />
                )}
                {file && (
                  <p className="absolute bottom-1 left-0 right-0 text-center text-[7px] font-sans text-white/35 truncate px-1">
                    {file.name}
                  </p>
                )}
              </div>
            ) : objectUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={objectUrl}
                alt={`Slot ${idx + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-stone-100 flex items-center justify-center">
                <ImageIcon size={16} className="text-stone-300" />
              </div>
            )}

            {/* Hover preview hint for images */}
            {!isVideo && objectUrl && (
              <div className="absolute inset-0 bg-black/0 hover:bg-black/25 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 pointer-events-none">
                <Maximize2 size={14} className="text-white drop-shadow-md" />
              </div>
            )}

            {/* Upload spinner overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/45 flex items-center justify-center pointer-events-none">
                <Loader2 size={16} className="text-white animate-spin" />
              </div>
            )}

            {/* Status badge (top-right) */}
            {isDone && !isHero && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center shadow pointer-events-none">
                <Check size={8} strokeWidth={3} className="text-white" />
              </div>
            )}
            {isError && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center shadow pointer-events-none">
                <X size={8} strokeWidth={3} className="text-white" />
              </div>
            )}

            {/* Hero badge (top-left) */}
            {isHero && isDone && (
              <div className="absolute top-1 left-1 w-4 h-4 bg-amber-gold rounded-full flex items-center justify-center shadow pointer-events-none">
                <Star size={7} fill="white" className="text-white" />
              </div>
            )}

            {/* Remove button */}
            <button
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="absolute bottom-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <X size={9} />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-stone-dark/30">
            {isVideo ? <Film size={16} /> : <UploadCloud size={16} />}
            <span className="text-[9px] font-sans font-medium text-center px-1 leading-tight">
              {isVideo ? "Video" : `Image ${idx + 1}`}
            </span>
          </div>
        )}
      </div>

      {/* Status / hero label row */}
      <div className="min-h-[14px] flex flex-col items-center justify-center">
        {hasFile && isUploading && (
          <p className="text-[8px] font-sans text-amber-600 leading-none">Uploading…</p>
        )}
        {hasFile && isDone && isVideo && (
          <p className="text-[8px] font-sans text-emerald-600 leading-none">✓ Uploaded</p>
        )}
        {hasFile && isError && (
          <p className="text-[8px] font-sans text-red-500 leading-none">✕ Failed</p>
        )}
        {hasFile && isDone && !isVideo && !isHero && (
          <button
            onClick={onSetHero}
            className="text-[8px] font-sans font-medium text-stone-dark/38 hover:text-amber-gold transition-colors leading-none"
          >
            Set hero
          </button>
        )}
        {hasFile && isDone && !isVideo && isHero && (
          <p className="text-[8px] font-sans font-semibold text-amber-gold leading-none">★ Hero</p>
        )}
      </div>
    </div>
  );
}

// ─── AI Processing Banner ─────────────────────────────────────────────────────
function AIBanner({ status }: { status: "idle" | "processing" | "done" }) {
  return (
    <AnimatePresence>
      {status !== "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className={`rounded-xl border p-3.5 ${
            status === "done"
              ? "bg-emerald-50 border-emerald-200/60"
              : "bg-amber-50 border-amber-200/60"
          }`}
        >
          <div className="flex items-center gap-2.5 mb-2">
            {status === "processing" ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              >
                <Cpu size={14} className="text-amber-600" />
              </motion.div>
            ) : (
              <CheckCircle2 size={14} className="text-emerald-600" />
            )}
            <p className="font-sans text-xs font-semibold text-stone-950">
              {status === "processing"
                ? "AI is analyzing your stone images…"
                : "AI Analysis Complete"}
            </p>
          </div>

          {status === "processing" ? (
            <div className="h-1 bg-amber-200/60 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-amber-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.4, ease: "linear" }}
              />
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {[
                "Color palette detected",
                "Texture pattern identified",
                "Finish type confirmed",
                "Listing optimized",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-emerald-100 border border-emerald-200/60 text-emerald-700 text-[9px] font-sans font-semibold rounded-full"
                >
                  ✓ {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────
type SubmitAction = "draft" | "review";

interface ProductSubmissionFormProps {
  onSubmit: (
    action: SubmitAction,
    data: { step1: FormStep1; step2: FormStep2; step3: FormStep3 }
  ) => void;
  editListing?: { step1: FormStep1; step2: FormStep2 } | null;
}

const INITIAL_STEP1: FormStep1 = {
  name: "",
  materialType: "",
  category: "",
  stockQty: "",
  pricePerUnit: "",
  unit: "sq ft",
};

const INITIAL_STEP2: FormStep2 = {
  color: "",
  finish: "",
  thickness: "",
  dimensions: "",
  warehouseCity: "",
};

export function ProductSubmissionForm({
  onSubmit,
  editListing,
}: ProductSubmissionFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [step1, setStep1] = useState<FormStep1>(editListing?.step1 ?? INITIAL_STEP1);
  const [step2, setStep2] = useState<FormStep2>(editListing?.step2 ?? INITIAL_STEP2);
  const [step3, setStep3] = useState<FormStep3>(emptyStep3());
  const [objectUrls, setObjectUrls] = useState<(string | null)[]>(Array(7).fill(null));
  const [uploadStates, setUploadStates] = useState<UploadState[]>(Array(7).fill("idle"));
  const [uploadErrors, setUploadErrors] = useState<(string | null)[]>(Array(7).fill(null));
  const [previewSlot, setPreviewSlot] = useState<number | null>(null);
  const [aiStatus, setAiStatus] = useState<"idle" | "processing" | "done">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<SubmitAction | null>(null);

  const fileRefs = useRef<Array<HTMLInputElement | null>>(Array.from({ length: 7 }, () => null));
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup object URLs on unmount
  useEffect(() => {
    const urls = objectUrls;
    return () => urls.forEach((u) => u && URL.revokeObjectURL(u));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync editListing into form state + reset media state
  useEffect(() => {
    if (editListing) {
      setStep1(editListing.step1);
      setStep2(editListing.step2);
      setStep(1);
      // Reset media entirely when switching to a different edit session
      objectUrls.forEach((u) => u && URL.revokeObjectURL(u));
      setObjectUrls(Array(7).fill(null));
      setStep3(emptyStep3());
      setUploadStates(Array(7).fill("idle"));
      setUploadErrors(Array(7).fill(null));
      setPreviewSlot(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editListing]);

  function triggerAI() {
    setAiStatus("processing");
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    aiTimerRef.current = setTimeout(() => setAiStatus("done"), 2600);
  }

  // Upload a file immediately when selected and track per-slot status
  async function handleFileSelect(slotIdx: number, file: File) {
    // Revoke the previous object URL for this slot (if any)
    if (objectUrls[slotIdx]) URL.revokeObjectURL(objectUrls[slotIdx]!);
    const objUrl = URL.createObjectURL(file); // works for both images and video

    setObjectUrls((prev) => { const n = [...prev]; n[slotIdx] = objUrl; return n; });
    setStep3((prev) => {
      const files = [...prev.files] as (File | null)[];
      files[slotIdx] = file;
      const uploadedUrls = [...prev.uploadedUrls];
      uploadedUrls[slotIdx] = null; // clear old URL while re-uploading
      return { ...prev, files, uploadedUrls };
    });
    setUploadStates((prev) => { const n = [...prev]; n[slotIdx] = "uploading"; return n; });
    setUploadErrors((prev) => { const n = [...prev]; n[slotIdx] = null; return n; });

    if (slotIdx < 6) triggerAI();

    try {
      let uploadedUrl: string | null = null;

      if (slotIdx === 6) {
        // Video — browser uploads directly to Supabase (no server relay)
        const res = await getVideoUploadUrl(file.name, file.type);
        if ("error" in res) throw new Error(res.error);
        const put = await fetch(res.signedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type || "video/mp4" },
        });
        if (!put.ok) throw new Error(`Upload failed (${put.status})`);
        uploadedUrl = res.publicUrl;
      } else {
        // Image — browser uploads directly to Supabase (no server relay)
        const res = await getImageUploadUrl(file.name, file.type);
        if ("error" in res) throw new Error(res.error);
        const put = await fetch(res.signedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type || "image/jpeg" },
        });
        if (!put.ok) throw new Error(`Upload failed (${put.status})`);
        uploadedUrl = res.publicUrl;
      }

      // Guard: only update if this file is still the one in the slot
      setStep3((prev) => {
        if (prev.files[slotIdx] !== file) return prev;
        const uploadedUrls = [...prev.uploadedUrls];
        uploadedUrls[slotIdx] = uploadedUrl;
        return { ...prev, uploadedUrls };
      });
      setUploadStates((prev) => { const n = [...prev]; n[slotIdx] = "done"; return n; });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setUploadStates((prev) => { const n = [...prev]; n[slotIdx] = "error"; return n; });
      setUploadErrors((prev) => { const n = [...prev]; n[slotIdx] = msg; return n; });
    }
  }

  function handleFileClear(slotIdx: number) {
    if (objectUrls[slotIdx]) URL.revokeObjectURL(objectUrls[slotIdx]!);
    setObjectUrls((prev) => { const n = [...prev]; n[slotIdx] = null; return n; });
    setStep3((prev) => {
      const files = [...prev.files] as (File | null)[];
      files[slotIdx] = null;
      const uploadedUrls = [...prev.uploadedUrls];
      uploadedUrls[slotIdx] = null;
      const heroIdx =
        prev.heroIdx === slotIdx
          ? files.findIndex((f) => f !== null)
          : prev.heroIdx;
      return { ...prev, files, uploadedUrls, heroIdx: heroIdx < 0 ? 0 : heroIdx };
    });
    setUploadStates((prev) => { const n = [...prev]; n[slotIdx] = "idle"; return n; });
    setUploadErrors((prev) => { const n = [...prev]; n[slotIdx] = null; return n; });
    if (previewSlot === slotIdx) setPreviewSlot(null);
  }

  // ── Validation ──────────────────────────────────────────────────────────────
  function validateStep1(): boolean {
    const errs: Record<string, string> = {};
    if (!step1.name.trim()) errs.name = "Stone name is required";
    if (!step1.materialType) errs.materialType = "Select a material type";
    if (!step1.category) errs.category = "Select a category";
    if (!step1.pricePerUnit || isNaN(Number(step1.pricePerUnit)))
      errs.pricePerUnit = "Enter a valid price";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep2(): boolean {
    const errs: Record<string, string> = {};
    if (!step2.color) errs.color = "Select a color";
    if (!step2.finish) errs.finish = "Select a finish";
    if (!step2.thickness) errs.thickness = "Select thickness";
    if (!step2.warehouseCity) errs.warehouseCity = "Select a city";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function goNext() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setErrors({});
    setStep((s) => Math.min(s + 1, 3) as 1 | 2 | 3);
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1) as 1 | 2 | 3);
  }

  function handleAction(action: SubmitAction) {
    // Block submit while any upload is in progress
    const anyUploading = uploadStates.some((s) => s === "uploading");
    if (anyUploading) {
      setErrors({ media: "Please wait for all uploads to complete before submitting." });
      return;
    }

    if (action === "review" && step === 3) {
      const hasUploadedImage = step3.uploadedUrls.slice(0, 6).some(Boolean);
      // For new listings, require at least one uploaded image
      if (!hasUploadedImage && !editListing) {
        setErrors({ media: "Upload at least one stone image before submitting." });
        return;
      }
    }

    onSubmit(action, { step1, step2, step3 });
    setSubmitted(action);
    setTimeout(() => {
      setSubmitted(null);
      setStep(1);
      setStep1(INITIAL_STEP1);
      setStep2(INITIAL_STEP2);
      objectUrls.forEach((u) => u && URL.revokeObjectURL(u));
      setStep3(emptyStep3());
      setObjectUrls(Array(7).fill(null));
      setUploadStates(Array(7).fill("idle"));
      setUploadErrors(Array(7).fill(null));
      setPreviewSlot(null);
      setAiStatus("idle");
    }, 2200);
  }

  // Derived
  const anyUploading = uploadStates.some((s) => s === "uploading");

  // ── Success state ───────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 18 }}
          className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${
            submitted === "draft" ? "bg-stone-dark/8" : "bg-emerald-100"
          }`}
        >
          {submitted === "draft" ? (
            <Save size={24} className="text-stone-dark/60" />
          ) : (
            <CheckCircle2 size={24} className="text-emerald-600" />
          )}
        </motion.div>
        <h3 className="font-serif text-2xl font-bold text-stone-950 mb-2">
          {submitted === "draft" ? "Saved as Draft" : "Submitted for Review!"}
        </h3>
        <p className="font-sans text-sm text-stone-dark/50 max-w-xs">
          {submitted === "draft"
            ? "Your listing has been saved. You can submit it for review anytime."
            : "Our team will review your listing within 24–48 hours."}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Image / video preview modals */}
      <AnimatePresence>
        {previewSlot !== null && objectUrls[previewSlot] && (
          previewSlot === 6 ? (
            <VideoPreviewModal
              key="video-preview"
              url={objectUrls[previewSlot]!}
              onClose={() => setPreviewSlot(null)}
            />
          ) : (
            <ImagePreviewModal
              key="image-preview"
              url={objectUrls[previewSlot]!}
              onClose={() => setPreviewSlot(null)}
            />
          )
        )}
      </AnimatePresence>

      <StepIndicator current={step} />

      <AnimatePresence mode="wait">
        {/* ── Step 1: Basic Info ── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28 }}
          >
            <div className="bg-white rounded-2xl border border-stone-dark/8 p-6 space-y-5">
              <div>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-gold mb-1">
                  Step 1
                </p>
                <h3 className="font-serif text-xl font-bold text-stone-950">
                  Basic Information
                </h3>
              </div>

              <Field label="Stone Name" error={errors.name}>
                <input
                  type="text"
                  value={step1.name}
                  onChange={(e) =>
                    setStep1((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. Calacatta Oro Premium"
                  className={inputCls}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Material Type"
                  value={step1.materialType}
                  onChange={(v) => setStep1((p) => ({ ...p, materialType: v }))}
                  options={FORM_OPTIONS.materialType}
                  error={errors.materialType}
                />
                <SelectField
                  label="Category"
                  value={step1.category}
                  onChange={(v) => setStep1((p) => ({ ...p, category: v }))}
                  options={FORM_OPTIONS.category}
                  error={errors.category}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Stock Quantity (units)">
                  <input
                    type="number"
                    min="0"
                    value={step1.stockQty}
                    onChange={(e) =>
                      setStep1((p) => ({ ...p, stockQty: e.target.value }))
                    }
                    placeholder="e.g. 500"
                    className={inputCls}
                  />
                </Field>

                <Field label="Price per Unit" error={errors.pricePerUnit}>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-sans font-semibold text-stone-dark/40">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={step1.pricePerUnit}
                        onChange={(e) =>
                          setStep1((p) => ({ ...p, pricePerUnit: e.target.value }))
                        }
                        placeholder="0"
                        className={`${inputCls} pl-7`}
                      />
                    </div>
                    <div className="relative w-28 flex-shrink-0">
                      <select
                        value={step1.unit}
                        onChange={(e) =>
                          setStep1((p) => ({
                            ...p,
                            unit: e.target.value as UnitType,
                          }))
                        }
                        className={selectCls}
                      >
                        {FORM_OPTIONS.unit.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={11}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-dark/35 pointer-events-none"
                      />
                    </div>
                  </div>
                </Field>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Specifications ── */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28 }}
          >
            <div className="bg-white rounded-2xl border border-stone-dark/8 p-6 space-y-5">
              <div>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-gold mb-1">
                  Step 2
                </p>
                <h3 className="font-serif text-xl font-bold text-stone-950">
                  Specifications
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Color"
                  value={step2.color}
                  onChange={(v) => setStep2((p) => ({ ...p, color: v }))}
                  options={FORM_OPTIONS.color}
                  error={errors.color}
                />
                <SelectField
                  label="Finish"
                  value={step2.finish}
                  onChange={(v) => setStep2((p) => ({ ...p, finish: v }))}
                  options={FORM_OPTIONS.finish}
                  error={errors.finish}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Thickness"
                  value={step2.thickness}
                  onChange={(v) => setStep2((p) => ({ ...p, thickness: v }))}
                  options={FORM_OPTIONS.thickness}
                  error={errors.thickness}
                />
                <SelectField
                  label="Standard Dimensions"
                  value={step2.dimensions}
                  onChange={(v) => setStep2((p) => ({ ...p, dimensions: v }))}
                  options={FORM_OPTIONS.dimensions}
                />
              </div>

              <SelectField
                label="Warehouse City"
                value={step2.warehouseCity}
                onChange={(v) => setStep2((p) => ({ ...p, warehouseCity: v }))}
                options={FORM_OPTIONS.warehouseCity}
                error={errors.warehouseCity}
              />
            </div>
          </motion.div>
        )}

        {/* ── Step 3: Media Upload ── */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28 }}
          >
            <div className="bg-white rounded-2xl border border-stone-dark/8 p-6 space-y-5">
              <div>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-gold mb-1">
                  Step 3
                </p>
                <h3 className="font-serif text-xl font-bold text-stone-950">
                  Media Upload
                </h3>
                <p className="font-sans text-xs text-stone-dark/45 mt-1">
                  {editListing
                    ? "Optionally replace images/video. Leave empty to keep existing media."
                    : "Upload up to 6 images and 1 video. Files upload immediately — you'll see a ✓ when each is ready."}
                </p>
              </div>

              {/* Media grid: 6 image slots + 1 video slot */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                {Array.from({ length: 7 }, (_, i) => {
                  const isVideo = i === 6;
                  return (
                    <React.Fragment key={i}>
                      <input
                        ref={(el) => { fileRefs.current[i] = el; }}
                        type="file"
                        accept={isVideo ? "video/*" : "image/*"}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(i, file);
                          e.target.value = "";
                        }}
                      />
                      <MediaSlot
                        idx={i}
                        isVideo={isVideo}
                        file={step3.files[i]}
                        objectUrl={objectUrls[i]}
                        uploadState={uploadStates[i]}
                        isHero={!isVideo && step3.heroIdx === i}
                        onSelect={() => fileRefs.current[i]?.click()}
                        onClear={() => handleFileClear(i)}
                        onSetHero={() => setStep3((p) => ({ ...p, heroIdx: i }))}
                        onPreview={() => setPreviewSlot(i)}
                      />
                    </React.Fragment>
                  );
                })}
              </div>

              {errors.media && (
                <p className={errorCls}>{errors.media}</p>
              )}

              {/* Video upload success message */}
              <AnimatePresence>
                {uploadStates[6] === "done" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-2.5 p-3 bg-emerald-50 border border-emerald-200/60 rounded-xl"
                  >
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                    <p className="font-sans text-xs font-medium text-emerald-700">
                      Video uploaded successfully.
                    </p>
                  </motion.div>
                )}
                {uploadStates[6] === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-2.5 p-3 bg-red-50 border border-red-200/60 rounded-xl"
                  >
                    <AlertCircle size={14} className="text-red-600 flex-shrink-0" />
                    <p className="font-sans text-xs font-medium text-red-700">
                      Video upload failed: {uploadErrors[6] ?? "Unknown error"}. Please remove and try again.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI processing banner */}
              <AIBanner status={aiStatus} />

              {/* Hero note */}
              {step3.files.some(Boolean) && (
                <p className="text-[10px] font-sans text-stone-dark/38 flex items-center gap-1.5">
                  <Star size={10} className="text-amber-gold" />
                  Click &quot;Set hero&quot; under any uploaded image to set it as the catalog thumbnail.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Form navigation ── */}
      <div className="flex items-center justify-between mt-5 gap-3">
        {/* Back */}
        <motion.button
          onClick={goBack}
          disabled={step === 1}
          whileHover={step > 1 ? { scale: 1.03 } : {}}
          whileTap={step > 1 ? { scale: 0.97 } : {}}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-sans font-semibold rounded-xl border transition-all ${
            step === 1
              ? "border-stone-dark/8 text-stone-dark/25 cursor-not-allowed"
              : "border-stone-dark/12 text-stone-dark/60 hover:border-stone-dark/22 hover:text-stone-dark/80"
          }`}
        >
          <ArrowLeft size={14} />
          Back
        </motion.button>

        <div className="flex items-center gap-2.5">
          {/* Save as Draft */}
          <motion.button
            onClick={() => handleAction("draft")}
            disabled={anyUploading}
            whileHover={!anyUploading ? { scale: 1.03 } : {}}
            whileTap={!anyUploading ? { scale: 0.97 } : {}}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-sans font-semibold rounded-xl border transition-all ${
              anyUploading
                ? "border-stone-dark/8 text-stone-dark/25 cursor-not-allowed"
                : "border-stone-dark/12 text-stone-dark/60 hover:border-stone-dark/22 hover:text-stone-dark/80"
            }`}
          >
            <Save size={14} />
            Save Draft
          </motion.button>

          {/* Next or Submit */}
          {step < 3 ? (
            <motion.button
              onClick={goNext}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-sans font-semibold rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            >
              Next
              <ArrowRight size={14} />
            </motion.button>
          ) : (
            <motion.button
              onClick={() => handleAction("review")}
              disabled={anyUploading}
              whileHover={!anyUploading ? { scale: 1.03 } : {}}
              whileTap={!anyUploading ? { scale: 0.97 } : {}}
              className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-sans font-semibold rounded-xl transition-colors ${
                anyUploading
                  ? "bg-amber-gold/40 text-stone-950/40 cursor-not-allowed"
                  : "bg-amber-gold text-stone-950 hover:bg-amber-gold/85 shadow-[0_2px_12px_rgba(184,134,90,0.3)]"
              }`}
            >
              {anyUploading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Send size={14} />
                  Submit for Review
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
