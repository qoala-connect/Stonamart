import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Route protection middleware ──────────────────────────────────────────────
// Strategy: lightweight cookie existence check in Edge middleware.
// Full role/status validation is enforced in the server component layouts.
//
// Why two layers?
//   - Edge middleware cannot call the database (no Node.js runtime).
//   - The cookie check prevents obvious unauthenticated requests early.
//   - The layout-level check is the authoritative guard with role verification.

const SESSION_COOKIE = "better-auth.session_token";

// Routes that require any authenticated session.
// /vendor covers all of /vendor, /vendor/dashboard, /vendor/pending —
// the /vendor/register early-return above keeps registration public.
const AUTH_REQUIRED_PREFIXES = [
  "/admin",
  "/vendor",
  "/account",
];

// Routes that authenticated users should not see again.
// /login is intentionally NOT here — an admin or vendor needs to be able
// to visit /login to switch to a different account without signing out first.
const AUTH_REDIRECT_PATHS = ["/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE);
  const isAuthenticated = !!sessionCookie?.value;

  // Vendor register is public — allow always
  if (pathname.startsWith("/vendor/register")) {
    return NextResponse.next();
  }

  // Block unauthenticated access to protected routes
  const needsAuth = AUTH_REQUIRED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (needsAuth && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect already-authenticated users away from login/signup
  if (isAuthenticated && AUTH_REDIRECT_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/vendor/:path*",
    "/account/:path*",
    "/login",
    "/signup",
  ],
};
