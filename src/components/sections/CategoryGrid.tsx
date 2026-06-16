"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container, MarbleOverlay } from "@/components/ui";
import Link from "next/link";

const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

// ─── Realistic stone texture renderers ───────────────────────────────────────

function MarbleTexture() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={{
        background: [
          "linear-gradient(142deg, transparent 0%, rgba(140,128,115,0.24) 18%, transparent 44%, rgba(120,108,96,0.15) 64%, transparent 84%)",
          "linear-gradient(55deg, transparent 22%, rgba(155,143,130,0.11) 52%, transparent 78%)",
          "linear-gradient(168deg, #f9f7f3 0%, #ede8de 36%, #f3ede4 63%, #f8f3ea 100%)",
        ].join(", "),
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 220" preserveAspectRatio="xMidYMid slice">
        <path d="M -10 55 C 90 32, 200 68, 310 44 S 420 68, 500 50" stroke="rgba(128,118,106,0.55)" strokeWidth="1.6" fill="none" />
        <path d="M 200 68 C 215 92, 228 122, 248 152" stroke="rgba(128,118,106,0.32)" strokeWidth="0.9" fill="none" />
        <path d="M 15 128 C 110 108, 230 148, 360 122 S 460 148, 510 130" stroke="rgba(138,128,115,0.38)" strokeWidth="1.1" fill="none" />
        <path d="M 70 178 C 175 162, 295 182, 415 165" stroke="rgba(138,128,115,0.25)" strokeWidth="0.7" fill="none" />
        <path d="M 340 -5 C 355 52, 344 108, 360 165" stroke="rgba(118,108,96,0.20)" strokeWidth="0.55" fill="none" />
        <path d="M 55 90 C 160 76, 280 108, 410 90" stroke="rgba(201,169,97,0.20)" strokeWidth="0.8" fill="none" />
        <path d="M 120 200 C 200 188, 310 205, 410 195" stroke="rgba(128,118,106,0.18)" strokeWidth="0.5" fill="none" />
      </svg>
      <div className="absolute inset-0" style={{ backgroundImage: GRAIN, backgroundSize: "128px", opacity: 0.06, mixBlendMode: "multiply" as const }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.22) 0%, transparent 55%, rgba(255,255,255,0.06) 100%)" }} />
    </div>
  );
}

function GraniteTexture() {
  const crystals = [
    [24,18],[48,10],[72,28],[100,8],[128,22],[156,12],[184,32],[212,8],[240,24],[268,14],[296,30],[324,10],[352,26],[380,8],[408,22],[436,14],[460,28],
    [18,52],[44,44],[68,60],[96,40],[124,56],[152,42],[180,65],[208,45],[236,58],[264,42],[292,62],[320,44],[348,58],[376,40],[404,55],[432,42],[458,62],
    [30,88],[56,78],[82,96],[110,76],[138,92],[166,78],[194,100],[222,80],[250,94],[278,78],[306,98],[334,80],[362,96],[390,78],[418,94],[446,80],
    [12,122],[40,112],[66,130],[94,110],[122,128],[150,112],[178,135],[206,114],[234,128],[262,110],[290,132],[318,112],[346,128],[374,110],[402,130],[430,112],[456,128],
    [22,158],[50,148],[78,165],[106,146],[134,162],[162,148],[190,168],[218,148],[246,162],[274,148],[302,166],[330,148],[358,164],[386,148],[414,165],[442,148],[468,165],
    [35,195],[60,185],[88,200],[116,182],[144,198],[172,182],[200,202],[228,182],[256,198],[284,182],[312,202],[340,182],[368,198],[396,182],[424,200],[452,182],
  ];
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={{ background: "linear-gradient(148deg, #101010 0%, #1c1c1c 52%, #131313 100%)" }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 220" preserveAspectRatio="xMidYMid slice">
        {crystals.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy}
            r={i % 7 === 0 ? 1.6 : i % 5 === 0 ? 1.1 : i % 3 === 0 ? 0.75 : 0.45}
            fill={i % 5 === 0 ? "rgba(255,255,255,0.68)" : i % 5 === 1 ? "rgba(201,169,97,0.58)" : i % 5 === 2 ? "rgba(220,215,208,0.48)" : i % 5 === 3 ? "rgba(180,170,158,0.38)" : "rgba(255,255,255,0.28)"}
          />
        ))}
        <path d="M 60 40 C 150 32, 260 55, 380 38" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" fill="none" />
        <path d="M 40 140 C 145 128, 265 152, 400 135" stroke="rgba(255,255,255,0.05)" strokeWidth="0.4" fill="none" />
      </svg>
      <div className="absolute inset-0" style={{ backgroundImage: GRAIN, backgroundSize: "96px", opacity: 0.14, mixBlendMode: "overlay" as const }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(140deg, rgba(255,255,255,0.07) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)" }} />
    </div>
  );
}

