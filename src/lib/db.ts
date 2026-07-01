import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

function resolveDatabaseUrl(): string | undefined {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.DATABASE_URL_UNPOOLED,
    process.env.PG_URL,
  ];

  return candidates.find((value): value is string => Boolean(value && value.trim()));
}

const connectionString = resolveDatabaseUrl();

if (!connectionString) {
  console.warn("[db] No database connection string found. Set DATABASE_URL (or POSTGRES_URL) in your environment variables.");
}

export const db =
  global._pgPool ??
  new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,                      // Supabase free tier: stay within connection limits
    min: 0,                      // no idle connections kept alive permanently
    idleTimeoutMillis: 10_000,   // close idle connections after 10 s
    connectionTimeoutMillis: 15_000, // allow slower Vercel network connections
  });

global._pgPool = db; // reuse pool across hot-reloads in dev AND across invocations in prod
