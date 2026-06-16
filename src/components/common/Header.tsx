"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui";
import {
  MapPin, ChevronDown, Menu, X, Check,
  User, Building2, ShieldCheck, LogIn, ArrowRight, Gem, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CITIES = [
  { id: "mumbai",    name: "Mumbai",    region: "Maharashtra" },
  { id: "delhi",     name: "Delhi",     region: "Delhi NCR" },
  { id: "bangalore", name: "Bangalore", region: "Karnataka" },
  { id: "hyderabad", name: "Hyderabad", region: "Telangana" },
  { id: "pune",      name: "Pune",      region: "Maharashtra" },
  { id: "kolkata",   name: "Kolkata",   region: "West Bengal" },
  { id: "chennai",   name: "Chennai",   region: "Tamil Nadu" },
  { id: "jaipur",    name: "Jaipur",    region: "Rajasthan" },
  { id: "ahmedabad", name: "Ahmedabad", region: "Gujarat" },
  { id: "surat",     name: "Surat",     region: "Gujarat" },
];

const NAV_LINKS = [
  { href: "/products", label: "Catalog" },
  { href: "/about",    label: "About" },
];

// ─── Grain texture ────────────────────────────────────────────────────────────
const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

// ─── Animated marble backgrounds for modal ────────────────────────────────────
function CustomerMarble() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(148deg, #eef3ff 0%, #e4ecff 32%, #d8e4fc 60%, #e4ecff 100%)" }} />
      <motion.div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 28% 38%, rgba(147,197,253,0.42) 0%, transparent 58%)" }}
        animate={{ x: [0, 28, 0], opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 75% 65%, rgba(196,181,253,0.24) 0%, transparent 48%)" }}
        animate={{ x: [0, -18, 0], opacity: [0.35, 0.75, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 290" preserveAspectRatio="xMidYMid slice">
        <path d="M -10 58 C 72 35, 172 72, 275 46 S 358 72, 390 58" stroke="rgba(148,163,210,0.48)" strokeWidth="1.6" fill="none" />
        <path d="M -10 138 C 88 112, 195 152, 305 125" stroke="rgba(148,163,210,0.30)" strokeWidth="1.1" fill="none" />
        <path d="M -10 218 C 78 192, 188 228, 292 202" stroke="rgba(148,163,210,0.18)" strokeWidth="0.72" fill="none" />
        <path d="M 165 -5 C 170 75, 162 152, 168 228" stroke="rgba(148,163,210,0.16)" strokeWidth="0.62" fill="none" />
      </svg>
      <div className="absolute inset-0" style={{ backgroundImage: GRAIN, backgroundSize: "148px", opacity: 0.04, mixBlendMode: "multiply" as const }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.38) 0%, transparent 52%)" }} />
    </div>
  );
}

function VendorMarble() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(148deg, #fef9ee 0%, #f9f0db 32%, #f4e8cc 60%, #f9f0db 100%)" }} />
      <motion.div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 32% 36%, rgba(201,169,97,0.36) 0%, transparent 55%)" }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.52, 1, 0.52] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 72% 68%, rgba(245,200,100,0.22) 0%, transparent 45%)" }}
        animate={{ scale: [1.12, 1, 1.12], opacity: [0.28, 0.68, 0.28] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 290" preserveAspectRatio="xMidYMid slice">
        <path d="M -10 65 C 80 40, 190 80, 302 52 S 372 78, 402 65" stroke="rgba(160,128,72,0.52)" strokeWidth="1.8" fill="none" />
        <path d="M 190 80 C 200 110, 212 148, 224 185" stroke="rgba(160,128,72,0.28)" strokeWidth="0.9" fill="none" />
        <path d="M -10 152 C 90 125, 198 162, 312 135" stroke="rgba(160,128,72,0.32)" strokeWidth="1.2" fill="none" />
        <path d="M -10 228 C 84 204, 192 240, 305 215" stroke="rgba(160,128,72,0.18)" strokeWidth="0.8" fill="none" />
      </svg>
      <div className="absolute inset-0" style={{ backgroundImage: GRAIN, backgroundSize: "148px", opacity: 0.05, mixBlendMode: "multiply" as const }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.32) 0%, transparent 52%)" }} />
    </div>
  );
}

