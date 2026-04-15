import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { auditsController } from './audits.controller';

export const auditsRouter = Router();

auditsRouter.use(authMiddleware);
auditsRouter.get('/', (req, res, next) => auditsController.list(req, res, next));
auditsRouter.get('/:id', (req, res, next) => auditsController.getById(req, res, next));
auditsRouter.post('/', (req, res, next) => auditsController.create(req, res, next));
auditsRouter.patch('/:id', (req, res, next) => auditsController.update(req, res, next));
auditsRouter.delete('/:id', (req, res, next) => auditsController.delete(req, res, next));
auditsRouter.post('/:id/duplicate', (req, res, next) => auditsController.duplicate(req, res, next));
auditsRouter.get('/:id/opportunities.csv', (req, res, next) => auditsController.exportOpportunitiesCsv(req, res, next));
