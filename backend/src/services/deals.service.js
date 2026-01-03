import logger from '#config/logger.js';
import { db } from '#config/database.js';
import { deals } from '#models/deal.model.js';
import { and, eq } from 'drizzle-orm';
import { getContactById } from '#services/contacts.service.js';

const dealSelect = {
  id: deals.id,
  ownerId: deals.owner_id,
  contactId: deals.contact_id,
  title: deals.title,
  amount: deals.amount,
  stage: deals.stage,
  createdAt: deals.created_at,
  updatedAt: deals.updated_at,
};

export const createDeal = async (ownerId, data) => {
  try {
    await getContactById(ownerId, data.contactId);

    const [deal] = await db
      .insert(deals)
      .values({
        owner_id: ownerId,
        contact_id: data.contactId,
        title: data.title,
        amount: data.amount,
        stage: data.stage ?? 'new',
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning(dealSelect);

    return deal;
  } catch (e) {
    logger.error('Error creating deal', e);
    throw e;
  }
};

export const listDeals = async ownerId => {
  try {
    return await db
      .select(dealSelect)
      .from(deals)
      .where(eq(deals.owner_id, ownerId));
  } catch (e) {
    logger.error('Error listing deals', e);
    throw e;
  }
};

export const getDealById = async (ownerId, dealId) => {
  try {
    const [deal] = await db
      .select(dealSelect)
      .from(deals)
      .where(and(eq(deals.id, dealId), eq(deals.owner_id, ownerId)))
      .limit(1);

    if (!deal) {
      throw new Error('Deal not found');
    }

    return deal;
  } catch (e) {
    logger.error(`Error getting deal by id ${dealId}`, e);
    throw e;
  }
};

export const updateDeal = async (ownerId, dealId, updates) => {
  try {
    await getDealById(ownerId, dealId);

    if (updates.contactId) {
      await getContactById(ownerId, updates.contactId);
    }

    const updateData = {
      updated_at: new Date(),
    };

    if (updates.contactId !== undefined)
      updateData.contact_id = updates.contactId;
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.amount !== undefined) updateData.amount = updates.amount;
    if (updates.stage !== undefined) updateData.stage = updates.stage;

    const [updatedDeal] = await db
      .update(deals)
      .set(updateData)
      .where(and(eq(deals.id, dealId), eq(deals.owner_id, ownerId)))
      .returning(dealSelect);

    return updatedDeal;
  } catch (e) {
    logger.error(`Error updating deal ${dealId}`, e);
    throw e;
  }
};

export const deleteDeal = async (ownerId, dealId) => {
  try {
    await getDealById(ownerId, dealId);

    const [deletedDeal] = await db
      .delete(deals)
      .where(and(eq(deals.id, dealId), eq(deals.owner_id, ownerId)))
      .returning(dealSelect);

    return deletedDeal;
  } catch (e) {
    logger.error(`Error deleting deal ${dealId}`, e);
    throw e;
  }
};
