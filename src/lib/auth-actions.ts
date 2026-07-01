"use server";

import { auth } from "./auth";
import { db } from "./db";
import { supabaseAdmin } from "./supabase";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { hashPassword } from "@better-auth/utils/password";
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

async function repairCredentialPasswordForUser(email: string, password: string) {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const { rows: userRows } = await db.query(
      `SELECT id FROM "user" WHERE LOWER(email) = $1 LIMIT 1`,
      [normalizedEmail]
    );

    const userId = userRows[0]?.id as string | undefined;
    if (!userId) return false;

    const { rows: accountRows } = await db.query(
      `SELECT id FROM account WHERE "userId" = $1 AND "providerId" = 'credential' LIMIT 1`,
      [userId]
    );

    const accountId = accountRows[0]?.id as string | undefined;
    if (!accountId) return false;

    const hashedPassword = await hashPassword(password);
    await db.query(
      `UPDATE account SET "password" = $1, "updatedAt" = NOW() WHERE id = $2`,
      [hashedPassword, accountId]
    );

    return true;
  } catch (repairErr) {
    console.error("[loginAction] Failed to repair credential password hash:", repairErr);
    return false;
  }
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  console.log("[loginAction] Starting login process.");

  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const normalizedEmail = email?.toLowerCase() ?? "";

  if (!email || !password) {
    console.log("[loginAction] Email or password missing.");
    return { error: "Email and password are required." };
  }

  // --- Step 1: Check required environment variables ---
  console.log("[loginAction] Step 1: Checking environment variables.");
  const requiredEnvVars = [
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY", // Used by supabaseAdmin for privileged operations
    "NEXT_PUBLIC_APP_URL", // Crucial for Better Auth's trustedOrigins
  ];
  const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v]);
  if (missingEnvVars.length > 0) {
    const errorMessage = `Missing required server environment variables: ${missingEnvVars.join(
      ", "
    )}.`;
    console.error(`[loginAction] ${errorMessage}`);
    // Fail fast to make the issue obvious during development
    return {
      error: process.env.NODE_ENV !== 'production' ? `Configuration Error: ${errorMessage}` : "Server configuration error. Please contact support.",
    };
  }
  console.log("[loginAction] Environment check complete.");

  // --- Step 2: Validate PostgreSQL connectivity (best-effort only) ---
  console.log("[loginAction] Step 2: Checking PostgreSQL connectivity.");
  try {
    await db.query('SELECT 1');
    console.log("[loginAction] PostgreSQL connection successful.");
  } catch (dbErr) {
    console.warn("[loginAction] PostgreSQL connection check failed (continuing without hard stop):", dbErr);
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
      body: { email: normalizedEmail, password },
      headers: requestHeaders,
    });
    console.log("[loginAction] Better Auth signInEmail successful.");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[loginAction] signInEmail failed:", msg);

    const needsPasswordRepair = /invalid|unauthorized|password/i.test(msg);
    if (needsPasswordRepair) {
      const repaired = await repairCredentialPasswordForUser(normalizedEmail, password);
      if (repaired) {
        try {
          const requestHeaders = await headers();
          await auth.api.signInEmail({
            body: { email: normalizedEmail, password },
            headers: requestHeaders,
          });
          console.log("[loginAction] Better Auth signInEmail succeeded after password repair.");
        } catch (retryErr: unknown) {
          const retryMsg = retryErr instanceof Error ? retryErr.message : String(retryErr);
          console.error("[loginAction] signInEmail retry failed:", retryMsg);
          return { error: process.env.NODE_ENV !== 'production' ? `Login failed: ${retryMsg}` : "Invalid email or password. Please try again." };
        }
      } else {
        return { error: process.env.NODE_ENV !== 'production' ? `Login failed: ${msg}` : "Invalid email or password. Please try again." };
      }
    } else {
      return { error: process.env.NODE_ENV !== 'production' ? `Login failed: ${msg}` : "Invalid email or password. Please try again." };
    }
  }

  // --- Step 4: Query DB for user role/status and redirect ---
  console.log("[loginAction] Step 4: Querying DB for user role and status.");
  // Query DB directly for role/status — signInEmail return value may omit
  // custom fields when using the nextCookies() plugin.
  let userRole = "CUSTOMER";
  let userStatus = "ACTIVE";

  try {
    const { rows } = await db.query(
      `SELECT role, status FROM "user" WHERE email = $1 LIMIT 1`,
      [email]
    );
    userRole = (rows[0]?.role as string) ?? "CUSTOMER";
    userStatus = (rows[0]?.status as string) ?? "ACTIVE";
    console.log(`[loginAction] User found: Role=${userRole}, Status=${userStatus}`);
  } catch (dbQueryErr) {
    console.error("[loginAction] Failed to query user role/status from DB:", dbQueryErr);
    const errorMessage = "Failed to retrieve user details after login.";
    return {
      error:
        process.env.NODE_ENV !== "production"
          ? `${errorMessage} Details: ${String(dbQueryErr)}`
          : "An unexpected error occurred. Please try again.",
    };
  }

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
