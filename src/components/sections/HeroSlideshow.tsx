"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, BadgeCheck, Camera, Search } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const AIImageSearchModal = dynamic(
  () => import("@/components/catalog/AIImageSearchModal").then((m) => ({ default: m.AIImageSearchModal })),
  { ssr: false }
);



// ─── Image-search drag zone inside the search bar ───────────────────────────
function ImageSearchZone({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      aria-label="Search by photo"
      className="group flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dashed border-stone-300 hover:border-amber-gold hover:bg-amber-gold/5 active:scale-95 transition-all duration-300 cursor-pointer bg-white"
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
    router.push(
      q.trim() ? `/products?q=${encodeURIComponent(q.trim())}` : "/products"
    );
  }, [q, router]);

  return (
    <div className="w-full max-w-[520px]">
      <p className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-stone-700 mb-3 ml-1">
        Search Products
      </p>

      <div className="group flex items-center bg-white rounded-2xl border-2 border-stone-300 hover:border-stone-500 focus-within:border-amber-gold transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden">

        {/* Search Icon */}
        <Search
          size={18}
          className="ml-4 text-stone-600 group-focus-within:text-amber-gold transition-colors shrink-0"
        />

        {/* Input */}
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go()}
          placeholder="Search marble, granite, finish..."
          className="flex-1 px-3 py-4 text-[14px] font-medium text-stone-900 placeholder:text-stone-500 bg-transparent focus:outline-none"
        />

        <div className="flex items-center gap-2 pr-2">

          {/* Search by Photo */}
          <button
            onClick={onOpenAI}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-stone-300 bg-stone-50 hover:bg-amber-50 hover:border-amber-gold transition-all duration-300"
          >
            <Camera
              size={16}
              className="text-stone-600 group-hover:text-amber-gold transition-colors"
            />

            <span className="text-[12px] font-semibold text-stone-700 group-hover:text-amber-gold whitespace-nowrap">
              Search by Photo
            </span>
          </button>

          {/* Search Button */}
          <button
            onClick={go}
            aria-label="Search"
            className="w-11 h-11 rounded-xl bg-amber-gold text-white flex items-center justify-center hover:bg-[#A6754A] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
          >
            <ArrowRight size={17} />
          </button>

        </div>
      </div>
    </div>
  );
}
// ─── Main Hero ───────────────────────────────────────────────────────────────
export function HeroSlideshow() {
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <>
    <section
  className="relative w-full h-[380px] md:h-[450px] lg:h-[520px] overflow-hidden flex items-center bg-stone-100"
>
        
        {/* ── BACKGROUND IMAGE ── */}
       {/* ── BACKGROUND IMAGE ── */}
<div className="absolute inset-0 z-0">
  <SafeImage
    src="/images/stonamart_background.png"
    alt="Premium stone interior background"
    fill
    priority
    className="object-cover object-center"
  />
  {/* Gradients to ensure text readability on the left side while keeping the right side clear */}
  <div className="absolute inset-0 bg-white/20 md:bg-transparent" />
  <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent md:w-3/4 lg:w-2/3" />
</div>

        {/* ── FOREGROUND CONTENT ── */}
        <div className="relative z-10 w-full px-8 sm:px-12 lg:px-16 xl:px-20 py-16">
          <div className="max-w-[550px]">
            
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-amber-gold mb-5"
            >
              Premium Quality
            </motion.p>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="font-serif font-bold text-stone-950 leading-[1.05] mb-5"
              style={{ fontSize: "clamp(2.2rem, 4.2vw, 3.4rem)" }}
            >
              Marbles & Granites
              <br />
              That Define <span className="text-amber-gold">Luxury</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="font-sans text-[14.5px] text-stone-700 font-medium leading-relaxed mb-8 max-w-[420px]"
            >
              Explore our exclusive range of premium marbles and granites. Perfect for elegance that lasts forever.
            </motion.p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <Link
                href="#categories"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-stone-950 text-white font-sans font-semibold text-[13px] hover:bg-stone-800 active:scale-[0.98] transition-all duration-200 shadow-lg"
              >
                SHOP MARBLES <ArrowRight size={14} />
              </Link>
              <Link
                href="#categories"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white border border-stone-300 text-stone-700 font-sans font-semibold text-[13px] hover:border-stone-950 hover:text-stone-950 active:scale-[0.98] transition-all duration-200 shadow-md"
              >
                SHOP GRANITES <ArrowRight size={14} />
              </Link>
            </div>

            {/* Search Container with Glassmorphism */}
            <div className="bg-white/40 backdrop-blur-md p-5 -ml-5 rounded-3xl inline-block w-full max-w-[540px] border border-white/50 shadow-xl">
              <HeroSearch onOpenAI={() => setAiOpen(true)} />
            </div>

            {/* Trust strip */}
          
            
          </div>
        </div>
      </section>

      <AIImageSearchModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}