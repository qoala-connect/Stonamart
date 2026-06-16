"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserPlus } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { CustomerSignupForm } from "./CustomerSignupForm";

type Tab = "signin" | "register";

export function CustomerAuthTabs({ defaultTab = "signin" }: { defaultTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(defaultTab);

  return (
    <div className="space-y-7">
      {/* Tab switcher */}
      <div className="relative flex rounded-2xl p-1 gap-1"
        style={{
          background: "rgba(0,0,0,0.04)",
          border: "1px solid rgba(0,0,0,0.07)",
        }}>
        {([
          { id: "signin",   label: "Sign In",        icon: LogIn    },
          { id: "register", label: "Create Account", icon: UserPlus },
        ] as { id: Tab; label: string; icon: React.FC<{ size?: number; className?: string }> }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="relative flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-sans text-[13px] font-semibold transition-colors duration-200 z-10"
            style={{
              color: tab === t.id ? "#0a0a0a" : "rgba(10,10,10,0.40)",
            }}
          >
            {tab === t.id && (
              <motion.div
                layoutId="tab-bg"
                className="absolute inset-0 rounded-xl bg-white"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(201,169,97,0.20)" }}
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <t.icon size={13} className="relative z-10 flex-shrink-0" />
            <span className="relative z-10 whitespace-nowrap">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Amber underline accent */}
      <div className="h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,97,0.35) 30%, rgba(201,169,97,0.55) 50%, rgba(201,169,97,0.35) 70%, transparent)" }} />

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
            <SignInSection onSwitchToRegister={() => setTab("register")} />
          ) : (
            <RegisterSection onSwitchToSignIn={() => setTab("signin")} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Sign-in wrapper — strips the bottom "New to Stonamart?" block ──────────────
function SignInSection({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  return (
    <div className="space-y-6">
      <LoginFormInline />
      <p className="font-sans text-[12.5px] text-stone-dark/42 text-center">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-amber-gold font-semibold hover:text-amber-gold/75 transition-colors"
        >
          Create one free
        </button>
      </p>
    </div>
  );
}

// ── Register wrapper ──────────────────────────────────────────────────────────
function RegisterSection({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  return (
    <div className="space-y-6">
      <CustomerSignupFormInline />
      <p className="font-sans text-[12.5px] text-stone-dark/42 text-center">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="text-amber-gold font-semibold hover:text-amber-gold/75 transition-colors"
        >
          Sign in here
        </button>
      </p>
    </div>
  );
}

// ── Inline LoginForm (no external "New to Stonamart?" footer — handled by tab) ──
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { loginAction } from "@/lib/auth-actions";
import { FormField, AuthInput, SubmitButton } from "./AuthLayout";

function LoginSubmit() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending} label="Sign In" pendingLabel="Signing in…" />;
}

function LoginFormInline() {
  const [state, formAction] = useActionState(loginAction, {});
  const [showPw, setShowPw] = React.useState(false);

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
        <FormField label="Email Address" error={state.fieldErrors?.email}>
          <AuthInput type="email" name="email" placeholder="you@example.com" autoComplete="email" error={!!state.fieldErrors?.email} required />
        </FormField>

        <FormField label="Password" error={state.fieldErrors?.password}>
          <div className="relative">
            <AuthInput
              type={showPw ? "text" : "password"} name="password" placeholder="••••••••"
              autoComplete="current-password" error={!!state.fieldErrors?.password} className="pr-12" required
            />
            <button type="button" onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-dark/30 hover:text-stone-dark/60 transition-colors">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </FormField>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-[12px] font-sans text-amber-gold hover:text-amber-gold/70 transition-colors font-medium">
            Forgot password?
          </Link>
        </div>

        <LoginSubmit />
      </form>
    </div>
  );
}

// ── Inline CustomerSignupForm (no external "Already have an account?" link) ──
import { customerSignupAction } from "@/lib/auth-actions";
import { AuthSelect, AuthDivider } from "./AuthLayout";
import { CheckCircle2 } from "lucide-react";

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat",
  "Kochi", "Chandigarh", "Indore", "Lucknow", "Nagpur",
];

function RegisterSubmit() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending} label="Create Account" pendingLabel="Creating account…" />;
}

function CustomerSignupFormInline() {
  const [state, formAction] = useActionState(customerSignupAction, {});
  const [showPw, setShowPw] = React.useState(false);
  const [password, setPassword] = React.useState("");

  const checks = [
    { label: "8+ chars",   pass: password.length >= 8 },
    { label: "Uppercase",  pass: /[A-Z]/.test(password) },
    { label: "Number",     pass: /[0-9]/.test(password) },
  ];

  return (
    <div className="space-y-5">
      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200/60 rounded-xl"
          >
            <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="font-sans text-[13px] text-red-700">{state.error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form action={formAction} className="space-y-4">
        <FormField label="Full Name" error={state.fieldErrors?.name}>
          <AuthInput name="name" type="text" placeholder="Arjun Mehta" autoComplete="name" error={!!state.fieldErrors?.name} required />
        </FormField>

        <FormField label="Email Address" error={state.fieldErrors?.email}>
          <AuthInput name="email" type="email" placeholder="you@example.com" autoComplete="email" error={!!state.fieldErrors?.email} required />
        </FormField>

        <FormField label="Password" error={state.fieldErrors?.password}>
          <div className="relative">
            <AuthInput
              name="password" type={showPw ? "text" : "password"} placeholder="Min. 8 characters"
              autoComplete="new-password" error={!!state.fieldErrors?.password} className="pr-12"
              value={password} onChange={(e) => setPassword(e.target.value)} required
            />
            <button type="button" onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-dark/30 hover:text-stone-dark/60 transition-colors">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {password && (
            <div className="flex items-center gap-3 flex-wrap mt-1.5">
              {checks.map((c) => (
                <div key={c.label} className="flex items-center gap-1">
                  <CheckCircle2 size={11} className={c.pass ? "text-emerald-500" : "text-stone-dark/20"} />
                  <span className={`text-[10.5px] font-sans ${c.pass ? "text-emerald-600" : "text-stone-dark/35"}`}>{c.label}</span>
                </div>
              ))}
            </div>
          )}
        </FormField>

        <FormField label="City (optional)">
          <div className="relative">
            <AuthSelect name="city" defaultValue="">
              <option value="">Select your city</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              <option value="Other">Other</option>
            </AuthSelect>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-dark/30">▾</div>
          </div>
        </FormField>

        <RegisterSubmit />
      </form>

      {/* Member benefits */}
      <div className="p-4 bg-amber-gold/6 border border-amber-gold/18 rounded-xl">
        <p className="text-[10.5px] font-sans font-bold text-amber-700 uppercase tracking-wider mb-2">Member benefits</p>
        <ul className="space-y-1">
          {["Save inquiries & track order history", "Instant WhatsApp quotations", "Early access to new arrivals"].map((b) => (
            <li key={b} className="flex items-center gap-2 text-[12px] font-sans text-stone-dark/60">
              <CheckCircle2 size={11} className="text-amber-gold flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
