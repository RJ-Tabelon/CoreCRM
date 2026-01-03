import express from 'express';
import { authenticateToken } from '#middleware/auth.middleware.js';
import {
  createDealForUser,
  deleteDealById,
  fetchDealById,
  listDealsForUser,
  updateDealById,
} from '#controllers/deals.controller.js';

const router = express.Router();

router.get('/', authenticateToken, listDealsForUser);
router.post('/', authenticateToken, createDealForUser);

router.get('/:id', authenticateToken, fetchDealById);
router.put('/:id', authenticateToken, updateDealById);
router.delete('/:id', authenticateToken, deleteDealById);

export default router;
