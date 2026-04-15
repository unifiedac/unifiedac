import { ResourceController } from '../_shared/resource.controller';
import { createSchema, updateSchema } from './pain-points.validation';
import { painPointsService } from './pain-points.service';

export const painPointsController = new ResourceController(painPointsService, createSchema, updateSchema);
