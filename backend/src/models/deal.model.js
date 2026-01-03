import {
  pgTable,
  serial,
  timestamp,
  varchar,
  integer,
  numeric,
} from 'drizzle-orm/pg-core';
import { users } from '#models/user.model.js';
import { contacts } from '#models/contact.model.js';

export const deals = pgTable('deals', {
  id: serial('id').primaryKey(),
  owner_id: integer('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  contact_id: integer('contact_id')
    .notNull()
    .references(() => contacts.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  stage: varchar('stage', { length: 50 }).notNull().default('new'),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
});
