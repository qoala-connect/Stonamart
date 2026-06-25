"use server";

import { db } from "./db";
import { getServerSession } from "./auth-actions";
import { supabaseAdmin } from "./supabase";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const PRODUCT_IMAGE_BUCKET = "product-images";

async function ensureImageBucket() {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const exists = buckets?.some((b: { name: string }) => b.name === PRODUCT_IMAGE_BUCKET);
    if (!exists) {
      await supabaseAdmin.storage.createBucket(PRODUCT_IMAGE_BUCKET, {
        public: true,
        fileSizeLimit: 104857600, // 100 MB — large enough for video uploads
      });
    } else {
      // Ensure the limit is large enough to accept video files
      await supabaseAdmin.storage.updateBucket(PRODUCT_IMAGE_BUCKET, {
        public: true,
        fileSizeLimit: 104857600, // 100 MB
      });
    }
  } catch {
    // Non-fatal — upload will fail if bucket truly doesn't exist
  }
}

export async function uploadProductVideo(
  formData: FormData
): Promise<{ url: string | null; error?: string }> {
  const session = await getServerSession();
  if (!session || session.user.role !== "VENDOR") return { url: null, error: "Unauthorized" };

  await ensureImageBucket();

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { url: null };

  try {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "mp4";
    const path = `${session.user.id}/video-${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabaseAdmin.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .upload(path, buffer, { contentType: file.type || "video/mp4", upsert: true });

    if (error) {
      console.error("[uploadProductVideo] storage error:", error);
      return { url: null, error: error.message ?? "Video upload failed" };
    }

    const { data } = supabaseAdmin.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path);
    return { url: data?.publicUrl ?? null };
  } catch (err) {
    console.error("[uploadProductVideo]", err);
    return { url: null, error: "Video upload failed" };
  }
}

// ─── Direct-upload signed URLs (browser → Supabase, no server relay) ──────────
// Returns a short-lived signed URL so the browser can PUT the file directly
// to Supabase storage without it travelling through the Next.js server first.

export async function getVideoUploadUrl(
  fileName: string,
  fileType: string
): Promise<{ signedUrl: string; publicUrl: string } | { error: string }> {
  const session = await getServerSession();
  if (!session || session.user.role !== "VENDOR") return { error: "Unauthorized" };

  await ensureImageBucket();

  const ext = fileName.split(".").pop()?.toLowerCase() ?? "mp4";
  const path = `${session.user.id}/video-${Date.now()}.${ext}`;

  const { data, error } = await supabaseAdmin.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    console.error("[getVideoUploadUrl]", error);
    return { error: error?.message ?? "Failed to create upload URL" };
  }

  const { data: pub } = supabaseAdmin.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .getPublicUrl(path);

  return { signedUrl: data.signedUrl, publicUrl: pub.publicUrl };
}

export async function getImageUploadUrl(
  fileName: string,
  fileType: string
): Promise<{ signedUrl: string; publicUrl: string } | { error: string }> {
  const session = await getServerSession();
  if (!session || session.user.role !== "VENDOR") return { error: "Unauthorized" };

  await ensureImageBucket();

  const ext = fileName.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${session.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabaseAdmin.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    console.error("[getImageUploadUrl]", error);
    return { error: error?.message ?? "Failed to create upload URL" };
  }

  const { data: pub } = supabaseAdmin.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .getPublicUrl(path);

  return { signedUrl: data.signedUrl, publicUrl: pub.publicUrl };
}

export async function uploadProductImages(
  formData: FormData
): Promise<{ urls: string[] }> {
  const session = await getServerSession();
  if (!session || session.user.role !== "VENDOR") return { urls: [] };

  await ensureImageBucket();

  const urls: string[] = [];
  const files = formData.getAll("files") as File[];

  for (const file of files) {
    if (!file || file.size === 0) continue;
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${session.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error } = await supabaseAdmin.storage
        .from(PRODUCT_IMAGE_BUCKET)
        .upload(path, buffer, {
          contentType: file.type || "image/jpeg",
          upsert: true,
        });

      if (!error) {
        const { data } = supabaseAdmin.storage
          .from(PRODUCT_IMAGE_BUCKET)
          .getPublicUrl(path);
        if (data?.publicUrl) urls.push(data.publicUrl);
      }
    } catch {
      // Skip failed file — partial uploads are acceptable
    }
  }

  return { urls };
}

// ─── Types ─────────────────────────────────────────────────────────────────────
export type VendorProfileData = {
  userId: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  city: string;
};

export type ProductRow = {
  id: string;
  vendorId: string;
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
  isOutOfStock: boolean;
  status: string;
  views: number;
  createdAt: string;
  adminFeedback?: string | null;
};

export type SubmitProductInput = {
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
  status: "DRAFT" | "PENDING_APPROVAL";
  imageUrls?: string[];
  videoUrl?: string | null;
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
async function requireVendor() {
  const session = await getServerSession();
  if (!session || session.user.role !== "VENDOR") redirect("/login");
  return session;
}

// ─── Queries ───────────────────────────────────────────────────────────────────
export async function getVendorProfile(): Promise<VendorProfileData | null> {
  const session = await requireVendor();
  const { rows } = await db.query(
    `SELECT "companyName", "contactPerson", phone, city
     FROM vendor_profiles WHERE "userId" = $1 LIMIT 1`,
    [session.user.id]
  );
  if (!rows[0]) return null;
  return {
    userId: session.user.id,
    companyName: rows[0].companyName,
    contactPerson: rows[0].contactPerson,
    phone: rows[0].phone,
    city: rows[0].city,
  };
}

export async function getVendorProducts(): Promise<ProductRow[]> {
  const session = await requireVendor();
  try {
    // Ensure columns exist (idempotent)
    await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS "videoUrl" TEXT DEFAULT NULL`).catch(() => {});
    await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS "adminFeedback" TEXT DEFAULT NULL`).catch(() => {});

    const { rows } = await db.query(
      `SELECT id, "vendorId", name, "materialType", category, color, finish,
        thickness, dimensions, "warehouseCity", "pricePerUnit", unit,
        "stockQty", "isOutOfStock", status, views, "createdAt", "adminFeedback"
       FROM products WHERE "vendorId" = $1 ORDER BY "createdAt" DESC`,
      [session.user.id]
    );
    return rows;
  } catch {
    return [];
  }
}

// ─── Mutations ─────────────────────────────────────────────────────────────────
export async function submitProduct(
  data: SubmitProductInput
): Promise<{ ok: boolean; error?: string; id?: string }> {
  const session = await getServerSession();
  if (!session || session.user.role !== "VENDOR")
    return { ok: false, error: "Unauthorized" };
  if (session.user.status !== "ACTIVE")
    return { ok: false, error: "Your account is not yet active." };

  try {
    // Ensure videoUrl column exists (idempotent)
    await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS "videoUrl" TEXT DEFAULT NULL`).catch(() => {});

    const { rows } = await db.query(
      `INSERT INTO products (
        "vendorId", name, "materialType", category, color, finish,
        thickness, dimensions, "warehouseCity", "pricePerUnit",
        unit, "stockQty", status, "imageUrls", "videoUrl"
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING id`,
      [
        session.user.id,
        data.name,
        data.materialType,
        data.category,
        data.color,
        data.finish,
        data.thickness,
        data.dimensions,
        data.warehouseCity,
        data.pricePerUnit,
        data.unit,
        data.stockQty,
        data.status,
        data.imageUrls ?? [],
        data.videoUrl ?? null,
      ]
    );
    revalidatePath("/vendor/dashboard");
    revalidatePath("/admin/dashboard");
    return { ok: true, id: rows[0].id };
  } catch (err) {
    console.error("[submitProduct]", err);
    return { ok: false, error: "Failed to save product. Please try again." };
  }
}

