// Run once: node migrate-profiles.mjs
// Creates customer_profiles and admin_profiles tables

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
CREATE TABLE IF NOT EXISTS customer_profiles (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId"        text NOT NULL UNIQUE,
  phone           text,
  address         text,
  pincode         text,
  "preferredCity" text,
  "createdAt"     timestamptz DEFAULT now(),
  "updatedAt"     timestamptz DEFAULT now()
);
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
GRANT ALL PRIVILEGES ON TABLE customer_profiles TO sonamart_app;

CREATE TABLE IF NOT EXISTS admin_profiles (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId"      text NOT NULL UNIQUE,
  designation   text DEFAULT 'Admin',
  department    text DEFAULT 'Operations',
  "createdAt"   timestamptz DEFAULT now(),
  "updatedAt"   timestamptz DEFAULT now()
);
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
GRANT ALL PRIVILEGES ON TABLE admin_profiles TO sonamart_app;
`;

async function migrate() {
  console.log("Connecting to Supabase...");
  const client = await pool.connect();
  try {
    await client.query(SQL);
    console.log("✓ customer_profiles table created");
    console.log("✓ admin_profiles table created");
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
