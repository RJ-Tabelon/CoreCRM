import 'dotenv/config';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Creates a lightweight, serverless PostgreSQL client
const sql = neon(process.env.DATABASE_URL);

// Wraps that client with Drizzle ORM, giving you a type-safe way to build and run SQL queries
const db = drizzle(sql);

export { db, sql };
