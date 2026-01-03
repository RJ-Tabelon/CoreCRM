import { pgTable, serial, timestamp, text, integer } from 'drizzle-orm/pg-core';
import { contacts } from '#models/contact.model.js';

export const contact_notes = pgTable('contact_notes', {
  id: serial('id').primaryKey(),
  contact_id: integer('contact_id')
    .notNull()
    .references(() => contacts.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  created_at: timestamp().defaultNow().notNull(),
});
