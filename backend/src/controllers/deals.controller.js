import logger from '#config/logger.js';
import {
  createDealSchema,
  dealIdSchema,
  updateDealSchema,
} from '#validations/deals.validation.js';
import { formatValidationError } from '#utils/format.js';
import {
  createDeal,
  deleteDeal,
  getDealById,
  listDeals,
  updateDeal,
} from '#services/deals.service.js';

export const createDealForUser = async (req, res, next) => {
  try {
    const validationResult = createDealSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const ownerId = req.user?.id;
    const deal = await createDeal(ownerId, validationResult.data);

    res.status(201).json({
      message: 'Deal created successfully',
      deal,
    });
  } catch (e) {
    logger.error('Error creating deal', e);
    if (e.message === 'Contact not found') {
      return res.status(404).json({ error: 'Contact not found' });
    }
    next(e);
  }
};

export const listDealsForUser = async (req, res, next) => {
  try {
    const ownerId = req.user?.id;
    const dealsList = await listDeals(ownerId);

    res.json({
      message: 'Successfully retrieved deals',
      deals: dealsList,
      count: dealsList.length,
    });
  } catch (e) {
    logger.error('Error listing deals', e);
    next(e);
  }
};

export const fetchDealById = async (req, res, next) => {
  try {
    const idResult = dealIdSchema.safeParse({ id: req.params.id });
    if (!idResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(idResult.error),
      });
    }

    const ownerId = req.user?.id;
    const deal = await getDealById(ownerId, idResult.data.id);

    res.json({
      message: 'Deal retrieved successfully',
      deal,
    });
  } catch (e) {
    logger.error('Error fetching deal by id', e);
    if (e.message === 'Deal not found') {
      return res.status(404).json({ error: 'Deal not found' });
    }
    next(e);
  }
};

export const updateDealById = async (req, res, next) => {
  try {
    const idResult = dealIdSchema.safeParse({ id: req.params.id });
    if (!idResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(idResult.error),
      });
    }

    const bodyResult = updateDealSchema.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(bodyResult.error),
      });
    }

    const ownerId = req.user?.id;
    const updated = await updateDeal(
      ownerId,
      idResult.data.id,
      bodyResult.data
    );

    res.json({
      message: 'Deal updated successfully',
      deal: updated,
    });
  } catch (e) {
    logger.error('Error updating deal', e);
    if (e.message === 'Deal not found') {
      return res.status(404).json({ error: 'Deal not found' });
    }
    if (e.message === 'Contact not found') {
      return res.status(404).json({ error: 'Contact not found' });
    }
    next(e);
  }
};

export const deleteDealById = async (req, res, next) => {
  try {
    const idResult = dealIdSchema.safeParse({ id: req.params.id });
    if (!idResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(idResult.error),
      });
    }

    const ownerId = req.user?.id;
    const deleted = await deleteDeal(ownerId, idResult.data.id);

    res.json({
      message: 'Deal deleted successfully',
      deal: deleted,
    });
  } catch (e) {
    logger.error('Error deleting deal', e);
    if (e.message === 'Deal not found') {
      return res.status(404).json({ error: 'Deal not found' });
    }
    next(e);
  }
};