function QuartzTexture() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={{
        background: [
          "linear-gradient(130deg, transparent 0%, rgba(180,170,160,0.16) 20%, transparent 45%, rgba(160,152,144,0.10) 65%, transparent 85%)",
          "linear-gradient(168deg, #f5f2ee 0%, #eae5dc 38%, #f0ebe2 63%, #f5f0e8 100%)",
        ].join(", "),
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 220" preserveAspectRatio="xMidYMid slice">
        {/* Engineered quartz — very fine, consistent veining */}
        <path d="M -5 42 C 95 32, 215 52, 340 38 S 440 54, 500 42" stroke="rgba(155,145,132,0.30)" strokeWidth="0.7" fill="none" />
        <path d="M 0 88 C 100 78, 220 98, 345 82 S 445 98, 505 88" stroke="rgba(145,136,124,0.22)" strokeWidth="0.5" fill="none" />
        <path d="M -5 138 C 105 128, 230 148, 355 132 S 455 148, 510 138" stroke="rgba(155,145,132,0.18)" strokeWidth="0.45" fill="none" />
        <path d="M 0 185 C 110 175, 240 195, 360 178 S 460 195, 515 185" stroke="rgba(145,136,124,0.15)" strokeWidth="0.4" fill="none" />
        <path d="M 165 -5 C 170 55, 162 115, 168 175" stroke="rgba(145,136,124,0.15)" strokeWidth="0.4" fill="none" />
        <path d="M 340 -5 C 345 55, 336 115, 342 175" stroke="rgba(155,145,132,0.12)" strokeWidth="0.35" fill="none" />
      </svg>
      <div className="absolute inset-0" style={{ backgroundImage: GRAIN, backgroundSize: "128px", opacity: 0.05, mixBlendMode: "multiply" as const }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.28) 0%, transparent 50%)" }} />
    </div>
  );
}

