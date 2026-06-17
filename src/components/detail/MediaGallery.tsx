"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ZoomIn, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import Image from "next/image";
import type { CatalogProduct } from "@/components/catalog/types";

function isVideoUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return (
    lower.endsWith(".mp4") ||
    lower.endsWith(".mov") ||
    lower.endsWith(".webm") ||
    lower.endsWith(".avi") ||
    lower.includes("youtube.com") ||
    lower.includes("youtu.be") ||
    lower.includes("vimeo.com")
  );
}

interface MediaSlot {
  url: string;
  isVideo: boolean;
  label: string;
}

function buildSlots(product: CatalogProduct): MediaSlot[] {
  const urls: string[] =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : product.imageUrl
      ? [product.imageUrl]
      : [];

  return urls.map((url, i) => ({
    url,
    isVideo: isVideoUrl(url),
    label: i === 0 ? "Main View" : isVideoUrl(url) ? "Video" : `View ${i + 1}`,
  }));
}

interface MediaGalleryProps {
  product: CatalogProduct;
}

export function MediaGallery({ product }: MediaGalleryProps) {
  const slots = buildSlots(product);
  const [activeIdx, setActiveIdx] = useState(0);
  const hasMedia = slots.length > 0;
  const activeSlot = slots[activeIdx] ?? null;

  function goTo(idx: number) {
    setActiveIdx(((idx % slots.length) + slots.length) % slots.length);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Hero frame ── */}
      <div
        className="relative rounded-2xl overflow-hidden bg-stone-100"
        style={{ aspectRatio: "4/3" }}
      >
        {!hasMedia ? (
          /* No images placeholder */
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ background: product.bg }}
          >
            <ImageOff size={32} className="text-stone-dark/20" />
            <p className="text-[12px] font-sans text-stone-dark/30">No images available</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlot.url}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0"
            >
              {activeSlot.isVideo ? (
                <video
                  src={activeSlot.url}
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                  playsInline
                />
              ) : (
                <Image
                  src={activeSlot.url}
                  alt={`${product.name} — ${activeSlot.label}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={activeIdx === 0}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Bottom scrim + label */}
        {hasMedia && (
          <>
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3.5 left-4 right-14 pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeSlot.url}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="text-[11px] font-sans font-medium text-white/65"
                >
                  {activeSlot.label}
                </motion.span>
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Counter */}
        {slots.length > 1 && (
          <div className="absolute bottom-3.5 right-3.5 px-2.5 py-1 bg-black/30 backdrop-blur-sm rounded-full text-[10px] font-sans font-medium text-white/80">
            {activeIdx + 1} / {slots.length}
          </div>
        )}

        {/* Zoom hint (images only) */}
        {hasMedia && !activeSlot.isVideo && (
          <div className="absolute top-3 left-3 p-2 bg-black/20 backdrop-blur-sm rounded-xl pointer-events-none">
            <ZoomIn size={14} className="text-white/65" />
          </div>
        )}

        {/* Prev / Next arrows */}
        {slots.length > 1 && (
          <>
            <button
              onClick={() => goTo(activeIdx - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/22 hover:bg-black/38 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => goTo(activeIdx + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/22 hover:bg-black/38 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* ── Thumbnail strip ── */}
      {slots.length > 1 && (
        <div className="flex gap-2.5 flex-wrap">
          {slots.map((slot, idx) => (
            <motion.button
              key={slot.url}
              onClick={() => setActiveIdx(idx)}
              className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                idx === activeIdx
                  ? "border-amber-gold shadow-[0_0_0_3px_rgba(201,169,97,0.22)]"
                  : "border-transparent hover:border-stone-dark/18"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              {slot.isVideo ? (
                <div className="absolute inset-0 bg-stone-800 flex items-center justify-center">
                  <Play size={13} className="text-white ml-0.5" fill="white" />
                </div>
              ) : (
                <Image
                  src={slot.url}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              )}
              {idx === activeIdx && (
                <motion.div
                  layoutId="thumbActiveDot"
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-gold rounded-full"
                />
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
