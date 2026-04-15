import { ResourceService } from '../_shared/resource.service';
import type { z } from 'zod';
import { createSchema, updateSchema } from './recommendations.validation';

export type CreateInput = z.infer<typeof createSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;

export const recommendationsService = new ResourceService<CreateInput, UpdateInput>('recommendation');
