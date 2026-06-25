"use server";

import { db } from "./db";
import { getServerSession } from "./auth-actions";
import { revalidatePath } from "next/cache";

export type InquiryStatus = "NEW" | "CONTACTED" | "CLOSED";

export type CustomerInquiry = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  productId: string;
  productName: string;
  productCategory: string;
  productImageUrl: string | null;
  vendorId: string | null;
  message: string;
  quantity: string | null;
  notes: string | null;
  status: InquiryStatus;
  createdAt: string;
};

// ─── Submit inquiry ────────────────────────────────────────────────────────────
export async function submitInquiry(data: {
  productId: string;
  message?: string;
  quantity?: string;
  notes?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const session = await getServerSession();
  if (!session)
    return { ok: false, error: "Please sign in to submit an inquiry." };
  if (session.user.role !== "CUSTOMER")
    return { ok: false, error: "Only customers can submit inquiries." };

  // Get product name
  let productName = "", productCategory = "";
  try {
    const { rows } = await db.query(
      `SELECT name, category FROM products WHERE id::text = $1 LIMIT 1`,
      [data.productId]
    );
    productName     = rows[0]?.name     ?? "";
    productCategory = rows[0]?.category ?? "";
  } catch { /* ok */ }

  const userMsg = data.message?.trim() ||
    `Hi, I am interested in ${productName || data.productId} and would like to know more about pricing and availability.`;

  // Store all details in message as structured text so admin can read them
  // even when extra columns don't exist in the schema
  const fullMessage = [
    `CUSTOMER: ${session.user.name} <${session.user.email}>`,
    `PRODUCT: ${productName || data.productId}${productCategory ? ` (${productCategory})` : ""}`,
    `PRODUCT_ID: ${data.productId}`,
    `---`,
    userMsg,
  ].join("\n");

  try {
    await db.query(
      `INSERT INTO inquiries (email, message) VALUES ($1, $2)`,
      [session.user.email, fullMessage]
    );
    revalidatePath("/account");
    revalidatePath("/admin/dashboard");
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[submitInquiry]", msg);
    return { ok: false, error: msg };
  }
}

// ─── Parse structured message back into fields ─────────────────────────────────
function parseInquiryRow(row: Record<string, unknown>): CustomerInquiry {
  const raw = String(row.message ?? "");
  const lines = raw.split("\n");

  // Extract structured header
  let customerName = "", customerEmail = String(row.email ?? "");
  let productName = "", productCategory = "", productId = "";
  let bodyLines: string[] = [];
  let inBody = false;

  for (const line of lines) {
    if (line.startsWith("CUSTOMER: ")) {
      const m = line.replace("CUSTOMER: ", "").match(/^(.+?)\s*<(.+)>$/);
      if (m) { customerName = m[1].trim(); customerEmail = m[2].trim(); }
    } else if (line.startsWith("PRODUCT: ")) {
      const val = line.replace("PRODUCT: ", "");
      const m = val.match(/^(.+?)\s*\((.+)\)$/);
      if (m) { productName = m[1].trim(); productCategory = m[2].trim(); }
      else { productName = val.trim(); }
    } else if (line.startsWith("PRODUCT_ID: ")) {
      productId = line.replace("PRODUCT_ID: ", "").trim();
    } else if (line === "---") {
      inBody = true;
    } else if (inBody) {
      bodyLines.push(line);
    }
  }

  const message = bodyLines.join("\n").trim() || raw;

  return {
    id:              String(row.id ?? ""),
    customerId:      String(row.user_id ?? customerEmail),
    customerName:    customerName || String(row.customer_name ?? ""),
    customerEmail,
    customerPhone:   null,
    productId:       productId || String(row.product_id ?? ""),
    productName:     productName || String(row.product_name ?? ""),
    productCategory,
    productImageUrl: null,
    vendorId:        null,
    message,
    quantity:        null,
    notes:           null,
    status:          "NEW" as InquiryStatus,
    createdAt:       String(row.created_at ?? row.createdAt ?? new Date().toISOString()),
  };
}

// ─── Enrich parsed inquiries with product images from products table ──────────
async function enrichWithProducts(inquiries: CustomerInquiry[]): Promise<CustomerInquiry[]> {
  const ids = [...new Set(inquiries.map(i => i.productId).filter(Boolean))];
  if (!ids.length) return inquiries;
  try {
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
    const { rows } = await db.query(
      `SELECT id::text AS id, name, category, "imageUrls" FROM products WHERE id::text IN (${placeholders})`,
      ids
    );
    const byId = new Map(rows.map((r: Record<string, unknown>) => [String(r.id), r]));
    return inquiries.map(inq => {
      const p = byId.get(inq.productId);
      if (!p) return inq;
      return {
        ...inq,
        productName:     inq.productName     || String(p.name     ?? ""),
        productCategory: inq.productCategory || String(p.category ?? ""),
        productImageUrl: (p.imageUrls as string[])?.[0] ?? null,
      };
    });
  } catch { return inquiries; }
}

// ─── Customer: own inquiries ───────────────────────────────────────────────────
export async function getCustomerInquiries(): Promise<CustomerInquiry[]> {
  const session = await getServerSession();
  if (!session || session.user.role !== "CUSTOMER") return [];
  try {
    const { rows } = await db.query(
      `SELECT * FROM inquiries WHERE email = $1 ORDER BY "createdAt" DESC LIMIT 50`,
      [session.user.email]
    );
    const parsed = rows.map(parseInquiryRow);
    return enrichWithProducts(parsed);
  } catch { return []; }
}

// ─── Admin: all inquiries ──────────────────────────────────────────────────────
export async function getAdminInquiries(): Promise<CustomerInquiry[]> {
  const session = await getServerSession();
  if (!session || session.user.role !== "ADMIN") return [];
  try {
    const { rows } = await db.query(
      `SELECT * FROM inquiries ORDER BY "createdAt" DESC LIMIT 200`
    );
    const parsed = rows.map(parseInquiryRow);
    return enrichWithProducts(parsed);
  } catch { return []; }
}

// ─── Admin: update status ──────────────────────────────────────────────────────
export async function updateInquiryStatus(
  inquiryId: string,
  status: InquiryStatus
): Promise<{ ok: boolean }> {
  const session = await getServerSession();
  if (!session || session.user.role !== "ADMIN") return { ok: false };
  try {
    await db.query(
      `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'NEW'`
    ).catch(() => {});
    await db.query(
      `UPDATE inquiries SET status = $1 WHERE id = $2`,
      [status, inquiryId]
    );
    revalidatePath("/admin/dashboard");
    return { ok: true };
  } catch { return { ok: false }; }
}
