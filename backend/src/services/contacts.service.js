import logger from '#config/logger.js';
import { db } from '#config/database.js';
import { contacts } from '#models/contact.model.js';
import { contact_notes } from '#models/contactNote.model.js';
import { and, asc, eq, ilike, or } from 'drizzle-orm';

const contactSelect = {
  id: contacts.id,
  ownerId: contacts.owner_id,
  name: contacts.name,
  email: contacts.email,
  phone: contacts.phone,
  company: contacts.company,
  createdAt: contacts.created_at,
  updatedAt: contacts.updated_at,
};

export const createContact = async (ownerId, data) => {
  try {
    const [contact] = await db
      .insert(contacts)
      .values({
        owner_id: ownerId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning(contactSelect);

    return contact;
  } catch (e) {
    logger.error('Error creating contact', e);
    throw e;
  }
};

export const listContacts = async ({ ownerId, q }) => {
  try {
    const whereParts = [eq(contacts.owner_id, ownerId)];

    if (q) {
      const like = `%${q}%`;
      whereParts.push(
        or(
          ilike(contacts.name, like),
          ilike(contacts.email, like),
          ilike(contacts.company, like)
        )
      );
    }

    return await db
      .select(contactSelect)
      .from(contacts)
      .where(and(...whereParts));
  } catch (e) {
    logger.error('Error listing contacts', e);
    throw e;
  }
};

export const getContactById = async (ownerId, contactId) => {
  try {
    const [contact] = await db
      .select(contactSelect)
      .from(contacts)
      .where(and(eq(contacts.id, contactId), eq(contacts.owner_id, ownerId)))
      .limit(1);

    if (!contact) {
      throw new Error('Contact not found');
    }

    return contact;
  } catch (e) {
    logger.error(`Error getting contact by id ${contactId}`, e);
    throw e;
  }
};

export const updateContact = async (ownerId, contactId, updates) => {
  try {
    await getContactById(ownerId, contactId);

    const [updatedContact] = await db
      .update(contacts)
      .set({
        ...updates,
        updated_at: new Date(),
      })
      .where(and(eq(contacts.id, contactId), eq(contacts.owner_id, ownerId)))
      .returning(contactSelect);

    return updatedContact;
  } catch (e) {
    logger.error(`Error updating contact ${contactId}`, e);
    throw e;
  }
};

export const deleteContact = async (ownerId, contactId) => {
  try {
    await getContactById(ownerId, contactId);

    const [deletedContact] = await db
      .delete(contacts)
      .where(and(eq(contacts.id, contactId), eq(contacts.owner_id, ownerId)))
      .returning(contactSelect);

    return deletedContact;
  } catch (e) {
    logger.error(`Error deleting contact ${contactId}`, e);
    throw e;
  }
};

export const addContactNote = async (ownerId, contactId, content) => {
  try {
    await getContactById(ownerId, contactId);

    const [note] = await db
      .insert(contact_notes)
      .values({
        contact_id: contactId,
        content,
        created_at: new Date(),
      })
      .returning({
        id: contact_notes.id,
        contactId: contact_notes.contact_id,
        content: contact_notes.content,
        createdAt: contact_notes.created_at,
      });

    return note;
  } catch (e) {
    logger.error(`Error adding note for contact ${contactId}`, e);
    throw e;
  }
};

export const listContactNotes = async (ownerId, contactId) => {
  try {
    await getContactById(ownerId, contactId);

    return await db
      .select({
        id: contact_notes.id,
        contactId: contact_notes.contact_id,
        content: contact_notes.content,
        createdAt: contact_notes.created_at,
      })
      .from(contact_notes)
      .where(eq(contact_notes.contact_id, contactId))
      .orderBy(asc(contact_notes.created_at));
  } catch (e) {
    logger.error(`Error listing notes for contact ${contactId}`, e);
    throw e;
  }
};
