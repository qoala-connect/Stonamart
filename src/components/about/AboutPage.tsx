"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  MapPin, Shield, Sparkles, TrendingUp, Users,
  CheckCircle2, ArrowRight, Star, Package, Award,
} from "lucide-react";
import { MarbleOverlay } from "@/components/ui";

// ─── Fade-up helper ───────────────────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Marble stone texture gradient ───────────────────────────────────────────
const HERO_BG = [
  "linear-gradient(155deg, transparent 0%, rgba(139,115,85,0.12) 35%, transparent 65%)",
  "linear-gradient(55deg, transparent 20%, rgba(201,169,97,0.07) 50%, transparent 76%)",
  "linear-gradient(165deg, #0a0a0a 0%, #141414 40%, #0e0e0e 70%, #1a1a1a 100%)",
].join(", ");

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "200+", label: "Stone varieties", icon: Package },
  { value: "18+",  label: "Origins worldwide", icon: MapPin },
  { value: "40+",  label: "Verified vendors", icon: Shield },
  { value: "12",   label: "Cities served", icon: TrendingUp },
];

// ─── Values ───────────────────────────────────────────────────────────────────
const VALUES = [
  {
    icon: Shield,
    title: "Verified Quality",
    body: "Every stone in our catalog passes a multi-point inspection before listing. We reject nearly 60% of vendor submissions that don't meet our standard.",
  },
  {
    icon: Sparkles,
    title: "Curated Selection",
    body: "We don't list everything — we list the right things. Our team personally evaluates each variety for consistency, finish, and suitability of application.",
  },
  {
    icon: Users,
    title: "Transparent Marketplace",
    body: "No hidden markups. No mystery pricing. Buyers see competitive market ranges; vendors compete fairly. Everyone wins when trust is the foundation.",
  },
  {
    icon: Award,
    title: "End-to-End Support",
    body: "From sample request to site delivery, our team is available on WhatsApp, email, and phone. We've turned every inquiry into a relationship.",
  },
];

// ─── Timeline ─────────────────────────────────────────────────────────────────
const TIMELINE = [
  {
    year: "2019",
    title: "The Problem We Saw",
    body: "Founders Arjun Mehta and Priya Nair, both interior designers, spent months chasing stone quotes for a Juhu villa — fragmented suppliers, opaque pricing, no accountability. They decided to fix it.",
  },
  {
    year: "2020",
    title: "First Catalog",
    body: "We launched with just 28 stone varieties from 4 Mumbai warehouses and a simple inquiry form. 200 inquiries in the first month told us we were onto something real.",
  },
  {
    year: "2022",
    title: "Vendor Network",
    body: "Expanded to 14 verified vendors across Mumbai, Delhi, and Bangalore. Introduced the vendor quality audit process that now benchmarks every supplier we onboard.",
  },
  {
    year: "2024",
    title: "National Reach",
    body: "200+ stone varieties. 40+ verified vendors. 12 cities with active delivery. ₹18 Cr+ in facilitated orders. And we're just getting started.",
  },
];


