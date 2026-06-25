"use client";

import React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { loginAction } from "@/lib/auth-actions";
import { FormField, AuthInput, SubmitButton } from "./AuthLayout";

function SubmitRow() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending} label="Login" pendingLabel="Signing in…" />;
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, {});
  const [showPw, setShowPw] = React.useState(false);

  return (
    <div>
      {/* Header — compact */}
      <div className="mb-6">
        <h2 className="font-serif text-[1.6rem] font-bold text-stone-950 leading-tight mb-1">
          Customer Login
        </h2>
        <p className="font-sans text-[12.5px] text-stone-400">
          Welcome back! Please login to your account.
        </p>
      </div>

      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 p-3 bg-red-50 border border-red-200/70 rounded-lg mb-4"
          >
            <AlertCircle size={13} className="text-red-500 shrink-0 mt-0.5" />
            <p className="font-sans text-[12px] text-red-700">{state.error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form action={formAction} className="space-y-0">
        <FormField label="Email Address" error={state.fieldErrors?.email}>
          <AuthInput
            type="email" name="email" placeholder="Enter your email"
            autoComplete="email" error={!!state.fieldErrors?.email} required
          />
        </FormField>

        <FormField label="Password" error={state.fieldErrors?.password}>
          <div className="relative">
            <AuthInput
              type={showPw ? "text" : "password"} name="password"
              placeholder="Enter your password" autoComplete="current-password"
              error={!!state.fieldErrors?.password} className="pr-10" required
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors"
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </FormField>

        <div className="flex items-center justify-between py-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" className="w-3.5 h-3.5 accent-stone-950 rounded" />
            <span className="font-sans text-[12px] text-stone-500">Remember me</span>
          </label>
          <Link href="/forgot-password" className="font-sans text-[12px] text-amber-gold hover:underline font-medium">
            Forgot Password?
          </Link>
        </div>

        <div className="pt-1">
          <SubmitRow />
        </div>
      </form>

      <p className="text-center font-sans text-[12.5px] text-stone-400 mt-5">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-stone-950 font-bold hover:text-amber-gold transition-colors">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
