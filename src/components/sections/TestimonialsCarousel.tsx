"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Container, MarbleOverlay } from "@/components/ui";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: number;
  author: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  initials: string;
  avatarBg: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    author: "Rajesh Kumar",
    role: "Principal Architect",
    company: "Kumar & Associates",
    content:
      "Stonamart has transformed how we source premium stone. The quality is genuinely exceptional — every slab we've received has met the highest standards. Their team understands what architects need.",
    rating: 5,
    initials: "RK",
    avatarBg: "linear-gradient(135deg, #c9a961 0%, #8b7355 100%)",
  },
  {
    id: 2,
    author: "Priya Sharma",
    role: "Senior Interior Designer",
    company: "Design Studio Mumbai",
    content:
      "The variety of marble options is outstanding. I can find everything from classic Carrara to rare Calacatta Gold in one place. My clients are consistently impressed with the results.",
    rating: 5,
    initials: "PS",
    avatarBg: "linear-gradient(135deg, #1a1a1a 0%, #8b7355 100%)",
  },
  {
    id: 3,
    author: "Vikram Patel",
    role: "Construction Manager",
    company: "BuildTech Group",
    content:
      "Reliable delivery, verified quality, and competitive pricing ranges. For a project manager, Stonamart removes the guesswork entirely. We've sourced over 50,000 sq ft through them.",
    rating: 5,
    initials: "VP",
    avatarBg: "linear-gradient(135deg, #2a2a2a 0%, #c9a961 100%)",
  },
  {
    id: 4,
    author: "Anjali Mehta",
    role: "Hotel Owner & Developer",
    company: "Prestige Hospitality",
    content:
      "For our 5-star properties, only the finest stone works. Stonamart delivered Black Absolute and Calacatta Oro to our Jaipur property on time, within spec. Remarkable attention to detail.",
    rating: 5,
    initials: "AM",
    avatarBg: "linear-gradient(135deg, #8b7355 0%, #c9a961 100%)",
  },
  {
    id: 5,
    author: "Suresh Reddy",
    role: "Real Estate Developer",
    company: "Skyline Properties",
    content:
      "Sourcing stone for 200 luxury apartments used to be a nightmare. Stonamart's RFQ system got us competitive quotes in 24 hours and we saved 18% versus our previous supplier.",
    rating: 5,
    initials: "SR",
    avatarBg: "linear-gradient(135deg, #1d1d1d 0%, #8b7355 100%)",
  },
  {
    id: 6,
    author: "Neha Joshi",
    role: "Kitchen & Bath Designer",
    company: "Artisan Interiors",
    content:
      "The quartz selection on Stonamart is unmatched. I always find the right tone for each project. The price-range display gives clients realistic expectations without exposing margins.",
    rating: 5,
    initials: "NJ",
    avatarBg: "linear-gradient(135deg, #c9a961 0%, #1a1a1a 100%)",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} className="fill-amber-gold text-amber-gold" />
      ))}
    </div>
  );
}

interface TestimonialCardProps {
  t: Testimonial;
  index: number;
}

