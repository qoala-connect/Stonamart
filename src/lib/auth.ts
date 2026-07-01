import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db";

const resolvedAppUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? // Primary public URL, e.g., https://www.yourdomain.com
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_VERCEL_URL ?? // Vercel specific public URL, e.g., https://your-app.vercel.app
  process.env.BETTER_AUTH_URL_PROD ??
  process.env.NEXT_PUBLIC_APP_URL_PROD ??
  process.env.NEXT_PUBLIC_BASE_URL ??
  process.env.NEXT_PUBLIC_BASE_URL_PROD ??
  "http://127.0.0.1:3000";

if (!process.env.BETTER_AUTH_URL) {
  process.env.BETTER_AUTH_URL = resolvedAppUrl;
}

// ─── Better Auth server configuration ────────────────────────────────────────
// Connects to Supabase PostgreSQL via DATABASE_URL (service role connection).
// The nextCookies() plugin enables automatic cookie management in
// Next.js Server Actions, Server Components, and Route Handlers.
export const auth = betterAuth({
  database: db,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "CUSTOMER",
        input: true,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: "ACTIVE",
        input: false, // cannot be set by the user during registration
      },
      city: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,     // refresh if older than 1 day
  },

  plugins: [nextCookies()],

  trustedOrigins: [resolvedAppUrl, "http://localhost:3000"] , // IMPORTANT: Replace with your actual deployed domains.
});

// ─── Inferred types ───────────────────────────────────────────────────────────
export type AuthSession = typeof auth.$Infer.Session;
export type AuthUser = typeof auth.$Infer.Session.user & {
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  city?: string;
};
