"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, BadgeCheck, Camera, Upload, X, Search } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const AIImageSearchModal = dynamic(
  () => import("@/components/catalog/AIImageSearchModal").then((m) => ({ default: m.AIImageSearchModal })),
  { ssr: false }
);

// 4 hero slides — all Unsplash free license
const SLIDES = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1633119713175-c53c29479984?w=1600&q=85",
    eyebrow: "Premium Quality",
    title: ["Marbles & Granites", "That Define Luxury"],
    sub: "Explore our exclusive range of premium marbles and granites. Perfect for elegance that lasts forever.",
    cta1: "Shop Marbles",
    cta2: "Shop Granites",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1722605090433-41d1183a792d?w=1600&q=85",
    eyebrow: "Luxury Interiors",
    title: ["Timeless Stone", "For Every Space"],
    sub: "From living rooms to lobbies — premium natural stone that transforms any surface into something extraordinary.",
    cta1: "Explore Collection",
    cta2: "Get a Quote",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?w=1600&q=85",
    eyebrow: "Direct from Quarries",
    title: ["India's Finest", "Stone Marketplace"],
    sub: "Sourced directly from Rajasthan, Gujarat, Karnataka and more. Verified quality, transparent pricing.",
    cta1: "Browse Catalog",
    cta2: "Become a Vendor",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1566041510394-cf7c8fe21800?w=1600&q=85",
    eyebrow: "100% Natural Stone",
    title: ["Craftsmanship", "That Lasts Centuries"],
    sub: "Premium-grade marble, granite, sandstone and slate — handpicked from the best quarries across India.",
    cta1: "See All Products",
    cta2: "Contact Us",
  },
];

const TRUST = [
  { icon: BadgeCheck, title: "Premium Quality",      sub: "100% Natural Stone"  },
  { icon: Truck,      title: "Free Delivery",         sub: "Across India"        },
  { icon: ShieldCheck,title: "Best Price Guarantee", sub: "Unbeatable Prices"   },
];

// ─── Image-search drag zone inside the search bar ───────────────────────────
// ─── Image-search drag zone inside the search bar ───────────────────────────
function ImageSearchZone({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      aria-label="Search by photo"
      className="group flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dashed border-stone-300 hover:border-amber-gold hover:bg-amber-gold/5 active:scale-95 transition-all duration-300 cursor-pointer"
      title="Search by photo — attach a picture of your stone"
    >
      <Camera size={15} className="text-stone-400 group-hover:text-amber-gold transition-colors duration-300" />
      <span className="font-sans text-[12px] font-medium text-stone-400 group-hover:text-amber-gold whitespace-nowrap transition-colors duration-300">
        Search by photo
      </span>
    </button>
  );
}

// ─── Search bar ──────────────────────────────────────────────────────────────
function HeroSearch({ onOpenAI }: { onOpenAI: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const go = useCallback(() => {
    router.push(q.trim() ? `/products?q=${encodeURIComponent(q.trim())}` : "/products");
  }, [q, router]);

  return (
    <div className="w-full max-w-[500px]">
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400 mb-2.5 ml-1">
        Search our catalog or upload a photo
      </p>
      
      {/* The Magic happens here: 
        Using focus-within to trigger borders and glowing ring effects 
        without needing React state 
      */}
      <div className="flex items-center bg-white rounded-2xl overflow-hidden transition-all duration-300 border-2 border-transparent focus-within:border-amber-gold/40 focus-within:ring-4 focus-within:ring-amber-gold/10 shadow-[0_4px_20px_rgba(0,0,0,0.06)] focus-within:shadow-[0_8px_30px_rgba(0,0,0,0.12)] group">
        
        <Search size={16} className="ml-4 text-stone-400 group-focus-within:text-amber-gold transition-colors shrink-0" />
        
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go()}
          placeholder="marble, granite, finish, city…"
          className="flex-1 px-3 py-3.5 text-[13.5px] font-sans text-stone-800 placeholder-stone-300 bg-transparent focus:outline-none"
        />
        
        <div className="flex items-center gap-1.5 pr-2 shrink-0">
          <ImageSearchZone onOpen={onOpenAI} />
          <button
            onClick={go}
            aria-label="Submit search"
            className="w-9 h-9 rounded-xl bg-amber-gold text-white flex items-center justify-center hover:bg-[#A6754A] active:scale-90 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Made the "Search by photo" text clickable for better UX */}
      <p className="font-sans text-[10.5px] text-stone-400 mt-3 ml-1">
        💡 Have a piece of stone? Click{" "}
        <button onClick={onOpenAI} className="text-amber-gold font-medium hover:underline transition-all">
          "Search by photo"
        </button>{" "}
        to find matching stones instantly
      </p>
    </div>
  );
}

