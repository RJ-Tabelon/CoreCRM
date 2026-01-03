import { z } from 'zod';

export const contactIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID must be a valid number')
    .transform(Number)
    .refine(val => val > 0, 'ID must be a positive number'),
});

export const listContactsQuerySchema = z.object({
  q: z.string().trim().min(1).max(255).optional(),
  ownerId: z
    .string()
    .regex(/^\d+$/, 'ownerId must be a valid number')
    .transform(Number)
    .refine(val => val > 0, 'ownerId must be a positive number')
    .optional(),
});

export const createContactSchema = z.object({
  name: z.string().min(1).max(255).trim(),
  email: z.email().max(255).toLowerCase().trim().optional(),
  phone: z.string().min(1).max(50).trim().optional(),
  company: z.string().min(1).max(255).trim().optional(),
});

export const updateContactSchema = z
  .object({
    name: z.string().min(1).max(255).trim().optional(),
    email: z.email().max(255).toLowerCase().trim().optional(),
    phone: z.string().min(1).max(50).trim().optional(),
    company: z.string().min(1).max(255).trim().optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const createContactNoteSchema = z.object({
  content: z.string().min(1).trim(),
});
