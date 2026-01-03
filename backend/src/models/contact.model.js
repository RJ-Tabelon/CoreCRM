import {
  pgTable,
  serial,
  timestamp,
  varchar,
  integer,
} from 'drizzle-orm/pg-core';
import { users } from '#models/user.model.js';

export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  owner_id: integer('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  company: varchar('company', { length: 255 }),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
});
