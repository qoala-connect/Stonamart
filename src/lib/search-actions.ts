"use server";

import { db } from "./db";

export type SearchSuggestion = {
  id: string;
  name: string;
  category: string;
  materialType: string;
  imageUrl: string | null;
};

export async function searchProducts(q: string): Promise<SearchSuggestion[]> {
  if (!q.trim()) return [];
  try {
    const { rows } = await db.query(
      `SELECT id::text AS id, name, category, "materialType",
              ("imageUrls")[1] AS "imageUrl"
       FROM products
       WHERE status = 'APPROVED'
         AND (name ILIKE $1 OR category ILIKE $1 OR "materialType" ILIKE $1 OR color ILIKE $1)
       ORDER BY views DESC NULLS LAST
       LIMIT 6`,
      [`%${q.trim()}%`]
    );
    return rows as SearchSuggestion[];
  } catch {
    return [];
  }
}
