import { ResourceController } from '../_shared/resource.controller';
import { createSchema, updateSchema } from './scoring.validation';
import { scoringService } from './scoring.service';

export const scoringController = new ResourceController(scoringService, createSchema, updateSchema);
