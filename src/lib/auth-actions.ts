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
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  // Sign out any existing session first — avoids cookie conflicts when
  // switching accounts (e.g. admin logging in as vendor).
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch {
    // Not currently signed in — that's fine, continue.
  }

  try {
    await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[loginAction] signInEmail failed:", msg);
    return { error: "Invalid email or password. Please try again." };
  }

  // Query DB directly for role/status — signInEmail return value may omit
  // custom fields when using the nextCookies() plugin.
  const { rows } = await db.query(
    `SELECT role, status FROM "user" WHERE email = $1 LIMIT 1`,
    [email]
  );
  const userRole   = (rows[0]?.role   as string) ?? "CUSTOMER";
  const userStatus = (rows[0]?.status as string) ?? "ACTIVE";

  if (userStatus === "INACTIVE") redirect("/suspended");
  if (userRole === "ADMIN")  redirect("/admin/dashboard");
  if (userRole === "VENDOR") {
    if (userStatus === "PENDING") redirect("/vendor/pending");
    redirect("/vendor/dashboard");
  }
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
