"use server";

import { auth } from "./auth";
import { db } from "./db";
import { supabaseAdmin } from "./supabase";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// ─── Types ────────────────────────────────────────────────────────────────────
export type AuthActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

// ─── R2 client (lazy init — only created if env vars are set) ─────────────────
function getR2Client() {
  if (
    !process.env.R2_ACCOUNT_ID ||
    !process.env.R2_ACCESS_KEY_ID ||
    !process.env.R2_SECRET_ACCESS_KEY
  )
    return null;
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
}

// ─── Helper: get presigned R2 upload URL ──────────────────────────────────────
export async function getR2PresignedUrl(
  filename: string,
  contentType: string,
  userId: string
): Promise<{ url: string; key: string } | null> {
  const r2 = getR2Client();
  if (!r2 || !process.env.R2_BUCKET_NAME) return null;

  const key = `vendor-docs/${userId}/${Date.now()}-${filename}`;
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(r2, command, { expiresIn: 300 });
  return { url, key };
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  console.log("[loginAction] Starting login process.");

  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    console.log("[loginAction] Email or password missing.");
    return { error: "Email and password are required." };
  }

  // --- Step 1: Check required environment variables ---
  console.log("[loginAction] Step 1: Checking environment variables.");
  const requiredEnvVars = [
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_APP_URL", // Crucial for Better Auth's trustedOrigins
  ];
  const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v]);
  if (missingEnvVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingEnvVars.join(", ")}.`;
    console.error(`[loginAction] ${errorMessage}`);
    return { error: process.env.NODE_ENV !== 'production' ? errorMessage : "Configuration error. Please try again later." };
  }
  console.log("[loginAction] All required environment variables are present.");

  // --- Step 2: Validate PostgreSQL connectivity ---
  console.log("[loginAction] Step 2: Validating PostgreSQL connectivity.");
  try {
    await db.query('SELECT 1');
    console.log("[loginAction] PostgreSQL connection successful.");
  } catch (dbErr) {
    console.error("[loginAction] PostgreSQL connection failed:", dbErr);
    const errorMessage = "Failed to connect to the database.";
    return { error: process.env.NODE_ENV !== 'production' ? `${errorMessage} Details: ${String(dbErr)}` : "Database connection error. Please try again later." };
  }

  // Sign out any existing session first — avoids cookie conflicts when
  // switching accounts (e.g. admin logging in as vendor).
  console.log("[loginAction] Attempting to sign out any existing session.");
  try {
    await auth.api.signOut({ headers: await headers() });
    console.log("[loginAction] Existing session signed out successfully (if any).");
  } catch {
    console.warn("[loginAction] Failed to sign out existing session (non-fatal).");
  }

  // --- Step 3: Attempt to sign in via Better Auth ---
  console.log("[loginAction] Step 3: Attempting to sign in with Better Auth.");
  try {
    const requestHeaders = await headers();
    console.log("[loginAction] Request headers for signInEmail:", Object.fromEntries(requestHeaders.entries()));

    await auth.api.signInEmail({
      body: { email, password },
      headers: requestHeaders,
    });
    console.log("[loginAction] Better Auth signInEmail successful.");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[loginAction] signInEmail failed:", msg);
    // Return actual error message in development, generic in production
    return { error: process.env.NODE_ENV !== 'production' ? `Login failed: ${msg}` : "Invalid email or password. Please try again." };
  }

  // --- Step 4: Query DB for user role/status and redirect ---
  console.log("[loginAction] Step 4: Querying DB for user role and status.");
  // Query DB directly for role/status — signInEmail return value may omit
  // custom fields when using the nextCookies() plugin.
  try {
    const { rows } = await db.query(
      `SELECT role, status FROM "user" WHERE email = $1 LIMIT 1`,
      [email]
    );
    const userRole   = (rows[0]?.role   as string) ?? "CUSTOMER";
    const userStatus = (rows[0]?.status as string) ?? "ACTIVE";
    console.log(`[loginAction] User found: Role=${userRole}, Status=${userStatus}`);

    if (userStatus === "INACTIVE") {
      console.log("[loginAction] Redirecting to /suspended (INACTIVE user).");
      redirect("/suspended");
    }
    if (userRole === "ADMIN") {
      console.log("[loginAction] Redirecting to /admin/dashboard (ADMIN user).");
      redirect("/admin/dashboard");
    }
    if (userRole === "VENDOR") {
      if (userStatus === "PENDING") {
        console.log("[loginAction] Redirecting to /vendor/pending (PENDING VENDOR user).");
        redirect("/vendor/pending");
      }
      console.log("[loginAction] Redirecting to /vendor/dashboard (ACTIVE VENDOR user).");
      redirect("/vendor/dashboard");
    }
    console.log("[loginAction] Redirecting to /account (CUSTOMER user).");
    redirect("/account");
  } catch (dbQueryErr) {
    console.error("[loginAction] Failed to query user role/status from DB:", dbQueryErr);
    const errorMessage = "Failed to retrieve user details after login.";
    return { error: process.env.NODE_ENV !== 'production' ? `${errorMessage} Details: ${String(dbQueryErr)}` : "An unexpected error occurred. Please try again." };
  }
}

// ─── CUSTOMER SIGNUP ──────────────────────────────────────────────────────────
export async function customerSignupAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const city = (formData.get("city") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Full name is required.";
  if (!email || !email.includes("@")) errors.email = "Valid email is required.";
  if (!password || password.length < 8)
    errors.password = "Password must be at least 8 characters.";
  if (Object.keys(errors).length > 0) return { fieldErrors: errors };

  let userId = "";

  try {
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        role: "CUSTOMER",
        city: city || undefined,
      },
      headers: await headers(),
    });
    const user = (result as { user?: { id?: string } })?.user;
    userId = user?.id ?? "";
  } catch (err: unknown) {
    console.error("[customerSignupAction] signUpEmail failed:", err);
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes("email") || msg.toLowerCase().includes("unique")) {
      return { fieldErrors: { email: "An account with this email already exists." } };
    }
    return { error: "Could not create your account. Please try again." };
  }

  // Save customer profile (phone, city)
  if (userId) {
    try {
      await db.query(
        `INSERT INTO customer_profiles ("userId", phone, "preferredCity")
         VALUES ($1, $2, $3)
         ON CONFLICT ("userId") DO NOTHING`,
        [userId, phone || null, city || null]
      );
    } catch {
      // Non-fatal
    }
  }

  // Link past guest inquiries to this new account
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.id) {
      await supabaseAdmin
        .from("inquiries")
        .update({ user_id: session.user.id })
        .eq("email", email)
        .is("user_id", null);
    }
  } catch {
    // Non-fatal
  }

  redirect("/account");
}

// ─── VENDOR REGISTRATION ──────────────────────────────────────────────────────
export async function vendorRegisterAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const companyName = (formData.get("companyName") as string)?.trim();
  const contactPerson = (formData.get("contactPerson") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const gstNumber = (formData.get("gstNumber") as string)?.trim();
  const businessAddress = (formData.get("businessAddress") as string)?.trim();
  const city = (formData.get("city") as string)?.trim();
  const documentUrls = JSON.parse(
    (formData.get("documentUrls") as string) || "[]"
  ) as string[];

  const errors: Record<string, string> = {};
  if (!companyName) errors.companyName = "Company name is required.";
  if (!contactPerson) errors.contactPerson = "Contact person is required.";
  if (!phone) errors.phone = "Phone number is required.";
  if (!email || !email.includes("@")) errors.email = "Valid email is required.";
  if (!password || password.length < 8)
    errors.password = "Password must be at least 8 characters.";
  if (!city) errors.city = "City is required.";
  if (Object.keys(errors).length > 0) return { fieldErrors: errors };

  let userId = "";

  // ── Step 1: create the auth account ──────────────────────────────────────
  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: contactPerson,
        email,
        password,
        role: "VENDOR",
        city: city || undefined,
      },
      headers: await headers(),
    });

    const user = (result as { user?: { id?: string } })?.user;
    if (!user?.id) throw new Error("User creation failed — no user id returned");
    userId = user.id;
  } catch (err: unknown) {
    console.error("[vendorRegisterAction] signUpEmail failed:", err);
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes("email") || msg.toLowerCase().includes("unique")) {
      return { fieldErrors: { email: "An account with this email already exists." } };
    }
    return { error: "Could not create your account. Please try again." };
  }

  // ── Step 2: set status to PENDING via direct DB query ────────────────────
  // Using the shared pg Pool (same connection as Better Auth) so this works
  // regardless of whether the Supabase service-role key is configured.
  try {
    await db.query(
      `UPDATE "user" SET "status" = $1, "updatedAt" = NOW() WHERE "id" = $2`,
      ["PENDING", userId]
    );
  } catch (err: unknown) {
    console.error("[vendorRegisterAction] status update failed:", err);
    // Non-fatal: admin can fix status manually. Registration continues.
  }

  // Insert vendor profile
  try {
    await supabaseAdmin.from("vendor_profiles").insert({
      userId,
      companyName,
      contactPerson,
      phone,
      gstNumber: gstNumber || null,
      businessAddress: businessAddress || null,
      city,
      documentUrls,
    });
  } catch {
    // Non-fatal; vendor profile can be added later by admin
  }

  redirect("/vendor/pending");
}

// ─── SIGN OUT ─────────────────────────────────────────────────────────────────
export async function signOutAction(): Promise<void> {
  await auth.api.signOut({ headers: await headers() });
  redirect("/login");
}

// ─── GET SESSION (server utility) ─────────────────────────────────────────────
export async function getServerSession() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    return session as {
      user: {
        id: string;
        name: string;
        email: string;
        role: "CUSTOMER" | "VENDOR" | "ADMIN";
        status: "ACTIVE" | "PENDING" | "INACTIVE";
        city?: string;
      };
      session: { id: string; expiresAt: Date };
    } | null;
  } catch {
    return null;
  }
}
