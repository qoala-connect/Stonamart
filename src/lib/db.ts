import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

export const db =
  global._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 5,                      // Supabase free tier: stay within connection limits
    min: 0,                      // no idle connections kept alive permanently
    idleTimeoutMillis: 10_000,   // close idle connections after 10 s
    connectionTimeoutMillis: 8_000, // fail fast if DB unreachable
  });

global._pgPool = db; // reuse pool across hot-reloads in dev AND across invocations in prod
