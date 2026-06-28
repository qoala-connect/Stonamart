"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/ui";
import {
  Facebook, Instagram, Youtube,
  Phone, Mail, MapPin, Leaf, Truck, BadgeCheck,
} from "lucide-react";

const SHOP = ["Marbles", "Granites", "Tiles", "Slabs", "New Arrivals"];
const COMPANY = ["About Us", "How It Works", "Delivery Information", "Returns & Refunds", "FAQ"];
const BIZ = ["Become a Vendor", "Bulk Enquiry", "Architects & Designers", "Dealers & Distributors"];
const TRUST = [
  { icon: Leaf,       label: "100% Natural Stone"   },
  { icon: Truck,      label: "Pan-India Delivery"   },
  { icon: BadgeCheck, label: "Best Price Guarantee" },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const item    = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

function LinkList({ title, links }: { title: string; links: string[] }) {
  return (
    <motion.div variants={item}>
      <h4 className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-amber-gold mb-4">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l}>
            <Link
              href="#"
              className="group inline-flex items-center text-white/45 hover:text-white text-[12.5px] font-sans transition-colors duration-150"
            >
              <span className="w-0 group-hover:w-3 h-px bg-amber-gold mr-0 group-hover:mr-1.5 transition-all duration-200" />
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Footer() {
  return (
    <footer className="relative bg-stone-950 text-white">
      {/* top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-gold/50 to-transparent" />

      <Container className="pt-16 pb-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-12 mb-14"
        >
          {/* Brand */}
          <motion.div variants={item} className="col-span-2 md:col-span-4">
            <span className="font-serif text-2xl font-bold text-white">
              Stona<span className="text-amber-gold">mart</span>
            </span>
            <p className="text-[9.5px] font-sans font-semibold uppercase tracking-[0.22em] text-amber-gold/60 mt-1 mb-5">
              Marbles &amp; Granites
            </p>
            <p className="text-white/40 text-[12.5px] leading-relaxed mb-6 max-w-xs">
              Premium marbles and granites, sourced directly from India&apos;s finest quarries.
              Crafting spaces. Defining luxury.
            </p>
            <div className="flex items-center gap-2.5">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/45 hover:text-stone-950 hover:bg-amber-gold hover:border-amber-gold transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Shop */}
          <div className="md:col-span-2">
            <LinkList title="Shop" links={SHOP} />
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <LinkList title="Company" links={COMPANY} />
          </div>

          {/* For Business */}
          <div className="md:col-span-2">
            <LinkList title="For Business" links={BIZ} />
          </div>

          {/* Customer Care */}
          <motion.div variants={item} className="col-span-2 md:col-span-2">
            <h4 className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-amber-gold mb-4">
              Customer Care
            </h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2.5">
                <Phone size={13} className="text-amber-gold mt-0.5 shrink-0" />
                <div>
                  <p className="text-white/65 text-[12px] font-sans">+91 12345 67890</p>
                  <p className="text-white/30 text-[10.5px]">Mon – Sat · 9AM – 7PM</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={13} className="text-amber-gold mt-0.5 shrink-0" />
                <div>
                  <p className="text-white/65 text-[12px] font-sans break-all">support@stonamart.com</p>
                  <p className="text-white/30 text-[10.5px]">We reply within 24 hrs</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={13} className="text-amber-gold mt-0.5 shrink-0" />
                <p className="text-white/45 text-[11.5px] leading-relaxed font-sans">
                  Plot No. 123, Stone Street,<br />Makrana, Rajasthan, India
                </p>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-[12px] font-sans">
            © {new Date().getFullYear()} Stonamart Marbles &amp; Granites. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms & Conditions", "Cookies"].map((t) => (
              <Link
                key={t}
                href="#"
                className="text-white/35 hover:text-amber-gold text-[12px] font-sans transition-colors whitespace-nowrap"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}