import { ResourceController } from '../_shared/resource.controller';
import { createSchema, updateSchema } from './workflows.validation';
import { workflowsService } from './workflows.service';

export const workflowsController = new ResourceController(workflowsService, createSchema, updateSchema);
