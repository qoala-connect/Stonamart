"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Container } from "@/components/ui";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  origin: string;
  state: string;
  category: string;
  finish: string;
  status: "in-stock" | "limited";
  img: string;
  rating: number;
}

const PRODUCTS: Product[] = [
  {
    id: "p1", name: "Makrana White", origin: "Rajasthan", state: "Mumbai",
    category: "Marble", finish: "Polished", status: "in-stock", rating: 4.9,
    img: "https://images.unsplash.com/photo-1566041510394-cf7c8fe21800?w=700&q=82",
  },
  {
    id: "p2", name: "Jet Black Granite", origin: "Karnataka", state: "Bangalore",
    category: "Granite", finish: "Polished", status: "in-stock", rating: 4.8,
    img: "https://images.unsplash.com/photo-1699982759850-22dbbd9676b7?w=700&q=82",
  },
  {
    id: "p3", name: "Ambaji White", origin: "Gujarat", state: "Delhi",
    category: "Marble", finish: "Polished", status: "in-stock", rating: 4.7,
    img: "https://images.unsplash.com/photo-1726987242665-d0a7d2268ea0?w=700&q=82",
  },
  {
    id: "p4", name: "Indore Brown", origin: "Madhya Pradesh", state: "Pune",
    category: "Marble", finish: "Honed", status: "in-stock", rating: 4.8,
    img: "https://images.unsplash.com/photo-1722605090433-41d1183a792d?w=700&q=82",
  },
  {
    id: "p5", name: "Sunset Gold", origin: "Rajasthan", state: "Jaipur",
    category: "Sandstone", finish: "Brushed", status: "in-stock", rating: 4.6,
    img: "https://images.unsplash.com/photo-1554755229-ca4470e07232?w=700&q=82",
  },
  {
    id: "p6", name: "Tan Brown Granite", origin: "Andhra Pradesh", state: "Hyderabad",
    category: "Granite", finish: "Polished", status: "limited", rating: 4.9,
    img: "https://images.unsplash.com/photo-1733085097233-66441dedba94?w=700&q=82",
  },
];

// Category filter tabs
const CATS = ["All", "Marble", "Granite", "Sandstone"];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } };
const item    = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function ProductCard({ p }: { p: Product }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={item}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_14px_44px_rgba(0,0,0,0.12)] hover:border-stone-300 transition-all duration-300 flex flex-col"
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <SafeImage
          src={p.img}
          alt={p.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700"
          style={{ transform: hovered ? "scale(1.07)" : "scale(1)" }}
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="text-[10.5px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-stone-700 shadow-sm">
            {p.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Name + rating */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-serif text-[1.05rem] font-bold text-stone-950 leading-tight group-hover:text-amber-gold transition-colors duration-200">
            {p.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="font-sans text-[11px] font-semibold text-stone-600">{p.rating}</span>
          </div>
        </div>

        {/* Origin */}
        <div className="flex items-center gap-1.5 mb-3">
          <MapPin size={11} className="text-amber-gold shrink-0" />
          <span className="font-sans text-[11.5px] text-stone-400">
            {p.state} · {p.origin}, India
          </span>
          <span className="text-stone-200 mx-0.5">·</span>
          <span className="font-sans text-[11.5px] text-stone-400">{p.finish}</span>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-end pt-3 mt-auto border-t border-stone-100">
          <Link
            href={`/products/${p.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-950 text-white text-[11.5px] font-sans font-bold hover:bg-amber-gold active:scale-[0.97] transition-all duration-200"
          >
            Get Quote <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturedProductsSection() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = activeTab === "All"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeTab);

  return (
    <section className="py-20 bg-stone-50 border-t border-stone-100">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8"
        >
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-gold mb-2">
              Featured Stones
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-950 leading-tight">
              Bestsellers from across India
            </h2>
            <p className="font-sans text-sm text-stone-400 mt-2">
              Sourced from India&apos;s top quarries, verified for quality.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-[13px] font-sans font-semibold text-stone-950 border border-stone-200 px-5 py-2.5 rounded-full hover:bg-stone-950 hover:text-white hover:border-stone-950 transition-all duration-200 whitespace-nowrap"
          >
            View all products <ArrowRight size={13} />
          </Link>
        </motion.div>

        {/* Category filter tabs */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {CATS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={cn(
                "px-4 py-2 rounded-full font-sans text-[12.5px] font-semibold transition-all duration-200",
                activeTab === cat
                  ? "bg-stone-950 text-white shadow-sm"
                  : "bg-white border border-stone-200 text-stone-600 hover:border-stone-300 hover:text-stone-900"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          key={activeTab}
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map((p) => <ProductCard key={p.id} p={p} />)}
        </motion.div>
      </Container>
    </section>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}