import { ResourceService } from '../_shared/resource.service';
import type { z } from 'zod';
import { createSchema, updateSchema } from './pain-points.validation';

export type CreateInput = z.infer<typeof createSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;

export const painPointsService = new ResourceService<CreateInput, UpdateInput>('painPoint');
