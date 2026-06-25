"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, ShieldCheck, Sparkles, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

const TIMELINE_STEPS = [
  {
    icon: CheckCircle2,
    title: "Application submitted",
    desc: "We've received your details and documents.",
    done: true,
  },
  {
    icon: ShieldCheck,
    title: "Verification in progress",
    desc: "Our team is reviewing your business credentials.",
    done: false,
    active: true,
  },
  {
    icon: Sparkles,
    title: "Account activated",
    desc: "You'll get an email and can start listing products.",
    done: false,
  },
];

export function VendorPendingScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{
        background: [
          "radial-gradient(ellipse at 20% 20%, rgba(184,134,90,0.06) 0%, transparent 55%)",
          "radial-gradient(ellipse at 80% 80%, rgba(139,115,85,0.04) 0%, transparent 50%)",
          "linear-gradient(160deg, #FDFBF8 0%, #F6F0E6 100%)",
        ].join(", "),
      }}
    >
      {/* Logo */}
      <div className="mb-12 text-center">
        <Link href="/">
          <p className="text-[9px] font-sans font-bold text-amber-gold/60 uppercase tracking-[0.25em] mb-0.5">
            Premium Natural Stone
          </p>
          <h1 className="font-serif text-2xl font-bold text-stone-950">Stonamart</h1>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-lg"
      >
        <div className="bg-white rounded-2xl border border-stone-dark/8 shadow-xl shadow-stone-dark/4 overflow-hidden">
          {/* Header band */}
          <div
            className="relative px-8 pt-8 pb-6 overflow-hidden"
            style={{
              background: [
                "linear-gradient(135deg, transparent 0%, rgba(184,134,90,0.06) 50%, transparent 100%)",
                "linear-gradient(160deg, #3a2f26 0%, #3a2f26 100%)",
              ].join(", "),
            }}
          >
            <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 500 160" preserveAspectRatio="xMidYMid slice">
              <path d="M 0 80 Q 150 40 300 90 T 600 70" stroke="#B8865A" strokeWidth="2" fill="none" />
            </svg>

            <div className="relative flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-amber-gold/20 flex items-center justify-center">
                  <Clock size={26} className="text-amber-gold" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-2xl bg-amber-gold/20"
                />
              </div>
              <div>
                <p className="text-amber-gold text-[10px] font-sans font-bold uppercase tracking-[0.18em]">
                  Application Status
                </p>
                <h2 className="font-serif text-xl font-bold text-white leading-tight mt-0.5">
                  Under Review
                </h2>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-7 space-y-7">
            <p className="font-sans text-[14px] text-stone-dark/65 leading-relaxed">
              Thank you for registering as a Stonamart vendor. Our team is reviewing
              your business details. You&apos;ll receive an email at{" "}
              <span className="text-stone-950 font-semibold">your registered address</span>{" "}
              once your account is activated — typically within <strong>1–2 business days</strong>.
            </p>

            {/* Timeline */}
            <div className="space-y-4">
              {TIMELINE_STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          s.done
                            ? "bg-emerald-500 text-white"
                            : s.active
                            ? "bg-amber-gold text-stone-950"
                            : "bg-stone-dark/6 text-stone-dark/25"
                        }`}
                      >
                        <Icon size={14} />
                      </div>
                      {i < TIMELINE_STEPS.length - 1 && (
                        <div
                          className={`w-px flex-1 mt-1.5 min-h-[20px] ${
                            s.done ? "bg-emerald-300" : "bg-stone-dark/8"
                          }`}
                        />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className={`font-sans text-[13.5px] font-semibold ${s.done ? "text-emerald-700" : s.active ? "text-stone-950" : "text-stone-dark/40"}`}>
                        {s.title}
                      </p>
                      <p className="font-sans text-[12px] text-stone-dark/45 mt-0.5">
                        {s.desc}
                      </p>
                      {s.active && (
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "65%" }}
                          transition={{ duration: 3, ease: "easeOut", delay: 0.5 }}
                          className="mt-2.5 h-1 bg-gradient-to-r from-amber-gold to-amber-gold/30 rounded-full"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* What to expect */}
            <div className="p-4 bg-stone-dark/3 rounded-xl border border-stone-dark/6">
              <p className="text-[11px] font-sans font-semibold text-stone-dark/50 uppercase tracking-wider mb-2.5">
                What happens next?
              </p>
              <ul className="space-y-2">
                {[
                  "You'll receive an approval email with login instructions",
                  "Once approved, you can list products and set pricing",
                  "Listings go live after a quick quality check",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[12.5px] font-sans text-stone-dark/55">
                    <ArrowRight size={12} className="mt-0.5 flex-shrink-0 text-amber-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-3 pt-2 border-t border-stone-dark/6">
              <Mail size={14} className="text-stone-dark/30 flex-shrink-0" />
              <p className="font-sans text-[12.5px] text-stone-dark/45">
                Questions? Write to{" "}
                <a
                  href="mailto:vendors@stonamart.in"
                  className="text-amber-gold hover:text-amber-gold/70 font-semibold transition-colors"
                >
                  vendors@stonamart.in
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
            ← Return to Stonamart homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
