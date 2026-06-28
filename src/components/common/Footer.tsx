"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/ui";
import {
<<<<<<< HEAD
  Facebook, Instagram, Youtube, ArrowRight,
  Phone, Mail, MapPin, Leaf, ShieldCheck, Truck, BadgeCheck,
} from "lucide-react";

const SHOP  = ["Marbles","Granites","Tiles","Slabs","Accessories","New Arrivals","Deals"];
const INFO  = ["About Us","How It Works","Delivery Information","Returns & Refunds","Privacy Policy","Terms & Conditions","FAQ"];
const BIZ   = ["Become a Vendor","Bulk Enquiry","Architects & Designers","Dealers & Distributors"];
const TRUST = [
  { icon: Leaf,       label: "100% Natural Stone"   },
  { icon: ShieldCheck,label: "Secure Payment"        },
  { icon: Truck,      label: "Worldwide Delivery"    },
  { icon: BadgeCheck, label: "Best Price Guarantee"  },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const item    = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

export function Footer() {
  return (
    <footer className="bg-stone-950 text-white">
=======
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

>>>>>>> 3ce4358 (fixed header and footer , hero secton)
      <Container className="pt-16 pb-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
<<<<<<< HEAD
          className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12"
        >
          {/* Brand col */}
          <motion.div variants={item} className="col-span-2 md:col-span-1">
            <div className="mb-1">
              <span className="font-serif text-xl font-bold text-white">
                Stone<span className="text-amber-gold">mart</span>
              </span>
            </div>
            <p className="text-[9.5px] font-sans font-semibold uppercase tracking-[0.2em] text-amber-gold/60 mb-4">
              Marbles &amp; Granites
            </p>
            <p className="text-white/40 text-[12.5px] leading-relaxed mb-5">
              Premium quality marbles and granites, directly from the best quarries. Crafting spaces. Defining luxury.
=======
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
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
            </p>
            <div className="flex items-center gap-2.5">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
<<<<<<< HEAD
                  className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-amber-gold hover:border-amber-gold/40 transition-all duration-200"
                >
                  <Icon size={13} />
=======
                  aria-label="Social link"
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/45 hover:text-stone-950 hover:bg-amber-gold hover:border-amber-gold transition-all duration-200"
                >
                  <Icon size={14} />
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
                </a>
              ))}
            </div>
          </motion.div>

          {/* Shop */}
<<<<<<< HEAD
          <motion.div variants={item}>
            <h4 className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-amber-gold mb-4">Shop</h4>
            <ul className="space-y-2">
              {SHOP.map((l) => (
                <li key={l}>
                  <Link href="#" className="text-white/40 hover:text-amber-gold text-[12.5px] font-sans transition-colors duration-150">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Information */}
          <motion.div variants={item}>
            <h4 className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-amber-gold mb-4">Information</h4>
            <ul className="space-y-2">
              {INFO.map((l) => (
                <li key={l}>
                  <Link href="#" className="text-white/40 hover:text-amber-gold text-[12.5px] font-sans transition-colors duration-150">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* For Business + Customer Care */}
          <motion.div variants={item}>
            <h4 className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-amber-gold mb-4">For Business</h4>
            <ul className="space-y-2 mb-7">
              {BIZ.map((l) => (
                <li key={l}>
                  <Link href="#" className="text-white/40 hover:text-amber-gold text-[12.5px] font-sans transition-colors duration-150">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-amber-gold mb-4">Customer Care</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <Phone size={12} className="text-amber-gold mt-0.5 shrink-0" />
                <div>
                  <p className="text-white/60 text-[12px] font-sans">+91 12345 67890</p>
                  <p className="text-white/30 text-[10.5px]">Mon – Sat: 9AM – 7PM</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={12} className="text-amber-gold mt-0.5 shrink-0" />
                <div>
                  <p className="text-white/60 text-[12px] font-sans">support@stonamart.com</p>
                  <p className="text-white/30 text-[10.5px]">We reply within 24hrs</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={12} className="text-amber-gold mt-0.5 shrink-0" />
                <p className="text-white/40 text-[11.5px] leading-relaxed font-sans">
=======
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
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
                  Plot No. 123, Stone Street,<br />Makrana, Rajasthan, India
                </p>
              </li>
            </ul>
          </motion.div>
<<<<<<< HEAD

          {/* Stay Updated */}
          <motion.div variants={item} className="col-span-2 md:col-span-1">
            <h4 className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-amber-gold mb-4">Stay Updated</h4>
            <p className="text-white/40 text-[12.5px] leading-relaxed mb-4">
              Subscribe to get updates on new arrivals, offers and more.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center bg-white/8 border border-white/12 rounded-sm overflow-hidden mb-5">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 text-[12.5px] font-sans text-white placeholder-white/25 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 h-full py-3 bg-amber-gold text-white hover:bg-[#A6754A] transition-colors shrink-0"
              >
                <ArrowRight size={15} />
              </button>
            </form>
            {/* Payment badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {["VISA", "MC", "RuPay", "UPI"].map((p) => (
                <div
                  key={p}
                  className="px-2.5 py-1.5 rounded bg-white/10 border border-white/10 text-[9px] font-bold font-sans text-white/40 tracking-wide"
                >
                  {p}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Trust strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 py-7 border-t border-white/8">
          {TRUST.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/6 border border-white/10 flex items-center justify-center text-amber-gold shrink-0">
                <Icon size={14} strokeWidth={1.5} />
              </div>
              <span className="text-white/45 text-[12.5px] font-sans font-medium">{label}</span>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-[12px] font-sans">
            © {new Date().getFullYear()} Stonamart Marbles &amp; Granites. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy","Terms","Cookies"].map((t) => (
              <Link key={t} href="#" className="text-white/30 hover:text-amber-gold text-[12px] font-sans transition-colors">
=======
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
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
                {t}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}