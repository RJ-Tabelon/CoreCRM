import express from 'express';
import { authenticateToken } from '#middleware/auth.middleware.js';
import {
  createTaskForUser,
  deleteTaskById,
  fetchTaskById,
  listMyTasks,
  listTasksForUser,
  updateTaskById,
} from '#controllers/tasks.controller.js';

const router = express.Router();

router.get('/', authenticateToken, listTasksForUser);
router.post('/', authenticateToken, createTaskForUser);

router.get('/mine', authenticateToken, listMyTasks);

router.get('/:id', authenticateToken, fetchTaskById);
router.put('/:id', authenticateToken, updateTaskById);
router.delete('/:id', authenticateToken, deleteTaskById);

export default router;
