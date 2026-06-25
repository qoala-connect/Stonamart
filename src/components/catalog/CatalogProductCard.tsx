"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowUpRight, CheckCircle2, AlertCircle, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CatalogProduct } from "./types";

const STATUS_CONFIG = {
  "in-stock": {
    label: "In Stock",
    icon: CheckCircle2,
    className: "bg-emerald-500/15 border-emerald-500/25 text-emerald-600",
  },
  limited: {
    label: "Limited",
    icon: AlertCircle,
    className: "bg-amber-500/15 border-amber-500/25 text-amber-600",
  },
  "pre-order": {
    label: "Pre-Order",
    icon: Clock,
    className: "bg-blue-500/15 border-blue-500/25 text-blue-600",
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  Flooring: "bg-stone-dark/8 text-stone-dark/65",
  "Wall Cladding": "bg-stone-dark/8 text-stone-dark/65",
  Countertops: "bg-amber-gold/10 text-amber-gold",
  Outdoor: "bg-stone-dark/8 text-stone-dark/65",
  Decorative: "bg-stone-dark/8 text-stone-dark/65",
};

interface CatalogProductCardProps {
  product: CatalogProduct;
  index?: number;
  isVisuallySimilar?: boolean;
}

export function CatalogProductCard({
  product,
  index = 0,
  isVisuallySimilar = false,
}: CatalogProductCardProps) {
  const status = STATUS_CONFIG[product.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{
        delay: Math.min(index * 0.05, 0.3),
        duration: 0.45,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      layout
    >
      <Link href={`/products/${product.id}`}>
        <motion.div
          className="group bg-white rounded-2xl border border-stone-dark/8 overflow-hidden hover:border-stone-dark/18 hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer"
          whileHover="hover"
          initial="rest"
        >
          {/* Thumbnail — stone texture, 220px tall */}
          <div className="relative h-52 overflow-hidden">
            {product.imageUrl ? (
              /* Real product photo */
              <motion.div
                className="absolute inset-0"
                variants={{
                  rest: { scale: 1 },
                  hover: {
                    scale: 1.07,
                    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
                  },
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </motion.div>
            ) : (
              <>
                {/* Stone texture gradient with zoom */}
                <motion.div
                  className="absolute inset-0"
                  style={{ background: product.bg }}
                  variants={{
                    rest: { scale: 1 },
                    hover: {
                      scale: 1.07,
                      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
                    },
                  }}
                />
                {/* SVG noise texture */}
                <div
                  className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
                    backgroundSize: "128px 128px",
                  }}
                />
              </>
            )}

            {/* Gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

            {/* Top badges */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
              {/* Visually Similar badge (left) */}
              {isVisuallySimilar ? (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1 px-2.5 py-1 bg-stone-950/80 border border-amber-gold/40 rounded-full text-[10px] font-sans font-bold text-amber-gold backdrop-blur-sm"
                >
                  <Sparkles size={9} />
                  Visually Similar
                </motion.span>
              ) : (
                <span
                  className={cn(
                    "text-[10px] font-sans font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm",
                    CATEGORY_COLORS[product.category] ?? "bg-stone-dark/8 text-stone-dark/65"
                  )}
                >
                  {product.category}
                </span>
              )}

              {/* Stock status (right) */}
              <span
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-sans font-semibold backdrop-blur-sm",
                  status.className
                )}
              >
                <StatusIcon size={9} className="flex-shrink-0" />
                {status.label}
              </span>
            </div>

            {/* Hover: View CTA overlay */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              variants={{
                rest: { opacity: 0 },
                hover: { opacity: 1, transition: { duration: 0.2 } },
              }}
            >
              <motion.div
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-sans font-semibold text-stone-950 shadow-[0_2px_12px_rgba(0,0,0,0.18)]"
                variants={{
                  rest: { y: 8, scale: 0.95 },
                  hover: { y: 0, scale: 1, transition: { duration: 0.22 } },
                }}
              >
                View Details
                <ArrowUpRight size={12} />
              </motion.div>
            </motion.div>
          </div>

          {/* Card body */}
          <div className="p-4">
            {/* Material type chip */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.12em] text-amber-gold">
                {product.materialType}
              </span>
              <span className="text-stone-dark/20 text-xs">·</span>
              <span className="text-[10px] font-sans text-stone-dark/45 capitalize">
                {product.finish}
              </span>
            </div>

            {/* Product name */}
            <h3 className="font-serif text-lg font-semibold text-stone-950 leading-tight mb-2 group-hover:text-amber-gold transition-colors duration-200">
              {product.name}
            </h3>

            {/* Specs row */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="flex items-center gap-1 text-xs font-sans text-stone-dark/50">
                <MapPin size={10} className="text-amber-gold flex-shrink-0" />
                {product.location}
              </span>
              <span className="text-stone-dark/20 text-xs">·</span>
              <span className="text-xs font-sans text-stone-dark/45">
                {product.origin}
              </span>
              <span className="text-stone-dark/20 text-xs">·</span>
              <span className="text-xs font-sans text-stone-dark/45">
                {product.thickness}
              </span>
            </div>

            {/* Price range + CTA row */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-dark/6">
              <div>
                <p className="text-[9px] font-sans uppercase tracking-[0.12em] text-stone-dark/35 mb-0.5">
                  Price range
                </p>
                <p className="font-serif text-sm font-semibold text-amber-gold">
                  {product.priceRange}
                </p>
              </div>

              <motion.div
                className="flex items-center gap-1 px-3 py-1.5 border border-stone-dark/12 rounded-xl text-xs font-sans font-medium text-stone-dark/60 hover:border-amber-gold/40 hover:text-amber-gold transition-all duration-200"
                variants={{
                  rest: {},
                  hover: { borderColor: "rgba(184,134,90,0.5)", color: "#B8865A" },
                }}
              >
                Quote
                <ArrowUpRight size={11} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
