"use client";

import React, { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogIn, ShieldCheck, Eye, EyeOff, AlertCircle, KeyRound,
  CheckCircle2, Lock,
} from "lucide-react";
import Link from "next/link";
import { loginAction } from "@/lib/auth-actions";
import { adminSetupAction } from "@/lib/admin-actions";
import { FormField, AuthInput, SubmitButton } from "./AuthLayout";

type Tab = "signin" | "setup";

// ─── Submit helpers ───────────────────────────────────────────────────────────
function LoginSubmit() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending} label="Sign In" pendingLabel="Signing in…" />;
}

function SetupSubmit() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending} label="Create Admin Account" pendingLabel="Creating account…" />;
}

// ─── Sign-in form ─────────────────────────────────────────────────────────────
function AdminLoginForm() {
  const [state, formAction] = useActionState(loginAction, {});
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="space-y-5">
      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200/60 rounded-xl"
          >
            <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="font-sans text-[13px] text-red-700">{state.error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form action={formAction} className="space-y-4">
        <FormField label="Admin Email" error={state.fieldErrors?.email}>
          <AuthInput type="email" name="email" placeholder="admin@stonamart.com"
            autoComplete="email" error={!!state.fieldErrors?.email} required />
        </FormField>

        <FormField label="Password" error={state.fieldErrors?.password}>
          <div className="relative">
            <AuthInput
              type={showPw ? "text" : "password"} name="password" placeholder="••••••••"
              autoComplete="current-password" error={!!state.fieldErrors?.password}
              className="pr-12" required
            />
            <button type="button" onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-dark/30 hover:text-stone-dark/60 transition-colors">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </FormField>

        <div className="flex justify-end">
          <Link href="/forgot-password"
            className="text-[12px] font-sans text-amber-gold hover:text-amber-gold/70 transition-colors font-medium">
            Forgot password?
          </Link>
        </div>

        <LoginSubmit />
      </form>

      {/* Security note */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl"
        style={{ background: "rgba(201,169,97,0.06)", border: "1px solid rgba(201,169,97,0.16)" }}>
        <Lock size={13} className="text-amber-gold flex-shrink-0 mt-0.5" />
        <p className="font-sans text-[11.5px] text-stone-dark/52 leading-relaxed">
          Admin access is restricted. Unauthorized login attempts are logged and monitored.
        </p>
      </div>
    </div>
  );
}

// ─── Setup / Register form ────────────────────────────────────────────────────
function AdminSetupForm() {
  const [state, formAction, isPending] = useActionState(adminSetupAction, {});
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="p-4 rounded-xl"
        style={{ background: "linear-gradient(135deg, rgba(201,169,97,0.08) 0%, rgba(201,169,97,0.04) 100%)", border: "1px solid rgba(201,169,97,0.22)" }}>
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={14} className="text-amber-gold" />
          <p className="font-sans text-[11.5px] font-bold text-amber-700 uppercase tracking-wider">
            First-time setup only
          </p>
        </div>
        <p className="font-sans text-[11.5px] text-stone-dark/55 leading-relaxed">
          This form creates the <strong className="text-stone-950">initial admin account</strong>. It becomes unavailable once an admin exists. You need the <strong className="text-stone-950">setup key</strong> to proceed.
        </p>
      </div>

      <AnimatePresence>
        {state?.error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200/60 rounded-xl"
          >
            <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="font-sans text-[13px] text-red-700">{state.error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form action={formAction} className="space-y-4" onSubmit={(e) => {
        if (password !== confirmPassword) {
          e.preventDefault();
          setConfirmError("Passwords do not match");
        } else {
          setConfirmError("");
        }
      }}>
        {/* Setup key */}
        <FormField label="Setup Key">
          <div className="relative">
            <KeyRound size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-dark/30" />
            <AuthInput name="setupKey" type="text" placeholder="stonamart-setup-2024"
              className="pl-9" required />
          </div>
        </FormField>

        <FormField label="Full Name">
          <AuthInput name="name" type="text" placeholder="Admin name" autoComplete="name" required />
        </FormField>

        <FormField label="Email Address">
          <AuthInput name="email" type="email" placeholder="admin@stonamart.com"
            autoComplete="email" required />
        </FormField>

        <FormField label="Password">
          <div className="relative">
            <AuthInput
              name="password" type={showPwd ? "text" : "password"}
              placeholder="Min. 8 characters" autoComplete="new-password"
              className="pr-12" required minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-dark/30 hover:text-stone-dark/60 transition-colors">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </FormField>

        <FormField label="Confirm Password" error={confirmError}>
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
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-dark/30 hover:text-stone-dark/60 transition-colors">
              {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {confirmPassword && confirmPassword === password && (
            <p className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1">
              <CheckCircle2 size={11} /> Passwords match
            </p>
          )}
        </FormField>

        <SetupSubmit />
      </form>

      {/* Checklist */}
      <div className="space-y-2">
        {[
          "Setup key is provided in your deployment config",
          "Only one admin account can be created this way",
          "Additional admins can be added from the dashboard",
        ].map((item) => (
          <div key={item} className="flex items-start gap-2">
            <CheckCircle2 size={12} className="text-amber-gold flex-shrink-0 mt-0.5" />
            <p className="font-sans text-[11.5px] text-stone-dark/50 leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main tabbed component ────────────────────────────────────────────────────
export function AdminAuthTabs({ defaultTab = "signin" }: { defaultTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(defaultTab);

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <p className="text-[10px] font-sans font-bold text-amber-gold/70 uppercase tracking-[0.22em] mb-2">
          Admin Portal
        </p>
        <h2 className="font-serif text-[1.85rem] font-bold text-stone-950 leading-tight tracking-tight">
          {tab === "signin" ? "Welcome back" : "Admin Setup"}
        </h2>
        <p className="mt-1.5 font-sans text-[13.5px] text-stone-dark/45 leading-relaxed">
          {tab === "signin"
            ? "Sign in to access the admin operations portal."
            : "Create the initial administrator account."}
        </p>
        <div className="mt-4 h-px bg-gradient-to-r from-amber-gold/30 via-stone-dark/8 to-transparent" />
      </div>

      {/* Tab switcher */}
      <div className="relative flex rounded-2xl p-1 gap-1"
        style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.07)" }}>
        {([
          { id: "signin", label: "Sign In",      icon: LogIn       },
          { id: "setup",  label: "Admin Setup",  icon: ShieldCheck },
        ] as { id: Tab; label: string; icon: React.FC<{ size?: number; className?: string }> }[]).map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="relative flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-sans text-[13px] font-semibold transition-colors duration-200 z-10"
            style={{ color: tab === t.id ? "#0a0a0a" : "rgba(10,10,10,0.40)" }}>
            {tab === t.id && (
              <motion.div layoutId="admin-tab-bg"
                className="absolute inset-0 rounded-xl bg-white"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(201,169,97,0.20)" }}
                transition={{ type: "spring", stiffness: 420, damping: 36 }} />
            )}
            <t.icon size={13} className="relative z-10 flex-shrink-0" />
            <span className="relative z-10 whitespace-nowrap">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Form panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: tab === "signin" ? -16 : 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: tab === "signin" ? 16 : -16, filter: "blur(4px)" }}
          transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {tab === "signin" ? (
            <div className="space-y-5">
              <AdminLoginForm />
              <p className="font-sans text-[12.5px] text-stone-dark/42 text-center">
                First time here?{" "}
                <button type="button" onClick={() => setTab("setup")}
                  className="text-amber-gold font-semibold hover:text-amber-gold/75 transition-colors">
                  Run admin setup
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <AdminSetupForm />
              <p className="font-sans text-[12.5px] text-stone-dark/42 text-center">
                Already set up?{" "}
                <button type="button" onClick={() => setTab("signin")}
                  className="text-amber-gold font-semibold hover:text-amber-gold/75 transition-colors">
                  Sign in here
                </button>
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
