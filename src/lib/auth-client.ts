import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

// Prioritize NEXT_PUBLIC_APP_URL for general deployments, NEXT_PUBLIC_VERCEL_URL for Vercel, then other fallbacks.
const resolvedAppUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? // Primary public URL, e.g., https://www.yourdomain.com
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_VERCEL_URL ?? // Vercel specific public URL, e.g., https://your-app.vercel.app
  process.env.BETTER_AUTH_URL_PROD ??
  process.env.NEXT_PUBLIC_APP_URL_PROD ??
  process.env.NEXT_PUBLIC_BASE_URL ??
  process.env.NEXT_PUBLIC_BASE_URL_PROD ??
  "http://127.0.0.1:3000";

// ─── Better Auth client ───────────────────────────────────────────────────────
// Used in Client Components for reactive auth state and mutations.
export const authClient = createAuthClient({
  baseURL: resolvedAppUrl,
  plugins: [inferAdditionalFields<typeof auth>()],
});

export type ClientSession = Awaited<ReturnType<typeof authClient.getSession>>;
