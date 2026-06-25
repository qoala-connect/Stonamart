"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldOff, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export function SuspendedScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{
        background: [
          "radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.04) 0%, transparent 60%)",
          "linear-gradient(160deg, #FDFBF8 0%, #F6F0E6 100%)",
        ].join(", "),
      }}
    >
      {/* Logo */}
      <div className="mb-12 text-center">
        <Link href="/">
          <p className="text-[9px] font-sans font-bold text-stone-dark/30 uppercase tracking-[0.25em] mb-0.5">
            Premium Natural Stone
          </p>
          <h1 className="font-serif text-2xl font-bold text-stone-dark/50">Stonamart</h1>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl border border-red-200/40 shadow-xl shadow-stone-dark/4 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-stone-950 to-stone-dark px-8 pt-8 pb-7">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center">
                <ShieldOff size={26} className="text-red-400" />
              </div>
              <div>
                <p className="text-red-400/70 text-[10px] font-sans font-bold uppercase tracking-[0.18em]">
                  Account Status
                </p>
                <h2 className="font-serif text-xl font-bold text-white leading-tight mt-0.5">
                  Account Suspended
                </h2>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-7 space-y-6">
            <p className="font-sans text-[14px] text-stone-dark/65 leading-relaxed">
              Your Stonamart account has been temporarily suspended. This may be due to a
              policy violation, pending compliance verification, or an administrative review.
            </p>

            <div className="space-y-3">
              {[
                "You cannot log in or access account features while suspended.",
                "Existing orders or listings may be on hold.",
                "Contact support to understand the reason and next steps.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <ArrowRight size={12} className="mt-1 flex-shrink-0 text-stone-dark/30" />
                  <p className="font-sans text-[13px] text-stone-dark/55">{item}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-red-50 border border-red-200/50 rounded-xl">
              <p className="text-[11px] font-sans font-semibold text-red-700 uppercase tracking-wide mb-1.5">
                To appeal this suspension
              </p>
              <p className="font-sans text-[12.5px] text-red-600/80 leading-relaxed">
                Send an email with your registered email address and account details to our trust &amp; safety team.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-stone-dark/6">
              <Mail size={14} className="text-stone-dark/30 flex-shrink-0" />
              <p className="font-sans text-[12.5px] text-stone-dark/45">
                Contact{" "}
                <a
                  href="mailto:trust@stonamart.in"
                  className="text-stone-950 hover:text-amber-gold font-semibold transition-colors"
                >
                  trust@stonamart.in
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="font-sans text-[13px] text-stone-dark/40 hover:text-stone-950 transition-colors"
          >
            ← Return to homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
