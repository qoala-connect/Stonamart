"use server";

import { auth } from "./auth";
import { db } from "./db";
import { getServerSession } from "./auth-actions";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sendRejectionEmail } from "./email";

// ─── Types ─────────────────────────────────────────────────────────────────────
export type VendorApplication = {
  userId: string;
  name: string;
  email: string;
  status: string;
  companyName: string | null;
  contactPerson: string | null;
  phone: string | null;
  gstNumber: string | null;
  businessAddress: string | null;
  city: string | null;
  documentUrls: string[];
  createdAt: string;
};

// ─── Auth guard ────────────────────────────────────────────────────────────────
async function requireAdmin() {
  const session = await getServerSession();
  if (!session || session.user.role !== "ADMIN") redirect("/login");
}

// ─── Queries ───────────────────────────────────────────────────────────────────
export async function getPendingVendors(): Promise<VendorApplication[]> {
  await requireAdmin();
  const { rows } = await db.query(`
    SELECT
      u.id            AS "userId",
      u.name,
      u.email,
      u.status,
      u."createdAt",
      vp."companyName",
      vp."contactPerson",
      vp.phone,
      vp."gstNumber",
      vp."businessAddress",
      vp.city,
      COALESCE(vp."documentUrls", '{}') AS "documentUrls"
    FROM "user" u
    LEFT JOIN vendor_profiles vp ON vp."userId" = u.id
    WHERE u.role = 'VENDOR' AND u.status = 'PENDING'
    ORDER BY u."createdAt" DESC
  `);
  return rows;
}

export async function getAllVendors(): Promise<VendorApplication[]> {
  await requireAdmin();
  const { rows } = await db.query(`
    SELECT
      u.id            AS "userId",
      u.name,
      u.email,
      u.status,
      u."createdAt",
      vp."companyName",
      vp."contactPerson",
      vp.phone,
      vp."gstNumber",
      vp."businessAddress",
      vp.city,
      COALESCE(vp."documentUrls", '{}') AS "documentUrls"
    FROM "user" u
    LEFT JOIN vendor_profiles vp ON vp."userId" = u.id
    WHERE u.role = 'VENDOR'
    ORDER BY u."createdAt" DESC
  `);
  return rows;
}

export async function getRegisteredVendors(): Promise<VendorApplication[]> {
  await requireAdmin();
  const { rows } = await db.query(`
    SELECT
      u.id            AS "userId",
      u.name,
      u.email,
      u.status,
      u."createdAt",
      vp."companyName",
      vp."contactPerson",
      vp.phone,
      vp."gstNumber",
      vp."businessAddress",
      vp.city,
      COALESCE(vp."documentUrls", '{}') AS "documentUrls"
    FROM "user" u
    LEFT JOIN vendor_profiles vp ON vp."userId" = u.id
    WHERE u.role = 'VENDOR' AND u.status = 'ACTIVE'
    ORDER BY u."createdAt" DESC
  `);
  return rows;
}

// ─── Product review ────────────────────────────────────────────────────────────
export type PendingProduct = {
  id: string;
  vendorId: string;
  vendorName: string;
  companyName: string | null;
  vendorEmail: string | null;
  vendorPhone: string | null;
  name: string;
  materialType: string;
  category: string;
  color: string;
  finish: string;
  thickness: string;
  dimensions: string;
  warehouseCity: string;
  pricePerUnit: number;
  unit: string;
  stockQty: number;
  imageUrls: string[];
  videoUrl: string | null;
  createdAt: string;
  status: string; // 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED'
};

export async function getPendingProducts(): Promise<PendingProduct[]> {
  return getAdminProducts("pending");
}

// Returns all vendor-submitted products (non-DRAFT) for admin review queue.
// filter: 'all' | 'pending' | 'approved' | 'rejected'
export async function getAdminProducts(
  filter: "all" | "pending" | "approved" | "rejected" = "all"
): Promise<PendingProduct[]> {
  await requireAdmin();
  try {
    await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS "videoUrl" TEXT DEFAULT NULL`).catch(() => {});
    await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS "adminFeedback" TEXT DEFAULT NULL`).catch(() => {});

    const statusMap = {
      all:      `('PENDING_APPROVAL','APPROVED','REJECTED','CHANGES_REQUESTED')`,
      pending:  `('PENDING_APPROVAL')`,
      approved: `('APPROVED')`,
      rejected: `('REJECTED','CHANGES_REQUESTED')`,
    };

    const { rows } = await db.query(`
      SELECT
        p.id, p."vendorId", p.name, p."materialType", p.category,
        p.color, p.finish, p.thickness, p.dimensions,
        p."warehouseCity", p."pricePerUnit", p.unit, p."stockQty", p."createdAt",
        p.status,
        COALESCE(p."imageUrls", '{}') AS "imageUrls",
        p."videoUrl",
        u.name   AS "vendorName",
        u.email  AS "vendorEmail",
        vp."companyName",
        vp.phone AS "vendorPhone"
      FROM products p
      JOIN "user" u ON u.id = p."vendorId"
      LEFT JOIN vendor_profiles vp ON vp."userId" = p."vendorId"
      WHERE p.status IN ${statusMap[filter]}
      ORDER BY p."createdAt" DESC
    `);
    return rows;
  } catch {
    return [];
  }
}

