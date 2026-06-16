"use client";

import React, { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Store, ShieldCheck, ArrowLeft,
  Eye, EyeOff, CheckCircle2, AlertCircle, KeyRound,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { customerSignupAction } from "@/lib/auth-actions";
import { adminSetupAction } from "@/lib/admin-actions";
import {
  FormField, AuthInput, AuthSelect, SubmitButton, AuthDivider,
} from "./AuthLayout";

type Role = "customer" | "vendor" | "admin";

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat",
  "Kochi", "Chandigarh", "Indore", "Lucknow", "Nagpur",
];

// ─── Password strength ─────────────────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ chars", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
  ];
  if (!password) return null;
  return (
    <div className="flex items-center gap-3 flex-wrap mt-1.5">
      {checks.map((c) => (
        <div key={c.label} className="flex items-center gap-1">
          <CheckCircle2
            size={11}
            className={c.pass ? "text-emerald-500" : "text-stone-dark/20"}
          />
          <span className={`text-[10.5px] font-sans ${c.pass ? "text-emerald-600" : "text-stone-dark/35"}`}>
            {c.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Role selection cards ──────────────────────────────────────────────────────
const ROLES: {
  id: Role;
  label: string;
  sub: string;
  Icon: React.ElementType;
  accent: string;
  bg: string;
  border: string;
}[] = [
  {
    id: "customer",
    label: "Customer",
    sub: "Browse & buy premium stone",
    Icon: ShoppingBag,
    accent: "text-amber-gold",
    bg: "bg-amber-gold/8 hover:bg-amber-gold/14",
    border: "border-amber-gold/20 hover:border-amber-gold/45",
  },
  {
    id: "vendor",
    label: "Vendor",
    sub: "List & sell your inventory",
    Icon: Store,
    accent: "text-emerald-600",
    bg: "bg-emerald-500/6 hover:bg-emerald-500/12",
    border: "border-emerald-500/18 hover:border-emerald-500/40",
  },
  {
    id: "admin",
    label: "Admin",
    sub: "Manage the platform",
    Icon: ShieldCheck,
    accent: "text-blue-500",
    bg: "bg-blue-500/6 hover:bg-blue-500/12",
    border: "border-blue-500/18 hover:border-blue-500/40",
  },
];

function RoleSelector({ onSelect }: { onSelect: (r: Role) => void }) {
  return (
    <div className="space-y-7">
      <div>
        <h2 className="font-serif text-[1.75rem] font-bold text-stone-950 leading-tight">
          Create your account
        </h2>
        <p className="mt-1.5 font-sans text-[13.5px] text-stone-dark/50">
          Choose your role to get started
        </p>
      </div>

      <div className="space-y-3">
        {ROLES.map(({ id, label, sub, Icon, accent, bg, border }) => (
          <motion.button
            key={id}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => onSelect(id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left group ${bg} ${border}`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm border ${border}`}>
              <Icon size={20} className={accent} />
            </div>
            <div className="flex-1">
              <p className="font-sans font-bold text-stone-950 text-[14px]">{label}</p>
              <p className="font-sans text-[12px] text-stone-dark/45 mt-0.5">{sub}</p>
            </div>
            <ArrowRight size={15} className="text-stone-dark/20 group-hover:text-stone-dark/45 transition-colors" />
          </motion.button>
        ))}
      </div>

      <AuthDivider label="Already have an account?" />
      <Link
        href="/login"
        className="flex items-center justify-center w-full py-3 border border-stone-dark/12 rounded-xl text-[13px] font-sans font-semibold text-stone-dark/70 hover:border-stone-dark/25 hover:text-stone-950 transition-all"
      >
        Sign In
      </Link>
    </div>
  );
}

// ─── Back header ───────────────────────────────────────────────────────────────
function BackRow({
  role,
  onBack,
}: {
  role: Role;
  onBack: () => void;
}) {
  const roleLabel = ROLES.find((r) => r.id === role)?.label ?? "";
  return (
    <div className="flex items-center gap-3 mb-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-stone-dark/40 hover:text-stone-950 font-sans text-[12px] font-semibold transition-colors"
      >
        <ArrowLeft size={13} />
        Back
      </button>
      <div className="flex-1 h-px bg-stone-dark/8" />
      <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-stone-dark/30">
        {roleLabel} Registration
      </span>
    </div>
  );
}

// ─── Customer form ─────────────────────────────────────────────────────────────
function CustomerSubmitRow() {
  const { pending } = useFormStatus();
  return (
    <SubmitButton pending={pending} label="Create Account" pendingLabel="Creating account…" />
  );
}

function CustomerForm({ onBack }: { onBack: () => void }) {
  const [state, formAction] = useActionState(customerSignupAction, {});
  const [showPw, setShowPw] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <div className="space-y-5">
      <BackRow role="customer" onBack={onBack} />

      <div>
        <h2 className="font-serif text-[1.6rem] font-bold text-stone-950 leading-tight">
          Customer Account
        </h2>
        <p className="mt-1 font-sans text-[13px] text-stone-dark/45">
          Discover premium natural stone for your project
        </p>
      </div>

      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200/60 rounded-xl"
          >
            <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="font-sans text-[13px] text-red-700">{state.error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form action={formAction} className="space-y-3.5">
        <FormField label="Full Name" error={state.fieldErrors?.name}>
          <AuthInput
            name="name"
            type="text"
            placeholder="Arjun Mehta"
            autoComplete="name"
            error={!!state.fieldErrors?.name}
            required
          />
        </FormField>

        <FormField label="Email Address" error={state.fieldErrors?.email}>
          <AuthInput
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={!!state.fieldErrors?.email}
            required
          />
        </FormField>

        <FormField label="Password" error={state.fieldErrors?.password}>
          <div className="relative">
            <AuthInput
              name="password"
              type={showPw ? "text" : "password"}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              error={!!state.fieldErrors?.password}
              className="pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-dark/30 hover:text-stone-dark/60 transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <PasswordStrength password={password} />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Phone (optional)">
            <AuthInput
              name="phone"
              type="tel"
              placeholder="98765 43210"
              autoComplete="tel"
            />
          </FormField>

          <FormField label="City (optional)">
            <div className="relative">
              <AuthSelect name="city" defaultValue="">
                <option value="">Select city</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Other">Other</option>
              </AuthSelect>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-dark/30 text-xs">▾</div>
            </div>
          </FormField>
        </div>

        <div className="pt-1">
          <CustomerSubmitRow />
        </div>
      </form>

      <div className="p-3.5 bg-amber-gold/6 border border-amber-gold/18 rounded-xl">
        <ul className="space-y-1">
          {[
            "Browse 200+ stone varieties",
            "Get instant WhatsApp quotations",
            "Track your inquiries",
          ].map((b) => (
            <li key={b} className="flex items-center gap-2 text-[11.5px] font-sans text-stone-dark/60">
              <CheckCircle2 size={10} className="text-amber-gold flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Vendor redirect card ──────────────────────────────────────────────────────
function VendorRedirectCard({ onBack }: { onBack: () => void }) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <BackRow role="vendor" onBack={onBack} />

      <div>
        <h2 className="font-serif text-[1.6rem] font-bold text-stone-950 leading-tight">
          Vendor Registration
        </h2>
        <p className="mt-1 font-sans text-[13px] text-stone-dark/45">
          List your stone inventory on Stonamart
        </p>
      </div>

      <div className="p-5 bg-emerald-50 border border-emerald-200/60 rounded-2xl space-y-3">
        <p className="font-sans text-[13px] text-stone-dark/70 leading-relaxed">
          Vendor registration requires additional business details — company name,
          GST number, warehouse city, and supporting documents.
        </p>
        <ul className="space-y-1.5">
          {[
            "Company & GST details",
            "Contact person & phone",
            "Business address",
            "Application reviewed by admin",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-[12px] font-sans text-stone-dark/55">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push("/vendor/register")}
        className="w-full py-3.5 font-sans font-semibold text-[14px] rounded-xl text-white flex items-center justify-center gap-2"
        style={{
          background: "linear-gradient(135deg, #166534 0%, #15803d 50%, #14532d 100%)",
          boxShadow: "0 2px 12px rgba(22,101,52,0.25), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <Store size={15} />
        Continue to Vendor Registration
      </motion.button>

      <p className="font-sans text-[11px] text-stone-dark/35 text-center">
        After registration, your application will be reviewed by our admin team.
      </p>
    </div>
  );
}

// ─── Admin form ────────────────────────────────────────────────────────────────
function AdminSubmitRow() {
  const { pending } = useFormStatus();
  return (
    <SubmitButton pending={pending} label="Create Admin Account" pendingLabel="Creating account…" />
  );
}

function AdminForm({ onBack }: { onBack: () => void }) {
  const [state, formAction] = useActionState(adminSetupAction, {});
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="space-y-5">
      <BackRow role="admin" onBack={onBack} />

      <div>
        <h2 className="font-serif text-[1.6rem] font-bold text-stone-950 leading-tight">
          Admin Account
        </h2>
        <p className="mt-1 font-sans text-[13px] text-stone-dark/45">
          Platform management access — requires a setup key
        </p>
      </div>

      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200/60 rounded-xl"
          >
            <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="font-sans text-[13px] text-red-700">{state.error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form action={formAction} className="space-y-3.5">
        {/* Setup key — first field, most important */}
        <FormField label="Setup Key">
          <div className="relative">
            <KeyRound
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-dark/30"
            />
            <AuthInput
              name="setupKey"
              type="text"
              placeholder="Enter setup key"
              className="pl-10"
              required
            />
          </div>
          <p className="text-[10px] font-sans text-stone-dark/30 mt-1">
            Default key: <span className="font-mono text-stone-dark/45">stonamart-setup-2024</span>
          </p>
        </FormField>

        <FormField label="Full Name">
          <AuthInput
            name="name"
            type="text"
            placeholder="Admin name"
            autoComplete="name"
            required
          />
        </FormField>

        <FormField label="Email Address">
          <AuthInput
            name="email"
            type="email"
            placeholder="admin@yourdomain.com"
            autoComplete="email"
            required
          />
        </FormField>

        <FormField label="Password">
          <div className="relative">
            <AuthInput
              name="password"
              type={showPw ? "text" : "password"}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              className="pr-12"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-dark/30 hover:text-stone-dark/60 transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </FormField>

        <div className="pt-1">
          <AdminSubmitRow />
        </div>
      </form>

      <div className="p-3.5 bg-blue-50 border border-blue-200/60 rounded-xl">
        <p className="font-sans text-[11.5px] text-blue-700 leading-relaxed">
          Only one admin can be created. After setup, log in with these credentials to access the Admin Dashboard.
        </p>
      </div>
    </div>
  );
}

// ─── Main unified signup form ──────────────────────────────────────────────────
export function UnifiedSignupForm({
  searchParams,
}: {
  searchParams?: Promise<{ role?: string }>;
}) {
  // Read ?role= from URL on first render (searchParams is a Promise in Next.js 15)
  const [role, setRole] = useState<Role | null>(null);

  React.useEffect(() => {
    if (!searchParams) return;
    searchParams.then((p) => {
      const r = p?.role;
      if (r === "customer" || r === "vendor" || r === "admin") {
        setRole(r);
      }
    });
  }, [searchParams]);

  return (
    <AnimatePresence mode="wait">
      {role === null && (
        <motion.div
          key="selector"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.22 }}
        >
          <RoleSelector onSelect={setRole} />
        </motion.div>
      )}

      {role === "customer" && (
        <motion.div
          key="customer"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.22 }}
        >
          <CustomerForm onBack={() => setRole(null)} />
        </motion.div>
      )}

      {role === "vendor" && (
        <motion.div
          key="vendor"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.22 }}
        >
          <VendorRedirectCard onBack={() => setRole(null)} />
        </motion.div>
      )}

      {role === "admin" && (
        <motion.div
          key="admin"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.22 }}
        >
          <AdminForm onBack={() => setRole(null)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