// ─── Main component ───────────────────────────────────────────────────────────
export function AboutPage() {
  return (
    <div className="font-sans">

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden py-28 md:py-36"
        style={{ background: HERO_BG }}
      >
        {/* SVG noise overlay */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.045]"
          style={{ mixBlendMode: "overlay" }}
        >
          <filter id="about-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#about-noise)" />
        </svg>

        {/* Gold veining lines */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.06]"
          viewBox="0 0 1200 500"
          preserveAspectRatio="xMidYMid slice"
        >
          <path d="M 0 120 Q 300 80 600 150 T 1200 100" stroke="#c9a961" strokeWidth="1.5" fill="none" />
          <path d="M 0 300 Q 400 250 700 320 T 1200 280" stroke="#c9a961" strokeWidth="1" fill="none" />
          <path d="M 200 0 Q 250 180 180 380" stroke="#8b7355" strokeWidth="0.8" fill="none" />
        </svg>

        {/* Gold left edge accent */}
        <div
          className="absolute top-0 left-0 h-full w-[3px]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, #c9a961 25%, #e8dcc4 55%, #c9a961 80%, transparent 100%)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-[10px] font-sans font-bold text-amber-gold/70 uppercase tracking-[0.28em] mb-4">
              Our Story
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-stone-light leading-[1.1] max-w-3xl">
              We built the marketplace we always wished existed.
            </h1>
            <p className="mt-6 font-sans text-[15px] text-stone-light/45 leading-relaxed max-w-xl">
              Stonamart is India&apos;s curated premium stone marketplace — connecting architects,
              designers, and builders with verified suppliers, transparent pricing, and genuine
              quality assurance.
            </p>

            <div className="flex items-center gap-4 mt-10 flex-wrap">
              <Link
                href="/products"
                className="flex items-center gap-2 px-6 py-3 bg-amber-gold text-stone-950 font-sans font-semibold text-sm rounded-xl hover:bg-amber-gold/85 transition-colors shadow-[0_4px_20px_rgba(201,169,97,0.3)]"
              >
                Browse Catalog
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/vendor/register"
                className="flex items-center gap-2 px-6 py-3 border border-white/15 text-white/70 font-sans font-semibold text-sm rounded-xl hover:border-white/30 hover:text-white transition-all"
              >
                Become a Vendor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar — White Carrara marble ── */}
      <section
        className="border-y border-stone-dark/8 relative overflow-hidden"
        style={{
          background: [
            "radial-gradient(ellipse at 30% 50%, rgba(201,169,97,0.06) 0%, transparent 55%)",
            "linear-gradient(155deg, #f9f7f4 0%, #f1ece5 50%, #f7f3ed 100%)",
          ].join(", "),
        }}
      >
        <MarbleOverlay variant="white" intensity={0.9} />
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <FadeUp key={stat.label} delay={i * 0.08}>
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-gold/10 flex items-center justify-center mb-1">
                      <Icon size={18} className="text-amber-gold" />
                    </div>
                    <p className="font-serif text-3xl font-bold text-stone-950 leading-none">
                      {stat.value}
                    </p>
                    <p className="font-sans text-[12.5px] text-stone-dark/45 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Mission — Cream Travertine ── */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          background: [
            "radial-gradient(ellipse at 20% 30%, rgba(201,169,97,0.08) 0%, transparent 55%)",
            "linear-gradient(145deg, #f0e7d8 0%, #e8dcc9 40%, #ede4d2 70%, #f0e8da 100%)",
          ].join(", "),
        }}
      >
        <MarbleOverlay variant="cream" intensity={0.85} />
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left: text */}
            <FadeUp>
              <p className="text-[10px] font-sans font-bold text-amber-gold uppercase tracking-[0.2em] mb-3">
                Our Mission
              </p>
              <h2 className="font-serif text-[2rem] md:text-[2.25rem] font-bold text-stone-950 leading-[1.15]">
                Make premium stone accessible — without compromising on trust.
              </h2>
              <p className="mt-5 font-sans text-[14.5px] text-stone-dark/55 leading-relaxed">
                Stone sourcing in India has always been opaque — scattered suppliers, wildly
                variable quality, zero price transparency. We&apos;re changing that by building
                a platform where every listing is verified, every price is fair, and every
                buyer knows exactly what they&apos;re getting.
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  "Quality audits on every vendor before listing",
                  "Price ranges derived from live market data",
                  "Dedicated support from inquiry to delivery",
                  "Zero commission hidden in buyer-facing prices",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 font-sans text-[13.5px] text-stone-dark/65">
                    <CheckCircle2 size={15} className="text-amber-gold flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeUp>

            {/* Right: stone slab visual */}
            <FadeUp delay={0.15}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl shadow-stone-dark/10">
                {/* Marble simulation */}
                <div
                  className="w-full h-full"
                  style={{
                    background: [
                      "linear-gradient(140deg, transparent 0%, rgba(139,115,85,0.12) 30%, transparent 60%)",
                      "linear-gradient(55deg, transparent 20%, rgba(180,155,120,0.09) 50%, transparent 76%)",
                      "linear-gradient(165deg, #f0ece4 0%, #e4ddd2 35%, #ede7dc 60%, #e0d8cc 100%)",
                    ].join(", "),
                  }}
                />
                {/* Veining overlay */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 480 360">
                  <path d="M 40 80 Q 160 60 240 120 T 480 90" stroke="#8b7355" strokeWidth="1.5" fill="none" />
                  <path d="M 0 200 Q 120 170 220 210 T 480 185" stroke="#8b7355" strokeWidth="1" fill="none" />
                  <path d="M 100 0 Q 140 100 110 240 T 180 360" stroke="#c9a961" strokeWidth="0.8" fill="none" />
                </svg>
                {/* Label */}
                <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-stone-dark/8">
                  <p className="font-sans text-[10px] font-bold text-stone-dark/40 uppercase tracking-widest mb-0.5">
                    Featured Stone
                  </p>
                  <p className="font-serif text-[15px] font-bold text-stone-950">Calacatta Oro</p>
                  <p className="font-sans text-[11px] text-stone-dark/40">Italy · Polished · 2cm</p>
                </div>
                {/* Star badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-amber-gold rounded-full px-3 py-1.5">
                  <Star size={11} className="text-stone-950 fill-stone-950" />
                  <span className="text-[11px] font-sans font-bold text-stone-950">Top Rated</span>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Values — White Carrara marble ── */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          background: [
            "radial-gradient(ellipse at 70% 30%, rgba(201,169,97,0.06) 0%, transparent 50%)",
            "linear-gradient(158deg, #f8f6f3 0%, #f0ebe4 40%, #f5f1ea 70%, #f9f6f2 100%)",
          ].join(", "),
        }}
      >
        <MarbleOverlay variant="white" intensity={0.95} />
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <FadeUp className="text-center mb-14">
            <p className="text-[10px] font-sans font-bold text-amber-gold uppercase tracking-[0.2em] mb-3">
              What We Stand For
            </p>
            <h2 className="font-serif text-[2rem] md:text-[2.25rem] font-bold text-stone-950 leading-[1.15]">
              Built on four principles
            </h2>
          </FadeUp>

          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <FadeUp key={v.title} delay={i * 0.1}>
                  <div className="p-6 rounded-2xl border border-stone-dark/8 bg-white/60 hover:border-amber-gold/30 hover:shadow-lg hover:shadow-stone-dark/5 transition-all duration-300 group backdrop-blur-sm">
                    <div className="w-10 h-10 rounded-xl bg-stone-950 flex items-center justify-center mb-4 group-hover:bg-amber-gold transition-colors duration-300">
                      <Icon size={17} className="text-white group-hover:text-stone-950 transition-colors duration-300" />
                    </div>
                    <h3 className="font-serif text-[1.1rem] font-bold text-stone-950 mb-2">
                      {v.title}
                    </h3>
                    <p className="font-sans text-[13.5px] text-stone-dark/55 leading-relaxed">
                      {v.body}
                    </p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Timeline — Silver Grey marble ── */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          background: [
            "radial-gradient(ellipse at 25% 25%, rgba(255,255,255,0.4) 0%, transparent 58%)",
            "linear-gradient(145deg, #dddad5 0%, #d4d0ca 38%, #e0dcd7 65%, #dbd8d2 100%)",
          ].join(", "),
        }}
      >
        <MarbleOverlay variant="grey" intensity={0.95} />
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <FadeUp className="mb-14">
            <p className="text-[10px] font-sans font-bold text-amber-gold uppercase tracking-[0.2em] mb-3">
              Our Journey
            </p>
            <h2 className="font-serif text-[2rem] md:text-[2.25rem] font-bold text-stone-950 leading-[1.15]">
              From a shared frustration to a national platform
            </h2>
          </FadeUp>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-stone-dark/10 md:left-1/2" />

            <div className="space-y-10">
              {TIMELINE.map((item, i) => (
                <FadeUp key={item.year} delay={i * 0.1}>
                  <div className={`relative flex gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    {/* Year bubble */}
                    <div className="relative z-10 flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-3">
                      <div className="w-10 h-10 rounded-full bg-stone-950 flex items-center justify-center shadow-md">
                        <span className="text-amber-gold text-[11px] font-sans font-bold">{item.year}</span>
                      </div>
                    </div>

                    {/* Card */}
                    <div className={`flex-1 md:w-[calc(50%-2.5rem)] md:px-0 ${i % 2 === 0 ? "md:pr-14 md:text-right" : "md:pl-14 md:ml-auto"}`}>
                      <div className="bg-white/65 rounded-2xl border border-stone-dark/8 px-6 py-5 shadow-sm relative overflow-hidden"><MarbleOverlay variant="grey" intensity={0.4} />
                        <h3 className="font-serif text-[1rem] font-bold text-stone-950 mb-1.5">
                          {item.title}
                        </h3>
                        <p className="font-sans text-[13px] text-stone-dark/55 leading-relaxed">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA — Black Nero Marquina marble ── */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background: [
            "radial-gradient(ellipse at 25% 25%, rgba(201,169,97,0.09) 0%, transparent 50%)",
            "linear-gradient(148deg, #0a0a0a 0%, #111111 45%, #0d0d0d 100%)",
          ].join(", "),
        }}
      >
        <MarbleOverlay variant="black" intensity={0.9} />
        {/* Noise */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" style={{ mixBlendMode: "overlay" }}>
          <filter id="cta-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#cta-noise)" />
        </svg>
        {/* Vein */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none" viewBox="0 0 1200 240">
          <path d="M 0 120 Q 400 80 700 130 T 1200 110" stroke="#c9a961" strokeWidth="1.5" fill="none" />
        </svg>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <FadeUp>
            <p className="text-amber-gold text-[10px] font-sans font-bold uppercase tracking-[0.25em] mb-4">
              Ready to get started?
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
              Discover stone for every vision.<br />No middlemen. No guesswork.
            </h2>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/products"
                className="flex items-center gap-2 px-7 py-3.5 bg-amber-gold text-stone-950 font-sans font-semibold text-sm rounded-xl hover:bg-amber-gold/85 transition-colors shadow-[0_4px_20px_rgba(201,169,97,0.3)]"
              >
                Explore Products
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/vendor/register"
                className="flex items-center gap-2 px-7 py-3.5 border border-white/15 text-white/70 font-sans font-semibold text-sm rounded-xl hover:border-white/30 hover:text-white transition-all"
              >
                List Your Inventory
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  );
}
