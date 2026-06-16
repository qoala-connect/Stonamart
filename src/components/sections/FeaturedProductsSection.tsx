"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Container, MarbleOverlay } from "@/components/ui";
import Link from "next/link";

interface FeaturedProduct {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  origin: string;
  location: string;
  finish: string;
  priceRange: string;
  status: "in-stock" | "limited";
  description: string;
  bg: string;
  textLight: boolean;
}

const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    id: "p1",
    name: "Calacatta Oro",
    category: "marble",
    categoryLabel: "Marble",
    origin: "Italy",
    location: "Mumbai",
    finish: "Polished",
    priceRange: "₹150–₹400 / sq ft",
    status: "in-stock",
    description: "Dramatic gold veining on a pristine white canvas — the pinnacle of Italian marble.",
    bg: [
      "linear-gradient(135deg, transparent 0%, rgba(139,115,85,0.09) 35%, transparent 65%)",
      "linear-gradient(45deg, transparent 20%, rgba(180,155,120,0.11) 52%, transparent 78%)",
      "linear-gradient(165deg, #f7f4ef 0%, #ede8df 40%, #e3dbd0 70%, #ede8df 100%)",
    ].join(", "),
    textLight: false,
  },
  {
    id: "p2",
    name: "Black Absolute",
    category: "granite",
    categoryLabel: "Granite",
    origin: "Norway",
    location: "Bangalore",
    finish: "Polished",
    priceRange: "₹80–₹200 / sq ft",
    status: "in-stock",
    description: "Uncompromising jet-black with fine mineral crystalline texture.",
    bg: [
      "radial-gradient(circle at 22% 28%, rgba(201,169,97,0.14) 0%, transparent 9%)",
      "radial-gradient(circle at 78% 65%, rgba(255,255,255,0.05) 0%, transparent 7%)",
      "radial-gradient(circle at 50% 82%, rgba(139,115,85,0.1) 0%, transparent 11%)",
      "linear-gradient(140deg, #1c1c1c 0%, #262626 55%, #161616 100%)",
    ].join(", "),
    textLight: true,
  },
  {
    id: "p3",
    name: "Stellar White",
    category: "quartz",
    categoryLabel: "Quartz",
    origin: "USA",
    location: "Delhi",
    finish: "Polished",
    priceRange: "₹120–₹280 / sq ft",
    status: "in-stock",
    description: "Mirror-like engineered quartz — consistent, scratch-resistant, enduring.",
    bg: [
      "linear-gradient(135deg, transparent 0%, rgba(200,190,175,0.14) 30%, transparent 62%)",
      "linear-gradient(165deg, #f2eeea 0%, #e6e0d8 48%, #f0ece4 100%)",
    ].join(", "),
    textLight: false,
  },
  {
    id: "p4",
    name: "Emperador Dark",
    category: "marble",
    categoryLabel: "Marble",
    origin: "Spain",
    location: "Pune",
    finish: "Honed",
    priceRange: "₹180–₹420 / sq ft",
    status: "in-stock",
    description: "Rich chocolate-brown marble with cream and gold veining — Spanish heritage.",
    bg: [
      "linear-gradient(135deg, transparent 0%, rgba(80,40,10,0.18) 32%, transparent 64%)",
      "linear-gradient(50deg, transparent 15%, rgba(120,80,30,0.14) 48%, transparent 72%)",
      "linear-gradient(160deg, #6b4a2a 0%, #8b5e38 32%, #5a3c1e 62%, #7a5030 100%)",
    ].join(", "),
    textLight: true,
  },
  {
    id: "p5",
    name: "Sunset Gold",
    category: "sandstone",
    categoryLabel: "Sandstone",
    origin: "India",
    location: "Jaipur",
    finish: "Brushed",
    priceRange: "₹55–₹130 / sq ft",
    status: "in-stock",
    description: "Warm Rajasthani sandstone — naturally weather-resistant and timeless.",
    bg: [
      "linear-gradient(135deg, transparent 0%, rgba(255,220,100,0.1) 32%, transparent 68%)",
      "linear-gradient(140deg, #d4b06a 0%, #b88940 32%, #e0c080 62%, #9a7030 100%)",
    ].join(", "),
    textLight: true,
  },
  {
    id: "p6",
    name: "Deep Onyx Black",
    category: "onyx",
    categoryLabel: "Onyx",
    origin: "Mexico",
    location: "Hyderabad",
    finish: "Polished",
    priceRange: "₹400–₹750 / sq ft",
    status: "limited",
    description: "Translucent deep-black onyx with ethereal depth — extremely rare and luxurious.",
    bg: [
      "radial-gradient(ellipse at 32% 22%, rgba(18,12,48,0.9) 0%, transparent 56%)",
      "radial-gradient(ellipse at 70% 80%, rgba(4,28,14,0.7) 0%, transparent 46%)",
      "linear-gradient(140deg, #0c0c0c 0%, #141414 52%, #080808 100%)",
    ].join(", "),
    textLight: true,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Section-level marble vein overlay SVG
function SectionMarbleVeins() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1400 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ opacity: 1 }}
    >
      <path d="M-100 120 C100 80, 300 160, 520 100 C740 40, 900 130, 1100 80 C1280 34, 1420 100, 1600 70" stroke="rgba(255,255,255,0.07)" strokeWidth="1.8" fill="none" />
      <path d="M0 280 C180 240, 380 310, 600 270 C820 230, 980 295, 1200 255 C1380 218, 1500 268, 1700 240" stroke="rgba(201,169,97,0.18)" strokeWidth="1.5" fill="none" />
      <path d="M200 450 C380 415, 560 470, 760 435 C960 400, 1120 455, 1340 418 C1500 384, 1620 430, 1800 400" stroke="rgba(255,255,255,0.05)" strokeWidth="1.1" fill="none" />
      <path d="M-50 620 C150 585, 340 640, 560 605 C780 570, 940 625, 1160 588 C1340 554, 1460 600, 1640 570" stroke="rgba(201,169,97,0.12)" strokeWidth="1.2" fill="none" />
      <path d="M100 760 C290 725, 480 775, 700 740 C920 705, 1080 758, 1300 722 C1480 688, 1600 735, 1780 705" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