function TestimonialCard({ t, index }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="bg-white/70 border border-stone-dark/10 rounded-2xl p-7 flex flex-col gap-5 hover:bg-white/85 hover:border-amber-gold/30 hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
    >
      {/* Quote icon + stars */}
      <div className="flex items-start justify-between">
        <Quote size={28} className="text-amber-gold/50 flex-shrink-0 -scale-x-100" />
        <StarRating count={t.rating} />
      </div>

      {/* Content */}
      <p className="font-sans text-stone-dark/65 text-sm leading-relaxed flex-1">
        &ldquo;{t.content}&rdquo;
      </p>

      {/* Author row */}
      <div className="flex items-center gap-3 pt-4 border-t border-stone-dark/8">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-amber-gold/25"
          style={{ background: t.avatarBg }}
        >
          <span className="text-stone-light font-serif text-xs font-bold">
            {t.initials}
          </span>
        </div>
        <div>
          <p className="font-serif text-stone-950 text-[15px] font-semibold leading-tight">
            {t.author}
          </p>
          <p className="font-sans text-stone-dark/45 text-xs mt-0.5">
            {t.role}, {t.company}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Mobile single-card carousel
function MobileCarousel() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback(
    (next: number) => {
      setDir(next > idx ? 1 : -1);
      setIdx(next);
    },
    [idx]
  );

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setIdx((p) => (p + 1) % TESTIMONIALS.length);
    }, 5500);
    return () => clearInterval(t);
  }, []);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 280 : -280, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? 280 : -280, opacity: 0 }),
  };

  const t = TESTIMONIALS[idx];

  return (
    <div className="md:hidden">
      <div className="overflow-hidden relative min-h-72">
        <AnimatePresence initial={false} custom={dir} mode="wait">
          <motion.div
            key={idx}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full"
          >
            <div className="bg-white/70 border border-stone-dark/10 rounded-2xl p-6 flex flex-col gap-5 backdrop-blur-sm">
              <div className="flex items-start justify-between">
                <Quote size={24} className="text-amber-gold/50 -scale-x-100" />
                <StarRating count={t.rating} />
              </div>
              <p className="font-sans text-stone-dark/65 text-sm leading-relaxed">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-stone-dark/8">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-amber-gold/25"
                  style={{ background: t.avatarBg }}
                >
                  <span className="text-stone-light font-serif text-xs font-bold">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p className="font-serif text-stone-950 text-[15px] font-semibold leading-tight">
                    {t.author}
                  </p>
                  <p className="font-sans text-stone-dark/45 text-xs mt-0.5">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <motion.button
          onClick={() => go(idx === 0 ? TESTIMONIALS.length - 1 : idx - 1)}
          className="p-2.5 rounded-full border border-stone-dark/18 hover:border-amber-gold/40 hover:bg-amber-gold/10 transition-all"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          <ChevronLeft size={18} className="text-stone-dark/55" />
        </motion.button>

        <div className="flex gap-1.5">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === idx ? "w-6 bg-amber-gold" : "w-1.5 bg-stone-dark/20 hover:bg-stone-dark/35"
              )}
            />
          ))}
        </div>

        <motion.button
          onClick={() => go((idx + 1) % TESTIMONIALS.length)}
          className="p-2.5 rounded-full border border-stone-dark/18 hover:border-amber-gold/40 hover:bg-amber-gold/10 transition-all"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          <ChevronRight size={18} className="text-stone-dark/55" />
        </motion.button>
      </div>
    </div>
  );
}

export function TestimonialsCarousel() {
  return (
    <section
      className="py-20 md:py-28 relative overflow-hidden"
      style={{
        background: [
          "radial-gradient(ellipse at 25% 25%, rgba(255,255,255,0.5) 0%, transparent 60%)",
          "radial-gradient(ellipse at 75% 75%, rgba(201,169,97,0.05) 0%, transparent 50%)",
          "linear-gradient(145deg, #dddad5 0%, #d4d0ca 35%, #e0dcd7 65%, #dbd8d2 100%)",
        ].join(", "),
      }}
    >
      <MarbleOverlay variant="grey" intensity={1.0} />

      <Container className="relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-amber-gold font-sans text-xs font-medium uppercase tracking-[0.18em] mb-3">
            Client Stories
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-950 leading-tight">
            Trusted by Premium Brands
          </h2>
          <p className="mt-4 font-sans text-stone-dark/55 text-base max-w-sm mx-auto">
            500+ architects, developers, and designers source through Stonamart.
          </p>
        </motion.div>

        {/* Desktop: 3-column masonry grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.id} t={t} index={i} />
          ))}
        </div>

        {/* Mobile: carousel */}
        <MobileCarousel />

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-14 pt-10 border-t border-stone-dark/12"
        >
          {[
            { value: "500+", label: "Projects Sourced" },
            { value: "98%", label: "On-Time Delivery" },
            { value: "4.9★", label: "Average Rating" },
            { value: "50+", label: "Stone Varieties" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-3xl font-bold text-amber-gold">
                {stat.value}
              </p>
              <p className="font-sans text-xs text-stone-dark/45 mt-0.5 uppercase tracking-wider" style={{ fontVariant: "small-caps" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
