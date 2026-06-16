"use client";

import React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { loginAction } from "@/lib/auth-actions";
import {
  FormField,
  AuthInput,
  SubmitButton,
  AuthDivider,
} from "./AuthLayout";

function SubmitRow() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending} label="Sign In" pendingLabel="Signing in…" />;
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, {});
  const [showPw, setShowPw] = React.useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-[10px] font-sans font-bold text-amber-gold/70 uppercase tracking-[0.22em] mb-2">
          Stonamart Portal
        </p>
        <h2 className="font-serif text-[1.85rem] font-bold text-stone-950 leading-tight tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 font-sans text-[13.5px] text-stone-dark/45 leading-relaxed">
          Sign in to your Stonamart account
        </p>
        <div className="mt-5 h-px bg-gradient-to-r from-amber-gold/30 via-stone-dark/8 to-transparent" />
      </div>

      {/* Global error */}
      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200/60 rounded-xl"
          >
            <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="font-sans text-[13px] text-red-700">{state.error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form action={formAction} className="space-y-5">
        <FormField label="Email Address" error={state.fieldErrors?.email}>
          <AuthInput
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={!!state.fieldErrors?.email}
            required
          />
        </FormField>

        <FormField label="Password" error={state.fieldErrors?.password}>
          <div className="relative">
            <AuthInput
              type={showPw ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              error={!!state.fieldErrors?.password}
              className="pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-dark/30 hover:text-stone-dark/60 transition-colors"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </FormField>

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-[12px] font-sans text-amber-gold hover:text-amber-gold/70 transition-colors font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <SubmitRow />
      </form>

      <AuthDivider label="New to Stonamart?" />

      {/* Signup links — all three roles */}
      <div className="grid grid-cols-3 gap-2.5">
        <Link
          href="/signup"
          className="flex flex-col items-center gap-1.5 px-3 py-3 bg-white border border-stone-dark/10 rounded-xl text-[12px] font-sans font-semibold text-stone-dark/60 hover:border-amber-gold/35 hover:text-stone-950 hover:bg-amber-gold/4 transition-all duration-200"
        >
          <span className="text-base">🛒</span>
          Customer
        </Link>
        <Link
          href="/vendor/register"
          className="flex flex-col items-center gap-1.5 px-3 py-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-[12px] font-sans font-semibold text-emerald-700 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all duration-200"
        >
          <span className="text-base">🏪</span>
          Vendor
        </Link>
        <Link
          href="/signup?role=admin"
          className="flex flex-col items-center gap-1.5 px-3 py-3 bg-blue-500/5 border border-blue-500/18 rounded-xl text-[12px] font-sans font-semibold text-blue-600 hover:bg-blue-500/10 hover:border-blue-500/35 transition-all duration-200"
        >
          <span className="text-base">⚙️</span>
          Admin
        </Link>
      </div>
    </div>
  );
}
