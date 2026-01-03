import express from 'express';
import { authenticateToken } from '#middleware/auth.middleware.js';
import {
  createContactForUser,
  createContactNoteForContact,
  deleteContactById,
  fetchContactById,
  listContactsForUser,
  listNotesForContact,
  updateContactById,
} from '#controllers/contacts.controller.js';

const router = express.Router();

router.get('/', authenticateToken, listContactsForUser);
router.post('/', authenticateToken, createContactForUser);

router.get('/:id', authenticateToken, fetchContactById);
router.put('/:id', authenticateToken, updateContactById);
router.delete('/:id', authenticateToken, deleteContactById);

router.get('/:id/notes', authenticateToken, listNotesForContact);
router.post('/:id/notes', authenticateToken, createContactNoteForContact);

export default router;
