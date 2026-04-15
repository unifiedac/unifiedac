import { ResourceController } from '../_shared/resource.controller';
import { createSchema, updateSchema } from './report-sections.validation';
import { reportSectionsService } from './report-sections.service';

export const reportSectionsController = new ResourceController(reportSectionsService, createSchema, updateSchema);