export async function approveProduct(
  productId: string
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  try {
    const { rows } = await db.query(
      `UPDATE products SET status = 'APPROVED', "updatedAt" = NOW()
       WHERE id = $1
       RETURNING "imageUrls"`,
      [productId]
    );
    revalidatePath("/products");
    revalidatePath("/admin/dashboard");

    // Fire-and-forget: generate CLIP embedding for the first product image
    const imageUrls: string[] = rows[0]?.imageUrls ?? [];
    if (imageUrls.length > 0) {
      generateEmbeddingBackground(productId, imageUrls[0]).catch(() => {});
    }

    return { ok: true };
  } catch (err) {
    console.error("[approveProduct]", err);
    return { ok: false, error: "Failed to approve product." };
  }
}

async function generateEmbeddingBackground(productId: string, imageUrl: string) {
  try {
    const { embedImageUrl, toVectorLiteral } = await import("./clip");
    const embedding = await embedImageUrl(imageUrl);
    await db.query(
      `UPDATE products SET embedding = $1::vector WHERE id = $2`,
      [toVectorLiteral(embedding), productId]
    );
  } catch {
    // Non-fatal — embedding can be backfilled later via /api/admin/embed-products
  }
}

export async function rejectProduct(
  productId: string,
  reason: string
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  try {
    // Ensure adminFeedback column exists (idempotent)
    await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS "adminFeedback" TEXT DEFAULT NULL`).catch(() => {});

    await db.query(
      `UPDATE products SET status = 'REJECTED', "adminFeedback" = $2, "updatedAt" = NOW() WHERE id = $1`,
      [productId, reason]
    );
    revalidatePath("/admin/dashboard");
    revalidatePath("/vendor/dashboard");

    // Notify vendor (best-effort)
    const { rows } = await db.query(
      `SELECT u.email, u.name FROM products p
       JOIN "user" u ON u.id = p."vendorId"
       WHERE p.id = $1 LIMIT 1`,
      [productId]
    );
    if (rows[0]) {
      await sendRejectionEmail(
        rows[0].email,
        rows[0].name,
        `Your product listing was rejected. Reason: ${reason}`
      );
    }
    return { ok: true };
  } catch (err) {
    console.error("[rejectProduct]", err);
    return { ok: false, error: "Failed to reject product." };
  }
}

// ─── Mutations ─────────────────────────────────────────────────────────────────
export async function approveVendor(
  userId: string
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  try {
    await db.query(
      `UPDATE "user" SET status = 'ACTIVE', "updatedAt" = NOW() WHERE id = $1`,
      [userId]
    );
    return { ok: true };
  } catch (err) {
    console.error("[approveVendor]", err);
    return { ok: false, error: "Database update failed." };
  }
}

export async function rejectVendor(
  userId: string,
  reason: string
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  try {
    const { rows } = await db.query(
      `SELECT email, name FROM "user" WHERE id = $1`,
      [userId]
    );

    await db.query(
      `UPDATE "user" SET status = 'INACTIVE', "updatedAt" = NOW() WHERE id = $1`,
      [userId]
    );

    if (rows[0]) {
      await sendRejectionEmail(rows[0].email, rows[0].name, reason);
    }
    return { ok: true };
  } catch (err) {
    console.error("[rejectVendor]", err);
    return { ok: false, error: "Database update failed." };
  }
}

// ─── Admin setup (first-time only) ────────────────────────────────────────────
export async function adminSetupAction(
  _prev: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const { rows } = await db.query(
    `SELECT id FROM "user" WHERE role = 'ADMIN' LIMIT 1`
  );
  if (rows.length > 0) redirect("/login");

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const setupKey = (formData.get("setupKey") as string)?.trim();

  const expectedKey = process.env.ADMIN_SETUP_KEY ?? "stonamart-setup-2024";
  if (setupKey !== expectedKey) return { error: "Invalid setup key." };
  if (!name || !email || !password || password.length < 8)
    return { error: "All fields required. Password min 8 characters." };

  let userId = "";

  try {
    const result = await auth.api.signUpEmail({
      body: { name, email, password, role: "ADMIN" },
      headers: await headers(),
    });
    const user = (result as { user?: { id?: string } })?.user;
    userId = user?.id ?? "";

    await db.query(
      `UPDATE "user" SET status = 'ACTIVE', "updatedAt" = NOW() WHERE email = $1`,
      [email]
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (
      msg.toLowerCase().includes("email") ||
      msg.toLowerCase().includes("unique")
    )
      return { error: "An account with this email already exists." };
    return { error: "Failed to create admin account." };
  }

  // Save admin profile
  if (userId) {
    try {
      await db.query(
        `INSERT INTO admin_profiles ("userId", designation, department)
         VALUES ($1, $2, $3)
         ON CONFLICT ("userId") DO NOTHING`,
        [userId, "Super Admin", "Operations"]
      );
    } catch {
      // Non-fatal
    }
  }

  // signUpEmail auto-logs the user in, so redirect straight to dashboard.
  redirect("/admin/dashboard");
}
