"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
<<<<<<< HEAD
import { ArrowRight, MapPin, CheckCircle2, AlertCircle, Star } from "lucide-react";
=======
import { ArrowRight, MapPin, Star } from "lucide-react";
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
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
<<<<<<< HEAD
  price: string;
  priceNum: number;
  status: "in-stock" | "limited";
  description: string;
=======
  status: "in-stock" | "limited";
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
  img: string;
  rating: number;
}

const PRODUCTS: Product[] = [
  {
    id: "p1", name: "Makrana White", origin: "Rajasthan", state: "Mumbai",
<<<<<<< HEAD
    category: "Marble", finish: "Polished", price: "₹150–₹400", priceNum: 150,
    status: "in-stock", rating: 4.9,
    description: "The marble that built the Taj Mahal — pristine white with subtle natural veining.",
=======
    category: "Marble", finish: "Polished", status: "in-stock", rating: 4.9,
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
    img: "https://images.unsplash.com/photo-1566041510394-cf7c8fe21800?w=700&q=82",
  },
  {
    id: "p2", name: "Jet Black Granite", origin: "Karnataka", state: "Bangalore",
<<<<<<< HEAD
    category: "Granite", finish: "Polished", price: "₹80–₹200", priceNum: 80,
    status: "in-stock", rating: 4.8,
    description: "Uncompromising jet-black with fine crystalline texture. A South Indian staple.",
=======
    category: "Granite", finish: "Polished", status: "in-stock", rating: 4.8,
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
    img: "https://images.unsplash.com/photo-1699982759850-22dbbd9676b7?w=700&q=82",
  },
  {
    id: "p3", name: "Ambaji White", origin: "Gujarat", state: "Delhi",
<<<<<<< HEAD
    category: "Marble", finish: "Polished", price: "₹120–₹280", priceNum: 120,
    status: "in-stock", rating: 4.7,
    description: "Soft grey veining on a luminous white base — loved for temples and luxury homes.",
=======
    category: "Marble", finish: "Polished", status: "in-stock", rating: 4.7,
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
    img: "https://images.unsplash.com/photo-1726987242665-d0a7d2268ea0?w=700&q=82",
  },
  {
    id: "p4", name: "Indore Brown", origin: "Madhya Pradesh", state: "Pune",
<<<<<<< HEAD
    category: "Marble", finish: "Honed", price: "₹180–₹420", priceNum: 180,
    status: "in-stock", rating: 4.8,
    description: "Rich warm-toned marble with cream veining — a statement piece for kitchens.",
=======
    category: "Marble", finish: "Honed", status: "in-stock", rating: 4.8,
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
    img: "https://images.unsplash.com/photo-1722605090433-41d1183a792d?w=700&q=82",
  },
  {
    id: "p5", name: "Sunset Gold", origin: "Rajasthan", state: "Jaipur",
<<<<<<< HEAD
    category: "Sandstone", finish: "Brushed", price: "₹55–₹130", priceNum: 55,
    status: "in-stock", rating: 4.6,
    description: "Warm Rajasthani sandstone — weather-resistant and timeless for facades.",
=======
    category: "Sandstone", finish: "Brushed", status: "in-stock", rating: 4.6,
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
    img: "https://images.unsplash.com/photo-1554755229-ca4470e07232?w=700&q=82",
  },
  {
    id: "p6", name: "Tan Brown Granite", origin: "Andhra Pradesh", state: "Hyderabad",
<<<<<<< HEAD
    category: "Granite", finish: "Polished", price: "₹400–₹750", priceNum: 400,
    status: "limited", rating: 4.9,
    description: "Deep brown with striking grey-violet crystals. One of India's most exported stones.",
=======
    category: "Granite", finish: "Polished", status: "limited", rating: 4.9,
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
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
<<<<<<< HEAD
      className="group bg-white border border-stone-100 rounded-2xl overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] hover:border-stone-200 transition-all duration-300 flex flex-col"
=======
      className="group bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_14px_44px_rgba(0,0,0,0.12)] hover:border-stone-300 transition-all duration-300 flex flex-col"
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
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
<<<<<<< HEAD
        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span className="text-[10.5px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-stone-700 shadow-sm">
            {p.category}
          </span>
          {p.status === "limited" ? (
            <span className="flex items-center gap-1 text-[10px] font-sans font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
              <AlertCircle size={9} /> Limited
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-sans font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 size={9} /> In Stock
            </span>
          )}
=======
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="text-[10.5px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-stone-700 shadow-sm">
            {p.category}
          </span>
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
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
<<<<<<< HEAD
        <div className="flex items-center gap-1.5 mb-2.5">
=======
        <div className="flex items-center gap-1.5 mb-3">
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
          <MapPin size={11} className="text-amber-gold shrink-0" />
          <span className="font-sans text-[11.5px] text-stone-400">
            {p.state} · {p.origin}, India
          </span>
          <span className="text-stone-200 mx-0.5">·</span>
          <span className="font-sans text-[11.5px] text-stone-400">{p.finish}</span>
        </div>

<<<<<<< HEAD
        {/* Description */}
        <p className="font-sans text-[12.5px] text-stone-500 leading-relaxed mb-3 flex-1">
          {p.description}
        </p>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <div>
            <p className="font-sans text-[9.5px] text-stone-400 uppercase tracking-widest mb-0.5">Per sq ft</p>
            <p className="font-serif text-[1rem] font-bold text-stone-950">
              {p.price} <span className="text-[11px] font-sans font-normal text-stone-400">/ sq ft</span>
            </p>
          </div>
=======
        {/* CTA */}
        <div className="flex items-center justify-end pt-3 mt-auto border-t border-stone-100">
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
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
<<<<<<< HEAD
    <section className="py-20 bg-white border-t border-stone-100">
=======
    <section className="py-20 bg-stone-50 border-t border-stone-100">
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
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
<<<<<<< HEAD
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
=======
                  : "bg-white border border-stone-200 text-stone-600 hover:border-stone-300 hover:text-stone-900"
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
