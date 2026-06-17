"use server";

import { db } from "./db";
import { getServerSession } from "./auth-actions";
import { supabaseAdmin } from "./supabase";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sendProductRequestEmail } from "./email";

const REQUEST_MEDIA_BUCKET = "product-images";

// ── Upload reference media (admin only) ───────────────────────────────────────
export async function uploadRequestMedia(
  formData: FormData
): Promise<{ urls: string[] }> {
  const session = await getServerSession();
  if (!session || session.user.role !== "ADMIN") return { urls: [] };

  const urls: string[] = [];
  const files = formData.getAll("files") as File[];

  for (const file of files) {
    if (!file || file.size === 0) continue;
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `requests/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error } = await supabaseAdmin.storage
        .from(REQUEST_MEDIA_BUCKET)
        .upload(path, buffer, { contentType: file.type || "image/jpeg", upsert: true });

      if (!error) {
        const { data } = supabaseAdmin.storage
          .from(REQUEST_MEDIA_BUCKET)
          .getPublicUrl(path);
        if (data?.publicUrl) urls.push(data.publicUrl);
      }
    } catch {
      // Skip failed uploads
    }
  }

  return { urls };
}

// ── Types ─────────────────────────────────────────────────────────────────────
export type ProductRequest = {
  id: string;
  adminId: string;
  title: string;
  category: string;
  description: string | null;
  quantity: string | null;
  unit: string;
  targetCity: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  mediaUrls: string[];
  status: "ACTIVE" | "CLOSED";
  broadcastAt: string;
  createdAt: string;
  responseCount: number;
};

export type VendorRequestResponse = {
  id: string;
  requestId: string;
  vendorId: string;
  vendorName: string | null;
  vendorPhone: string | null;
  vendorEmail: string | null;
  message: string | null;
  price: number | null;
  unit: string | null;
  availability: string | null;
  createdAt: string;
};

export type BroadcastVendor = {
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  companyName: string | null;
};

async function requireAdmin() {
  const session = await getServerSession();
  if (!session || session.user.role !== "ADMIN") redirect("/login");
  return session;
}

async function requireVendor() {
  const session = await getServerSession();
  if (!session || session.user.role !== "VENDOR") redirect("/login");
  return session;
}

// ── Admin: create broadcast ────────────────────────────────────────────────────
export async function createProductRequest(data: {
  title: string;
  category: string;
  description: string;
  quantity: string;
  unit: string;
  targetCity: string;
  budgetMin: number | null;
  budgetMax: number | null;
  mediaUrls?: string[];
}): Promise<{
  ok: boolean;
  requestId?: string;
  vendorCount?: number;
  vendors?: BroadcastVendor[];
  error?: string;
}> {
  const session = await requireAdmin();
  try {
    const {
      rows: [req],
    } = await db.query(
      `INSERT INTO product_requests
         ("adminId", title, category, description, quantity, unit, "targetCity", "budgetMin", "budgetMax", "mediaUrls")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id`,
      [
        session.user.id,
        data.title,
        data.category,
        data.description || null,
        data.quantity || null,
        data.unit,
        data.targetCity || null,
        data.budgetMin,
        data.budgetMax,
        data.mediaUrls ?? [],
      ]
    );
    const requestId = req.id as string;

    const { rows: vendors } = await db.query<BroadcastVendor>(`
      SELECT u.id AS "userId", u.name, u.email,
             vp.phone, vp."companyName"
      FROM "user" u
      LEFT JOIN vendor_profiles vp ON vp."userId" = u.id
      WHERE u.role = 'VENDOR' AND u.status = 'ACTIVE'
    `);

    await Promise.allSettled(
      vendors.map((v) =>
        sendProductRequestEmail(v, { ...data, id: requestId, mediaUrls: data.mediaUrls ?? [] })
      )
    );

    revalidatePath("/admin/dashboard");
    return { ok: true, requestId, vendorCount: vendors.length, vendors };
  } catch (err) {
    console.error("[createProductRequest]", err);
    return { ok: false, error: "Failed to create product request." };
  }
}

// ── Admin: fetch all requests ─────────────────────────────────────────────────
export async function getProductRequests(): Promise<ProductRequest[]> {
  await requireAdmin();
  try {
    const { rows } = await db.query(`
      SELECT pr.*,
             COALESCE(COUNT(vrr.id)::int, 0) AS "responseCount"
      FROM product_requests pr
      LEFT JOIN vendor_request_responses vrr ON vrr."requestId" = pr.id
      GROUP BY pr.id
      ORDER BY pr."createdAt" DESC
    `);
    return rows as ProductRequest[];
  } catch {
    return [];
  }
}

// ── Admin: fetch responses for one request ────────────────────────────────────
export async function getRequestResponses(
  requestId: string
): Promise<VendorRequestResponse[]> {
  await requireAdmin();
  try {
    const { rows } = await db.query(
      `SELECT * FROM vendor_request_responses WHERE "requestId" = $1 ORDER BY "createdAt" DESC`,
      [requestId]
    );
    return rows as VendorRequestResponse[];
  } catch {
    return [];
  }
}

// ── Admin: close a request ────────────────────────────────────────────────────
export async function closeProductRequest(
  requestId: string
): Promise<{ ok: boolean }> {
  await requireAdmin();
  try {
    await db.query(
      `UPDATE product_requests SET status = 'CLOSED' WHERE id = $1`,
      [requestId]
    );
    revalidatePath("/admin/dashboard");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

// ── Vendor: open requests not yet responded to ────────────────────────────────
export async function getOpenRequestsForVendor(): Promise<ProductRequest[]> {
  const session = await requireVendor();
  try {
    const { rows } = await db.query(
      `SELECT pr.*, 0 AS "responseCount"
       FROM product_requests pr
       WHERE pr.status = 'ACTIVE'
         AND pr.id NOT IN (
           SELECT "requestId" FROM vendor_request_responses WHERE "vendorId" = $1
         )
       ORDER BY pr."createdAt" DESC`,
      [session.user.id]
    );
    return rows as ProductRequest[];
  } catch {
    return [];
  }
}

// ── Vendor: requests already responded to ────────────────────────────────────
export async function getMyVendorResponses(): Promise<
  (VendorRequestResponse & { requestTitle: string; requestStatus: string })[]
> {
  const session = await requireVendor();
  try {
    const { rows } = await db.query(
      `SELECT vrr.*, pr.title AS "requestTitle", pr.status AS "requestStatus"
       FROM vendor_request_responses vrr
       JOIN product_requests pr ON pr.id = vrr."requestId"
       WHERE vrr."vendorId" = $1
       ORDER BY vrr."createdAt" DESC`,
      [session.user.id]
    );
    return rows as (VendorRequestResponse & {
      requestTitle: string;
      requestStatus: string;
    })[];
  } catch {
    return [];
  }
}

// ── Vendor: submit response ───────────────────────────────────────────────────
export async function submitVendorResponse(
  requestId: string,
  data: {
    message: string;
    price: string;
    unit: string;
    availability: string;
  }
): Promise<{ ok: boolean; error?: string }> {
  const session = await requireVendor();
  try {
    const {
      rows: [vendor],
    } = await db.query(
      `SELECT u.name, u.email, vp.phone
       FROM "user" u
       LEFT JOIN vendor_profiles vp ON vp."userId" = u.id
       WHERE u.id = $1`,
      [session.user.id]
    );

    await db.query(
      `INSERT INTO vendor_request_responses
         ("requestId", "vendorId", "vendorName", "vendorPhone", "vendorEmail",
          message, price, unit, availability)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT ("requestId", "vendorId") DO UPDATE
         SET message      = EXCLUDED.message,
             price        = EXCLUDED.price,
             unit         = EXCLUDED.unit,
             availability = EXCLUDED.availability`,
      [
        requestId,
        session.user.id,
        vendor?.name ?? null,
        vendor?.phone ?? null,
        vendor?.email ?? null,
        data.message || null,
        data.price ? parseFloat(data.price) : null,
        data.unit,
        data.availability || null,
      ]
    );
    return { ok: true };
  } catch (err) {
    console.error("[submitVendorResponse]", err);
    return { ok: false, error: "Failed to submit response." };
  }
}
