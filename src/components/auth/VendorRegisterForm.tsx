"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, User, Phone, Mail, Lock, MapPin, FileText,
  Upload, X, CheckCircle2, Eye, EyeOff, AlertCircle,
  ChevronRight, ChevronLeft, Sparkles, Shield,
} from "lucide-react";
import { vendorRegisterAction, getR2PresignedUrl } from "@/lib/auth-actions";
import { FormField, AuthInput, AuthSelect, SubmitButton } from "./AuthLayout";

// ─── Constants ────────────────────────────────────────────────────────────────
const CITIES = [
  "Mumbai","Delhi","Bangalore","Hyderabad","Chennai","Kolkata","Pune",
  "Ahmedabad","Jaipur","Surat","Kochi","Chandigarh","Indore","Lucknow",
  "Nagpur","Bhopal","Vadodara","Rajkot","Coimbatore","Visakhapatnam",
];

const STEPS = [
  { n: 1, label: "Account",     icon: Lock      },
  { n: 2, label: "Business",    icon: Building2 },
  { n: 3, label: "Location",    icon: MapPin    },
  { n: 4, label: "Documents",   icon: FileText  },
];

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_MB = 10;

// ─── Types ────────────────────────────────────────────────────────────────────
interface Step1Data { contactPerson: string; email: string; password: string; }
interface Step2Data { companyName: string; phone: string; gstNumber: string; }
interface Step3Data { businessAddress: string; city: string; }
interface UploadedFile { file: File; preview?: string; uploading: boolean; url?: string; error?: string; }

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const done = step.n < current;
        const active = step.n === current;
        return (
          <React.Fragment key={step.n}>
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  backgroundColor: done ? "#c9a961" : active ? "#0a0a0a" : "transparent",
                  borderColor: done ? "#c9a961" : active ? "#0a0a0a" : "#0a0a0a1a",
                }}
                transition={{ duration: 0.25 }}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
              >
                {done ? (
                  <CheckCircle2 size={13} className="text-white" />
                ) : (
                  <Icon size={13} className={active ? "text-white" : "text-stone-dark/25"} />
                )}
              </motion.div>
              <span className={`text-[10px] font-sans font-semibold whitespace-nowrap ${active ? "text-stone-950" : done ? "text-amber-gold" : "text-stone-dark/30"}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <motion.div
                animate={{ backgroundColor: done ? "#c9a961" : "#0a0a0a12" }}
                transition={{ duration: 0.3 }}
                className="h-px flex-1 mx-2 mb-4 min-w-[12px]"
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── File drop zone ───────────────────────────────────────────────────────────
function FileDropZone({
  files,
  onAdd,
  onRemove,
}: {
  files: UploadedFile[];
  onAdd: (f: File[]) => void;
  onRemove: (i: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const items = Array.from(e.dataTransfer.files).filter(
        (f) => ACCEPTED_TYPES.includes(f.type) && f.size <= MAX_FILE_SIZE_MB * 1024 * 1024
      );
      onAdd(items);
    },
    [onAdd]
  );

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
          dragging
            ? "border-amber-gold/60 bg-amber-gold/6"
            : "border-stone-dark/12 hover:border-stone-dark/25 hover:bg-stone-dark/2"
        }`}
      >
        <Upload size={22} className="mx-auto text-stone-dark/25 mb-2" />
        <p className="font-sans text-[13px] font-semibold text-stone-dark/50">
          Drop files or <span className="text-amber-gold underline underline-offset-2">browse</span>
        </p>
        <p className="font-sans text-[11px] text-stone-dark/30 mt-1">
          PDF, JPG, PNG · Max {MAX_FILE_SIZE_MB} MB per file
        </p>
        <p className="font-sans text-[10.5px] text-stone-dark/25 mt-0.5">
          Business registration, GST certificate, trade licence, etc.
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={(e) => {
            const items = Array.from(e.target.files || []).filter(
              (f) => f.size <= MAX_FILE_SIZE_MB * 1024 * 1024
            );
            onAdd(items);
            e.target.value = "";
          }}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3.5 py-2.5 bg-white border border-stone-dark/8 rounded-xl"
            >
              <FileText size={14} className="text-stone-dark/35 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-sans font-semibold text-stone-950 truncate">
                  {f.file.name}
                </p>
                <p className="text-[10.5px] font-sans text-stone-dark/35">
                  {(f.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex-shrink-0">
                {f.uploading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-amber-gold border-t-transparent animate-spin" />
                ) : f.url ? (
                  <CheckCircle2 size={15} className="text-emerald-500" />
                ) : f.error ? (
                  <AlertCircle size={15} className="text-red-400" />
                ) : (
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    className="text-stone-dark/25 hover:text-red-400 transition-colors"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Vendor Registration Form ────────────────────────────────────────────
export function VendorRegisterForm() {
  const [step, setStep] = useState(1);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Step data
  const [s1, setS1] = useState<Step1Data>({ contactPerson: "", email: "", password: "" });
  const [s2, setS2] = useState<Step2Data>({ companyName: "", phone: "", gstNumber: "" });
  const [s3, setS3] = useState<Step3Data>({ businessAddress: "", city: "" });
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [showPw, setShowPw] = useState(false);

  // ── Validation ──
  const validateStep = (n: number): boolean => {
    const errs: Record<string, string> = {};
    if (n === 1) {
      if (!s1.contactPerson.trim()) errs.contactPerson = "Required";
      if (!s1.email.trim() || !s1.email.includes("@")) errs.email = "Valid email required";
      if (s1.password.length < 8) errs.password = "Min. 8 characters";
    }
    if (n === 2) {
      if (!s2.companyName.trim()) errs.companyName = "Required";
      if (!s2.phone.trim()) errs.phone = "Required";
    }
    if (n === 3) {
      if (!s3.businessAddress.trim()) errs.businessAddress = "Required";
      if (!s3.city) errs.city = "Please select a city";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(4, s + 1));
  };
  const back = () => { setFieldErrors({}); setStep((s) => Math.max(1, s - 1)); };

  // ── File management ──
  const addFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [
      ...prev,
      ...newFiles.map((f) => ({ file: f, uploading: false })),
    ]);
  }, []);

  const removeFile = useCallback((i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }, []);

  // ── Upload to R2 via presigned URL ──
  const uploadToR2 = async (
    uploadFiles: UploadedFile[],
    userId: string
  ): Promise<string[]> => {
    const urls: string[] = [];
    for (let i = 0; i < uploadFiles.length; i++) {
      const f = uploadFiles[i];
      setFiles((prev) =>
        prev.map((p, idx) => (idx === i ? { ...p, uploading: true } : p))
      );
      try {
        const presigned = await getR2PresignedUrl(
          f.file.name, f.file.type, userId
        );
        if (presigned) {
          await fetch(presigned.url, {
            method: "PUT",
            body: f.file,
            headers: { "Content-Type": f.file.type },
          });
          const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${presigned.key}`;
          urls.push(publicUrl);
          setFiles((prev) =>
            prev.map((p, idx) =>
              idx === i ? { ...p, uploading: false, url: publicUrl } : p
            )
          );
        }
      } catch {
        setFiles((prev) =>
          prev.map((p, idx) =>
            idx === i ? { ...p, uploading: false, error: "Upload failed" } : p
          )
        );
      }
    }
    return urls;
  };

  // ── Final submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);
    setSubmitting(true);

    // Upload files if R2 is configured
    let documentUrls: string[] = [];
    if (files.length > 0 && process.env.NEXT_PUBLIC_R2_PUBLIC_URL) {
      documentUrls = await uploadToR2(files, s1.email.replace(/[^a-z0-9]/gi, "_"));
    }

    // Build FormData and call server action
    const fd = new FormData();
    fd.append("contactPerson", s1.contactPerson);
    fd.append("email", s1.email);
    fd.append("password", s1.password);
    fd.append("companyName", s2.companyName);
    fd.append("phone", s2.phone);
    fd.append("gstNumber", s2.gstNumber);
    fd.append("businessAddress", s3.businessAddress);
    fd.append("city", s3.city);
    fd.append("documentUrls", JSON.stringify(documentUrls));

    const result = await vendorRegisterAction({}, fd);
    if (result?.error) {
      setGlobalError(result.error);
      setSubmitting(false);
    }
    if (result?.fieldErrors) {
      setFieldErrors(result.fieldErrors);
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-[10px] font-sans font-bold text-amber-gold/70 uppercase tracking-[0.22em] mb-2">
          Vendor Partner Program
        </p>
        <h2 className="font-serif text-[1.85rem] font-bold text-stone-950 leading-tight tracking-tight">
          Register as a Vendor
        </h2>
        <p className="mt-2 font-sans text-[13.5px] text-stone-dark/45 leading-relaxed">
          List your stone inventory on India&apos;s premium marketplace
        </p>
        <div className="mt-5 h-px bg-gradient-to-r from-amber-gold/30 via-stone-dark/8 to-transparent" />
      </div>

      <StepDots current={step} />

      {/* Global error */}
      <AnimatePresence>
        {globalError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200/60 rounded-xl"
          >
            <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="font-sans text-[13px] text-red-700">{globalError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {/* ── Step 1: Account ── */}
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}
              className="space-y-4"
            >
              <FormField label="Contact Person" error={fieldErrors.contactPerson}>
                <div className="relative">
                  <AuthInput
                    type="text"
                    placeholder="Rajesh Kumar"
                    value={s1.contactPerson}
                    onChange={(e) => setS1((p) => ({ ...p, contactPerson: e.target.value }))}
                    error={!!fieldErrors.contactPerson}
                  />
                  <User size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-dark/20 pointer-events-none" />
                </div>
              </FormField>

              <FormField label="Business Email" error={fieldErrors.email}>
                <div className="relative">
                  <AuthInput
                    type="email"
                    placeholder="contact@yourcompany.in"
                    autoComplete="email"
                    value={s1.email}
                    onChange={(e) => setS1((p) => ({ ...p, email: e.target.value }))}
                    error={!!fieldErrors.email}
                  />
                  <Mail size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-dark/20 pointer-events-none" />
                </div>
              </FormField>

              <FormField label="Password" error={fieldErrors.password}>
                <div className="relative">
                  <AuthInput
                    type={showPw ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    value={s1.password}
                    onChange={(e) => setS1((p) => ({ ...p, password: e.target.value }))}
                    error={!!fieldErrors.password}
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-dark/30 hover:text-stone-dark/60 transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormField>
            </motion.div>
          )}

          {/* ── Step 2: Business Info ── */}
          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}
              className="space-y-4"
            >
              <FormField label="Company Name" error={fieldErrors.companyName}>
                <div className="relative">
                  <AuthInput
                    type="text"
                    placeholder="Rajesh Stone Exports Pvt. Ltd."
                    value={s2.companyName}
                    onChange={(e) => setS2((p) => ({ ...p, companyName: e.target.value }))}
                    error={!!fieldErrors.companyName}
                  />
                  <Building2 size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-dark/20 pointer-events-none" />
                </div>
              </FormField>

              <FormField label="Phone Number" error={fieldErrors.phone}>
                <div className="relative">
                  <AuthInput
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={s2.phone}
                    onChange={(e) => setS2((p) => ({ ...p, phone: e.target.value }))}
                    error={!!fieldErrors.phone}
                  />
                  <Phone size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-dark/20 pointer-events-none" />
                </div>
              </FormField>

              <FormField label="GST Number (optional)">
                <AuthInput
                  type="text"
                  placeholder="27AADCS0472N1Z1"
                  value={s2.gstNumber}
                  onChange={(e) => setS2((p) => ({ ...p, gstNumber: e.target.value.toUpperCase() }))}
                  className="font-mono tracking-wider"
                />
              </FormField>

              <div className="p-3.5 bg-blue-50 border border-blue-200/50 rounded-xl">
                <p className="text-[12px] font-sans text-blue-700 leading-relaxed">
                  <Shield size={12} className="inline mr-1.5 -mt-0.5 text-blue-500" />
                  Your GST registration accelerates approval and increases buyer trust.
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Location ── */}
          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}
              className="space-y-4"
            >
              <FormField label="Business Address" error={fieldErrors.businessAddress}>
                <textarea
                  rows={3}
                  placeholder="Plot 12, Industrial Area Phase 2, ..."
                  value={s3.businessAddress}
                  onChange={(e) => setS3((p) => ({ ...p, businessAddress: e.target.value }))}
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-[14px] font-sans text-stone-950 placeholder:text-stone-dark/25 focus:outline-none resize-none transition-all duration-200 ${
                    fieldErrors.businessAddress
                      ? "border-red-400 focus:border-red-500"
                      : "border-stone-dark/12 focus:border-amber-gold/60 focus:ring-2 focus:ring-amber-gold/12"
                  }`}
                />
              </FormField>

              <FormField label="City / Warehouse Location" error={fieldErrors.city}>
                <div className="relative">
                  <AuthSelect
                    value={s3.city}
                    onChange={(e) => setS3((p) => ({ ...p, city: e.target.value }))}
                    error={!!fieldErrors.city}
                  >
                    <option value="">Select city</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="Other">Other</option>
                  </AuthSelect>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-dark/30">
                    ▾
                  </div>
                </div>
              </FormField>
            </motion.div>
          )}

          {/* ── Step 4: Documents ── */}
          {step === 4 && (
            <motion.div
              key="s4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}
              className="space-y-5"
            >
              <div className="flex items-start gap-2.5 p-3.5 bg-amber-gold/6 border border-amber-gold/20 rounded-xl">
                <Sparkles size={14} className="text-amber-gold flex-shrink-0 mt-0.5" />
                <p className="font-sans text-[12.5px] text-amber-800 leading-relaxed">
                  Upload business registration, GST certificate, or trade licence for faster approval. Documents are stored securely and reviewed only by Stonamart admins.
                </p>
              </div>

              <FileDropZone
                files={files}
                onAdd={addFiles}
                onRemove={removeFile}
              />

              <p className="text-[11.5px] font-sans text-stone-dark/35 text-center">
                Document upload is optional — you can submit without it
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between mt-7 pt-5 border-t border-stone-dark/6">
          {step > 1 ? (
            <motion.button
              type="button"
              onClick={back}
              whileHover={{ x: -2 }}
              className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-sans font-semibold text-stone-dark/60 hover:text-stone-950 transition-colors"
            >
              <ChevronLeft size={15} />
              Back
            </motion.button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <motion.button
              type="button"
              onClick={next}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-3 bg-stone-950 text-white font-sans font-semibold text-[13px] rounded-xl hover:bg-stone-dark transition-colors shadow-sm"
            >
              Continue
              <ChevronRight size={14} />
            </motion.button>
          ) : (
            <SubmitButton
              pending={submitting}
              label="Submit for Review"
              pendingLabel="Submitting…"
            />
          )}
        </div>
      </form>

      {/* Already have an account */}
      <p className="text-center font-sans text-[12.5px] text-stone-dark/45">
        Already registered?{" "}
        <a
          href="/login"
          className="text-amber-gold hover:text-amber-gold/70 font-semibold transition-colors"
        >
          Sign in
        </a>
      </p>
    </div>
  );
}
