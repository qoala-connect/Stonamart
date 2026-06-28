"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin, ChevronDown, Menu, X, Check,
  User, ShieldCheck, ArrowRight, Camera, Search, Package,
  Home, LayoutGrid, Info, Mail, LogOut, LayoutDashboard,
  MessageSquare, Mic, MicOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { searchProducts, type SearchSuggestion } from "@/lib/search-actions";

const AIImageSearchModal = dynamic(
  () => import("@/components/catalog/AIImageSearchModal").then((m) => ({ default: m.AIImageSearchModal })),
  { ssr: false }
);

const CITIES = [
  { id: "mumbai",    name: "Mumbai",    region: "Maharashtra" },
  { id: "delhi",     name: "Delhi",     region: "Delhi NCR"   },
  { id: "bangalore", name: "Bangalore", region: "Karnataka"   },
  { id: "hyderabad", name: "Hyderabad", region: "Telangana"   },
  { id: "pune",      name: "Pune",      region: "Maharashtra" },
  { id: "kolkata",   name: "Kolkata",   region: "West Bengal" },
  { id: "chennai",   name: "Chennai",   region: "Tamil Nadu"  },
  { id: "jaipur",    name: "Jaipur",    region: "Rajasthan"   },
  { id: "ahmedabad", name: "Ahmedabad", region: "Gujarat"     },
  { id: "surat",     name: "Surat",     region: "Gujarat"     },
];

const NAV_LINKS = [
  { href: "/",         label: "Home",       icon: Home       },
  { href: "/products", label: "Collection", icon: LayoutGrid },
  { href: "/about",    label: "About Us",   icon: Info       },
  { href: "/contact",  label: "Contact",    icon: Mail       },
];

const ROLE_OPTIONS = [
<<<<<<< HEAD
  { id: "customer", label: "Customer", tagline: "Shop premium stones",   icon: User,        href: "/customer/auth",   desc: "Shop premium marbles, granites, tiles and more."         },
  { id: "vendor",   label: "Vendor",   tagline: "Grow your business",    icon: Package,     href: "/vendor/register", desc: "Manage products, orders and grow your business."         },
  { id: "admin",    label: "Admin",    tagline: "Manage operations",     icon: ShieldCheck, href: "/admin/auth",      desc: "Access and manage the platform and its operations."      },
=======
  { id: "customer", label: "Customer", tagline: "Shop premium stones", icon: User,        href: "/customer/auth",   desc: "Shop premium marbles, granites, tiles and more."   },
  { id: "vendor",   label: "Vendor",   tagline: "Grow your business",  icon: Package,     href: "/vendor/register", desc: "Manage products, orders and grow your business."   },
  { id: "admin",    label: "Admin",    tagline: "Manage operations",   icon: ShieldCheck, href: "/admin/auth",      desc: "Access and manage the platform and its operations." },
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
] as const;

// ─── Role-specific menu items ─────────────────────────────────────────────────
type MenuItem = { label: string; href: string; icon: React.ElementType };