function AdminMarble() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(148deg, #151b2e 0%, #1c2240 32%, #111828 62%, #161c30 100%)" }} />
      <motion.div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 28% 38%, rgba(201,169,97,0.18) 0%, transparent 50%)" }}
        animate={{ x: [0, 24, 0], opacity: [0.38, 0.88, 0.38] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 72% 65%, rgba(148,163,210,0.13) 0%, transparent 42%)" }}
        animate={{ x: [0, -16, 0], opacity: [0.28, 0.65, 0.28] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 290" preserveAspectRatio="xMidYMid slice">
        <path d="M -10 74 C 84 48, 198 88, 312 58 S 385 85, 415 74" stroke="rgba(255,255,255,0.12)" strokeWidth="2.0" fill="none" />
        <path d="M 198 88 C 208 120, 220 158, 230 195" stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" fill="none" />
        <path d="M -10 165 C 88 138, 200 175, 315 148" stroke="rgba(201,169,97,0.25)" strokeWidth="1.4" fill="none" />
        <path d="M -10 245 C 84 220, 198 258, 312 230" stroke="rgba(255,255,255,0.06)" strokeWidth="0.72" fill="none" />
      </svg>
      <div className="absolute inset-0" style={{ backgroundImage: GRAIN, backgroundSize: "148px", opacity: 0.08, mixBlendMode: "overlay" as const }} />
    </div>
  );
}

// ─── Role options ─────────────────────────────────────────────────────────────
const ROLE_OPTIONS = [
  {
    id: "customer", label: "Customer", tagline: "Browse & Enquire",
    desc: "Explore premium stones, compare prices and request quotes from verified vendors.",
    icon: User, href: "/customer/auth", Bg: CustomerMarble, textLight: false,
    accentColor: "rgba(59,130,246,0.88)", iconBorder: "rgba(59,130,246,0.45)",
    chipBg: "rgba(59,130,246,0.10)", chipBorder: "rgba(59,130,246,0.28)", chipText: "rgba(37,99,235,0.92)",
  },
  {
    id: "vendor", label: "Vendor", tagline: "Grow Your Business",
    desc: "List inventory, manage orders, and reach thousands of buyers across India.",
    icon: Building2, href: "/vendor/register", Bg: VendorMarble, textLight: false,
    accentColor: "rgba(160,110,30,0.90)", iconBorder: "rgba(201,169,97,0.55)",
    chipBg: "rgba(201,169,97,0.12)", chipBorder: "rgba(201,169,97,0.32)", chipText: "rgba(140,100,25,0.92)",
  },
  {
    id: "admin", label: "Admin", tagline: "Operations Portal",
    desc: "Approve vendors, review listings, and oversee all platform operations.",
    icon: ShieldCheck, href: "/login", Bg: AdminMarble, textLight: true,
    accentColor: "rgba(201,169,97,0.90)", iconBorder: "rgba(255,255,255,0.20)",
    chipBg: "rgba(255,255,255,0.10)", chipBorder: "rgba(255,255,255,0.20)", chipText: "rgba(255,255,255,0.75)",
  },
] as const;

// ─── Portal Selection Modal ───────────────────────────────────────────────────
function LoginModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.20 }}
    >
      <motion.div className="absolute inset-0"
        style={{ background: "rgba(8,10,18,0.75)", backdropFilter: "blur(10px)" }}
        onClick={onClose} />

      <motion.div
        className="relative w-full max-w-3xl rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(158deg, #f9f7f4 0%, #f2ede6 100%)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.85)",
        }}
        initial={{ scale: 0.90, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 12 }}
        transition={{ duration: 0.30, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="h-1" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,169,97,0.45) 18%, #c9a961 50%, rgba(201,169,97,0.45) 82%, transparent 100%)" }} />
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-dark/8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-stone-950 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-amber-gold font-serif font-bold text-base leading-none">S</span>
            </div>
            <div>
              <p className="text-[10px] font-sans font-bold text-amber-gold uppercase tracking-[0.22em] leading-none">Welcome to Stonamart</p>
              <h2 className="font-serif text-lg font-bold text-stone-950 mt-0.5 leading-tight">Choose your portal</h2>
            </div>
          </div>
          <motion.button onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-dark/6 flex items-center justify-center hover:bg-stone-dark/12 transition-colors"
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
            <X size={14} className="text-stone-dark/55" />
          </motion.button>
        </div>

        <div className="grid grid-cols-3 gap-4 p-5">
          {ROLE_OPTIONS.map((opt, i) => {
            const Icon = opt.icon;
            return (
              <motion.button key={opt.id}
                onClick={() => { onClose(); router.push(opt.href); }}
                className="relative rounded-2xl overflow-hidden text-left group focus:outline-none"
                style={{ minHeight: 290 }}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.10 + i * 0.08, duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -5 }} whileTap={{ scale: 0.97 }}
              >
                <motion.div className="absolute inset-0"
                  variants={{ rest: { scale: 1 }, hover: { scale: 1.07, transition: { duration: 0.60, ease: [0.25, 0.46, 0.45, 0.94] } } }}
                  initial="rest" whileHover="hover">
                  <opt.Bg />
                </motion.div>
                <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)" }} />
                <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
                  initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.25 }}
                  style={{ boxShadow: `0 0 0 2px ${opt.accentColor}` }} />
                <div className="absolute inset-x-0 bottom-0 h-3/5 pointer-events-none" style={{
                  background: opt.textLight
                    ? "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.38) 55%, transparent 100%)"
                    : "linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.60) 52%, transparent 100%)",
                }} />
                <div className="relative z-10 flex flex-col h-full p-4" style={{ minHeight: 290 }}>
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0"
                      style={{ background: opt.textLight ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.72)", border: `1.5px solid ${opt.iconBorder}`, boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}>
                      <Icon size={17} style={{ color: opt.textLight ? "rgba(255,255,255,0.90)" : opt.accentColor }} />
                    </div>
                    <span className="text-[9px] font-sans font-bold uppercase tracking-[0.18em] px-2 py-1 rounded-full backdrop-blur-sm"
                      style={{ background: opt.chipBg, border: `1px solid ${opt.chipBorder}`, color: opt.chipText }}>
                      {opt.id}
                    </span>
                  </div>
                  <div className="flex-1" />
                  <div>
                    <h3 className="font-serif text-[1.3rem] font-bold leading-tight mb-1" style={{ color: opt.textLight ? "#ffffff" : "#0a0a0a" }}>{opt.label}</h3>
                    <p className="font-sans text-[11px] font-semibold mb-2.5" style={{ color: opt.textLight ? "rgba(201,169,97,0.95)" : opt.accentColor }}>{opt.tagline}</p>
                    <p className="font-sans text-[11px] leading-relaxed mb-4" style={{ color: opt.textLight ? "rgba(255,255,255,0.58)" : "rgba(10,10,10,0.50)" }}>{opt.desc}</p>
                    <div className="flex items-center gap-1.5 font-sans text-xs font-bold" style={{ color: opt.textLight ? "#c9a961" : "rgba(10,10,10,0.68)" }}>
                      Continue
                      <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.45 }}>
                        <ArrowRight size={12} />
                      </motion.span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
        <div className="px-6 py-4 border-t border-stone-dark/6 bg-stone-dark/[0.018] flex items-center justify-center">
          <p className="font-sans text-[12.5px] text-stone-dark/45">
            Already have an account?{" "}
            <button onClick={() => { onClose(); router.push("/login"); }} className="text-amber-gold hover:text-amber-gold/70 font-semibold transition-colors">
              Sign in here
            </button>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Mobile portal options ────────────────────────────────────────────────────
