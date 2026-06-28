"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/lib/utils";

// ─── Photo slideshow for the left panel ──────────────────────────────────────
// Uses a static elegant marble slab as default, each auth page can override
interface AuthLayoutProps {
  children: React.ReactNode;
  headline?: string;
  subline?: string;
  panelPhoto?: string;
  panelFeatures?: string[];
  panelTheme?: "dark" | "light";
  panelAccent?: string; // e.g. gold for vendor, slate for admin
  quote?: string;
  quoteAttrib?: string;
}

const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1722605090433-41d1183a792d?w=1200&q=85";

export function AuthLayout({
  children,
  headline = "Welcome Back!",
  subline = "Discover premium stones for your dream spaces.",
  panelPhoto = DEFAULT_PHOTO,
  panelFeatures,
  panelTheme = "dark",
  panelAccent = "#B8865A",
  quote,
  quoteAttrib,
}: AuthLayoutProps) {
  return (
    <div className="fixed inset-0 flex font-sans bg-white overflow-hidden">

      {/* ── Left: full-height marble panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-[46%] relative flex-col overflow-hidden shrink-0">
        {/* Background photo */}
        <SafeImage
          src={panelPhoto}
          alt="Premium stone interior"
          fill
          sizes="46vw"
          priority
          className="object-cover"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              panelTheme === "dark"
                ? "linear-gradient(160deg, rgba(8,6,4,0.94) 0%, rgba(14,11,8,0.82) 50%, rgba(6,5,3,0.96) 100%)"
                : "linear-gradient(160deg, rgba(18,14,10,0.88) 0%, rgba(12,10,8,0.75) 50%, rgba(14,11,8,0.90) 100%)",
          }}
        />

        {/* Panel content */}
        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
          {/* Logo */}
          <Link href="/" className="inline-block shrink-0">
            <span className="font-serif text-[1.3rem] font-bold text-white">
              Stona<span style={{ color: panelAccent }}>mart</span>
            </span>
          </Link>

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center py-10">
            {/* Pill badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border w-fit mb-6"
              style={{ borderColor: `${panelAccent}45`, background: `${panelAccent}14` }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: panelAccent }} />
              <span
                className="font-sans text-[10px] font-bold uppercase tracking-[0.22em]"
                style={{ color: panelAccent }}
              >
                Premium Marketplace
              </span>
            </div>

            <h2 className="font-serif text-3xl xl:text-[2.1rem] font-bold text-white leading-[1.2] mb-3">
              {headline}
            </h2>
            <p className="font-sans text-[13.5px] text-white/50 leading-relaxed mb-8 max-w-[280px]">
              {subline}
            </p>

            {panelFeatures && panelFeatures.length > 0 && (
              <ul className="space-y-3">
                {panelFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[13px] font-sans text-white/72">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `${panelAccent}25`, border: `1.5px solid ${panelAccent}55` }}
                    >
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5 3.5-3.5" stroke={panelAccent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {quote && (
              <figure className="mt-8 max-w-[300px] border-l-2 pl-4" style={{ borderColor: `${panelAccent}66` }}>
                <blockquote className="font-serif text-lg leading-snug text-white/80">
                  &ldquo;{quote}&rdquo;
                </blockquote>
                {quoteAttrib && (
                  <figcaption className="mt-3 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                    {quoteAttrib}
                  </figcaption>
                )}
              </figure>
            )}
          </div>

          {/* Footer */}
          <p className="font-sans text-[11px] text-white/25 shrink-0">
            © {new Date().getFullYear()} Stonamart · Premium Marbles &amp; Granites
          </p>
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="flex-1 flex flex-col bg-white min-w-0">
        {/* Mobile / tablet top bar */}
        <div className="lg:hidden flex items-center justify-between px-5 sm:px-7 py-4 border-b border-stone-100 shrink-0">
          <Link href="/">
            <span className="font-serif text-[1.2rem] font-bold text-stone-950">
              Stona<span className="text-amber-gold">mart</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-[12px] font-sans font-medium text-stone-400 hover:text-stone-700 transition-colors"
          >
            ← Home
          </Link>
        </div>

        {/* Scrollable form area — overflows internally */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-5 sm:p-8 lg:p-10 xl:p-14">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full max-w-[400px] xl:max-w-[420px]"
            >
              {/* Back to home — desktop only, above the form */}
              <Link
                href="/"
                className="hidden lg:inline-flex items-center gap-1.5 text-[12px] font-sans font-medium text-stone-400 hover:text-stone-700 transition-colors mb-8"
              >
                ← Back to Home
              </Link>

              {/* Mobile headline — visible only when left panel is hidden */}
              <div className="lg:hidden mb-7">
                <h2 className="font-serif text-2xl font-bold text-stone-900 leading-snug">
                  {headline}
                </h2>
                <p className="font-sans text-[13px] text-stone-400 mt-1 leading-relaxed">
                  {subline}
                </p>
              </div>

              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Form primitives ──────────────────────────────────────────────────────────

export function FormField({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="mb-3.5">
      <label className="block text-[10.5px] font-sans font-semibold text-stone-400 uppercase tracking-[0.12em] mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-[11px] font-sans text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function AuthInput({
  className = "", error, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={cn(
        "w-full px-3.5 py-2.5 bg-white border text-[13px] font-sans text-stone-900 placeholder-stone-300 focus:outline-none transition-all duration-200 rounded-lg",
        error
          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
          : "border-stone-200 hover:border-stone-300 focus:border-amber-gold/60 focus:ring-2 focus:ring-amber-gold/12",
        className
      )}
    />
  );
}

export function AuthSelect({
  className = "", error, children, ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <select
      {...props}
      className={cn(
        "w-full px-3.5 py-2.5 bg-white border text-[13px] font-sans text-stone-900 focus:outline-none transition-all duration-200 appearance-none cursor-pointer rounded-lg",
        error
          ? "border-red-300"
          : "border-stone-200 hover:border-stone-300 focus:border-amber-gold/60 focus:ring-2 focus:ring-amber-gold/12",
        className
      )}
    >
      {children}
    </select>
  );
}

export function SubmitButton({
  pending, label, pendingLabel,
}: { pending: boolean; label: string; pendingLabel?: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 mt-1 font-sans font-bold text-[13px] uppercase tracking-wider bg-stone-950 text-white hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98]"
    >
      {pending && (
        <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      )}
      {pending ? (pendingLabel ?? "Please wait…") : label}
    </button>
  );
}

export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-stone-100" />
      <span className="text-[10px] font-sans text-stone-300 uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-stone-100" />
    </div>
  );
}