function getMenuItems(role: string): MenuItem[] {
  if (role === "CUSTOMER") return [
<<<<<<< HEAD
    { label: "My Profile",   href: "/account",               icon: User         },
=======
    { label: "My Profile",   href: "/account",               icon: User          },
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
    { label: "My Inquiries", href: "/account?tab=inquiries", icon: MessageSquare },
  ];
  if (role === "VENDOR") return [
    { label: "Vendor Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
    { label: "My Products",      href: "/vendor/dashboard", icon: Package         },
  ];
  // ADMIN
  return [
<<<<<<< HEAD
    { label: "Admin Dashboard",  href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Product Reviews",  href: "/admin/dashboard", icon: Package         },
=======
    { label: "Admin Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Product Reviews", href: "/admin/dashboard", icon: Package         },
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
  ];
}

function roleColor(role: string) {
  if (role === "ADMIN")  return "from-red-500/20 to-red-400/10 border-red-200/60 text-red-600";
  if (role === "VENDOR") return "from-blue-500/20 to-blue-400/10 border-blue-200/60 text-blue-600";
  return "from-amber-500/20 to-amber-400/10 border-amber-200/60 text-amber-600";
}

<<<<<<< HEAD
// ─── Search Bar with voice ────────────────────────────────────────────────────
function SearchBar() {
  const router = useRouter();
  const [query, setQuery]           = useState("");
  const [listening, setListening]   = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [open, setOpen]             = useState(false);
=======
// ─── Search Bar with voice + live suggestions ─────────────────────────────────
function SearchBar() {
  const router = useRouter();
  const [query, setQuery]             = useState("");
  const [listening, setListening]     = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [open, setOpen]               = useState(false);
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
  const wrapRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced suggestions fetch
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!query.trim()) { setSuggestions([]); setOpen(false); return; }
    timerRef.current = setTimeout(async () => {
<<<<<<< HEAD
      const res = await searchProducts(query);
      setSuggestions(res);
      setOpen(true);
=======
      try {
        const res = await searchProducts(query);
        setSuggestions(res);
        setOpen(true);
      } catch {
        setSuggestions([]);
        setOpen(false);
      }
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
    }, 220);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const go = useCallback((q: string) => {
    if (!q.trim()) return;
    setOpen(false);
    router.push(`/products?q=${encodeURIComponent(q.trim())}`);
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    go(query);
  }

  function startVoice() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Voice search not supported in this browser."); return; }
    const rec = new SR();
    rec.lang = "en-IN";
    rec.continuous = false;
    rec.interimResults = false;
    setListening(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      const text = e.results[0]?.[0]?.transcript ?? "";
      setQuery(text);
      setListening(false);
      if (text.trim()) go(text);
    };
    rec.onerror = () => setListening(false);
    rec.onend   = () => setListening(false);
    rec.start();
  }

  return (
<<<<<<< HEAD
    <div ref={wrapRef} className="relative w-full max-w-[520px]">
=======
    <div ref={wrapRef} className="relative w-full max-w-[420px]">
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
      <form onSubmit={handleSubmit}>
        <div className={cn(
          "flex items-center gap-2 pl-4 pr-2 py-2 rounded-full border transition-all duration-200",
          "bg-stone-50 border-stone-200 hover:border-stone-300",
          "focus-within:bg-white focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/15"
        )}>
          <Search size={15} className="text-stone-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="Search marbles, granites, tiles…"
            className="flex-1 min-w-0 bg-transparent text-[13.5px] font-sans text-stone-800 placeholder:text-stone-400 outline-none"
          />
          {/* Mic button */}
          <button
            type="button"
            onClick={startVoice}
            title="Search by voice"
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-200",
              listening
                ? "bg-red-50 text-red-500 animate-pulse"
                : "text-stone-400 hover:text-amber-600 hover:bg-amber-50"
            )}
          >
            {listening ? <MicOff size={14} /> : <Mic size={14} />}
          </button>
          {/* Search button */}
          <button
            type="submit"
            title="Search"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-900 text-white flex-shrink-0 hover:bg-amber-600 transition-colors duration-200"
          >
            <Search size={13} />
          </button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: -6, scale: 0.98  }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.13)] border border-stone-100 overflow-hidden z-[200]"
          >
            {suggestions.map(s => (
              <button
                key={s.id}
                onClick={() => { setOpen(false); setQuery(""); router.push(`/products/${s.id}`); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors text-left group"
              >
                {s.imageUrl ? (
                  <Image src={s.imageUrl} alt={s.name} width={40} height={40}
                    className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-stone-100" unoptimized />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0">
                    <Package size={14} className="text-stone-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-sans font-semibold text-stone-800 truncate">{s.name}</p>
                  <p className="text-[11px] font-sans text-stone-400">{s.category} · {s.materialType}</p>
                </div>
                <ArrowRight size={12} className="text-stone-300 group-hover:text-amber-500 flex-shrink-0 transition-colors" />
              </button>
            ))}
            {/* See all results */}
            <div className="border-t border-stone-100 px-4 py-2.5">
              <button
                onClick={() => go(query)}
                className="text-[12px] font-sans font-medium text-amber-600 hover:text-amber-700 transition-colors"
              >
                See all results for &ldquo;{query}&rdquo; →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── User dropdown menu ───────────────────────────────────────────────────────
function UserMenu({ user }: { user: { name: string; email: string; role: string } }) {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const firstName = user.name.split(" ")[0];
  const initials = user.name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const menuItems = getMenuItems(user.role);

  // Close on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    await authClient.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-all duration-200 group"
      >
        {/* Avatar */}
        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${roleColor(user.role)} border flex items-center justify-center flex-shrink-0`}>
          <span className="text-[10px] font-bold font-sans">{initials}</span>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-[12px] font-sans font-semibold text-stone-800 leading-none">
            Welcome, {firstName}
          </p>
          <p className="text-[9.5px] font-sans text-stone-400 mt-0.5 capitalize leading-none">
            {user.role.toLowerCase()}
          </p>
        </div>
        <ChevronDown
          size={13}
          className={cn(
            "text-stone-400 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.12)] border border-stone-100 overflow-hidden z-50"
          >
            {/* User info header */}
            <div className="px-4 py-3 border-b border-stone-100 bg-stone-50/60">
              <p className="text-[12px] font-sans font-semibold text-stone-800 truncate">
                {user.name}
              </p>
              <p className="text-[10.5px] font-sans text-stone-400 truncate">{user.email}</p>
              <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-gradient-to-r ${roleColor(user.role)} border`}>
                {user.role}
              </span>
            </div>

            {/* Menu items */}
            <div className="py-1">
              {menuItems.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-sans text-stone-700 hover:bg-stone-50 hover:text-stone-950 transition-colors"
                >
                  <Icon size={14} className="text-stone-400" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Sign out */}
            <div className="border-t border-stone-100 py-1">
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-sans text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <LogOut size={14} />
                {signingOut ? "Signing out…" : "Sign Out"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Login Modal ─────────────────────────────────────────────────────────────
function LoginModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-stone-950/70 backdrop-blur-[8px]"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[540px] bg-white rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.32)] overflow-hidden"
      >
        <div className="h-[3px] bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-xl flex items-center justify-center border border-stone-200 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-all duration-200"
        >
          <X size={15} />
        </button>

        <div className="px-7 pt-7 pb-5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-4">
            <User size={21} className="text-amber-600" strokeWidth={1.5} />
          </div>
          <h2 className="font-serif text-[1.45rem] font-bold text-stone-900 mb-1">Welcome to Stonamart</h2>
          <p className="font-sans text-[13px] text-stone-400">Choose your account type to continue</p>
        </div>

        <div className="grid grid-cols-3 gap-3 px-6 pb-5">
          {ROLE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => { onClose(); router.push(opt.href); }}
                className="group flex flex-col items-center text-center p-4 rounded-2xl border border-stone-200 bg-stone-50/60 hover:bg-white hover:border-amber-300 hover:shadow-[0_8px_32px_rgba(184,134,90,0.14)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-stone-200 shadow-sm flex items-center justify-center mb-3 group-hover:bg-amber-50 group-hover:border-amber-200 group-hover:scale-105 transition-all duration-200">
                  <Icon size={18} className="text-stone-500 group-hover:text-amber-600 transition-colors" strokeWidth={1.5} />
                </div>
                <p className="font-sans text-[13.5px] font-bold text-stone-800 mb-1">{opt.label}</p>
                <p className="font-sans text-[11px] text-stone-400 leading-relaxed mb-3 flex-1">{opt.desc}</p>
                <span className="mt-auto w-full flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-[11.5px] font-sans font-semibold bg-stone-900 text-white group-hover:bg-amber-600 transition-colors duration-200">
                  Continue <ArrowRight size={11} />
                </span>
              </button>
            );
          })}
        </div>

        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 text-center">
          <p className="font-sans text-[12.5px] text-stone-400">
            New to Stonamart?{" "}
            <button
              onClick={() => { onClose(); router.push("/signup"); }}
              className="font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              Create a free account
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
export function Header() {
  const [cityOpen,        setCityOpen]        = useState(false);
  const [loginOpen,       setLoginOpen]       = useState(false);
  const [imageSearchOpen, setImageSearchOpen] = useState(false);
  const [mobileOpen,      setMobileOpen]      = useState(false);
  const [selectedCity,    setSelectedCity]    = useState("mumbai");
  const [scrolled,        setScrolled]        = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

<<<<<<< HEAD
=======
  // Avoids hydration mismatch: session is only known on the client,
  // so we render the skeleton for SSR + first client paint, then resolve.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

>>>>>>> 3ce4358 (fixed header and footer , hero secton)
  // ── Auth state (persists across refreshes — reads from session cookie) ──
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const user = session?.user as { id: string; name: string; email: string; role: string } | undefined;
  const isLoggedIn = !!user;

  useEffect(() => {
    const v = document.cookie.split("; ").find((r) => r.startsWith("selectedCity="))?.split("=")[1];
    if (v) setSelectedCity(v);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 6);
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
<<<<<<< HEAD
      {/* ── Announcement bar ── */}
      <div className="bg-stone-950 text-white hidden sm:block">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-9">
            <p className="font-sans text-[11.5px] text-white/60">
              <span className="text-amber-gold mr-1">★</span>
              Premium Quality Marbles &amp; Granites
              <span className="text-white/25 mx-2">|</span>
              Direct from the Best Quarries
            </p>
            <div className="flex items-center gap-5 text-[11.5px] font-sans text-white/50">
              <span>🚚 Free Delivery</span>
              <span>↩ Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main header ── */}
      <header className={cn(
        "sticky top-0 z-[100] w-full bg-white transition-all duration-300",
        scrolled ? "shadow-[0_2px_24px_rgba(0,0,0,0.09)]" : "border-b border-stone-100"
      )}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-[68px] gap-6">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <span className="font-serif text-[1.55rem] font-bold text-stone-950 leading-none tracking-tight">
                Stona<span className="text-amber-gold">mart</span>
              </span>
              <span className="hidden sm:block text-[8px] font-sans font-bold uppercase tracking-[0.22em] text-stone-400 leading-[1.1] mt-0.5">
                Marbles &<br/>Granites
              </span>
            </Link>

            {/* Center — search bar */}
            <div className="hidden lg:flex flex-1 justify-center px-4">
              <SearchBar />
            </div>

            {/* Right controls */}
            <div className="hidden lg:flex items-center gap-1.5 shrink-0">

              {/* City selector */}
              <div className="relative" ref={cityRef}>
                <button
                  onClick={() => setCityOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-stone-50 transition-colors duration-200 group"
                >
                  <MapPin size={14} className="text-stone-400 group-hover:text-amber-gold transition-colors" />
                  <span className="font-sans text-[13px] font-medium text-stone-600">{activeCity?.name}</span>
                  <ChevronDown size={12} className={cn("text-stone-400 transition-transform duration-250", cityOpen && "rotate-180")} />
                </button>

                {cityOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl z-50 overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.13)] border border-stone-100 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-60 overflow-y-auto">
                      {CITIES.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => handleSelectCity(city.id)}
                          className={cn(
                            "w-full px-4 py-2.5 text-left flex items-center justify-between group/item transition-colors",
                            city.id === selectedCity ? "bg-amber-gold/8" : "hover:bg-stone-50"
                          )}
                        >
                          <div>
                            <p className={cn("text-[13px] font-sans font-medium", city.id === selectedCity ? "text-amber-gold" : "text-stone-700")}>
                              {city.name}
                            </p>
                            <p className="text-[10.5px] font-sans text-stone-400">{city.region}</p>
                          </div>
                          {city.id === selectedCity && <Check size={13} className="text-amber-gold" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-5 bg-stone-200 mx-0.5" />

              {/* AI image search */}
              <button
                onClick={() => setImageSearchOpen(true)}
                title="Search by photo (AI)"
                className="w-9 h-9 rounded-full flex items-center justify-center text-stone-500 hover:bg-stone-100 hover:text-amber-gold active:scale-90 transition-all duration-150"
              >
                <Camera size={18} />
              </button>

              {/* Auth section */}
              <div className="ml-1">
                {sessionPending ? (
                  /* Skeleton while session loads */
                  <div className="w-32 h-9 rounded-full bg-stone-100 animate-pulse" />
                ) : isLoggedIn && user ? (
                  <UserMenu user={user} />
                ) : (
                  <button
                    onClick={() => setLoginOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-950 text-white text-[13px] font-sans font-semibold hover:bg-stone-800 active:scale-[0.97] transition-all duration-150"
                  >
=======
     

      {/* ── Main header ── */}
      <header className={cn(
        "sticky top-0 z-[100] w-full bg-white transition-all duration-300",
        scrolled ? "shadow-[0_2px_24px_rgba(0,0,0,0.09)]" : "border-b border-stone-100"
      )}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-[68px] gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <span className="font-serif text-[1.55rem] font-bold text-stone-950 leading-none tracking-tight">
                Stona<span className="text-amber-gold">mart</span>
              </span>
              <span className="hidden xl:block text-[8px] font-sans font-bold uppercase tracking-[0.22em] text-stone-400 leading-[1.1] mt-0.5">
                Marbles &<br/>Granites
              </span>
            </Link>

            {/* Nav links — in-header */}
            <nav className="hidden lg:flex items-center gap-5 shrink-0">
              {NAV_LINKS.map((l) => {
                const Icon = l.icon;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="flex items-center gap-1.5 font-sans text-[13px] font-medium text-stone-600 hover:text-stone-950 transition-colors duration-150 whitespace-nowrap group"
                  >
                    <Icon size={14} className="text-stone-400 group-hover:text-amber-gold transition-colors" />
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            {/* Center — search bar */}
            <div className="hidden lg:flex flex-1 justify-center px-2">
              <SearchBar />
            </div>

            {/* Right controls */}
            <div className="hidden lg:flex items-center gap-1.5 shrink-0">

              {/* City selector */}
              <div className="relative" ref={cityRef}>
                <button
                  onClick={() => setCityOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-stone-50 transition-colors duration-200 group"
                >
                  <MapPin size={14} className="text-stone-400 group-hover:text-amber-gold transition-colors" />
                  <span className="font-sans text-[13px] font-medium text-stone-600">{activeCity?.name}</span>
                  <ChevronDown size={12} className={cn("text-stone-400 transition-transform duration-250", cityOpen && "rotate-180")} />
                </button>

                {cityOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl z-50 overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.13)] border border-stone-100 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-60 overflow-y-auto">
                      {CITIES.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => handleSelectCity(city.id)}
                          className={cn(
                            "w-full px-4 py-2.5 text-left flex items-center justify-between group/item transition-colors",
                            city.id === selectedCity ? "bg-amber-gold/8" : "hover:bg-stone-50"
                          )}
                        >
                          <div>
                            <p className={cn("text-[13px] font-sans font-medium", city.id === selectedCity ? "text-amber-gold" : "text-stone-700")}>
                              {city.name}
                            </p>
                            <p className="text-[10.5px] font-sans text-stone-400">{city.region}</p>
                          </div>
                          {city.id === selectedCity && <Check size={13} className="text-amber-gold" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-5 bg-stone-200 mx-0.5" />

              {/* Auth section */}
              <div className="ml-1">
                {!mounted || sessionPending ? (
                  /* Skeleton while session loads (and during SSR) */
                  <div className="w-32 h-9 rounded-full bg-stone-100 animate-pulse" />
                ) : isLoggedIn && user ? (
                  <UserMenu user={user} />
                ) : (
                  <button
                    onClick={() => setLoginOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-950 text-white text-[13px] font-sans font-semibold hover:bg-stone-800 active:scale-[0.97] transition-all duration-150"
                  >
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
                    <User size={14} />
                    Sign In
                  </button>
                )}
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center border border-stone-200 hover:bg-stone-50 transition-colors"
            >
              {mobileOpen ? <X size={19} className="text-stone-700" /> : <Menu size={19} className="text-stone-700" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-stone-100 bg-white shadow-lg">
            <div className="max-w-[1400px] mx-auto px-5 py-4 space-y-0.5">
              {/* Mobile search bar */}
              <div className="pb-3">
                <SearchBar />
              </div>
              {NAV_LINKS.map((l) => {
                const Icon = l.icon;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-sans font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-950 transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon size={16} className="text-stone-400" />
                      {l.label}
                    </span>
                    <ArrowRight size={14} className="text-stone-300" />
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-stone-100">
                {isLoggedIn && user ? (
                  /* Mobile: logged-in user options */
                  <div className="space-y-1">
                    {/* User info */}
                    <div className="flex items-center gap-3 px-4 py-3 mb-1">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${roleColor(user.role)} border flex items-center justify-center flex-shrink-0`}>
                        <span className="text-[11px] font-bold font-sans">
                          {user.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-stone-800">{user.name}</p>
                        <p className="text-[10px] text-stone-400 capitalize">{user.role.toLowerCase()}</p>
                      </div>
                    </div>
                    {getMenuItems(user.role).map(({ label, href, icon: Icon }) => (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-[13.5px] font-sans text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        <Icon size={15} className="text-stone-400" />
                        {label}
                      </Link>
                    ))}
                    <button
                      onClick={async () => {
                        setMobileOpen(false);
                        await authClient.signOut();
                        window.location.href = "/";
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-[13.5px] font-sans text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setMobileOpen(false); setLoginOpen(true); }}
                      className="flex-1 py-3 bg-stone-950 text-white font-sans font-semibold text-[13.5px] rounded-xl hover:bg-stone-800 transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { setMobileOpen(false); setImageSearchOpen(true); }}
                      className="w-12 h-12 flex items-center justify-center border border-stone-200 rounded-xl text-stone-500 hover:bg-stone-50"
                    >
                      <Camera size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <AnimatePresence>
        {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
      </AnimatePresence>
      <AIImageSearchModal isOpen={imageSearchOpen} onClose={() => setImageSearchOpen(false)} />
    </>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 3ce4358 (fixed header and footer , hero secton)
