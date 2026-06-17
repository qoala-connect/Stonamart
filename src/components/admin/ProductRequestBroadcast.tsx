"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio, Send, MessageCircle, CheckCircle2, Phone, Mail,
  MapPin, Package, Clock, Users, X, ChevronRight, ArrowLeft,
  Tag, Loader2, AlertCircle, ExternalLink,
  UploadCloud, Image as ImageIcon, Film,
} from "lucide-react";
import {
  createProductRequest,
  uploadRequestMedia,
  getProductRequests,
  getRequestResponses,
  closeProductRequest,
} from "@/lib/request-actions";
import type {
  ProductRequest,
  VendorRequestResponse,
  BroadcastVendor,
} from "@/lib/request-actions";

const CATEGORIES = [
  "Marble", "Granite", "Quartz", "Sandstone", "Limestone",
  "Onyx", "Slate", "Quartzite", "Travertine", "Other Stone",
];

const UNITS = ["sqft", "sqm", "running ft", "pieces", "slabs", "kg", "tons"];

// ── Helpers ───────────────────────────────────────────────────────────────────
function buildWhatsAppUrl(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("91") ? digits : `91${digits}`;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

function buildWaMessage(
  vendorName: string,
  request: { title: string; category: string; quantity: string; unit: string; targetCity: string; description: string; budgetMin: number | null; budgetMax: number | null },
  respondUrl: string
) {
  const budget =
    request.budgetMin && request.budgetMax
      ? `₹${Number(request.budgetMin).toLocaleString("en-IN")} – ₹${Number(request.budgetMax).toLocaleString("en-IN")} per ${request.unit}`
      : "Negotiable";
  return `Hi ${vendorName},

A customer urgently needs the following stone product through Stonamart:

*${request.title}* — ${request.category}
📍 Location: ${request.targetCity || "Any"}
📦 Quantity: ${request.quantity || "As needed"} ${request.unit}
💰 Budget: ${budget}
${request.description ? `\n📝 ${request.description}` : ""}

If you have this in stock, please respond here:
${respondUrl}

— Stonamart Sourcing Team`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.08em] mb-1.5">
      {children}
    </label>
  );
}

function InputField({
  placeholder, value, onChange, type = "text",
}: {
  placeholder?: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 text-[13px] font-sans border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-gold/30 focus:border-amber-gold/50 placeholder:text-gray-300 bg-white transition-all"
    />
  );
}

