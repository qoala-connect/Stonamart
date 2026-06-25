"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { FILTER_OPTIONS } from "./data";
import type { FilterState } from "./types";

interface FilterGroupProps {
  title: string;
  filterKey: keyof FilterState;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (key: keyof FilterState, value: string) => void;
  defaultOpen?: boolean;
}

function FilterGroup({
  title,
  filterKey,
  options,
  selected,
  onToggle,
  defaultOpen = true,
}: FilterGroupProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-stone-dark/8 last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3.5 px-1 text-left group"
      >
        <div className="flex items-center gap-2">
          <span className="font-sans text-sm font-semibold text-stone-950 group-hover:text-amber-gold transition-colors duration-200">
            {title}
          </span>
          {selected.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-amber-gold text-stone-950 rounded-full leading-none"
            >
              {selected.length}
            </motion.span>
          )}
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} className="text-stone-dark/40" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="pb-3.5 space-y-1">
              {options.map((opt) => {
                const checked = selected.includes(opt.value);
                return (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2.5 px-1 py-1.5 rounded-lg hover:bg-stone-dark/5 cursor-pointer group"
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded flex items-center justify-center border transition-all duration-150 flex-shrink-0",
                        checked
                          ? "bg-amber-gold border-amber-gold"
                          : "border-stone-dark/25 group-hover:border-amber-gold/60"
                      )}
                      onClick={() => onToggle(filterKey, opt.value)}
                    >
                      {checked && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="#3a2f26"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </motion.svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => onToggle(filterKey, opt.value)}
                    />
                    <span
                      className={cn(
                        "text-sm font-sans transition-colors duration-150",
                        checked ? "text-stone-950 font-medium" : "text-stone-dark/65"
                      )}
                    >
                      {opt.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FilterSidebarProps {
  filters: FilterState;
  onToggle: (key: keyof FilterState, value: string) => void;
  onClearAll: () => void;
  activeCount: number;
  // Mobile drawer
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const FILTER_GROUPS: Array<{
  title: string;
  key: keyof FilterState;
  optionKey: keyof typeof FILTER_OPTIONS;
  defaultOpen: boolean;
}> = [
  { title: "Material Type", key: "materialType", optionKey: "materialType", defaultOpen: true },
  { title: "Color", key: "color", optionKey: "color", defaultOpen: true },
  { title: "Finish", key: "finish", optionKey: "finish", defaultOpen: true },
  { title: "Thickness", key: "thickness", optionKey: "thickness", defaultOpen: false },
  { title: "Availability", key: "availability", optionKey: "availability", defaultOpen: true },
  { title: "City / Stock Location", key: "city", optionKey: "city", defaultOpen: false },
  { title: "Application", key: "category", optionKey: "category", defaultOpen: false },
];

function SidebarContent({
  filters,
  onToggle,
  onClearAll,
  activeCount,
}: FilterSidebarProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Sidebar header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-stone-dark/60" />
          <h3 className="font-sans text-base font-semibold text-stone-950">
            Filters
          </h3>
          {activeCount > 0 && (
            <span className="text-xs font-medium text-stone-dark/50">
              ({activeCount} active)
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <motion.button
            onClick={onClearAll}
            className="text-xs font-sans font-medium text-amber-gold hover:text-amber-gold/70 transition-colors underline-offset-2 hover:underline"
            whileTap={{ scale: 0.95 }}
          >
            Clear all
          </motion.button>
        )}
      </div>

      {/* Active filter chips */}
      <AnimatePresence>
        {activeCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-1.5 mb-4 overflow-hidden"
          >
            {(Object.keys(filters) as (keyof FilterState)[]).map((key) =>
              filters[key].map((val) => (
                <motion.button
                  key={`${key}-${val}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={() => onToggle(key, val)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-amber-gold/10 border border-amber-gold/25 rounded-full text-xs font-sans font-medium text-amber-gold hover:bg-amber-gold/20 transition-colors"
                >
                  {val}
                  <X size={10} />
                </motion.button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter groups — scrollable */}
      <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-0">
        {FILTER_GROUPS.map((group) => (
          <FilterGroup
            key={group.key}
            title={group.title}
            filterKey={group.key}
            options={FILTER_OPTIONS[group.optionKey]}
            selected={filters[group.key]}
            onToggle={onToggle}
            defaultOpen={group.defaultOpen}
          />
        ))}
      </div>
    </div>
  );
}

export function FilterSidebar({
  filters,
  onToggle,
  onClearAll,
  activeCount,
  isMobileOpen = false,
  onMobileClose,
}: FilterSidebarProps) {
  return (
    <>
      {/* Desktop sticky sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div
          className="sticky top-24 bg-white rounded-2xl border border-stone-dark/8 p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
          style={{ maxHeight: "calc(100vh - 112px)", overflow: "hidden", display: "flex", flexDirection: "column" }}
        >
          <SidebarContent
            filters={filters}
            onToggle={onToggle}
            onClearAll={onClearAll}
            activeCount={activeCount}
          />
        </div>
      </aside>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-dark/50 z-40 lg:hidden"
              onClick={onMobileClose}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed left-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white z-50 flex flex-col lg:hidden shadow-luxury-lg"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-stone-dark/8">
                <span className="font-serif text-lg font-semibold text-stone-950">
                  Filters
                </span>
                <button
                  onClick={onMobileClose}
                  className="p-2 rounded-lg hover:bg-stone-dark/5 transition-colors"
                >
                  <X size={18} className="text-stone-dark/60" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                <SidebarContent
                  filters={filters}
                  onToggle={onToggle}
                  onClearAll={onClearAll}
                  activeCount={activeCount}
                />
              </div>

              {activeCount > 0 && (
                <div className="p-4 border-t border-stone-dark/8">
                  <button
                    onClick={onMobileClose}
                    className="w-full btn-luxury text-sm font-medium rounded-xl py-3"
                  >
                    View Results
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
