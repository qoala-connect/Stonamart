"use client";

import React, { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogIn, ShieldCheck, Eye, EyeOff, AlertCircle, KeyRound,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { loginAction } from "@/lib/auth-actions";
import { adminSetupAction } from "@/lib/admin-actions";
import { FormField, AuthInput, SubmitButton } from "./AuthLayout";

type Tab = "signin" | "setup";

// ─── Submit helpers ───────────────────────────────────────────────────────────
function LoginSubmit() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending} label="Sign In" pendingLabel="Authenticating…" />;
}

function SetupSubmit() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending} label="Initialize Admin" pendingLabel="Creating…" />;
}

// ─── Sign-in form ─────────────────────────────────────────────────────────────
function AdminLoginForm() {
  const [state, formAction] = useActionState(loginAction, {});
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-3 p-4 bg-red-50 border border-red-200/60 rounded-xl"
          >
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
            <p className="font-sans text-sm text-red-700">{state.error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form action={formAction} className="space-y-5">
        <FormField label="Admin ID" error={state.fieldErrors?.email}>
          <AuthInput type="email" name="email" placeholder="admin@stonamart.com"
            autoComplete="email" error={!!state.fieldErrors?.email} required />
        </FormField>

        <FormField label="Passkey" error={state.fieldErrors?.password}>
          <div className="relative">
            <AuthInput
              type={showPw ? "text" : "password"} name="password" placeholder="••••••••"
              autoComplete="current-password" error={!!state.fieldErrors?.password}
              className="pr-12" required
            />
            <button type="button" onClick={() => setShowPw((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-dark/30 hover:text-stone-dark/70 transition-colors">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </FormField>

        <div className="flex justify-end">
          <Link href="/forgot-password"
            className="text-xs font-sans text-[#B8865A]/70 hover:text-[#B8865A] transition-colors font-semibold tracking-wide uppercase">
            Recover Access
          </Link>
        </div>

        <LoginSubmit />
      </form>
    </div>
  );
}

// ─── Setup / Register form ────────────────────────────────────────────────────
function AdminSetupForm() {
  const [state, formAction] = useActionState(adminSetupAction, {});
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {state?.error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-3 p-4 bg-red-50 border border-red-200/60 rounded-xl"
          >
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
            <p className="font-sans text-sm text-red-700">{state.error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form action={formAction} className="space-y-5" onSubmit={(e) => {
        if (password !== confirmPassword) {
          e.preventDefault();
          setConfirmError("Passwords do not match");
        } else {
          setConfirmError("");
        }
      }}>
        <FormField label="Authorization Key">
          <div className="relative">
            <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-dark/30" />
            <AuthInput name="setupKey" type="text" placeholder="Enter root setup key"
              className="pl-11" required />
          </div>
        </FormField>

        <FormField label="Administrator Name">
          <AuthInput name="name" type="text" placeholder="Full name" autoComplete="name" required />
        </FormField>

        <FormField label="Secure Email">
          <AuthInput name="email" type="email" placeholder="admin@domain.com"
            autoComplete="email" required />
        </FormField>

        <FormField label="Master Password">
          <div className="relative">
            <AuthInput
              name="password" type={showPwd ? "text" : "password"}
              placeholder="Min. 8 characters" autoComplete="new-password"
              className="pr-12" required minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowPwd((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-dark/30 hover:text-stone-dark/70 transition-colors">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </FormField>

        <FormField label="Verify Password" error={confirmError}>
          <div className="relative">
            <AuthInput
              type={showConfirmPwd ? "text" : "password"}
              placeholder="Re-enter password"
              autoComplete="new-password"
              className="pr-12"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); if (confirmError) setConfirmError(""); }}
              error={!!confirmError}
            />
            <button type="button" onClick={() => setShowConfirmPwd((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-dark/30 hover:text-stone-dark/70 transition-colors">
              {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {confirmPassword && confirmPassword === password && (
            <p className="flex items-center gap-1.5 text-xs text-[#B8865A] mt-2 font-medium tracking-wide">
              <CheckCircle2 size={12} /> Verified match
            </p>
          )}
        </FormField>

        <div className="pt-2">
          <SetupSubmit />
        </div>
      </form>
    </div>
  );
}

// ─── Main tabbed component ────────────────────────────────────────────────────
export function AdminAuthTabs({ defaultTab = "signin" }: { defaultTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(defaultTab);

  return (
    <div className="space-y-8 w-full">
      
      {/* Sleek Header */}
      <div className="text-center">
        <h2 className="font-serif text-3xl font-bold text-stone-950 tracking-tight">
          {tab === "signin" ? "Admin Access" : "System Setup"}
        </h2>
        <p className="mt-2 font-sans text-sm text-stone-dark/40 tracking-wide">
          {tab === "signin"
            ? "Enter credentials to access operations."
            : "Initialize the primary root account."}
        </p>
      </div>

      {/* Luxury Tab Switcher */}
      <div className="relative flex rounded-xl p-1 bg-cream-100 border border-stone-dark/10">
        {([
          { id: "signin", label: "Sign In",      icon: LogIn       },
          { id: "setup",  label: "Initialize",   icon: ShieldCheck },
        ] as { id: Tab; label: string; icon: React.FC<{ size?: number; className?: string }> }[]).map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="relative flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-sans text-sm font-semibold transition-colors duration-300 z-10 uppercase tracking-widest"
            style={{ color: tab === t.id ? "#B8865A" : "rgba(58,47,38,0.45)" }}>
            {tab === t.id && (
              <motion.div layoutId="admin-tab-bg"
                className="absolute inset-0 rounded-lg bg-white border border-amber-gold/30 shadow-luxury"
                transition={{ type: "spring", stiffness: 400, damping: 30 }} />
            )}
            <t.icon size={14} className="relative z-10 flex-shrink-0" />
            <span className="relative z-10 whitespace-nowrap">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Form Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {tab === "signin" ? (
            <div className="space-y-6">
              <AdminLoginForm />
              <p className="font-sans text-xs text-stone-dark/30 text-center tracking-wide uppercase">
                First time?{" "}
                <button type="button" onClick={() => setTab("setup")}
                  className="text-[#B8865A]/80 font-bold hover:text-[#B8865A] transition-colors ml-1">
                  Run Setup
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <AdminSetupForm />
              <p className="font-sans text-xs text-stone-dark/30 text-center tracking-wide uppercase">
                Already initialized?{" "}
                <button type="button" onClick={() => setTab("signin")}
                  className="text-[#B8865A]/80 font-bold hover:text-[#B8865A] transition-colors ml-1">
                  Sign In
                </button>
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}