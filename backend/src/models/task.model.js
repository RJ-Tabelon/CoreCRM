import {
  pgTable,
  serial,
  timestamp,
  varchar,
  integer,
  date,
} from 'drizzle-orm/pg-core';
import { users } from '#models/user.model.js';
import { contacts } from '#models/contact.model.js';
import { deals } from '#models/deal.model.js';

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  owner_id: integer('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  due_date: date('due_date'),
  status: varchar('status', { length: 20 }).notNull().default('open'),
  contact_id: integer('contact_id').references(() => contacts.id, {
    onDelete: 'set null',
  }),
  deal_id: integer('deal_id').references(() => deals.id, {
    onDelete: 'set null',
  }),
  created_at: timestamp().defaultNow().notNull(),
});
