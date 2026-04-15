import { ResourceController } from '../_shared/resource.controller';
import { createSchema, updateSchema } from './task-breakdowns.validation';
import { taskBreakdownsService } from './task-breakdowns.service';

export const taskBreakdownsController = new ResourceController(taskBreakdownsService, createSchema, updateSchema);