// ── ResponsesPanel ─────────────────────────────────────────────────────────────
function ResponsesPanel({
  request,
  onBack,
}: {
  request: ProductRequest;
  onBack: () => void;
}) {
  const [responses, setResponses] = useState<VendorRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await getRequestResponses(request.id);
      setResponses(data);
      setLoading(false);
    });
  }, [request.id]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={15} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-[11px] text-gray-400 uppercase tracking-[0.08em]">Responses for</p>
          <h3 className="font-serif text-base font-bold text-gray-900 truncate">{request.title}</h3>
        </div>
        <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full ${
          request.status === "ACTIVE"
            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
            : "bg-gray-100 text-gray-500"
        }`}>
          {request.status}
        </span>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={20} className="animate-spin text-amber-gold" />
        </div>
      ) : responses.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-gray-300">
          <MessageCircle size={32} strokeWidth={1} />
          <p className="font-sans text-sm text-gray-400">No vendor responses yet</p>
          <p className="font-sans text-[11px] text-gray-300">Vendors will respond via email link or portal</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {responses.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="font-sans font-semibold text-[13px] text-gray-900">
                    {r.vendorName ?? "Vendor"}
                  </p>
                  <p className="font-sans text-[11px] text-gray-400">{fmtDate(r.createdAt)}</p>
                </div>
                {r.price && (
                  <div className="text-right flex-shrink-0">
                    <p className="font-sans font-bold text-[15px] text-amber-gold">
                      ₹{Number(r.price).toLocaleString("en-IN")}
                    </p>
                    <p className="font-sans text-[10px] text-gray-400">per {r.unit ?? "unit"}</p>
                  </div>
                )}
              </div>

              {r.availability && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-sans font-medium mb-2">
                  <CheckCircle2 size={10} />
                  {r.availability}
                </div>
              )}

              {r.message && (
                <p className="font-sans text-[12px] text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-3 py-2 mb-3">
                  {r.message}
                </p>
              )}

              <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                {r.vendorPhone && (
                  <a
                    href={buildWhatsAppUrl(r.vendorPhone, `Hi ${r.vendorName}, regarding your response on Stonamart sourcing request — `)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[11px] font-sans text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <MessageCircle size={12} />
                    {r.vendorPhone}
                  </a>
                )}
                {r.vendorEmail && (
                  <a
                    href={`mailto:${r.vendorEmail}`}
                    className="flex items-center gap-1.5 text-[11px] font-sans text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <Mail size={12} />
                    {r.vendorEmail}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── SentPanel (after broadcast success) ─────────────────────────────────────
function SentPanel({
  vendors,
  vendorCount,
  request,
  requestId,
  onDone,
}: {
  vendors: BroadcastVendor[];
  vendorCount: number;
  request: {
    title: string; category: string; quantity: string; unit: string;
    targetCity: string; description: string; budgetMin: number | null; budgetMax: number | null;
  };
  requestId: string;
  onDone: () => void;
}) {
  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "https://stonamart.com";
  const respondUrl = `${baseUrl}/vendor/requests?requestId=${requestId}`;
  const vendorsWithPhone = vendors.filter((v) => v.phone);

  return (
    <div className="flex flex-col h-full">
      {/* Success header */}
      <div className="flex-shrink-0 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={18} className="text-white" />
          </div>
          <div>
            <p className="font-sans font-bold text-[14px] text-emerald-800">Broadcast Sent!</p>
            <p className="font-sans text-[12px] text-emerald-600">
              Email sent to <strong>{vendorCount}</strong> registered vendor{vendorCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* WhatsApp section */}
      {vendorsWithPhone.length > 0 ? (
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-shrink-0 flex items-center justify-between mb-3">
            <div>
              <p className="font-sans font-semibold text-[13px] text-gray-800">WhatsApp Follow-up</p>
              <p className="font-sans text-[11px] text-gray-400">
                {vendorsWithPhone.length} vendor{vendorsWithPhone.length !== 1 ? "s" : ""} with phone number
              </p>
            </div>
            <span className="text-[10px] font-sans text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              Click to open WhatsApp
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {vendorsWithPhone.map((v) => {
              const waMsg = buildWaMessage(v.companyName ?? v.name, request, respondUrl);
              const waUrl = buildWhatsAppUrl(v.phone!, waMsg);
              return (
                <div
                  key={v.userId}
                  className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2.5 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-gold/20 to-amber-gold/5 border border-amber-gold/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-amber-gold">
                      {(v.companyName ?? v.name).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-medium text-[12px] text-gray-800 truncate">
                      {v.companyName ?? v.name}
                    </p>
                    <p className="font-sans text-[11px] text-gray-400">{v.phone}</p>
                  </div>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 bg-[#25D366] text-white rounded-lg text-[11px] font-sans font-semibold hover:bg-[#20bd5a] transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MessageCircle size={11} />
                    WhatsApp
                  </a>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 group-hover:hidden p-1.5 text-gray-300 hover:text-emerald-500 transition-colors"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-gray-300 py-8">
          <Phone size={28} strokeWidth={1} />
          <p className="font-sans text-sm text-gray-400">No vendor phone numbers on file</p>
          <p className="font-sans text-[11px] text-gray-300">Vendors were notified by email only</p>
        </div>
      )}

      <div className="flex-shrink-0 pt-4 mt-4 border-t border-gray-100">
        <button
          onClick={onDone}
          className="w-full py-2.5 border border-gray-200 rounded-xl text-[13px] font-sans font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          View Past Requests
        </button>
      </div>
    </div>
  );
}

// ── MediaSlot ─────────────────────────────────────────────────────────────────
function MediaSlot({
  idx,
  isVideo,
  file,
  objectUrl,
  onSelect,
  onClear,
}: {
  idx: number;
  isVideo: boolean;
  file: File | null;
  objectUrl: string | null;
  onSelect: () => void;
  onClear: () => void;
}) {
  const hasFile = file !== null;
  return (
    <div
      className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
        hasFile
          ? "border-amber-gold/40 shadow-sm"
          : "border-dashed border-gray-200 hover:border-amber-gold/40 hover:bg-amber-gold/3"
      }`}
      style={{ aspectRatio: "1/1" }}
      onClick={hasFile ? undefined : onSelect}
    >
      {hasFile ? (
        <>
          {isVideo ? (
            <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center gap-1.5">
              <Film size={20} className="text-amber-gold/70" />
              <p className="text-[9px] font-sans text-gray-400 truncate px-2 text-center max-w-full">
                {file!.name}
              </p>
            </div>
          ) : objectUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={objectUrl} alt={`ref ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <ImageIcon size={18} className="text-gray-400" />
            </div>
          )}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <X size={9} />
          </button>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-300">
          {isVideo ? <Film size={18} /> : <UploadCloud size={16} />}
          <span className="text-[9px] font-sans font-medium text-center px-1 leading-tight">
            {isVideo ? "Video" : `Photo ${idx + 1}`}
          </span>
        </div>
      )}
    </div>
  );
}

// ── BroadcastForm ─────────────────────────────────────────────────────────────
const TOTAL_SLOTS = 7; // 6 images + 1 video

function BroadcastForm({ onSent }: {
  onSent: (result: {
    requestId: string; vendorCount: number; vendors: BroadcastVendor[];
    formData: { title: string; category: string; quantity: string; unit: string; targetCity: string; description: string; budgetMin: number | null; budgetMax: number | null };
  }) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "", category: "Marble", description: "", quantity: "",
    unit: "sqft", targetCity: "", budgetMin: "", budgetMax: "",
  });

  // Media state — 6 images (idx 0–5) + 1 video (idx 6)
  const [mediaFiles, setMediaFiles] = useState<(File | null)[]>(Array(TOTAL_SLOTS).fill(null));
  const [objectUrls, setObjectUrls] = useState<(string | null)[]>(Array(TOTAL_SLOTS).fill(null));
  const fileRefs = useRef<Array<HTMLInputElement | null>>(Array.from({ length: TOTAL_SLOTS }, () => null));

  // Cleanup object URLs on unmount
  useEffect(() => {
    const urls = objectUrls;
    return () => urls.forEach((u) => u && URL.revokeObjectURL(u));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFileSelect(idx: number, file: File) {
    if (objectUrls[idx]) URL.revokeObjectURL(objectUrls[idx]!);
    const url = idx < 6 ? URL.createObjectURL(file) : null;
    setObjectUrls((prev) => { const n = [...prev]; n[idx] = url; return n; });
    setMediaFiles((prev) => { const n = [...prev]; n[idx] = file; return n; });
  }

  function handleFileClear(idx: number) {
    if (objectUrls[idx]) URL.revokeObjectURL(objectUrls[idx]!);
    setObjectUrls((prev) => { const n = [...prev]; n[idx] = null; return n; });
    setMediaFiles((prev) => { const n = [...prev]; n[idx] = null; return n; });
  }

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError("Product title is required."); return; }
    setError("");

    startTransition(async () => {
      // 1. Upload media if any files selected
      let mediaUrls: string[] = [];
      const filesToUpload = mediaFiles.filter(Boolean) as File[];
      if (filesToUpload.length > 0) {
        const fd = new FormData();
        filesToUpload.forEach((f) => fd.append("files", f));
        const { urls } = await uploadRequestMedia(fd);
        mediaUrls = urls;
      }

      // 2. Create broadcast request
      const result = await createProductRequest({
        title:       form.title.trim(),
        category:    form.category,
        description: form.description.trim(),
        quantity:    form.quantity.trim(),
        unit:        form.unit,
        targetCity:  form.targetCity.trim(),
        budgetMin:   form.budgetMin ? parseFloat(form.budgetMin) : null,
        budgetMax:   form.budgetMax ? parseFloat(form.budgetMax) : null,
        mediaUrls,
      });

      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      onSent({
        requestId:   result.requestId!,
        vendorCount: result.vendorCount ?? 0,
        vendors:     result.vendors ?? [],
        formData: {
          title:       form.title.trim(),
          category:    form.category,
          description: form.description.trim(),
          quantity:    form.quantity.trim(),
          unit:        form.unit,
          targetCity:  form.targetCity.trim(),
          budgetMin:   form.budgetMin ? parseFloat(form.budgetMin) : null,
          budgetMax:   form.budgetMax ? parseFloat(form.budgetMax) : null,
        },
      });
    });
  }

  const mediaCount = mediaFiles.filter(Boolean).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <FieldLabel>Product / Stone Required *</FieldLabel>
        <InputField
          placeholder="e.g. White Carrara Marble Tiles 600×600"
          value={form.title}
          onChange={(v) => set("title", v)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Category</FieldLabel>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full px-3 py-2.5 text-[13px] font-sans border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-gold/30 bg-white appearance-none cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel>Target City</FieldLabel>
          <InputField
            placeholder="e.g. Mumbai"
            value={form.targetCity}
            onChange={(v) => set("targetCity", v)}
          />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        <div className="col-span-3">
          <FieldLabel>Quantity</FieldLabel>
          <InputField
            placeholder="e.g. 500"
            value={form.quantity}
            onChange={(v) => set("quantity", v)}
          />
        </div>
        <div className="col-span-2">
          <FieldLabel>Unit</FieldLabel>
          <select
            value={form.unit}
            onChange={(e) => set("unit", e.target.value)}
            className="w-full px-3 py-2.5 text-[13px] font-sans border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-gold/30 bg-white appearance-none cursor-pointer"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Budget Min (₹ / {form.unit})</FieldLabel>
          <InputField
            placeholder="e.g. 80"
            type="number"
            value={form.budgetMin}
            onChange={(v) => set("budgetMin", v)}
          />
        </div>
        <div>
          <FieldLabel>Budget Max (₹ / {form.unit})</FieldLabel>
          <InputField
            placeholder="e.g. 150"
            type="number"
            value={form.budgetMax}
            onChange={(v) => set("budgetMax", v)}
          />
        </div>
      </div>

      <div>
        <FieldLabel>Additional Details</FieldLabel>
        <textarea
          placeholder="Thickness, finish, veining pattern, urgency, delivery requirements…"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className="w-full px-3 py-2.5 text-[13px] font-sans border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-gold/30 resize-none placeholder:text-gray-300 bg-white transition-all"
        />
      </div>

      {/* ── Reference Media ── */}
      <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <FieldLabel>Reference Photos &amp; Video</FieldLabel>
            <p className="text-[11px] font-sans text-gray-400 -mt-1">
              Optional — helps vendors understand exactly what you need
            </p>
          </div>
          {mediaCount > 0 && (
            <span className="text-[11px] font-sans font-semibold text-amber-gold bg-amber-gold/10 px-2.5 py-0.5 rounded-full">
              {mediaCount} file{mediaCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Grid: 6 images + 1 video */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: TOTAL_SLOTS }, (_, i) => {
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
                  file={mediaFiles[i]}
                  objectUrl={objectUrls[i]}
                  onSelect={() => fileRefs.current[i]?.click()}
                  onClear={() => handleFileClear(i)}
                />
              </React.Fragment>
            );
          })}
        </div>

        <p className="text-[10px] font-sans text-gray-400 mt-2.5 flex items-center gap-1">
          <ImageIcon size={10} className="text-gray-300" />
          Up to 6 photos · 1 video · Sent to vendors in email &amp; shown on portal
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-[12px] text-red-600 bg-red-50 rounded-xl px-3 py-2">
          <AlertCircle size={13} />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 py-3 bg-amber-gold text-white rounded-xl font-sans font-semibold text-[13px] hover:bg-amber-gold/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {isPending ? (
          <><Loader2 size={14} className="animate-spin" />
            {mediaCount > 0 ? "Uploading media & sending…" : "Sending to All Vendors…"}
          </>
        ) : (
          <><Send size={14} /> Send to All Registered Vendors</>
        )}
      </button>
    </form>
  );
}

// ── PastRequests ──────────────────────────────────────────────────────────────
function PastRequests({
  requests,
  loading,
  onSelect,
  onClose,
}: {
  requests: ProductRequest[];
  loading: boolean;
  onSelect: (r: ProductRequest) => void;
  onClose: (id: string) => void;
}) {
  const [closing, startClose] = useTransition();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 size={20} className="animate-spin text-amber-gold" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 text-gray-300 py-10">
        <Radio size={32} strokeWidth={1} />
        <p className="font-sans text-sm text-gray-400">No broadcasts sent yet</p>
        <p className="font-sans text-[11px] text-gray-300">Create your first product request above</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {requests.map((req) => (
        <div
          key={req.id}
          className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-amber-gold/20 hover:shadow-sm transition-all cursor-pointer group"
          onClick={() => onSelect(req)}
        >
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-1.5 h-10 rounded-full mt-0.5 ${
              req.status === "ACTIVE" ? "bg-emerald-400" : "bg-gray-200"
            }`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-sans font-semibold text-[13px] text-gray-900 truncate flex-1">
                  {req.title}
                </p>
                {req.responseCount > 0 && (
                  <span className="flex-shrink-0 flex items-center justify-center h-5 min-w-[20px] px-1.5 bg-amber-gold text-white text-[9px] font-bold rounded-full">
                    {req.responseCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[11px] font-sans text-gray-400">
                <span className="flex items-center gap-0.5">
                  <Tag size={10} />
                  {req.category}
                </span>
                {req.targetCity && (
                  <span className="flex items-center gap-0.5">
                    <MapPin size={10} />
                    {req.targetCity}
                  </span>
                )}
                <span className="flex items-center gap-0.5">
                  <Clock size={10} />
                  {fmtDate(req.createdAt)}
                </span>
              </div>
            </div>
            <ChevronRight size={14} className="flex-shrink-0 text-gray-300 group-hover:text-amber-gold transition-colors mt-1" />
          </div>

          {req.status === "ACTIVE" && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
              <span className="text-[11px] font-sans text-gray-400">
                {req.responseCount === 0
                  ? "Awaiting vendor responses"
                  : `${req.responseCount} vendor${req.responseCount > 1 ? "s" : ""} responded`}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startClose(async () => {
                    await closeProductRequest(req.id);
                    onClose(req.id);
                  });
                }}
                disabled={closing}
                className="text-[11px] font-sans text-gray-400 hover:text-red-500 transition-colors px-2 py-0.5 rounded-lg hover:bg-red-50"
              >
                Close request
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main ProductRequestBroadcast ──────────────────────────────────────────────
type View = "form" | "sent" | "requests" | "responses";

type SentState = {
  requestId: string;
  vendorCount: number;
  vendors: BroadcastVendor[];
  formData: {
    title: string; category: string; quantity: string; unit: string;
    targetCity: string; description: string; budgetMin: number | null; budgetMax: number | null;
  };
};

export function ProductRequestBroadcast() {
  const [view, setView] = useState<View>("form");
  const [tab, setTab] = useState<"new" | "past">("new");
  const [sentState, setSentState] = useState<SentState | null>(null);
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [requestsLoaded, setRequestsLoaded] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ProductRequest | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (tab === "past" && !requestsLoaded) {
      startTransition(async () => {
        const data = await getProductRequests();
        setRequests(data);
        setRequestsLoaded(true);
      });
    }
  }, [tab, requestsLoaded]);

  function handleSent(result: SentState) {
    setSentState(result);
    setView("sent");
    setRequestsLoaded(false);
  }

  function handleDoneFromSent() {
    setTab("past");
    setView("requests");
    setRequestsLoaded(false);
    startTransition(async () => {
      const data = await getProductRequests();
      setRequests(data);
      setRequestsLoaded(true);
    });
  }

  function handleSelectRequest(r: ProductRequest) {
    setSelectedRequest(r);
    setView("responses");
  }

  function handleCloseRequest(id: string) {
    setRequests((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: "CLOSED" as const } : r)
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-7 py-6">
      <div className="max-w-2xl mx-auto">

        {/* Tab switcher (hidden during sent/response view) */}
        <AnimatePresence mode="wait">
          {view !== "sent" && view !== "responses" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl mb-6 w-fit"
            >
              {(["new", "past"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t);
                    setView(t === "new" ? "form" : "requests");
                  }}
                  className={`relative px-4 py-1.5 rounded-lg text-[12px] font-sans font-medium transition-all ${
                    tab === t ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === t && (
                    <motion.div
                      layoutId="broadcastTab"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {t === "new" ? <><Radio size={12} /> New Broadcast</> : <><Users size={12} /> Past Requests</>}
                    {t === "past" && requests.length > 0 && (
                      <span className="flex items-center justify-center w-4 h-4 bg-amber-gold/15 text-amber-gold rounded-full text-[9px] font-bold">
                        {requests.length}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <AnimatePresence mode="wait">
          {view === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {/* Header card */}
              <div className="bg-gradient-to-r from-amber-gold/8 to-amber-gold/3 border border-amber-gold/15 rounded-2xl p-5 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-gold/15 border border-amber-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Radio size={16} className="text-amber-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-gray-900">Source a Product</h3>
                    <p className="font-sans text-[12px] text-gray-500 mt-0.5 leading-relaxed">
                      Enter the product details below. All registered vendors will receive an email instantly.
                      Vendors with phone numbers can also be contacted via WhatsApp.
                    </p>
                  </div>
                </div>
              </div>

              <BroadcastForm onSent={handleSent} />
            </motion.div>
          )}

          {view === "sent" && sentState && (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              style={{ height: "calc(100vh - 200px)" }}
              className="flex flex-col"
            >
              <SentPanel
                vendors={sentState.vendors}
                vendorCount={sentState.vendorCount}
                request={sentState.formData}
                requestId={sentState.requestId}
                onDone={handleDoneFromSent}
              />
            </motion.div>
          )}

          {view === "requests" && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <PastRequests
                requests={requests}
                loading={!requestsLoaded}
                onSelect={handleSelectRequest}
                onClose={handleCloseRequest}
              />
            </motion.div>
          )}

          {view === "responses" && selectedRequest && (
            <motion.div
              key="responses"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
              style={{ height: "calc(100vh - 200px)" }}
              className="flex flex-col"
            >
              <ResponsesPanel
                request={selectedRequest}
                onBack={() => {
                  setView("requests");
                  setSelectedRequest(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
