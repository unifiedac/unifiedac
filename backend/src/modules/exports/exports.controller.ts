import type { NextFunction, Request, Response } from 'express';
import { ResourceController } from '../_shared/resource.controller';
import type { CreateInput, UpdateInput } from './exports.service';
import { exportsService } from './exports.service';
import { createSchema, updateSchema } from './exports.validation';

class ExportsController extends ResourceController<CreateInput, UpdateInput> {
  constructor() {
    super(exportsService, createSchema, updateSchema);
  }

  async exportOpportunitiesCsv(req: Request, res: Response, next: NextFunction) {
    try {
      const auditId = typeof req.query.auditId === 'string' ? req.query.auditId : undefined;
      const csv = await exportsService.opportunitiesCsv(auditId);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="opportunities.csv"');
      res.status(200).send(csv);
    } catch (error) {
      next(error);
    }
  }
}

export const exportsController = new ExportsController();
