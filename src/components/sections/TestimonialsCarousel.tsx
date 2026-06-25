"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Container } from "@/components/ui";

const TESTIMONIALS = [
  {
    id: 1,
    author: "Rajesh Kumar",
    role: "Principal Architect",
    company: "Kumar & Associates, Mumbai",
    content: "Stonamart has transformed how we source premium stone. The quality is genuinely exceptional — every slab we've received has met the highest standards. Their team understands what architects need.",
    rating: 5,
    initials: "RK",
  },
  {
    id: 2,
    author: "Priya Sharma",
    role: "Senior Interior Designer",
    company: "Design Studio Mumbai",
    content: "The variety of marble options is outstanding. I can find everything from Makrana White to Jet Black Granite in one place. My clients are consistently impressed with the results.",
    rating: 5,
    initials: "PS",
  },
  {
    id: 3,
    author: "Vikram Patel",
    role: "Construction Manager",
    company: "BuildTech Group, Delhi",
    content: "Reliable delivery, verified quality, and competitive pricing. For a project manager, Stonamart removes the guesswork entirely. We've sourced over 50,000 sq ft through them.",
    rating: 5,
    initials: "VP",
  },
  {
    id: 4,
    author: "Aisha Nair",
    role: "Property Developer",
    company: "Prestige Homes, Bangalore",
    content: "The transparency in pricing and the quality assurance gave us confidence to place large orders. Stonamart is now our default supplier for all premium stone requirements.",
    rating: 5,
    initials: "AN",
  },
];

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((p) => (p + 1) % TESTIMONIALS.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length), []);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const t = TESTIMONIALS[current];

  return (
    <section className="py-20 bg-stone-50 border-y border-stone-100">
      <Container>
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-950 mb-3">
            What Our Clients Say
          </h2>
          <p className="font-sans text-sm text-stone-400">
            Trusted by architects, designers and builders across India
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-stone-100 rounded-2xl p-8 md:p-10 shadow-sm text-center"
            >
              <Quote size={32} className="text-amber-gold/30 mx-auto mb-5" />
              <div className="flex items-center justify-center gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-amber-gold fill-amber-gold" />
                ))}
              </div>
              <p className="font-sans text-[15px] text-stone-600 leading-relaxed mb-7">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-stone-950 flex items-center justify-center">
                  <span className="text-[11px] font-sans font-bold text-amber-gold">{t.initials}</span>
                </div>
                <div className="text-left">
                  <p className="font-serif text-[14px] font-bold text-stone-950">{t.author}</p>
                  <p className="font-sans text-[11.5px] text-stone-400">{t.role} · {t.company}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-7">
            <button
              onClick={prev}
              className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:border-stone-400 hover:text-stone-700 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1.5">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? 20 : 7,
                    height: 7,
                    background: i === current ? "#B8865A" : "#e5e7eb",
                  }}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:border-stone-400 hover:text-stone-700 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
