import logger from '#config/logger.js';
import { db } from '#config/database.js';
import { tasks } from '#models/task.model.js';
import { deals } from '#models/deal.model.js';
import { contacts } from '#models/contact.model.js';
import { and, asc, eq, isNotNull, sql } from 'drizzle-orm';

const taskSelect = {
  id: tasks.id,
  ownerId: tasks.owner_id,
  title: tasks.title,
  dueDate: tasks.due_date,
  status: tasks.status,
  contactId: tasks.contact_id,
  dealId: tasks.deal_id,
  createdAt: tasks.created_at,
};

const assertContactOwned = async (ownerId, contactId) => {
  const [contact] = await db
    .select({ id: contacts.id })
    .from(contacts)
    .where(and(eq(contacts.id, contactId), eq(contacts.owner_id, ownerId)))
    .limit(1);

  if (!contact) throw new Error('Contact not found');
};

const assertDealOwned = async (ownerId, dealId) => {
  const [deal] = await db
    .select({ id: deals.id })
    .from(deals)
    .where(and(eq(deals.id, dealId), eq(deals.owner_id, ownerId)))
    .limit(1);

  if (!deal) throw new Error('Deal not found');
};

export const createTask = async (ownerId, data) => {
  try {
    const status = data.status ?? 'open';

    if (!data.contactId && !data.dealId) {
      throw new Error(
        'Task must be linked to at least one: contactId or dealId'
      );
    }

    if (data.contactId) await assertContactOwned(ownerId, data.contactId);
    if (data.dealId) await assertDealOwned(ownerId, data.dealId);

    const [task] = await db
      .insert(tasks)
      .values({
        owner_id: ownerId,
        title: data.title,
        due_date: data.dueDate,
        status,
        contact_id: data.contactId,
        deal_id: data.dealId,
        created_at: new Date(),
      })
      .returning(taskSelect);

    return task;
  } catch (e) {
    logger.error('Error creating task', e);
    throw e;
  }
};

export const listTasks = async ownerId => {
  try {
    return await db
      .select(taskSelect)
      .from(tasks)
      .where(eq(tasks.owner_id, ownerId));
  } catch (e) {
    logger.error('Error listing tasks', e);
    throw e;
  }
};

export const getTaskById = async (ownerId, taskId) => {
  try {
    const [task] = await db
      .select(taskSelect)
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.owner_id, ownerId)))
      .limit(1);

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  } catch (e) {
    logger.error(`Error getting task by id ${taskId}`, e);
    throw e;
  }
};

export const updateTask = async (ownerId, taskId, updates) => {
  try {
    const existing = await getTaskById(ownerId, taskId);

    const nextContactId =
      updates.contactId === undefined ? existing.contactId : updates.contactId;
    const nextDealId =
      updates.dealId === undefined ? existing.dealId : updates.dealId;

    if (!nextContactId && !nextDealId) {
      throw new Error(
        'Task must be linked to at least one: contactId or dealId'
      );
    }

    if (updates.contactId && updates.contactId !== existing.contactId) {
      await assertContactOwned(ownerId, updates.contactId);
    }

    if (updates.dealId && updates.dealId !== existing.dealId) {
      await assertDealOwned(ownerId, updates.dealId);
    }

    const updateData = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.contactId !== undefined)
      updateData.contact_id = updates.contactId;
    if (updates.dealId !== undefined) updateData.deal_id = updates.dealId;

    const [updatedTask] = await db
      .update(tasks)
      .set(updateData)
      .where(and(eq(tasks.id, taskId), eq(tasks.owner_id, ownerId)))
      .returning(taskSelect);

    return updatedTask;
  } catch (e) {
    logger.error(`Error updating task ${taskId}`, e);
    throw e;
  }
};

export const deleteTask = async (ownerId, taskId) => {
  try {
    await getTaskById(ownerId, taskId);

    const [deletedTask] = await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.owner_id, ownerId)))
      .returning(taskSelect);

    return deletedTask;
  } catch (e) {
    logger.error(`Error deleting task ${taskId}`, e);
    throw e;
  }
};

export const listMyOpenTasks = async (ownerId, dueBefore) => {
  try {
    const whereParts = [eq(tasks.owner_id, ownerId), eq(tasks.status, 'open')];

    if (dueBefore) {
      whereParts.push(isNotNull(tasks.due_date));
      whereParts.push(sql`${tasks.due_date} <= ${dueBefore}`);
    }

    return await db
      .select(taskSelect)
      .from(tasks)
      .where(and(...whereParts))
      .orderBy(sql`${tasks.due_date} is null`, asc(tasks.due_date));
  } catch (e) {
    logger.error('Error listing my open tasks', e);
    throw e;
  }
};
