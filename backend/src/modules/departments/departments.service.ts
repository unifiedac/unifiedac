import { ResourceService } from '../_shared/resource.service';
import type { z } from 'zod';
import { createSchema, updateSchema } from './departments.validation';

export type CreateInput = z.infer<typeof createSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;

export const departmentsService = new ResourceService<CreateInput, UpdateInput>('department');
