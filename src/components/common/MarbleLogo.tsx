"use client";

import React from "react";

export function MarbleLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 sm:w-[44px] sm:h-[44px] md:w-[50px] md:h-[50px] flex-shrink-0">
        <div className="absolute rounded-[3px] border border-stone-dark/15 shadow-sm bg-bronze-accent w-[20px] h-[20px] sm:w-[26px] sm:h-[26px] md:w-[30px] md:h-[30px] top-[0px] right-[0px] z-10" />
        <div className="absolute rounded-[3px] border border-stone-dark/15 shadow-sm bg-amber-gold w-[18px] h-[18px] sm:w-[26px] sm:h-[26px] md:w-[30px] md:h-[30px] top-[6px] sm:top-[9px] md:top-[10px] right-[6px] sm:right-[9px] md:right-[10px] z-20" />
        <div className="absolute rounded-[3px] border border-stone-dark/15 shadow-sm bg-gradient-to-b from-white to-cream-100 w-[18px] h-[18px] sm:w-[26px] sm:h-[26px] md:w-[30px] md:h-[30px] top-[12px] sm:top-[18px] md:top-[20px] right-[12px] sm:right-[18px] md:right-[20px] z-30" />
      </div>

      <div className="flex flex-col leading-tight">
        <span className="font-serif text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-stone-950">
          Stona<span className="text-amber-gold">mart</span>
        </span>
        <span className="font-sans text-[9px] sm:text-[9px] md:text-[10px] font-medium uppercase tracking-widest text-stone-dark/40">Marbles &amp; Granites</span>
      </div>
    </div>
  );
}
