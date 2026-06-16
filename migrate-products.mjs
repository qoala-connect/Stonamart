// Run once: node migrate-products.mjs
// Creates the products table in Supabase

import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  host: "db.nymxznknmhmogbgnoiyn.supabase.co",
  port: 5432,
  database: "postgres",
  user: "sonamart_app",
  password: "Sonamart2024",
  ssl: { rejectUnauthorized: false },
});

const SQL = `
CREATE TABLE IF NOT EXISTS products (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "vendorId"      text NOT NULL,
  name            text NOT NULL,
  "materialType"  text NOT NULL,
  category        text NOT NULL,
  color           text,
  finish          text,
  thickness       text,
  dimensions      text,
  "warehouseCity" text,
  "pricePerUnit"  numeric NOT NULL DEFAULT 0,
  unit            text DEFAULT 'sq ft',
  "stockQty"      integer DEFAULT 0,
  "isOutOfStock"  boolean DEFAULT false,
  status          text DEFAULT 'DRAFT',
  views           integer DEFAULT 0,
  "imageUrls"     text[] DEFAULT '{}',
  "createdAt"     timestamptz DEFAULT now(),
  "updatedAt"     timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
GRANT ALL PRIVILEGES ON TABLE products TO sonamart_app;
`;

async function migrate() {
  console.log("Connecting to Supabase...");
  const client = await pool.connect();
  try {
    await client.query(SQL);
    console.log("✓ products table created");
    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
