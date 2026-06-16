"use client";

import React, { useActionState } from "react";
import { adminSetupAction } from "@/lib/admin-actions";
import { motion } from "framer-motion";
import { ShieldCheck, Eye, EyeOff, KeyRound } from "lucide-react";
import Link from "next/link";

export default function AdminSetupPage() {
  const [state, formAction, isPending] = useActionState(adminSetupAction, {});
  const [showPwd, setShowPwd] = React.useState(false);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #f0f2f5 0%, #e8edf5 60%, #f0f2f5 100%)" }}
    >
      {/* Subtle diagonal texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(30deg, transparent, transparent 80px, rgba(201,169,97,0.06) 80px, rgba(201,169,97,0.06) 81px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Top accent */}
          <div className="h-1.5 bg-gradient-to-r from-amber-gold/70 via-amber-gold to-amber-gold/70" />

          <div className="px-8 py-8">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                <ShieldCheck size={18} className="text-amber-gold" />
              </div>
              <div>
                <p className="font-serif text-lg font-bold text-stone-950 leading-none">
                  Stonamart
                </p>
                <p className="font-sans text-[10px] text-stone-dark/35 uppercase tracking-widest mt-0.5">
                  Admin Setup
                </p>
              </div>
            </div>

            <h1 className="font-serif text-2xl font-bold text-stone-950 mb-1">
              Create Admin Account
            </h1>
            <p className="font-sans text-sm text-stone-dark/45 mb-7 leading-relaxed">
              This page is only accessible once — no admin account exists yet.
              Enter the setup key to proceed.
            </p>

            {state?.error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 bg-red-50 border border-red-200/60 rounded-xl"
              >
                <p className="font-sans text-sm text-red-600 font-medium">
                  {state.error}
                </p>
              </motion.div>
            )}

            <form action={formAction} className="space-y-4">
              {/* Setup key — always first, prominent */}
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-stone-dark/45 mb-1.5">
                  Setup Key
                </label>
                <div className="relative">
                  <KeyRound
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-dark/30"
                  />
                  <input
                    name="setupKey"
                    type="text"
                    placeholder="stonamart-setup-2024"
                    required
                    className="w-full pl-9 pr-4 py-2.5 font-sans text-sm bg-stone-50 border border-stone-dark/10 rounded-xl text-stone-950 placeholder:text-stone-dark/22 focus:outline-none focus:border-amber-gold/50 focus:ring-2 focus:ring-amber-gold/12 transition-all"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-stone-dark/45 mb-1.5">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Admin name"
                  required
                  className="w-full px-4 py-2.5 font-sans text-sm bg-stone-50 border border-stone-dark/10 rounded-xl text-stone-950 placeholder:text-stone-dark/22 focus:outline-none focus:border-amber-gold/50 focus:ring-2 focus:ring-amber-gold/12 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-stone-dark/45 mb-1.5">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="admin@yourdomain.com"
                  required
                  className="w-full px-4 py-2.5 font-sans text-sm bg-stone-50 border border-stone-dark/10 rounded-xl text-stone-950 placeholder:text-stone-dark/22 focus:outline-none focus:border-amber-gold/50 focus:ring-2 focus:ring-amber-gold/12 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-stone-dark/45 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPwd ? "text" : "password"}
                    placeholder="Min 8 characters"
                    required
                    minLength={8}
                    className="w-full pl-4 pr-10 py-2.5 font-sans text-sm bg-stone-50 border border-stone-dark/10 rounded-xl text-stone-950 placeholder:text-stone-dark/22 focus:outline-none focus:border-amber-gold/50 focus:ring-2 focus:ring-amber-gold/12 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-dark/30 hover:text-stone-dark/60 transition-colors"
                  >
                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full mt-2 py-3 bg-amber-gold text-white font-sans font-semibold text-sm rounded-xl hover:bg-amber-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </>
                ) : (
                  <>
                    <ShieldCheck size={15} />
                    Create Admin Account
                  </>
                )}
              </button>
            </form>

            <p className="font-sans text-xs text-stone-dark/30 text-center mt-6">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-amber-gold/70 hover:text-amber-gold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="font-sans text-[11px] text-gray-400 text-center mt-4">
          Default setup key: <span className="text-gray-600 font-mono">stonamart-setup-2024</span>
        </p>
      </motion.div>
    </div>
  );
}
