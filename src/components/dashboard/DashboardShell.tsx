"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Gem, Bell, LogOut, Menu, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

// ─── Public types ──────────────────────────────────────────────────────────────
export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  disabled?: boolean;
  group?: string; // section header text; items without a group share the first section
}

export interface DashboardUser {
  name: string;
  email: string;
  role: string;
  subtitle?: string; // e.g. company name for vendor
}

export interface DashboardShellProps {
  navItems: NavItem[];
  activeNav: string;
  onNavChange: (id: string) => void;
  user: DashboardUser;
  pageTitle: string;
  pageSubtitle?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function roleStyle(role: string) {
  if (role === "ADMIN")  return { bg: "bg-red-500/15",   text: "text-red-400",   border: "border-red-500/20"   };
  if (role === "VENDOR") return { bg: "bg-blue-500/15",  text: "text-blue-400",  border: "border-blue-500/20"  };
  return                        { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/20" };
}

// ─── Sidebar inner ─────────────────────────────────────────────────────────────
function SidebarContent({
  navItems,
  activeNav,
  onNavChange,
  user,
  onSignOut,
  signingOut,
}: {
  navItems: NavItem[];
  activeNav: string;
  onNavChange: (id: string) => void;
  user: DashboardUser;
  onSignOut: () => void;
  signingOut: boolean;
}) {
  const rs = roleStyle(user.role);
  const initials = user.name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Group items by their `group` field; ungrouped items go to "__default"
  const groupOrder: string[] = [];
  const groups: Record<string, NavItem[]> = {};
  for (const item of navItems) {
    const g = item.group ?? "__default";
    if (!groups[g]) { groups[g] = []; groupOrder.push(g); }
    groups[g].push(item);
  }

  return (
    <div className="flex flex-col h-full bg-[#0F172A] border-r border-white/5 overflow-hidden">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Gem size={14} className="text-amber-400" />
          </div>
          <div>
            <h1 className="font-serif text-[1.05rem] font-bold text-white leading-none tracking-tight">
              Stona<span className="text-amber-400">mart</span>
            </h1>
            <p className="text-[8px] font-sans font-semibold text-slate-500 uppercase tracking-[0.2em] mt-0.5">
              Dashboard
            </p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[11px] font-sans text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ChevronRight size={10} className="rotate-180" />
          Back to store
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${rs.bg} border ${rs.border} flex items-center justify-center flex-shrink-0`}>
            <span className={`text-[12px] font-bold font-sans ${rs.text}`}>{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-sans font-semibold text-white truncate leading-tight">
              {user.name}
            </p>
            <p className="text-[10.5px] font-sans text-slate-400 truncate mt-0.5">
              {user.subtitle ?? user.email}
            </p>
            <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${rs.bg} ${rs.text} border ${rs.border}`}>
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {groupOrder.map((group, gi) => (
          <div key={group} className={gi > 0 ? "mt-5" : ""}>
            {group !== "__default" && (
              <p className="px-3 mb-2 text-[9.5px] font-sans font-bold uppercase tracking-[0.2em] text-slate-600 select-none">
                {group}
              </p>
            )}
            <div className="space-y-0.5">
              {groups[group].map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => !item.disabled && onNavChange(item.id)}
                    disabled={item.disabled}
                    className={cn(
                      "relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150",
                      item.disabled
                        ? "opacity-30 cursor-not-allowed text-slate-500"
                        : isActive
                        ? "text-white"
                        : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="shellActiveBg"
                        className="absolute inset-0 rounded-xl bg-white/10"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-amber-400 rounded-full" />
                    )}
                    <Icon
                      size={15}
                      className={cn(
                        "relative z-10 flex-shrink-0 transition-colors",
                        isActive ? "text-amber-400" : ""
                      )}
                    />
                    <span className="relative z-10 flex-1 text-[13px] font-sans font-medium truncate">
                      {item.label}
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="relative z-10 flex items-center justify-center h-5 min-w-[20px] px-1.5 bg-amber-500 text-white text-[9px] font-bold rounded-full">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                    {item.disabled && (
                      <span className="relative z-10 text-[9px] font-sans text-slate-600">soon</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="flex-shrink-0 px-3 pb-4 pt-2 border-t border-white/5">
        <button
          onClick={onSignOut}
          disabled={signingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-red-400/60 hover:text-red-400 hover:bg-red-500/8 disabled:opacity-40"
        >
          <LogOut size={15} className="flex-shrink-0" />
          <span className="text-[13px] font-sans font-medium">
            {signingOut ? "Signing out…" : "Sign Out"}
          </span>
        </button>
      </div>
    </div>
  );
}

// ─── Content-area top header ───────────────────────────────────────────────────
function ContentHeader({
  title,
  subtitle,
  user,
  right,
}: {
  title: string;
  subtitle?: string;
  user: DashboardUser;
  right?: React.ReactNode;
}) {
  const rs = roleStyle(user.role);
  const initials = user.name.split(" ").map((w) => w[0] ?? "").join("").toUpperCase().slice(0, 2);

  return (
    <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-white border-b border-stone-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div>
        <h2 className="font-serif text-[1.2rem] font-bold text-stone-900 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="font-sans text-[12px] text-stone-400 mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2.5">
        {right}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors">
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-500" />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-stone-100">
          <div className={`w-8 h-8 rounded-xl ${rs.bg} border ${rs.border} flex items-center justify-center flex-shrink-0`}>
            <span className={`text-[10px] font-bold font-sans ${rs.text}`}>{initials}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-[12.5px] font-sans font-semibold text-stone-800 leading-none">
              {user.name.split(" ")[0]}
            </p>
            <p className={`text-[9.5px] font-sans ${rs.text} mt-0.5 capitalize`}>
              {user.role.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shell ─────────────────────────────────────────────────────────────────────
export function DashboardShell({
  navItems,
  activeNav,
  onNavChange,
  user,
  pageTitle,
  pageSubtitle,
  headerRight,
  children,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setSigningOut(true);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const sidebarProps = {
    navItems,
    activeNav,
    user,
    onSignOut: handleSignOut,
    signingOut,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F3F4F6] font-sans">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 xl:w-[17.5rem] flex-shrink-0">
        <SidebarContent {...sidebarProps} onNavChange={onNavChange} />
      </aside>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 lg:hidden flex flex-col shadow-2xl"
            >
              <SidebarContent
                {...sidebarProps}
                onNavChange={(id) => { onNavChange(id); setMobileOpen(false); }}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Right content column */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[#0F172A] flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Menu size={18} />
          </button>
          <span className="font-serif text-white text-[1rem] font-bold">
            Stona<span className="text-amber-400">mart</span>
          </span>
        </div>

        {/* Page header */}
        <ContentHeader
          title={pageTitle}
          subtitle={pageSubtitle}
          user={user}
          right={headerRight}
        />

        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
