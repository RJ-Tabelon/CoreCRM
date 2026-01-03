import logger from '#config/logger.js';
import {
  createTaskSchema,
  myTasksQuerySchema,
  taskIdSchema,
  updateTaskSchema,
} from '#validations/tasks.validation.js';
import { formatValidationError } from '#utils/format.js';
import {
  createTask,
  deleteTask,
  getTaskById,
  listMyOpenTasks,
  listTasks,
  updateTask,
} from '#services/tasks.service.js';

export const createTaskForUser = async (req, res, next) => {
  try {
    const validationResult = createTaskSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const ownerId = req.user?.id;
    const task = await createTask(ownerId, validationResult.data);

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (e) {
    logger.error('Error creating task', e);
    if (e.message === 'Contact not found') {
      return res.status(404).json({ error: 'Contact not found' });
    }
    if (e.message === 'Deal not found') {
      return res.status(404).json({ error: 'Deal not found' });
    }
    if (
      e.message === 'Task must be linked to at least one: contactId or dealId'
    ) {
      return res.status(400).json({ error: e.message });
    }
    next(e);
  }
};

export const listTasksForUser = async (req, res, next) => {
  try {
    const ownerId = req.user?.id;
    const tasksList = await listTasks(ownerId);
    res.json({
      message: 'Successfully retrieved tasks',
      tasks: tasksList,
      count: tasksList.length,
    });
  } catch (e) {
    logger.error('Error listing tasks', e);
    next(e);
  }
};

export const listMyTasks = async (req, res, next) => {
  try {
    const validationResult = myTasksQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const ownerId = req.user?.id;
    const tasksList = await listMyOpenTasks(
      ownerId,
      validationResult.data.dueBefore
    );

    res.json({
      message: 'Successfully retrieved open tasks',
      tasks: tasksList,
      count: tasksList.length,
    });
  } catch (e) {
    logger.error('Error listing my tasks', e);
    next(e);
  }
};

export const fetchTaskById = async (req, res, next) => {
  try {
    const idResult = taskIdSchema.safeParse({ id: req.params.id });
    if (!idResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(idResult.error),
      });
    }

    const ownerId = req.user?.id;
    const task = await getTaskById(ownerId, idResult.data.id);

    res.json({
      message: 'Task retrieved successfully',
      task,
    });
  } catch (e) {
    logger.error('Error fetching task by id', e);
    if (e.message === 'Task not found') {
      return res.status(404).json({ error: 'Task not found' });
    }
    next(e);
  }
};

export const updateTaskById = async (req, res, next) => {
  try {
    const idResult = taskIdSchema.safeParse({ id: req.params.id });
    if (!idResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(idResult.error),
      });
    }

    const bodyResult = updateTaskSchema.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(bodyResult.error),
      });
    }

    const ownerId = req.user?.id;
    const updated = await updateTask(
      ownerId,
      idResult.data.id,
      bodyResult.data
    );

    res.json({
      message: 'Task updated successfully',
      task: updated,
    });
  } catch (e) {
    logger.error('Error updating task', e);
    if (e.message === 'Task not found') {
      return res.status(404).json({ error: 'Task not found' });
    }
    if (e.message === 'Contact not found') {
      return res.status(404).json({ error: 'Contact not found' });
    }
    if (e.message === 'Deal not found') {
      return res.status(404).json({ error: 'Deal not found' });
    }
    if (
      e.message === 'Task must be linked to at least one: contactId or dealId'
    ) {
      return res.status(400).json({ error: e.message });
    }
    next(e);
  }
};

export const deleteTaskById = async (req, res, next) => {
  try {
    const idResult = taskIdSchema.safeParse({ id: req.params.id });
    if (!idResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(idResult.error),
      });
    }

    const ownerId = req.user?.id;
    const deleted = await deleteTask(ownerId, idResult.data.id);

    res.json({
      message: 'Task deleted successfully',
      task: deleted,
    });
  } catch (e) {
    logger.error('Error deleting task', e);
    if (e.message === 'Task not found') {
      return res.status(404).json({ error: 'Task not found' });
    }
    next(e);
  }
};
