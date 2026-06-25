"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import {
  MapPin, Shield, Sparkles, TrendingUp, Users,
  CheckCircle2, ArrowRight, Star, Package, Award,
} from "lucide-react";

// ─── Real stone photography (Unsplash, free license) ──────────────────────────
const PHOTOS = {
  heroKitchen: "https://images.unsplash.com/photo-1633119713175-c53c29479984?w=1600&q=80",
  greyMarble: "https://images.unsplash.com/photo-1704530953106-9cdd4342dd36?w=1200&q=80",
};

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
      <section className="relative overflow-hidden py-28 md:py-36">
        {/* Real photo background */}
        <div className="absolute inset-0">
          <SafeImage
            src={PHOTOS.heroKitchen}
            alt="Modern kitchen with marble countertops"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#221c16]/92 via-[#221c16]/80 to-[#221c16]/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1712]/70 via-transparent to-transparent" />
        </div>

        {/* Gold left edge accent */}
        <div
          className="absolute top-0 left-0 h-full w-[3px]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, #B8865A 25%, #E8DCC4 55%, #B8865A 80%, transparent 100%)",
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
            <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.1] max-w-3xl">
              We built the marketplace we always wished existed.
            </h1>
            <p className="mt-6 font-sans text-[15px] text-white/55 leading-relaxed max-w-xl">
              Stonamart is India&apos;s curated premium stone marketplace — connecting architects,
              designers, and builders with verified suppliers, transparent pricing, and genuine
              quality assurance.
            </p>

            <div className="flex items-center gap-4 mt-10 flex-wrap">
              <Link
                href="/products"
                className="flex items-center gap-2 px-6 py-3 bg-amber-gold text-white font-sans font-semibold text-sm rounded-full hover:bg-[#A6754A] transition-colors shadow-[0_4px_20px_rgba(184,134,90,0.3)]"
              >
                Browse Catalog
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/vendor/register"
                className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white/80 font-sans font-semibold text-sm rounded-full hover:border-white/40 hover:text-white transition-all"
              >
                Become a Vendor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-stone-dark/8 bg-white">
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

      {/* ── Mission ── */}
      <section className="py-24 bg-[#FBF7F1]">
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

            {/* Right: real stone slab photo */}
            <FadeUp delay={0.15}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-luxury-lg">
                <SafeImage
                  src={PHOTOS.greyMarble}
                  alt="Premium grey-veined marble slab"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
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
                  <Star size={11} className="text-white fill-white" />
                  <span className="text-[11px] font-sans font-bold text-white">Top Rated</span>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 bg-white">
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
                  <div className="p-6 rounded-2xl border border-stone-dark/8 bg-[#FBF7F1] hover:border-amber-gold/30 hover:shadow-luxury-lg transition-all duration-300 group">
                    <div className="w-10 h-10 rounded-xl bg-stone-950 flex items-center justify-center mb-4 group-hover:bg-amber-gold transition-colors duration-300">
                      <Icon size={17} className="text-white transition-colors duration-300" />
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

      {/* ── Timeline ── */}
      <section className="py-24 bg-[#F6F0E6]">
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
                      <div className="bg-white rounded-2xl border border-stone-dark/8 px-6 py-5 shadow-sm">
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

      {/* ── CTA ── */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background: [
            "radial-gradient(ellipse at 25% 25%, rgba(184,134,90,0.12) 0%, transparent 50%)",
            "linear-gradient(148deg, #3a2f26 0%, #221c16 45%, #1c1712 100%)",
          ].join(", "),
        }}
      >
        {/* Vein accent */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none" viewBox="0 0 1200 240">
          <path d="M 0 120 Q 400 80 700 130 T 1200 110" stroke="#B8865A" strokeWidth="1.5" fill="none" />
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
                className="flex items-center gap-2 px-7 py-3.5 bg-amber-gold text-white font-sans font-semibold text-sm rounded-full hover:bg-[#A6754A] transition-colors shadow-[0_4px_20px_rgba(184,134,90,0.3)]"
              >
                Explore Products
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/vendor/register"
                className="flex items-center gap-2 px-7 py-3.5 border border-white/20 text-white/80 font-sans font-semibold text-sm rounded-full hover:border-white/40 hover:text-white transition-all"
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
