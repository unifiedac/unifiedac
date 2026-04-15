import type { NextFunction, Request, Response } from 'express';
import { idParamSchema } from '../_shared/resource.validation';
import { ResourceController } from '../_shared/resource.controller';
import type { CreateInput, UpdateInput } from './audits.service';
import { auditsService } from './audits.service';
import { createSchema, updateSchema } from './audits.validation';

class AuditsController extends ResourceController<CreateInput, UpdateInput> {
  constructor() {
    super(auditsService, createSchema, updateSchema);
  }

  async duplicate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const data = await auditsService.duplicateAudit(id);
      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async exportOpportunitiesCsv(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const csv = await auditsService.opportunitiesCsv(id);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="audit-${id}-opportunities.csv"`);
      res.status(200).send(csv);
    } catch (error) {
      next(error);
    }
  }
}

export const auditsController = new AuditsController();
