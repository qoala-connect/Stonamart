"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Layers, Clock, CheckCircle2, XCircle, Eye, TrendingUp } from "lucide-react";
import type { VendorListing } from "./types";

function Counter({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const steps = 30;
    const ms = 800 / steps;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setVal(Math.round((target * i) / steps));
      if (i >= steps) clearInterval(id);
    }, ms);
    return () => clearInterval(id);
  }, [target]);
  return <>{val.toLocaleString()}</>;
}

interface CardCfg {
  label: string;
  desc: string;
  icon: React.ElementType;
  accentColor: string;
  bgColor: string;
  iconColor: string;
  trend: string;
  trendUp: boolean;
  getValue: (l: VendorListing[]) => number;
}

const CARDS: CardCfg[] = [
  {
    label: "Total Listings",
    desc: "All submitted",
    icon: Layers,
    accentColor: "bg-stone-900",
    bgColor: "bg-stone-50",
    iconColor: "text-stone-600",
    trend: "+12.4%",
    trendUp: true,
    getValue: (l) => l.length,
  },
  {
    label: "Pending Review",
    desc: "Awaiting approval",
    icon: Clock,
    accentColor: "bg-amber-500",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
    trend: "-5.2%",
    trendUp: false,
    getValue: (l) => l.filter((x) => x.status === "PENDING_APPROVAL").length,
  },
  {
    label: "Approved",
    desc: "Live on marketplace",
    icon: CheckCircle2,
    accentColor: "bg-emerald-500",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
    trend: "+18.7%",
    trendUp: true,
    getValue: (l) => l.filter((x) => x.status === "APPROVED").length,
  },
  {
    label: "Rejected",
    desc: "Did not pass review",
    icon: XCircle,
    accentColor: "bg-red-500",
    bgColor: "bg-red-50",
    iconColor: "text-red-500",
    trend: "-8.1%",
    trendUp: false,
    getValue: (l) => l.filter((x) => x.status === "REJECTED").length,
  },
  {
    label: "Total Views",
    desc: "Across all listings",
    icon: Eye,
    accentColor: "bg-blue-500",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-500",
    trend: "+24.3%",
    trendUp: true,
    getValue: (l) => l.reduce((s, x) => s + x.views, 0),
  },
];

export function KPICards({ listings }: { listings: VendorListing[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {CARDS.map((cfg, i) => {
        const Icon = cfg.icon;
        const value = cfg.getValue(listings);
        return (
          <motion.div
            key={cfg.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="bg-white rounded-xl border border-stone-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            {/* Top accent bar */}
            <div className={`h-1 w-full ${cfg.accentColor}`} />
            <div className="p-4">
              <div className={`w-9 h-9 rounded-lg ${cfg.bgColor} flex items-center justify-center mb-3`}>
                <Icon size={16} className={cfg.iconColor} />
              </div>
              <p className="font-serif text-2xl font-bold text-stone-950 leading-none mb-1">
                <Counter target={value} />
              </p>
              <p className="font-sans text-[11.5px] font-semibold text-stone-700 mb-0.5">{cfg.label}</p>
              <p className="font-sans text-[10px] text-stone-400 mb-2">{cfg.desc}</p>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-sans font-bold px-1.5 py-0.5 rounded ${
                  cfg.trendUp
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-red-500 bg-red-50"
                }`}
              >
                <TrendingUp size={9} className={cfg.trendUp ? "" : "rotate-180"} />
                {cfg.trend}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