const PORTAL_OPTIONS_MOBILE = [
  { id: "customer", label: "Customer", desc: "Browse & enquire for your project",  icon: User,        href: "/customer/auth",   iconBg: "bg-blue-50",        iconColor: "text-blue-500"       },
  { id: "vendor",   label: "Vendor",   desc: "List inventory & manage orders",     icon: Building2,   href: "/vendor/register", iconBg: "bg-amber-50",       iconColor: "text-amber-600"      },
  { id: "admin",    label: "Admin",    desc: "Internal operations portal",         icon: ShieldCheck, href: "/login",           iconBg: "bg-slate-100",      iconColor: "text-slate-500"      },
] as const;

// ─── Header ───────────────────────────────────────────────────────────────────
export function Header() {
  const [cityOpen,     setCityOpen]     = useState(false);
  const [loginOpen,    setLoginOpen]    = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [selectedCity, setSelectedCity] = useState("mumbai");
  const [scrolled,     setScrolled]     = useState(false);
  const cityRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const v = document.cookie.split("; ").find((r) => r.startsWith("selectedCity="))?.split("=")[1];
    if (v) setSelectedCity(v);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setCityOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const activeCity = CITIES.find((c) => c.id === selectedCity);

  const handleSelectCity = (id: string) => {
    setSelectedCity(id);
    setCityOpen(false);
    document.cookie = `selectedCity=${id}; path=/; max-age=31536000`;
  };

  return (
    <>
      {/* ── Main header bar ── */}
      <header className={cn("sticky top-0 z-50 transition-all duration-500", scrolled ? "shadow-[0_8px_40px_rgba(0,0,0,0.10)]" : "")}>

        {/* ── Thin top announcement ribbon ── */}
        <div className="hidden md:flex items-center justify-center gap-2 py-2 text-center"
          style={{
            background: "linear-gradient(90deg, #1a2038 0%, #1e2742 45%, #1a2038 100%)",
            borderBottom: "1px solid rgba(201,169,97,0.18)",
          }}>
          <Sparkles size={10} className="text-amber-gold opacity-70" />
          <span className="font-sans text-[10.5px] text-white/55 tracking-[0.12em]">
            India&apos;s Premium Stone Marketplace — 1,200+ verified vendors across 10 cities
          </span>
          <Sparkles size={10} className="text-amber-gold opacity-70" />
        </div>

        {/* ── Main nav bar ── */}
        <div
          className="relative"
          style={{
            background: scrolled
              ? "rgba(255,255,255,0.96)"
              : "linear-gradient(158deg, #ffffff 0%, #faf8f5 50%, #f7f3ed 100%)",
            backdropFilter: scrolled ? "blur(20px)" : "none",
            borderBottom: scrolled ? "1px solid rgba(201,169,97,0.14)" : "1px solid rgba(201,169,97,0.10)",
          }}
        >
          {/* Marble SVG vein — decorative, across full width */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 80" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <path d="M -20 32 C 180 18, 420 45, 680 28 S 1020 50, 1240 35 S 1400 48, 1465 38"
              stroke="rgba(201,169,97,0.10)" strokeWidth="1.2" fill="none" />
            <path d="M -20 55 C 220 42, 480 65, 740 50 S 1080 70, 1300 55 S 1420 65, 1465 60"
              stroke="rgba(180,165,145,0.07)" strokeWidth="0.8" fill="none" />
          </svg>

          {/* Gold left accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px]"
            style={{ background: "linear-gradient(180deg, transparent 0%, rgba(201,169,97,0.7) 28%, #c9a961 55%, rgba(201,169,97,0.6) 80%, transparent 100%)" }} />

          <Container>
            <div className="relative flex items-center justify-between h-[72px]">

              {/* ── Logo ── */}
              <Link href="/" className="flex items-center gap-3.5 group flex-shrink-0 z-10">
                {/* Logo mark */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: "linear-gradient(138deg, #1a1a1a 0%, #2c2c2c 100%)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.22), 0 0 0 1px rgba(201,169,97,0.30)",
                    }}>
                    <Gem size={18} className="text-amber-gold relative z-10" />
                    {/* Inner shimmer */}
                    <div className="absolute inset-0 opacity-20"
                      style={{ background: "linear-gradient(135deg, rgba(201,169,97,0.5) 0%, transparent 60%)" }} />
                  </div>
                  {/* Gold dot accent */}
                  <motion.div
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-sm bg-amber-gold"
                    animate={{ opacity: [0.65, 1, 0.65], scale: [1, 1.08, 1] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>

                {/* Word mark */}
                <div className="hidden sm:block">
                  <p className="font-serif text-[1.35rem] font-bold text-stone-950 tracking-tight leading-none group-hover:text-stone-dark transition-colors duration-200">
                    Stonamart
                  </p>
                  <p className="text-[9.5px] text-stone-dark/38 font-sans uppercase tracking-[0.22em] leading-none mt-0.5">
                    Premium Stone Marketplace
                  </p>
                </div>
              </Link>

              {/* ── Nav links — centred ── */}
              <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                {NAV_LINKS.map((item) => (
                  <motion.div key={item.href} whileHover={{ y: -1.5 }} transition={{ duration: 0.15 }}>
                    <Link href={item.href}
                      className="relative font-sans text-[13.5px] font-semibold text-stone-dark/55 hover:text-stone-950 transition-colors duration-200 tracking-wide group">
                      {item.label}
                      {/* Animated underline */}
                      <motion.span
                        className="absolute -bottom-1 left-0 h-px bg-amber-gold"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      />
                    </Link>
                  </motion.div>
                ))}

                {/* Separator dot */}
                <span className="w-1 h-1 rounded-full bg-amber-gold/40" />

                {/* Inline Products link styled differently */}
                <motion.div whileHover={{ y: -1.5 }} transition={{ duration: 0.15 }}>
                  <Link href="/products"
                    className="relative font-sans text-[13.5px] font-semibold text-stone-dark/55 hover:text-stone-950 transition-colors duration-200 tracking-wide group flex items-center gap-1.5">
                    All Stones
                    <span className="text-[9px] font-bold text-amber-gold bg-amber-gold/10 border border-amber-gold/25 px-1.5 py-0.5 rounded-full leading-none">
                      1200+
                    </span>
                  </Link>
                </motion.div>
              </nav>

              {/* ── Right side controls ── */}
              <div className="flex items-center gap-2.5 z-10">

                {/* City selector */}
                <div className="relative hidden md:block" ref={cityRef}>
                  <motion.button
                    onClick={() => setCityOpen((v) => !v)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2.5 pl-3 pr-3.5 py-2 rounded-xl transition-all duration-200 group"
                    style={{
                      background: cityOpen ? "rgba(201,169,97,0.08)" : "rgba(0,0,0,0.03)",
                      border: cityOpen ? "1px solid rgba(201,169,97,0.35)" : "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    <div className="w-5 h-5 rounded-full bg-amber-gold/15 flex items-center justify-center flex-shrink-0">
                      <MapPin size={10} className="text-amber-gold" />
                    </div>
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[8.5px] text-stone-dark/38 font-sans uppercase tracking-[0.18em]">Ship to</span>
                      <span className="text-[13px] font-semibold text-stone-950 font-sans mt-0.5">{activeCity?.name}</span>
                    </div>
                    <motion.div animate={{ rotate: cityOpen ? 180 : 0 }} transition={{ duration: 0.22 }}>
                      <ChevronDown size={12} className="text-stone-dark/40" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {cityOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="absolute top-full right-0 mt-2.5 w-60 bg-white rounded-2xl z-50 overflow-hidden"
                        style={{ boxShadow: "0 16px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)" }}
                      >
                        {/* City dropdown header */}
                        <div className="px-4 py-3 border-b border-stone-dark/6">
                          <p className="text-[10px] font-bold text-stone-dark/38 uppercase tracking-[0.18em]">Select City</p>
                        </div>
                        <div className="max-h-64 overflow-y-auto py-1.5">
                          {CITIES.map((city) => (
                            <motion.button key={city.id}
                              onClick={() => handleSelectCity(city.id)}
                              className={cn(
                                "w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-amber-gold/5 transition-colors duration-150",
                                city.id === selectedCity && "bg-amber-gold/8"
                              )}
                              whileHover={{ x: 3 }} transition={{ duration: 0.1 }}
                            >
                              <div>
                                <p className={cn("text-[13px] font-semibold", city.id === selectedCity ? "text-amber-gold" : "text-stone-950")}>
                                  {city.name}
                                </p>
                                <p className="text-[11px] text-stone-dark/38 font-sans mt-0.5">{city.region}</p>
                              </div>
                              {city.id === selectedCity && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }}>
                                  <Check size={13} className="text-amber-gold" />
                                </motion.div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-6 bg-stone-dark/10" />

                {/* Get a Quote CTA */}
                <Link href="/products"
                  className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans text-[13px] font-semibold transition-all duration-250 whitespace-nowrap group"
                  style={{
                    background: "linear-gradient(135deg, rgba(201,169,97,0.10) 0%, rgba(201,169,97,0.06) 100%)",
                    border: "1px solid rgba(201,169,97,0.38)",
                    color: "#8b6914",
                  }}
                >
                  Get a Quote
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200 text-amber-gold" />
                </Link>

                {/* Sign In button — premium dark pill */}
                <motion.button
                  onClick={() => setLoginOpen(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans text-[13px] font-semibold whitespace-nowrap transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                    color: "#ffffff",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.06) inset",
                  }}
                >
                  <LogIn size={13} className="text-amber-gold" />
                  Sign In
                  {/* Gold shimmer on hover */}
                  <motion.span
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    style={{ background: "linear-gradient(135deg, rgba(201,169,97,0.08) 0%, transparent 60%)" }}
                  />
                </motion.button>

                {/* Mobile hamburger */}
                <motion.button
                  onClick={() => setMobileOpen((v) => !v)}
                  className="lg:hidden relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                  style={{ background: mobileOpen ? "rgba(201,169,97,0.10)" : "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.07)" }}
                  whileTap={{ scale: 0.94 }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {mobileOpen ? (
                      <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                        <X size={18} className="text-stone-950" />
                      </motion.div>
                    ) : (
                      <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                        <Menu size={18} className="text-stone-950" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </Container>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:hidden overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #faf8f5 0%, #f4efe8 100%)",
                borderBottom: "1px solid rgba(201,169,97,0.14)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.07)",
              }}
            >
              <Container>
                <div className="py-5 space-y-1">
                  {/* Nav links */}
                  {[...NAV_LINKS, { href: "/products", label: "All Stones" }].map((item, i) => (
                    <motion.div key={item.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                      <Link href={item.href}
                        className="flex items-center gap-3 px-4 py-3 text-stone-dark/65 hover:text-stone-950 hover:bg-amber-gold/5 rounded-xl font-sans font-semibold text-sm transition-colors"
                        onClick={() => setMobileOpen(false)}>
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}

                  {/* Divider */}
                  <div className="pt-3 pb-1 border-t border-stone-dark/6 mt-2">
                    <p className="px-4 py-1.5 text-[10px] font-sans font-bold text-amber-gold uppercase tracking-[0.22em]">Sign in as</p>
                  </div>

                  {PORTAL_OPTIONS_MOBILE.map((opt, i) => {
                    const Icon = opt.icon;
                    return (
                      <motion.div key={opt.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18 + i * 0.06 }}>
                        <Link href={opt.href} onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-amber-gold/5 transition-colors group">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${opt.iconBg}`}>
                            <Icon size={15} className={opt.iconColor} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-sans font-semibold text-[13.5px] text-stone-950">{opt.label}</p>
                            <p className="font-sans text-[11.5px] text-stone-dark/42">{opt.desc}</p>
                          </div>
                          <ArrowRight size={14} className="text-stone-dark/25 group-hover:text-amber-gold group-hover:translate-x-0.5 transition-all duration-150 flex-shrink-0" />
                        </Link>
                      </motion.div>
                    );
                  })}

                  {/* Footer */}
                  <div className="px-4 pt-3 pb-2 border-t border-stone-dark/6 mt-2">
                    <p className="font-sans text-[12.5px] text-stone-dark/42 text-center">
                      Have an account?{" "}
                      <Link href="/login" onClick={() => setMobileOpen(false)} className="text-amber-gold font-semibold hover:text-amber-gold/75 transition-colors">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Portal selection modal */}
      <AnimatePresence>
        {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