// ─── Main Hero ───────────────────────────────────────────────────────────────
export function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[current];

  return (
    <>
      <section className="relative overflow-hidden bg-white" style={{ minHeight: 580 }}>
        <div className="grid lg:grid-cols-2" style={{ minHeight: 580 }}>

          {/* ── LEFT: content panel with marble texture background ── */}
          <div className="relative flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 py-16 lg:py-0 overflow-hidden">
            {/* Very subtle marble texture */}
            <div className="absolute inset-0">
              <SafeImage
                src="https://images.unsplash.com/photo-1566041510394-cf7c8fe21800?w=1200&q=60"
                alt=""
                fill
                sizes="50vw"
                priority
                className="object-cover"
                style={{ opacity: 0.28 }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(110deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.94) 55%, rgba(255,255,255,0.82) 100%)" }}
              />
            </div>

            <div className="relative z-10 max-w-[520px]">
              {/* Eyebrow */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`eyebrow-${slide.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35 }}
                  className="font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-amber-gold mb-5"
                >
                  {slide.eyebrow}
                </motion.p>
              </AnimatePresence>

              {/* Headline */}
              <AnimatePresence mode="wait">
                <motion.h1
                  key={`h1-${slide.id}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="font-serif font-bold text-stone-950 leading-[1.05] mb-5"
                  style={{ fontSize: "clamp(2.2rem, 4.2vw, 3.4rem)" }}
                >
                  {slide.title[0]}
                  <br />
                  That Define <span className="text-amber-gold">Luxury</span>
                </motion.h1>
              </AnimatePresence>

              {/* Subtitle */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`sub-${slide.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="font-sans text-[14.5px] text-stone-500 leading-relaxed mb-8 max-w-[400px]"
                >
                  {slide.sub}
                </motion.p>
              </AnimatePresence>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 mb-10">
                <Link
                  href="#categories"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-stone-950 text-white font-sans font-semibold text-[13px] hover:bg-stone-800 active:scale-[0.98] transition-all duration-200"
                >
                  SHOP MARBLES <ArrowRight size={14} />
                </Link>
                <Link
                  href="#categories"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 border border-stone-300 text-stone-700 font-sans font-semibold text-[13px] hover:border-stone-950 hover:text-stone-950 active:scale-[0.98] transition-all duration-200"
                >
                  SHOP GRANITES <ArrowRight size={14} />
                </Link>
              </div>

              {/* Search with image-search */}
              <HeroSearch onOpenAI={() => setAiOpen(true)} />

              {/* Trust strip */}
              <div className="flex flex-wrap items-center gap-x-7 gap-y-3 mt-10 pt-8 border-t border-stone-100">
                {TRUST.map(({ icon: Icon, title, sub }) => (
                  <div key={title} className="flex items-center gap-2">
                    <Icon size={18} strokeWidth={1.5} className="text-amber-gold shrink-0" />
                    <div>
                      <p className="text-[12px] font-semibold text-stone-800 leading-tight">{title}</p>
                      <p className="text-[10.5px] text-stone-400">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: sliding photo panel ── */}
          <div className="relative overflow-hidden" style={{ minHeight: 440 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0"
              >
                <SafeImage
                  src={slide.img}
                  alt="Premium stone interior"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={slide.id === 1}
                  className="object-cover object-center"
                />
              </motion.div>
            </AnimatePresence>

            {/* Slide indicator dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="rounded-full transition-all duration-400"
                  style={{
                    width: i === current ? 22 : 7,
                    height: 7,
                    background: i === current ? "#fff" : "rgba(255,255,255,0.45)",
                  }}
                />
              ))}
            </div>

            {/* Prev/Next arrows */}
            <button
              onClick={() => setCurrent((p) => (p - 1 + SLIDES.length) % SLIDES.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/35 transition-all z-20"
            >
              <ArrowRight size={15} className="rotate-180" />
            </button>
            <button
              onClick={() => setCurrent((p) => (p + 1) % SLIDES.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/35 transition-all z-20"
            >
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      <AIImageSearchModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
