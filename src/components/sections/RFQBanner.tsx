"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, ShieldCheck, Globe } from "lucide-react";
import { Container, MarbleOverlay } from "@/components/ui";
import Link from "next/link";

const USP_ITEMS = [
  {
    icon: Zap,
    title: "24-Hour Quotes",
    desc: "Detailed RFQ responses within one business day",
  },
  {
    icon: ShieldCheck,
    title: "Verified Quality",
    desc: "Every supplier is audited — no compromises",
  },
  {
    icon: Globe,
    title: "PAN India Delivery",
    desc: "From quarry to site across all major cities",
  },
];

const TRUST_METRICS = [
  { value: "50K+", label: "sq ft delivered" },
  { value: "500+", label: "Projects" },
  { value: "40+", label: "Vendors" },
  { value: "98%", label: "On-Time" },
  { value: "4.9★", label: "Rating" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// SVG marble veining for section background
function SectionVeins() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1400 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Diagonal white veins */}
      <path d="M-200 100 C100 60, 350 140, 600 90 C850 40, 1050 120, 1300 72 C1480 36, 1600 90, 1800 58" stroke="white" strokeWidth="1.5" fill="none" opacity="0.025" />
      <path d="M-100 280 C150 238, 400 305, 660 258 C920 211, 1120 288, 1380 240 C1560 204, 1680 258, 1860 226" stroke="white" strokeWidth="1.0" fill="none" opacity="0.02" />
      <path d="M50 480 C280 438, 520 510, 780 462 C1040 414, 1240 490, 1500 444 C1680 408, 1780 460, 1960 428" stroke="white" strokeWidth="0.7" fill="none" opacity="0.018" />
      {/* Diagonal gold veins */}
      <path d="M-150 180 C80 138, 340 208, 600 158 C860 108, 1060 188, 1320 140 C1500 104, 1620 158, 1800 126" stroke="rgba(201,169,97,1)" strokeWidth="1.3" fill="none" opacity="0.03" />
      <path d="M-50 360 C180 318, 440 390, 700 342 C960 294, 1160 372, 1420 324 C1600 288, 1720 342, 1900 310" stroke="rgba(201,169,97,0.8)" strokeWidth="1.0" fill="none" opacity="0.025" />
      <path d="M100 560 C330 518, 580 590, 840 542 C1100 494, 1300 570, 1560 522 C1740 486, 1860 540, 2040 508" stroke="rgba(201,169,97,0.6)" strokeWidth="0.7" fill="none" opacity="0.022" />
      {/* A few short crossing veins for crystalline feel */}
      <path d="M300 -50 C280 100, 340 250, 310 420 C280 580, 330 720, 300 900" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" fill="none" opacity="0.015" />
      <path d="M900 -30 C880 120, 940 280, 910 450 C880 620, 930 760, 900 930" stroke="rgba(201,169,97,0.5)" strokeWidth="0.5" fill="none" opacity="0.018" />
    </svg>
  );
}

export function RFQBanner() {
  return (
    <section
      className="relative py-24 md:py-36 overflow-hidden"
      style={{
        background: [
          "radial-gradient(ellipse at 20% 20%, rgba(201,169,97,0.10) 0%, transparent 52%)",
          "radial-gradient(ellipse at 80% 80%, rgba(139,115,85,0.08) 0%, transparent 48%)",
          "linear-gradient(148deg, #0a0a0a 0%, #111111 45%, #0d0d0d 70%, #0a0a0a 100%)",
        ].join(", "),
      }}
    >
      <MarbleOverlay variant="black" intensity={1.0} />
      {/* SVG marble veining */}
      <SectionVeins />

      {/* Ambient orbs — larger, with a third at center-left */}
      <motion.div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(201,169,97,0.12) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,115,85,0.1) 0%, transparent 65%)",
        }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      {/* Third orb — center-left */}
      <motion.div
        className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(201,169,97,0.07) 0%, transparent 65%)",
          transform: "translateY(-50%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* Grid pattern — subtler at 0.02 opacity */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,169,97,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,97,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <Container className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Eyebrow pill */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center mb-6"
          >
            <span
              className="px-4 py-1.5 rounded-full font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-amber-gold"
              style={{
                border: "1px solid rgba(201,169,97,0.30)",
                background: "rgba(201,169,97,0.08)",
              }}
            >
              Ready to Source?
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            variants={itemVariants}
            className="font-serif font-bold text-stone-light leading-[1.05] mb-6"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)" }}
          >
            Source Your Vision.
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #c9a961 0%, #f0e4bc 40%, #e8d0a0 70%, #c9a961 100%)",
              }}
            >
              On Your Terms.
            </span>
          </motion.h2>

          {/* Sub-copy */}
          <motion.p
            variants={itemVariants}
            className="font-sans text-stone-light/55 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Describe your project, select your preferred stone, and receive competitive quotes
            from verified suppliers — all through our intelligent RFQ builder.
          </motion.p>

          {/* USP row */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
          >
            {USP_ITEMS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 + i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-stone-light/8 bg-stone-light/4 backdrop-blur-sm hover:border-amber-gold/20 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-gold/10 border border-amber-gold/20 flex items-center justify-center shadow-inner">
                  <item.icon size={18} className="text-amber-gold" />
                </div>
                <div className="text-center">
                  <p className="font-serif text-stone-light text-sm font-semibold">
                    {item.title}
                  </p>
                  <p className="font-sans text-stone-light/40 text-xs mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA row */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/rfq">
              <motion.button
                whileHover={{ scale: 1.04, x: 3 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-10 py-5 bg-amber-gold text-stone-950 font-serif font-bold text-[15px] rounded-2xl shadow-[0_4px_24px_rgba(201,169,97,0.35)] hover:bg-amber-gold/90 hover:shadow-[0_6px_32px_rgba(201,169,97,0.45)] transition-all duration-300"
              >
                Start RFQ Builder
                <ArrowRight size={18} />
              </motion.button>
            </Link>

            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-10 py-5 border border-stone-light/18 text-stone-light font-sans font-medium text-sm rounded-2xl hover:bg-stone-light/6 hover:border-stone-light/30 transition-all duration-300"
              >
                Browse Catalog
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust metrics row */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-0 mt-10"
          >
            {TRUST_METRICS.map((m, i) => (
              <React.Fragment key={m.label}>
                <div className="flex flex-col items-center px-5 py-2">
                  <span className="font-serif text-amber-gold text-sm font-bold">{m.value}</span>
                  <span className="font-sans text-stone-light/30 text-[10px] uppercase tracking-wider mt-0.5">{m.label}</span>
                </div>
                {i < TRUST_METRICS.length - 1 && (
                  <div className="w-px h-6 bg-amber-gold/20 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </motion.div>

          {/* Trust footnote */}
          <motion.p
            variants={itemVariants}
            className="font-sans text-stone-light/25 text-xs mt-6 uppercase tracking-[0.15em]"
          >
            Trusted by 500+ architects, designers & contractors across India
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
