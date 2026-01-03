import { z } from 'zod';

export const dealStageSchema = z.enum(['new', 'in_progress', 'won', 'lost']);

export const dealIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID must be a valid number')
    .transform(Number)
    .refine(val => val > 0, 'ID must be a positive number'),
});

export const createDealSchema = z.object({
  contactId: z.coerce.number().int().positive(),
  title: z.string().min(1).max(255).trim(),
  amount: z.coerce.number().nonnegative(),
  stage: dealStageSchema.optional(),
});

export const updateDealSchema = z
  .object({
    contactId: z.coerce.number().int().positive().optional(),
    title: z.string().min(1).max(255).trim().optional(),
    amount: z.coerce.number().nonnegative().optional(),
    stage: dealStageSchema.optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });
