import { z } from 'zod';

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

export const taskStatusSchema = z.enum(['open', 'done']);

export const taskIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID must be a valid number')
    .transform(Number)
    .refine(val => val > 0, 'ID must be a positive number'),
});

export const createTaskSchema = z
  .object({
    title: z.string().min(1).max(255).trim(),
    dueDate: dateStringSchema.optional(),
    status: taskStatusSchema.optional(),
    contactId: z.coerce.number().int().positive().optional(),
    dealId: z.coerce.number().int().positive().optional(),
  })
  .refine(data => data.contactId || data.dealId, {
    message: 'Task must be linked to at least one: contactId or dealId',
  });

export const updateTaskSchema = z
  .object({
    title: z.string().min(1).max(255).trim().optional(),
    dueDate: z.union([dateStringSchema, z.null()]).optional(),
    status: taskStatusSchema.optional(),
    contactId: z
      .union([z.coerce.number().int().positive(), z.null()])
      .optional(),
    dealId: z.union([z.coerce.number().int().positive(), z.null()]).optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const myTasksQuerySchema = z.object({
  dueBefore: dateStringSchema.optional(),
});
