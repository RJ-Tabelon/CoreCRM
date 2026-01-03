import logger from '#config/logger.js';
import {
  contactIdSchema,
  createContactSchema,
  createContactNoteSchema,
  listContactsQuerySchema,
  updateContactSchema,
} from '#validations/contacts.validation.js';
import { formatValidationError } from '#utils/format.js';
import {
  addContactNote,
  createContact,
  deleteContact,
  getContactById,
  listContactNotes,
  listContacts,
  updateContact,
} from '#services/contacts.service.js';

export const createContactForUser = async (req, res, next) => {
  try {
    const validationResult = createContactSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const ownerId = req.user?.id;
    const contact = await createContact(ownerId, validationResult.data);

    res.status(201).json({
      message: 'Contact created successfully',
      contact,
    });
  } catch (e) {
    logger.error('Error creating contact', e);
    next(e);
  }
};

export const listContactsForUser = async (req, res, next) => {
  try {
    const validationResult = listContactsQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const ownerId = req.user?.id;
    const q = validationResult.data.q;

    // Keep ownership strict by default; allow ownerId filter only for admins.
    const requestedOwnerId = validationResult.data.ownerId;
    const effectiveOwnerId =
      req.user?.role === 'admin' && requestedOwnerId
        ? requestedOwnerId
        : ownerId;

    const contactsList = await listContacts({ ownerId: effectiveOwnerId, q });

    res.json({
      message: 'Successfully retrieved contacts',
      contacts: contactsList,
      count: contactsList.length,
    });
  } catch (e) {
    logger.error('Error listing contacts', e);
    next(e);
  }
};

export const fetchContactById = async (req, res, next) => {
  try {
    const idResult = contactIdSchema.safeParse({ id: req.params.id });
    if (!idResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(idResult.error),
      });
    }

    const ownerId = req.user?.id;
    const contact = await getContactById(ownerId, idResult.data.id);

    res.json({
      message: 'Contact retrieved successfully',
      contact,
    });
  } catch (e) {
    logger.error('Error fetching contact by id', e);
    if (e.message === 'Contact not found') {
      return res.status(404).json({ error: 'Contact not found' });
    }
    next(e);
  }
};

export const updateContactById = async (req, res, next) => {
  try {
    const idResult = contactIdSchema.safeParse({ id: req.params.id });
    if (!idResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(idResult.error),
      });
    }

    const bodyResult = updateContactSchema.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(bodyResult.error),
      });
    }

    const ownerId = req.user?.id;
    const updated = await updateContact(
      ownerId,
      idResult.data.id,
      bodyResult.data
    );

    res.json({
      message: 'Contact updated successfully',
      contact: updated,
    });
  } catch (e) {
    logger.error('Error updating contact', e);
    if (e.message === 'Contact not found') {
      return res.status(404).json({ error: 'Contact not found' });
    }
    next(e);
  }
};

export const deleteContactById = async (req, res, next) => {
  try {
    const idResult = contactIdSchema.safeParse({ id: req.params.id });
    if (!idResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(idResult.error),
      });
    }

    const ownerId = req.user?.id;
    const deleted = await deleteContact(ownerId, idResult.data.id);

    res.json({
      message: 'Contact deleted successfully',
      contact: deleted,
    });
  } catch (e) {
    logger.error('Error deleting contact', e);
    if (e.message === 'Contact not found') {
      return res.status(404).json({ error: 'Contact not found' });
    }
    next(e);
  }
};

export const createContactNoteForContact = async (req, res, next) => {
  try {
    const idResult = contactIdSchema.safeParse({ id: req.params.id });
    if (!idResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(idResult.error),
      });
    }

    const bodyResult = createContactNoteSchema.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(bodyResult.error),
      });
    }

    const ownerId = req.user?.id;
    const note = await addContactNote(
      ownerId,
      idResult.data.id,
      bodyResult.data.content
    );

    res.status(201).json({
      message: 'Contact note created successfully',
      note,
    });
  } catch (e) {
    logger.error('Error creating contact note', e);
    if (e.message === 'Contact not found') {
      return res.status(404).json({ error: 'Contact not found' });
    }
    next(e);
  }
};

export const listNotesForContact = async (req, res, next) => {
  try {
    const idResult = contactIdSchema.safeParse({ id: req.params.id });
    if (!idResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(idResult.error),
      });
    }

    const ownerId = req.user?.id;
    const notes = await listContactNotes(ownerId, idResult.data.id);

    res.json({
      message: 'Successfully retrieved contact notes',
      notes,
      count: notes.length,
    });
  } catch (e) {
    logger.error('Error listing contact notes', e);
    if (e.message === 'Contact not found') {
      return res.status(404).json({ error: 'Contact not found' });
    }
    next(e);
  }
};
