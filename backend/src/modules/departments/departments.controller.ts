import { ResourceController } from '../_shared/resource.controller';
import { createSchema, updateSchema } from './departments.validation';
import { departmentsService } from './departments.service';

export const departmentsController = new ResourceController(departmentsService, createSchema, updateSchema);
