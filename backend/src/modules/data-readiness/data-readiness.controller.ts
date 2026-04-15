import { ResourceController } from '../_shared/resource.controller';
import { createSchema, updateSchema } from './data-readiness.validation';
import { dataReadinessService } from './data-readiness.service';

export const dataReadinessController = new ResourceController(dataReadinessService, createSchema, updateSchema);
