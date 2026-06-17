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

export async function uploadProductVideo(
  formData: FormData
): Promise<{ url: string | null }> {
  const session = await getServerSession();
  if (!session || session.user.role !== "VENDOR") return { url: null };

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

    if (error) return { url: null };

    const { data } = supabaseAdmin.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path);
    return { url: data?.publicUrl ?? null };
  } catch {
    return { url: null };
  }
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
