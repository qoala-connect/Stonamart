import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

const resolvedAppUrl =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.BETTER_AUTH_URL_PROD ??
  process.env.NEXT_PUBLIC_APP_URL_PROD ??
  process.env.NEXT_PUBLIC_BASE_URL ??
  process.env.NEXT_PUBLIC_BASE_URL_PROD ??
  "http://localhost:3000";

// ─── Better Auth client ───────────────────────────────────────────────────────
// Used in Client Components for reactive auth state and mutations.
export const authClient = createAuthClient({
  baseURL: resolvedAppUrl,
  plugins: [inferAdditionalFields<typeof auth>()],
});

export type ClientSession = Awaited<ReturnType<typeof authClient.getSession>>;