function TravertineTexture() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={{
        background: [
          "repeating-linear-gradient(0deg, transparent 0px, transparent 9px, rgba(155,125,82,0.10) 10px, transparent 11px)",
          "linear-gradient(165deg, #e0d0b0 0%, #ceba90 36%, #d8c8a0 64%, #dccca0 100%)",
        ].join(", "),
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 220" preserveAspectRatio="xMidYMid slice">
        <path d="M -5 40 C 115 30, 255 52, 400 35 S 490 52, 510 40" stroke="rgba(155,120,75,0.35)" strokeWidth="1.0" fill="none" />
        <path d="M -5 90 C 120 78, 260 102, 405 85 S 495 102, 515 90" stroke="rgba(165,132,85,0.28)" strokeWidth="0.8" fill="none" />
        <path d="M -5 140 C 115 128, 255 152, 400 135 S 490 152, 510 140" stroke="rgba(150,118,72,0.22)" strokeWidth="0.65" fill="none" />
        <path d="M -5 185 C 120 175, 258 198, 400 180 S 490 198, 510 185" stroke="rgba(158,125,78,0.18)" strokeWidth="0.55" fill="none" />
        {/* Pore marks */}
        <ellipse cx="88" cy="62" rx="5" ry="2" fill="rgba(138,108,65,0.22)" />
        <ellipse cx="215" cy="115" rx="7" ry="2.5" fill="rgba(128,100,58,0.18)" />
        <ellipse cx="360" cy="58" rx="4" ry="1.8" fill="rgba(145,112,68,0.20)" />
        <ellipse cx="155" cy="168" rx="6" ry="2.2" fill="rgba(138,108,65,0.16)" />
        <ellipse cx="300" cy="195" rx="5" ry="1.8" fill="rgba(130,100,60,0.18)" />
        <path d="M 280 -5 C 288 60, 278 130, 285 195" stroke="rgba(140,110,70,0.14)" strokeWidth="0.75" fill="none" />
      </svg>
      <div className="absolute inset-0" style={{ backgroundImage: GRAIN, backgroundSize: "112px", opacity: 0.08, mixBlendMode: "multiply" as const }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(145deg, rgba(255,245,220,0.20) 0%, transparent 55%)" }} />
    </div>
  );
}

function SandstoneTexture() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={{
        background: [
          "repeating-linear-gradient(0deg, transparent 0px, transparent 5px, rgba(200,155,60,0.10) 6px, transparent 7px)",
          "linear-gradient(148deg, #c8983c 0%, #a87828 35%, #d4a840 62%, #b48830 100%)",
        ].join(", "),
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 220" preserveAspectRatio="xMidYMid slice">
        <path d="M -5 48 C 120 38, 265 60, 405 42 S 495 60, 510 48" stroke="rgba(255,210,120,0.32)" strokeWidth="0.8" fill="none" />
        <path d="M -5 105 C 115 95, 262 115, 402 98 S 495 115, 510 105" stroke="rgba(240,190,90,0.24)" strokeWidth="0.65" fill="none" />
        <path d="M -5 165 C 125 155, 268 175, 408 158 S 498 175, 510 165" stroke="rgba(255,210,120,0.18)" strokeWidth="0.55" fill="none" />
        <path d="M 180 -5 C 186 65, 178 130, 184 200" stroke="rgba(240,190,90,0.18)" strokeWidth="0.6" fill="none" />
        <path d="M 360 -5 C 366 65, 358 130, 364 200" stroke="rgba(255,200,100,0.14)" strokeWidth="0.5" fill="none" />
      </svg>
      <div className="absolute inset-0" style={{ backgroundImage: GRAIN, backgroundSize: "100px", opacity: 0.10, mixBlendMode: "multiply" as const }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,230,150,0.22) 0%, transparent 45%, rgba(160,110,20,0.10) 100%)" }} />
    </div>
  );
}

function SlateTexture() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={{
        background: [
          "repeating-linear-gradient(175deg, transparent 0px, transparent 12px, rgba(80,80,95,0.12) 13px, transparent 14px)",
          "repeating-linear-gradient(5deg, transparent 0px, transparent 18px, rgba(60,65,80,0.08) 19px, transparent 20px)",
          "linear-gradient(148deg, #4a4e58 0%, #3a3e48 38%, #525665 65%, #3e4250 100%)",
        ].join(", "),
      }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 220" preserveAspectRatio="xMidYMid slice">
        <path d="M -5 55 C 120 44, 270 68, 420 50 S 500 68, 510 55" stroke="rgba(255,255,255,0.10)" strokeWidth="0.7" fill="none" />
        <path d="M -5 120 C 115 110, 265 132, 415 115 S 500 130, 510 120" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" fill="none" />
        <path d="M -5 178 C 120 168, 268 188, 418 170 S 500 188, 510 178" stroke="rgba(255,255,255,0.06)" strokeWidth="0.45" fill="none" />
        <path d="M 160 -5 C 165 65, 157 130, 163 200" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" fill="none" />
        <path d="M 330 -5 C 335 65, 327 130, 333 200" stroke="rgba(255,255,255,0.05)" strokeWidth="0.35" fill="none" />
      </svg>
      <div className="absolute inset-0" style={{ backgroundImage: GRAIN, backgroundSize: "112px", opacity: 0.10, mixBlendMode: "overlay" as const }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(140deg, rgba(255,255,255,0.07) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)" }} />
    </div>
  );
}

// ─── Category data ─────────────────────────────────────────────────────────
interface CategoryDef {
  id: string;
  name: string;
  tagline: string;
  description: string;
  count: number;
  priceFrom: string;
  uses: string[];
  swatches: { color: string; label: string }[];
  Texture: React.FC;
  textOnLight: boolean;
}

