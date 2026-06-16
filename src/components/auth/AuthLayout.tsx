"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MarbleOverlay } from "@/components/ui";

// ─── Deep slate marble panel ───────────────────────────────────────────────────
const MARBLE_BASE = [
  "radial-gradient(ellipse at 15% 10%, rgba(201,169,97,0.16) 0%, transparent 55%)",
  "radial-gradient(ellipse at 85% 90%, rgba(180,145,75,0.10) 0%, transparent 48%)",
  "radial-gradient(ellipse at 70% 18%, rgba(255,255,255,0.03) 0%, transparent 35%)",
  "linear-gradient(132deg, rgba(40,50,70,0.9) 0%, transparent 55%)",
  "linear-gradient(312deg, rgba(25,32,50,0.8) 0%, transparent 55%)",
  "linear-gradient(168deg, #1a2035 0%, #1e2742 28%, #1a2035 55%, #151d2e 78%, #1a2035 100%)",
].join(", ");

interface AuthLayoutProps {
  headline: string;
  subline: string;
  quote?: string;
  quoteAttrib?: string;
  children: React.ReactNode;
}

export function AuthLayout({
  headline,
  subline,
  quote,
  quoteAttrib,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans">
      {/* ── Dark marble decorative pane ── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative hidden lg:flex lg:w-[46%] xl:w-[44%] flex-col justify-between p-14 overflow-hidden"
        style={{ background: MARBLE_BASE }}
      >
        {/* ── Marble veining SVG ── */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full"
          viewBox="0 0 480 960"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="vein-blur-soft">
              <feGaussianBlur stdDeviation="1.2" />
            </filter>
            <filter id="vein-blur-hair">
              <feGaussianBlur stdDeviation="0.4" />
            </filter>
            <filter id="vein-glow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ── Main white veins ── */}
          <g filter="url(#vein-blur-soft)">
            {/* Primary diagonal vein */}
            <path
              d="M -20 180 C 60 210, 140 190, 200 260 S 320 340, 360 480 S 380 640, 500 720"
              stroke="rgba(255,255,255,0.22)" strokeWidth="2.8" fill="none"
            />
            {/* Branch off primary */}
            <path
              d="M 200 260 C 230 280, 260 310, 300 380 S 340 440, 360 480"
              stroke="rgba(255,255,255,0.10)" strokeWidth="1.2" fill="none"
            />
            {/* Secondary diagonal vein — left edge */}
            <path
              d="M -10 420 C 40 430, 90 410, 130 450 S 170 510, 200 560 S 230 640, 270 700 S 310 780, 340 850"
              stroke="rgba(255,255,255,0.14)" strokeWidth="1.8" fill="none"
            />
            {/* Top right vein */}
            <path
              d="M 300 -20 C 340 60, 380 140, 400 220 S 420 340, 390 420"
              stroke="rgba(255,255,255,0.12)" strokeWidth="1.4" fill="none"
            />
            {/* Fine crossing vein */}
            <path
              d="M 60 320 C 120 330, 180 320, 240 340 S 320 360, 390 380"
              stroke="rgba(255,255,255,0.07)" strokeWidth="0.9" fill="none"
            />
          </g>

          {/* ── Gold / warm mineral veins ── */}
          <g filter="url(#vein-blur-hair)">
            {/* Main gold diagonal */}
            <path
              d="M 80 -10 C 100 80, 110 160, 140 240 S 180 340, 210 420 S 230 520, 260 620 S 290 740, 300 870"
              stroke="rgba(201,169,97,0.45)" strokeWidth="1.4" fill="none"
            />
            {/* Secondary gold vein */}
            <path
              d="M 340 0 C 360 100, 370 180, 350 280 S 310 380, 320 480 S 340 580, 320 680"
              stroke="rgba(201,169,97,0.28)" strokeWidth="0.9" fill="none"
            />
            {/* Gold branch */}
            <path
              d="M 140 240 C 160 250, 200 260, 240 280 S 290 310, 310 360"
              stroke="rgba(201,169,97,0.22)" strokeWidth="0.7" fill="none"
            />
            {/* Fine gold hair veins */}
            <path
              d="M 20 600 C 60 610, 100 600, 150 620 S 200 640, 260 650"
              stroke="rgba(201,169,97,0.18)" strokeWidth="0.5" fill="none"
            />
            <path
              d="M 380 480 C 400 500, 420 520, 450 540 S 470 580, 490 620"
              stroke="rgba(201,169,97,0.15)" strokeWidth="0.6" fill="none"
            />
          </g>

          {/* ── Glowing gold accent vein ── */}
          <g filter="url(#vein-glow)" opacity="0.5">
            <path
              d="M 80 -10 C 100 80, 110 160, 140 240 S 180 340, 210 420"
              stroke="rgba(201,169,97,0.5)" strokeWidth="0.8" fill="none"
            />
          </g>

          {/* ── Hair-thin white micro veins ── */}
          <g opacity="0.6">
            <path
              d="M 160 80 C 180 100, 200 130, 190 170 S 175 210, 200 260"
              stroke="rgba(255,255,255,0.09)" strokeWidth="0.5" fill="none"
            />
            <path
              d="M 40 700 C 80 710, 120 700, 160 720 S 200 740, 250 760"
              stroke="rgba(255,255,255,0.07)" strokeWidth="0.4" fill="none"
            />
            <path
              d="M 280 800 C 300 820, 330 840, 370 850 S 420 860, 460 880"
              stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" fill="none"
            />
            <path
              d="M 420 280 C 440 300, 460 320, 470 360"
              stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" fill="none"
            />
          </g>
        </svg>

        {/* ── Fractal noise grain texture ── */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full"
          style={{ opacity: 0.06, mixBlendMode: "overlay" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="auth-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.72"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#auth-grain)" />
        </svg>

        {/* ── Crystalline sparkle dots ── */}
        {[
          { cx: 88, cy: 242, r: 1.2, op: 0.5 },
          { cx: 212, cy: 418, r: 0.8, op: 0.4 },
          { cx: 142, cy: 240, r: 1.0, op: 0.6 },
          { cx: 304, cy: 362, r: 0.9, op: 0.35 },
          { cx: 260, cy: 625, r: 1.1, op: 0.45 },
          { cx: 82, cy: 601, r: 0.7, op: 0.3 },
        ].map((dot, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${(dot.cx / 480) * 100}%`,
              top: `${(dot.cy / 960) * 100}%`,
              width: `${dot.r * 2}px`,
              height: `${dot.r * 2}px`,
              background: "rgba(201,169,97,0.9)",
              boxShadow: `0 0 ${dot.r * 4}px rgba(201,169,97,0.6)`,
            }}
            animate={{ opacity: [dot.op, dot.op * 1.8, dot.op] }}
            transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          />
        ))}

        {/* ── Gold gradient left edge ── */}
        <div
          className="absolute top-0 left-0 h-full w-[3px]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, #c9a961 20%, #f0e4bc 48%, #e8d4a0 65%, #c9a961 82%, transparent 100%)",
          }}
        />

        {/* ── Subtle vignette at corners ── */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.45) 100%)",
          }}
        />

        {/* ── Content ── */}
        <div className="relative z-10">
          {/* Logo */}
          <Link href="/" className="inline-block group">
            <p className="text-[9.5px] font-sans font-bold text-amber-gold/50 uppercase tracking-[0.32em] mb-1.5">
              Premium Natural Stone
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-stone-light/8 border border-amber-gold/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="font-serif font-bold text-amber-gold text-base leading-none">S</span>
              </div>
              <h1 className="font-serif text-[1.7rem] font-bold text-stone-light tracking-tight group-hover:text-amber-gold transition-colors duration-300">
                Stonamart
              </h1>
            </div>
          </Link>

          {/* Divider */}
          <div className="mt-8 mb-8 w-12 h-px bg-amber-gold/30" />

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.65 }}
            className="font-serif text-[2.05rem] font-bold text-stone-light leading-[1.18] tracking-tight"
          >
            {headline}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.55 }}
            className="mt-4 font-sans text-[13.5px] text-stone-light/40 leading-relaxed max-w-[300px]"
          >
            {subline}
          </motion.p>

          {/* Stone quality badges */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {["Verified Vendors", "Premium Grades", "Pan-India Delivery"].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-gold/20 bg-amber-gold/6 text-[10.5px] font-sans font-semibold text-amber-gold/70 uppercase tracking-[0.1em]"
              >
                <span className="w-1 h-1 rounded-full bg-amber-gold/60 inline-block" />
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── Quote ── */}
        {quote && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="relative z-10"
          >
            <div className="p-5 rounded-2xl border border-stone-light/6 bg-stone-light/[0.04] backdrop-blur-sm">
              <p className="font-serif text-[13.5px] italic text-stone-light/50 leading-relaxed">
                &ldquo;{quote}&rdquo;
              </p>
              {quoteAttrib && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-6 h-px bg-amber-gold/40" />
                  <p className="font-sans text-[10.5px] text-amber-gold/55 font-semibold uppercase tracking-[0.12em]">
                    {quoteAttrib}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ── Form pane — White Carrara marble ── */}
      <div
        className="flex-1 flex flex-col justify-center items-center px-6 py-12 min-h-screen lg:min-h-0 overflow-y-auto relative"
        style={{
          background: [
            "radial-gradient(ellipse at 30% 20%, rgba(201,169,97,0.06) 0%, transparent 55%)",
            "radial-gradient(ellipse at 75% 80%, rgba(160,148,136,0.07) 0%, transparent 50%)",
            "linear-gradient(158deg, #f9f7f4 0%, #f1ece5 40%, #f6f2ec 70%, #f8f5f1 100%)",
          ].join(", "),
        }}
      >
        <MarbleOverlay variant="white" intensity={1.0} />

        {/* Mobile logo */}
        <div className="lg:hidden mb-10 text-center">
          <Link href="/">
            <p className="text-[9px] font-sans font-bold text-amber-gold/70 uppercase tracking-[0.22em] mb-0.5">
              Premium Natural Stone
            </p>
            <h1 className="font-serif text-2xl font-bold text-stone-950">Stonamart</h1>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md relative z-10"
        >
          {children}
        </motion.div>

        {/* Bottom attribution */}
        <p className="absolute bottom-5 font-sans text-[10.5px] text-stone-dark/20 tracking-wide">
          © 2025 Stonamart · Premium Stone Marketplace
        </p>
      </div>
    </div>
  );
}

// ─── Shared form primitives ───────────────────────────────────────────────────
export function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10.5px] font-sans font-bold text-stone-dark/45 uppercase tracking-[0.14em]">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[11px] font-sans text-red-500 font-medium flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </div>
  );
}

export function AuthInput({
  className = "",
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3.5 bg-white border rounded-xl text-[13.5px] font-sans text-stone-950 placeholder:text-stone-dark/22 focus:outline-none transition-all duration-200 shadow-sm ${
        error
          ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-400/12 bg-red-50/30"
          : "border-stone-dark/10 focus:border-amber-gold/50 focus:ring-2 focus:ring-amber-gold/10 hover:border-stone-dark/20"
      } ${className}`}
    />
  );
}

export function AuthSelect({
  className = "",
  error,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <select
      {...props}
      className={`w-full px-4 py-3.5 bg-white border rounded-xl text-[13.5px] font-sans text-stone-950 focus:outline-none transition-all duration-200 appearance-none cursor-pointer shadow-sm ${
        error
          ? "border-red-300 focus:border-red-400"
          : "border-stone-dark/10 focus:border-amber-gold/50 focus:ring-2 focus:ring-amber-gold/10 hover:border-stone-dark/20"
      } ${className}`}
    >
      {children}
    </select>
  );
}

export function SubmitButton({
  pending,
  label,
  pendingLabel,
}: {
  pending: boolean;
  label: string;
  pendingLabel?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="relative w-full py-3.5 font-sans font-semibold text-[14px] rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden group"
      style={{
        background: pending
          ? "#6b7280"
          : "linear-gradient(135deg, #c9a961 0%, #b8943f 50%, #c9a961 100%)",
        color: "#ffffff",
        boxShadow: pending
          ? "none"
          : "0 2px 16px rgba(201,169,97,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
      }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {pending && (
          <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-stone-light/30 border-t-amber-gold animate-spin" />
        )}
        {pending ? (pendingLabel ?? "Please wait…") : label}
      </span>
      {/* White shimmer sweep */}
      <span className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      {/* Top edge gloss */}
      <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
    </button>
  );
}

export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-stone-dark/8" />
      <span className="text-[10.5px] font-sans text-stone-dark/30 font-medium px-1">{label}</span>
      <div className="flex-1 h-px bg-stone-dark/8" />
    </div>
  );
}