// ─── Update an existing REJECTED / CHANGES_REQUESTED / DRAFT product ──────────
// Uses the same ID — never creates a duplicate.
export async function updateProduct(
  productId: string,
  data: SubmitProductInput
): Promise<{ ok: boolean; error?: string }> {
  const session = await getServerSession();
  if (!session || session.user.role !== "VENDOR")
    return { ok: false, error: "Unauthorized" };
  if (session.user.status !== "ACTIVE")
    return { ok: false, error: "Your account is not yet active." };

  try {
    // Ensure required columns exist (idempotent)
    await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS "videoUrl" TEXT DEFAULT NULL`).catch(() => {});
    await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS "adminFeedback" TEXT DEFAULT NULL`).catch(() => {});
    await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ DEFAULT NOW()`).catch(() => {});

    // Keep existing media if no new media was uploaded
    const result = await db.query(
      `UPDATE products SET
         name             = $1,
         "materialType"   = $2,
         category         = $3,
         color            = $4,
         finish           = $5,
         thickness        = $6,
         dimensions       = $7,
         "warehouseCity"  = $8,
         "pricePerUnit"   = $9,
         unit             = $10,
         "stockQty"       = $11,
         status           = $12,
         "imageUrls"      = CASE
                              WHEN array_length($13::text[], 1) > 0
                              THEN $13::text[]
                              ELSE "imageUrls"
                            END,
         "videoUrl"       = CASE WHEN $14::text IS NOT NULL THEN $14::text ELSE "videoUrl" END,
         "adminFeedback"  = NULL,
         "updatedAt"      = NOW()
       WHERE id = $15
         AND "vendorId" = $16
         AND status != 'APPROVED'`,
      [
        data.name,
        data.materialType,
        data.category,
        data.color,
        data.finish,
        data.thickness,
        data.dimensions,
        data.warehouseCity,
        data.pricePerUnit,
        data.unit,
        data.stockQty,
        data.status,
        data.imageUrls ?? [],
        data.videoUrl ?? null,
        productId,
        session.user.id,
      ]
    );

    // If rowCount is 0, the WHERE clause didn't match — nothing was updated
    const rowCount = (result as unknown as { rowCount: number | null }).rowCount ?? 0;
    if (rowCount === 0) {
      // Log for debugging
      console.warn(`[updateProduct] 0 rows updated for product ${productId} (vendor ${session.user.id})`);
      return { ok: false, error: "Could not update this product. It may have already been submitted or approved." };
    }

    revalidatePath("/vendor/dashboard");
    revalidatePath("/admin/dashboard");
    return { ok: true };
  } catch (err) {
    console.error("[updateProduct]", err);
    return { ok: false, error: "Failed to update product." };
  }
}

// ─── Move a REJECTED / CHANGES_REQUESTED product to DRAFT when vendor starts editing ──
// Persists the "editing in progress" state so a page refresh shows DRAFT, not REJECTED.
export async function markProductAsDraft(
  productId: string
): Promise<{ ok: boolean; error?: string }> {
  const session = await requireVendor();
  try {
    await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ DEFAULT NOW()`).catch(() => {});
    await db.query(
      `UPDATE products
         SET status = 'DRAFT', "updatedAt" = NOW()
       WHERE id = $1
         AND "vendorId" = $2
         AND status IN ('REJECTED','CHANGES_REQUESTED')`,
      [productId, session.user.id]
    );
    revalidatePath("/vendor/dashboard");
    return { ok: true };
  } catch (err) {
    console.error("[markProductAsDraft]", err);
    return { ok: false, error: "Failed to save draft state." };
  }
}

// ─── Delete a REJECTED or DRAFT product ───────────────────────────────────────
export async function deleteProduct(
  productId: string
): Promise<{ ok: boolean; error?: string }> {
  const session = await requireVendor();
  try {
    const result = await db.query(
      `DELETE FROM products WHERE id = $1 AND "vendorId" = $2 AND status IN ('REJECTED','DRAFT')`,
      [productId, session.user.id]
    );
    // pg returns rowCount on mutation queries
    if ((result as unknown as { rowCount: number }).rowCount === 0) {
      return { ok: false, error: "Product not found or cannot be deleted in its current state." };
    }
    revalidatePath("/vendor/dashboard");
    return { ok: true };
  } catch (err) {
    console.error("[deleteProduct]", err);
    return { ok: false, error: "Failed to delete product." };
  }
}

export async function toggleProductOOS(
  productId: string
): Promise<{ ok: boolean }> {
  const session = await requireVendor();
  try {
    await db.query(
      `UPDATE products SET "isOutOfStock" = NOT "isOutOfStock", "updatedAt" = NOW()
       WHERE id = $1 AND "vendorId" = $2`,
      [productId, session.user.id]
    );
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
