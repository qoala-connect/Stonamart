// Run once: node migrate.mjs
// Creates all required tables in your Supabase database

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
-- ── Better Auth core tables ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "user" (
  "id"            text PRIMARY KEY,
  "name"          text NOT NULL,
  "email"         text NOT NULL UNIQUE,
  "emailVerified" boolean NOT NULL DEFAULT false,
  "image"         text,
  "createdAt"     timestamptz NOT NULL DEFAULT now(),
  "updatedAt"     timestamptz NOT NULL DEFAULT now(),
  "role"          text NOT NULL DEFAULT 'CUSTOMER',
  "status"        text NOT NULL DEFAULT 'ACTIVE',
  "city"          text
);

CREATE TABLE IF NOT EXISTS "session" (
  "id"          text PRIMARY KEY,
  "expiresAt"   timestamptz NOT NULL,
  "token"       text NOT NULL UNIQUE,
  "createdAt"   timestamptz NOT NULL DEFAULT now(),
  "updatedAt"   timestamptz NOT NULL DEFAULT now(),
  "ipAddress"   text,
  "userAgent"   text,
  "userId"      text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "account" (
  "id"                     text PRIMARY KEY,
  "accountId"              text NOT NULL,
  "providerId"             text NOT NULL,
  "userId"                 text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accessToken"            text,
  "refreshToken"           text,
  "idToken"                text,
  "accessTokenExpiresAt"   timestamptz,
  "refreshTokenExpiresAt"  timestamptz,
  "scope"                  text,
  "password"               text,
  "createdAt"              timestamptz NOT NULL DEFAULT now(),
  "updatedAt"              timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "verification" (
  "id"         text PRIMARY KEY,
  "identifier" text NOT NULL,
  "value"      text NOT NULL,
  "expiresAt"  timestamptz NOT NULL,
  "createdAt"  timestamptz,
  "updatedAt"  timestamptz
);

-- ── App tables ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS vendor_profiles (
  "id"              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId"          text NOT NULL,
  "companyName"     text NOT NULL,
  "contactPerson"   text NOT NULL,
  "phone"           text NOT NULL,
  "gstNumber"       text,
  "businessAddress" text,
  "city"            text NOT NULL,
  "documentUrls"    text[] DEFAULT '{}',
  "createdAt"       timestamptz DEFAULT now(),
  "updatedAt"       timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inquiries (
  "id"        uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "user_id"   text,
  "email"     text NOT NULL,
  "message"   text,
  "createdAt" timestamptz DEFAULT now()
);
`;

async function migrate() {
  console.log("Connecting to Supabase...");
  const client = await pool.connect();
  try {
    console.log("Running migrations...");
    await client.query(SQL);
    console.log("");
    console.log("✓ user table created");
    console.log("✓ session table created");
    console.log("✓ account table created");
    console.log("✓ verification table created");
    console.log("✓ vendor_profiles table created");
    console.log("✓ inquiries table created");
    console.log("");
    console.log("Migration complete! You can now run: npm run dev");
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
