import { z } from 'zod';

export const resourceCreateSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const resourceUpdateSchema = resourceCreateSchema.partial();

export const idParamSchema = z.object({
  id: z.string().min(1),
});
