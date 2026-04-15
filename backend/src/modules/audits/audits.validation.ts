import { z } from 'zod';
import { resourceCreateSchema, resourceUpdateSchema } from '../_shared/resource.validation';

export const createSchema = resourceCreateSchema.extend({
  departmentId: z.string().optional(),
  workflowId: z.string().optional(),
  status: z.enum(['draft', 'active', 'completed']).optional(),
});

export const updateSchema = resourceUpdateSchema.extend({
  departmentId: z.string().optional(),
  workflowId: z.string().optional(),
  status: z.enum(['draft', 'active', 'completed']).optional(),
});
