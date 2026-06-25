"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Ruler, Wrench, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";

// All photos: local files (marble.jpg, granite.jpg, travertine.webp) verified real HD photos
// Unsplash URLs: all verified free commercial license
const CATS = [
  {
    id: "marble",
    name: "Marbles",
    sub: "Premium Marble Collection",
    img: "/images/marble.jpg",           // local — verified real 4480x6720 photo
    href: "/products?category=marble",
    count: "280+ varieties",
  },
  {
    id: "granite",
    name: "Granites",
    sub: "Durable Granite Stones",
    img: "/images/granite.jpg",          // local — verified real 3265x5500 photo
    href: "/products?category=granite",
    count: "150+ varieties",
  },
  {
    id: "tiles",
    name: "Tiles",
    sub: "Designer Stone Tiles",
    img: "https://images.unsplash.com/photo-1754522711595-84428937b07a?w=800&q=82",  // Ela De Pure — free
    href: "/products?category=quartz",
    count: "200+ designs",
  },
  {
    id: "slabs",
    name: "Slabs",
    sub: "Large Slabs Collection",
    img: "/images/travertine.webp",       // local — verified real webp photo
    href: "/products?category=slate",
    count: "90+ options",
  },
];

const TRUST = [
  { icon: Leaf,       title: "100% Natural Stone",    sub: "Direct from Quarries"         },
  { icon: Ruler,      title: "Custom Size Available", sub: "Cut to Your Requirements"     },
  { icon: Wrench,     title: "Expert Guidance",       sub: "Help You Choose the Best"     },
  { icon: ShieldCheck,title: "Secure Payment",        sub: "100% Safe & Secure"           },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };
const fade    = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export function CategoryGrid() {
  return (
    <section id="categories" className="py-20 bg-stone-50">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-serif text-3xl md:text-[2.4rem] font-bold text-stone-950 mb-2.5">
            Shop By Category
          </h2>
          <p className="font-sans text-sm text-stone-400 mb-4">
            Choose from our wide range of premium stones
          </p>
          <div className="flex items-center justify-center gap-1.5">
            <div className="h-px w-8 bg-stone-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-gold" />
            <div className="h-px w-8 bg-stone-200" />
          </div>
        </motion.div>

        {/* 4 cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {CATS.map((cat) => (
            <motion.div key={cat.id} variants={fade}>
              <Link
                href={cat.href}
                className="group flex flex-col bg-white rounded-xl overflow-hidden border border-stone-100 hover:border-stone-200 hover:shadow-[0_12px_36px_rgba(0,0,0,0.09)] transition-all duration-350"
              >
                {/* Photo */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "3/2" }}>
                  <SafeImage
                    src={cat.img}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  {/* Count overlay */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-full bg-white/85 backdrop-blur-sm text-[10px] font-sans font-semibold text-stone-600">
                    {cat.count}
                  </div>
                </div>

                {/* Label */}
                <div className="flex items-center justify-between px-4 py-3.5">
                  <div>
                    <h3 className="font-serif text-[15px] font-bold text-stone-950 group-hover:text-amber-gold transition-colors duration-200">
                      {cat.name}
                    </h3>
                    <p className="font-sans text-[11px] text-stone-400 mt-0.5">{cat.sub}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 group-hover:bg-amber-gold group-hover:border-amber-gold group-hover:text-white transition-all duration-250 shrink-0">
                    <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-5 bg-white border border-stone-100 rounded-xl px-7 py-6"
        >
          {TRUST.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-gold/10 flex items-center justify-center text-amber-gold shrink-0">
                <Icon size={16} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-sans text-[12.5px] font-semibold text-stone-800">{title}</p>
                <p className="font-sans text-[11px] text-stone-400">{sub}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