const CATEGORIES: CategoryDef[] = [
  {
    id: "marble",
    name: "Marble",
    tagline: "Timeless Italian Elegance",
    description: "Natural stone with flowing veins — from pristine Carrara to dramatic Calacatta Gold.",
    count: 248,
    priceFrom: "₹80",
    uses: ["Flooring", "Countertops", "Wall Cladding", "Staircases"],
    swatches: [
      { color: "#f5f2ee", label: "Carrara White" },
      { color: "#e0d8c8", label: "Crema Marfil" },
      { color: "#b8a890", label: "Beige" },
    ],
    Texture: MarbleTexture,
    textOnLight: true,
  },
  {
    id: "granite",
    name: "Granite",
    tagline: "Enduring Strength",
    description: "The hardest natural stone — scratch-proof, heat-resistant, virtually maintenance-free.",
    count: 412,
    priceFrom: "₹55",
    uses: ["Kitchen Slabs", "Flooring", "Outdoor Paving", "Monuments"],
    swatches: [
      { color: "#1a1a1a", label: "Black Absolute" },
      { color: "#7a6868", label: "Kashmir Grey" },
      { color: "#8b3a3a", label: "Imperial Red" },
    ],
    Texture: GraniteTexture,
    textOnLight: false,
  },
  {
    id: "quartz",
    name: "Quartz",
    tagline: "Engineered Perfection",
    description: "Non-porous, uniform surface — ideal for high-traffic kitchen and bath applications.",
    count: 156,
    priceFrom: "₹120",
    uses: ["Kitchen Tops", "Vanity Tops", "Office Surfaces", "Hospitals"],
    swatches: [
      { color: "#f5f3ef", label: "Stellar White" },
      { color: "#e8e2d8", label: "Calacatta Laza" },
      { color: "#1c1c1c", label: "Jet Black" },
    ],
    Texture: QuartzTexture,
    textOnLight: true,
  },
  {
    id: "travertine",
    name: "Travertine",
    tagline: "Warm Ancient Beauty",
    description: "Naturally layered limestone from ancient hot springs — warm tones, timeless appeal.",
    count: 64,
    priceFrom: "₹95",
    uses: ["Pool Surrounds", "Flooring", "Wall Panels", "Spa Interiors"],
    swatches: [
      { color: "#ddd0b0", label: "Classic Ivory" },
      { color: "#c8b890", label: "Walnut Brown" },
      { color: "#e8d8a8", label: "Silver" },
    ],
    Texture: TravertineTexture,
    textOnLight: true,
  },
  {
    id: "sandstone",
    name: "Sandstone",
    tagline: "Warm Rajasthani Heritage",
    description: "India's native stone — weather-resistant, naturally textured, perfect for exteriors.",
    count: 89,
    priceFrom: "₹35",
    uses: ["Exterior Facades", "Garden Paving", "Feature Walls", "Temples"],
    swatches: [
      { color: "#d4b882", label: "Teak" },
      { color: "#c08040", label: "Golden Yellow" },
      { color: "#a85028", label: "Dholpur Red" },
    ],
    Texture: SandstoneTexture,
    textOnLight: false,
  },
  {
    id: "slate",
    name: "Slate & Others",
    tagline: "Natural Surface Variety",
    description: "Slate, Kota stone, quartzite and more — unique textures for distinctive spaces.",
    count: 134,
    priceFrom: "₹25",
    uses: ["Roof Tiles", "Flooring", "Garden Paths", "Rustic Interiors"],
    swatches: [
      { color: "#4a4e58", label: "Indian Slate" },
      { color: "#6a7888", label: "Kota Blue" },
      { color: "#b85030", label: "Terracotta" },
    ],
    Texture: SlateTexture,
    textOnLight: false,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function CategoryCard({ category }: { category: CategoryDef }) {
  const { Texture } = category;

  return (
    <motion.div variants={cardVariants}>
      <Link href={`/products?category=${category.id}`}>
        <motion.div
          className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400 cursor-pointer border border-stone-dark/8"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* ── Stone texture panel ── */}
          <div className="relative h-48 overflow-hidden">
            <motion.div
              className="absolute inset-0"
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.06, transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] } },
              }}
              initial="rest"
              whileHover="hover"
            >
              <Texture />
            </motion.div>

            {/* Count badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-sans font-semibold backdrop-blur-md"
              style={{ background: "rgba(0,0,0,0.42)", color: "rgba(255,255,255,0.90)", border: "1px solid rgba(255,255,255,0.15)" }}>
              {category.count}+ varieties
            </div>

            {/* Price badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-sans font-semibold backdrop-blur-md"
              style={{ background: "rgba(201,169,97,0.88)", color: "#0a0a0a" }}>
              From {category.priceFrom}/sq ft
            </div>

            {/* Bottom gradient for name overlay */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

            {/* Stone name on image */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
              <h3 className="font-serif text-[1.35rem] font-bold text-white leading-tight drop-shadow-md">
                {category.name}
              </h3>
              <p className="font-sans text-[10px] text-amber-gold/90 uppercase tracking-[0.16em] mt-0.5">
                {category.tagline}
              </p>
            </div>
          </div>

          {/* ── Info panel ── */}
          <div className="bg-white px-4 pt-3.5 pb-4">
            {/* Description */}
            <p className="font-sans text-[12.5px] text-stone-dark/60 leading-relaxed mb-3">
              {category.description}
            </p>

            {/* Color swatches */}
            <div className="flex items-center gap-2 mb-3">
              <span className="font-sans text-[10px] text-stone-dark/38 uppercase tracking-wider flex-shrink-0">Colors:</span>
              <div className="flex items-center gap-1.5">
                {category.swatches.map((sw) => (
                  <div
                    key={sw.label}
                    className="group/swatch relative w-5 h-5 rounded-full border-2 border-white shadow-sm hover:scale-125 transition-transform cursor-pointer"
                    style={{ background: sw.color, boxShadow: "0 0 0 1.5px rgba(0,0,0,0.12)" }}
                    title={sw.label}
                  />
                ))}
                <span className="font-sans text-[10px] text-stone-dark/35 ml-0.5">+more</span>
              </div>
            </div>

            {/* Use-case chips */}
            <div className="flex flex-wrap gap-1.5 mb-3.5">
              {category.uses.map((use) => (
                <span
                  key={use}
                  className="font-sans text-[10px] font-medium px-2 py-0.5 rounded bg-stone-dark/[0.055] text-stone-dark/55"
                >
                  {use}
                </span>
              ))}
            </div>

            {/* Footer: CTA */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-dark/8">
              <span className="font-sans text-[11px] text-stone-dark/40">
                Premium · Verified Vendors
              </span>
              <span className="flex items-center gap-1.5 font-sans text-[12px] font-bold text-amber-gold group-hover:gap-2.5 transition-all duration-200">
                Browse Collection
                <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function CategoryGrid() {
  return (
    <section
      id="categories"
      className="py-20 md:py-28 border-t border-amber-gold/20 relative overflow-hidden"
      style={{
        background: [
          "radial-gradient(ellipse at 20% 30%, rgba(201,169,97,0.08) 0%, transparent 55%)",
          "radial-gradient(ellipse at 80% 70%, rgba(155,125,85,0.07) 0%, transparent 50%)",
          "linear-gradient(145deg, #f0e7d8 0%, #e8ddc9 35%, #ede4d2 65%, #f1e8d9 100%)",
        ].join(", "),
      }}
    >
      <MarbleOverlay variant="cream" intensity={0.9} />

      <Container className="relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center gap-4 mb-14"
        >
          <p className="text-amber-gold font-sans text-xs font-medium uppercase tracking-[0.18em]">
            Stone Collections
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-950 leading-tight">
            Explore by Category
          </h2>
          <div className="w-16 h-px bg-amber-gold/40" />
          <p className="font-sans text-stone-dark/55 text-base max-w-md leading-relaxed">
            Seven families of natural and engineered stone — each with its own character, application, and price point.
          </p>
        </motion.div>

        {/* Card grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