interface FeaturedCardProps {
  product: FeaturedProduct;
}

function FeaturedCard({ product }: FeaturedCardProps) {
  const isLight = product.textLight;

  return (
    <motion.div variants={cardVariants}>
      <motion.div
        className="relative rounded-2xl overflow-hidden group flex flex-col"
        style={{
          minHeight: 380,
          boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
        }}
        whileHover="hover"
        initial="rest"
      >
        {/* Stone texture background — zooms on hover */}
        <motion.div
          className="absolute inset-0"
          style={{ background: product.bg }}
          variants={{
            rest: { scale: 1 },
            hover: {
              scale: 1.05,
              transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] },
            },
          }}
        />

        {/* SVG noise for stone depth */}
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
            backgroundSize: "128px 128px",
          }}
        />

        {/* Gradient scrim — richer at bottom for readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isLight
              ? "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.12) 55%, transparent 100%)"
              : "linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.06) 55%, transparent 100%)",
          }}
        />

        {/* Top badges row */}
        <div className="relative z-10 flex items-center justify-between p-5">
          <div className="flex items-center gap-2">
            {/* Category */}
            <span
              className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: isLight ? "rgba(255,255,255,0.85)" : "rgba(10,10,10,0.65)",
                backdropFilter: "blur(6px)",
              }}
            >
              {product.categoryLabel}
            </span>
            {/* Finish pill badge */}
            <span
              className="text-[10px] font-sans font-medium uppercase tracking-[0.12em] px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(201,169,97,0.15)",
                border: "1px solid rgba(201,169,97,0.30)",
                color: "#c9a961",
                backdropFilter: "blur(6px)",
              }}
            >
              {product.finish}
            </span>
          </div>

          {/* Stock status */}
          {product.status === "in-stock" ? (
            <span className="flex items-center gap-1.5 text-[10px] font-sans font-semibold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 backdrop-blur-sm">
              <CheckCircle2 size={10} className="flex-shrink-0" />
              In Stock
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[10px] font-sans font-semibold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 backdrop-blur-sm">
              <AlertCircle size={10} className="flex-shrink-0" />
              Limited
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1 min-h-16" />

        {/* Bottom content */}
        <div className="relative z-10 p-5">
          {/* Description — fades in on hover */}
          <motion.p
            className="font-sans text-xs leading-relaxed mb-3"
            style={{ color: isLight ? "rgba(255,255,255,0.6)" : "rgba(10,10,10,0.5)" }}
            variants={{
              rest: { opacity: 0, y: 6 },
              hover: { opacity: 1, y: 0, transition: { duration: 0.3 } },
            }}
          >
            {product.description}
          </motion.p>

          {/* Product name */}
          <h3
            className={`font-serif text-2xl font-bold leading-tight mb-2 ${isLight ? "text-stone-light" : "text-stone-950"}`}
          >
            {product.name}
          </h3>

          {/* Location + Origin row */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="flex items-center gap-1 text-xs font-sans"
              style={{ color: isLight ? "rgba(255,255,255,0.55)" : "rgba(10,10,10,0.5)" }}
            >
              <MapPin size={11} className="flex-shrink-0" style={{ color: "#c9a961" }} />
              {product.location}
            </span>
            <span
              className="text-xs font-sans"
              style={{ color: isLight ? "rgba(255,255,255,0.4)" : "rgba(10,10,10,0.38)" }}
            >
              ·
            </span>
            <span
              className="text-xs font-sans"
              style={{ color: isLight ? "rgba(255,255,255,0.55)" : "rgba(10,10,10,0.5)" }}
            >
              {product.origin}
            </span>
          </div>

          {/* Price range + CTA row */}
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-[10px] font-sans uppercase tracking-[0.12em] mb-0.5"
                style={{ color: isLight ? "rgba(255,255,255,0.4)" : "rgba(10,10,10,0.38)" }}
              >
                Price range
              </p>
              <p className="font-serif text-base font-semibold text-amber-gold">
                {product.priceRange}
              </p>
            </div>

            <Link href={`/products/${product.id}`}>
              <motion.div
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-sans font-semibold transition-all duration-200"
                style={{
                  background: "rgba(201,169,97,0.15)",
                  border: "1px solid rgba(201,169,97,0.35)",
                  color: "#c9a961",
                  backdropFilter: "blur(6px)",
                }}
                whileHover={{
                  background: "#c9a961",
                  color: "#0a0a0a",
                  scale: 1.04,
                }}
                whileTap={{ scale: 0.97 }}
              >
                Request Quote
                <ArrowUpRight size={13} />
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FeaturedProductsSection() {
  return (
    <section
      id="featured"
      className="py-20 md:py-28 relative overflow-hidden border-t border-amber-gold/15"
      style={{
        background: [
          "radial-gradient(ellipse at 18% 18%, rgba(201,169,97,0.13) 0%, transparent 46%)",
          "radial-gradient(ellipse at 82% 78%, rgba(100,118,175,0.10) 0%, transparent 44%)",
          "radial-gradient(ellipse at 55% 50%, rgba(80,100,155,0.07) 0%, transparent 38%)",
          "linear-gradient(148deg, #151b2e 0%, #1c2240 38%, #111828 68%, #161c30 100%)",
        ].join(", "),
      }}
    >
      <MarbleOverlay variant="grey" intensity={0.5} />
      {/* Section-level marble vein overlay */}
      <SectionMarbleVeins />

      <Container className="relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14"
        >
          <div>
            <p className="text-amber-gold font-sans text-xs font-medium uppercase tracking-[0.18em] mb-3">
              Curated by Experts
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-light leading-tight">
              Featured Premium<br className="hidden md:block" /> Products
            </h2>
          </div>
          <div className="max-w-xs">
            <p className="font-sans text-stone-light/50 text-base leading-relaxed">
              Hand-selected from the world&apos;s finest quarries. Each piece verified for quality.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 mt-3 text-sm font-sans font-medium text-amber-gold hover:text-amber-gold/75 transition-colors"
            >
              View complete catalog
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Product grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURED_PRODUCTS.map((product) => (
            <FeaturedCard key={product.id} product={product} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
