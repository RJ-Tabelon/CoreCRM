import 'dotenv/config';

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// When running against Neon Local, direct the serverless driver to the local proxy
if (process.env.NEON_LOCAL === 'true') {
  neonConfig.fetchEndpoint =
    process.env.NEON_FETCH_ENDPOINT || 'http://neon-local:5432/sql';
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

// Creates a lightweight, serverless PostgreSQL client
const sql = neon(process.env.DATABASE_URL);

// Wraps that client with Drizzle ORM, giving you a type-safe way to build and run SQL queries
const db = drizzle(sql);

export { db, sql };
