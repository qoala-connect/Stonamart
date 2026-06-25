"use client";

import React, { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, FileText, MessageCircle, X, Send, CheckCircle2,
  User, Phone, Mail, MapPin, ChevronDown, Clock, Shield, Loader2,
  LogIn, Sparkles,
} from "lucide-react";
import Link from "next/link";
import type { CatalogProduct } from "@/components/catalog/types";
import { authClient } from "@/lib/auth-client";
import { submitInquiry } from "@/lib/inquiry-actions";

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune",
  "Jaipur", "Chennai", "Kolkata", "Ahmedabad", "Surat",
];

const inputCls =
  "w-full px-3.5 py-2.5 text-sm font-sans bg-stone-50 border border-stone-200 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all duration-200";

// ─── Authenticated (logged-in customer) inquiry panel ─────────────────────────
function AuthInquiryForm({
  productId,
  productName,
  user,
  onSuccess,
}: {
  productId: string;
  productName: string;
  user: { name: string; email: string };
  onSuccess: () => void;
}) {
  const [message, setMessage] = useState(
    `Hi, I am interested in ${productName} and would like to know more about pricing and availability.`
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitInquiry({ productId, message });
      if (result.ok) {
        onSuccess();
      } else {
        setError(result.error ?? "Failed to submit inquiry.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
      {/* One-click indicator */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <User size={13} className="text-emerald-600" />
        </div>
        <div className="min-w-0">
          <p className="text-[12.5px] font-sans font-semibold text-emerald-800 truncate">{user.name}</p>
          <p className="text-[11px] font-sans text-emerald-500 truncate">{user.email}</p>
        </div>
        <span className="ml-auto flex items-center gap-1 text-[10px] font-sans font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
          <Sparkles size={9} />
          Logged in
        </span>
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-[10.5px] font-sans font-semibold uppercase tracking-[0.1em] text-stone-500">
          <MessageSquare size={10} />
          Your Message
        </label>
        <textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className={`${inputCls} resize-none`}
        />
      </div>

      {error && (
        <p className="text-[12px] font-sans text-red-500 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
          {error}
        </p>
      )}

      <motion.button
        type="submit"
        disabled={isPending}
        whileHover={!isPending ? { scale: 1.015 } : undefined}
        whileTap={!isPending ? { scale: 0.985 } : undefined}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-stone-900 text-white text-[13.5px] font-sans font-semibold rounded-xl hover:bg-stone-800 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.2)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        {isPending ? "Submitting…" : "Send Inquiry"}
      </motion.button>

      <div className="flex items-center justify-center gap-4 pt-1 pb-1">
        <span className="flex items-center gap-1.5 text-[11px] font-sans text-stone-400">
          <Shield size={11} className="text-stone-300" />
          Your data is safe
        </span>
        <span className="w-px h-3 bg-stone-200" />
        <span className="flex items-center gap-1.5 text-[11px] font-sans text-stone-400">
          <Clock size={11} className="text-stone-300" />
          Response within 2 hrs
        </span>
      </div>
    </form>
  );
}

// ─── Guest inquiry form (not logged in) ──────────────────────────────────────
function GuestInquiryForm({
  productName,
  onSuccess,
}: {
  productName: string;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", city: "",
    message: `Hi, I'm interested in ${productName} and would like more details on pricing and availability.`,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
      {/* Sign-in nudge */}
      <Link
        href="/customer/auth"
        className="flex items-center gap-2.5 px-3.5 py-2.5 bg-amber-50 border border-amber-200/70 rounded-xl hover:bg-amber-100/60 transition-colors group"
      >
        <LogIn size={14} className="text-amber-600 flex-shrink-0" />
        <span className="text-[12px] font-sans text-amber-800">
          <span className="font-semibold">Sign in</span> to inquire in one click
        </span>
        <span className="ml-auto text-amber-400 group-hover:translate-x-0.5 transition-transform">→</span>
      </Link>

      {/* Row 1: Name + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[10.5px] font-sans font-semibold uppercase tracking-[0.1em] text-stone-500">
            <User size={10} /> Full Name
          </label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Rahul Sharma" className={inputCls} />
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[10.5px] font-sans font-semibold uppercase tracking-[0.1em] text-stone-500">
            <Phone size={10} /> Phone
          </label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 98765 43210" className={inputCls} />
        </div>
      </div>

      {/* Row 2: Email + City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[10.5px] font-sans font-semibold uppercase tracking-[0.1em] text-stone-500">
            <Mail size={10} /> Email
          </label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@company.com" className={inputCls} />
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[10.5px] font-sans font-semibold uppercase tracking-[0.1em] text-stone-500">
            <MapPin size={10} /> City
          </label>
          <div className="relative">
            <select name="city" value={form.city} onChange={handleChange} required className={`${inputCls} appearance-none pr-8`}>
              <option value="">Select city</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-[10.5px] font-sans font-semibold uppercase tracking-[0.1em] text-stone-500">
          <MessageSquare size={10} /> Message
        </label>
        <textarea name="message" value={form.message} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} />
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-stone-900 text-white text-[13.5px] font-sans font-semibold rounded-xl hover:bg-stone-800 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
      >
        <Send size={15} /> Send Inquiry
      </motion.button>

      <div className="flex items-center justify-center gap-4 pt-1 pb-1">
        <span className="flex items-center gap-1.5 text-[11px] font-sans text-stone-400">
          <Shield size={11} className="text-stone-300" /> Your data is safe
        </span>
        <span className="w-px h-3 bg-stone-200" />
        <span className="flex items-center gap-1.5 text-[11px] font-sans text-stone-400">
          <Clock size={11} className="text-stone-300" /> Response within 2 hrs
        </span>
      </div>
    </form>
  );
}

// ─── Inquire Modal ─────────────────────────────────────────────────────────────
function InquireModal({
  isOpen,
  onClose,
  product,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: CatalogProduct;
}) {
  const [submitted, setSubmitted] = useState(false);
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const loggedInCustomer =
    session?.user?.role === "CUSTOMER"
      ? (session.user as { id: string; name: string; email: string; role: string })
      : null;

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function handleClose() {
    onClose();
    setTimeout(() => setSubmitted(false), 400);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
        >
          <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-[8px]" onClick={handleClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.32)] flex flex-col max-h-[90vh] overflow-hidden"
          >
            <div className="h-[3px] w-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 shrink-0" />

            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-stone-100 shrink-0">
              <div className="flex-1 min-w-0 pr-3">
                <p className="text-amber-600 font-sans text-[10px] font-bold uppercase tracking-[0.22em] mb-0.5">
                  Stone Inquiry
                </p>
                <h3 className="font-serif text-[1.18rem] font-bold text-stone-900 leading-snug truncate">
                  {product.name}
                </h3>
                <p className="font-sans text-[12px] text-stone-400 mt-0.5">
                  {loggedInCustomer
                    ? "Your details are pre-filled — just review and send"
                    : "Share your details — we'll respond within 2 hours"}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl border border-stone-200 text-stone-400 hover:bg-stone-100 hover:text-stone-700 hover:border-stone-300 transition-all duration-200"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 overscroll-contain">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="px-6 py-14 flex flex-col items-center text-center"
                  >
                    <motion.div
                      initial={{ scale: 0.4 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.08 }}
                      className="w-16 h-16 bg-emerald-50 border-2 border-emerald-100 rounded-full flex items-center justify-center mb-5"
                    >
                      <CheckCircle2 size={30} className="text-emerald-500" />
                    </motion.div>
                    <h4 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                      Inquiry Submitted!
                    </h4>
                    <p className="font-sans text-sm text-stone-500 max-w-[280px] leading-relaxed mb-8">
                      Your inquiry about{" "}
                      <span className="font-semibold text-stone-800">{product.name}</span>{" "}
                      has been submitted successfully. Our team will contact you within 2 hours.
                    </p>
                    {loggedInCustomer && (
                      <Link
                        href="/account?tab=inquiries"
                        onClick={handleClose}
                        className="mb-3 text-[12.5px] font-sans text-amber-600 hover:text-amber-700 underline underline-offset-2"
                      >
                        View my inquiries →
                      </Link>
                    )}
                    <motion.button
                      onClick={handleClose}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-8 py-3 bg-stone-900 text-white text-sm font-sans font-semibold rounded-xl hover:bg-stone-800 transition-colors"
                    >
                      Done
                    </motion.button>
                  </motion.div>
                ) : sessionPending ? (
                  <motion.div key="loading" className="px-6 py-10 flex items-center justify-center">
                    <Loader2 size={22} className="animate-spin text-stone-300" />
                  </motion.div>
                ) : loggedInCustomer ? (
                  <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <AuthInquiryForm
                      productId={product.id}
                      productName={product.name}
                      user={loggedInCustomer}
                      onSuccess={() => setSubmitted(true)}
                    />
                  </motion.div>
                ) : (
                  <motion.div key="guest" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <GuestInquiryForm
                      productName={product.name}
                      onSuccess={() => setSubmitted(true)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Action Stack ──────────────────────────────────────────────────────────────
interface ActionStackProps {
  product: CatalogProduct;
}

export function ActionStack({ product }: ActionStackProps) {
  const [inquireOpen, setInquireOpen] = useState(false);

  const waMsg = encodeURIComponent(
    `Hi, I'm interested in ${product.name} (${product.materialType}, ${product.finish}, ${product.thickness}) from Stonamart. Could you share availability and pricing details?`
  );
  const waUrl = `https://wa.me/919876543210?text=${waMsg}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18 }}
        className="flex flex-col gap-3"
      >
        {/* Primary: Inquire */}
        <motion.button
          onClick={() => setInquireOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2.5 py-4 bg-stone-950 text-white font-sans font-semibold rounded-2xl hover:bg-stone-800 transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.14)]"
        >
          <MessageSquare size={16} />
          Inquire About This Stone
        </motion.button>

        {/* Secondary: RFQ */}
        <Link href="/rfq" className="w-full block">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 border-2 border-stone-200 text-stone-600 font-sans font-semibold rounded-2xl hover:border-amber-400 hover:text-amber-600 transition-all duration-200 cursor-pointer"
          >
            <FileText size={16} />
            Request a Custom Quote
          </motion.div>
        </Link>

        {/* WhatsApp CTA */}
        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="w-full block">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#25D366]/10 border border-[#25D366]/30 text-[#1a8a50] font-sans font-semibold rounded-2xl hover:bg-[#25D366]/18 transition-colors cursor-pointer"
          >
            <MessageCircle size={16} />
            Chat on WhatsApp
          </motion.div>
        </a>

        <p className="text-center text-[10px] font-sans text-stone-400 mt-0.5">
          Verified supplier · No hidden charges · Responds within 2 hours
        </p>
      </motion.div>

      <InquireModal
        isOpen={inquireOpen}
        onClose={() => setInquireOpen(false)}
        product={product}
      />
    </>
  );
}
