"use server";

import { db } from "./db";
import { getServerSession } from "./auth-actions";
import { supabaseAdmin } from "./supabase";
import { redirect } from "next/navigation";

const PRODUCT_IMAGE_BUCKET = "product-images";

async function ensureImageBucket() {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const exists = buckets?.some((b: { name: string }) => b.name === PRODUCT_IMAGE_BUCKET);
    if (!exists) {
      await supabaseAdmin.storage.createBucket(PRODUCT_IMAGE_BUCKET, {
        public: true,
        fileSizeLimit: 10485760, // 10 MB
      });
    }
  } catch {
    // Non-fatal — upload will fail if bucket truly doesn't exist
  }
}

// Returns a signed upload URL for direct client-to-Supabase upload (avoids server action body size limit)
export async function createVideoUploadUrl(
  filename: string
): Promise<{ signedUrl: string | null; publicUrl: string | null }> {
  const session = await getServerSession();
  if (!session || session.user.role !== "VENDOR")
    return { signedUrl: null, publicUrl: null };

  await ensureImageBucket();

  const ext = filename.split(".").pop()?.toLowerCase() ?? "mp4";
  const path = `${session.user.id}/video-${Date.now()}.${ext}`;

  const { data, error } = await supabaseAdmin.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) return { signedUrl: null, publicUrl: null };

  const { data: urlData } = supabaseAdmin.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .getPublicUrl(path);

  return { signedUrl: data.signedUrl, publicUrl: urlData?.publicUrl ?? null };
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
  imageUrls: string[];
  videoUrl: string | null;
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
    await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS "videoUrl" TEXT DEFAULT NULL`).catch(() => {});
    const { rows } = await db.query(
      `SELECT id, "vendorId", name, "materialType", category, color, finish,
        thickness, dimensions, "warehouseCity", "pricePerUnit", unit,
        "stockQty", "isOutOfStock", status, views, "createdAt",
        COALESCE("imageUrls", '{}') AS "imageUrls",
        "videoUrl"
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
    return { ok: true, id: rows[0].id };
  } catch (err) {
    console.error("[submitProduct]", err);
    return { ok: false, error: "Failed to save product. Please try again." };
  }
}

export async function updateProduct(
  data: SubmitProductInput & { id: string }
): Promise<{ ok: boolean; error?: string }> {
  const session = await getServerSession();
  if (!session || session.user.role !== "VENDOR")
    return { ok: false, error: "Unauthorized" };

  try {
    await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS "videoUrl" TEXT DEFAULT NULL`).catch(() => {});

    await db.query(
      `UPDATE products SET
         name = $1, "materialType" = $2, category = $3, color = $4,
         finish = $5, thickness = $6, dimensions = $7, "warehouseCity" = $8,
         "pricePerUnit" = $9, unit = $10, "stockQty" = $11, status = $12,
         "imageUrls" = CASE WHEN cardinality($13::text[]) > 0
                            THEN $13::text[] ELSE "imageUrls" END,
         "videoUrl"   = CASE WHEN $14::text IS NOT NULL
                            THEN $14::text ELSE "videoUrl" END,
         "updatedAt"  = NOW()
       WHERE id = $15 AND "vendorId" = $16`,
      [
        data.name, data.materialType, data.category, data.color,
        data.finish, data.thickness, data.dimensions, data.warehouseCity,
        data.pricePerUnit, data.unit, data.stockQty, data.status,
        data.imageUrls ?? [],
        data.videoUrl ?? null,
        data.id,
        session.user.id,
      ]
    );
    return { ok: true };
  } catch (err) {
    console.error("[updateProduct]", err);
    return { ok: false, error: "Failed to update product. Please try again." };
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
