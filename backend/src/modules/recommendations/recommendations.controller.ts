import { ResourceController } from '../_shared/resource.controller';
import { createSchema, updateSchema } from './recommendations.validation';
import { recommendationsService } from './recommendations.service';

export const recommendationsController = new ResourceController(recommendationsService, createSchema, updateSchema);
