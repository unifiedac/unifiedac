import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { dataReadinessController } from './data-readiness.controller';

export const dataReadinessRouter = Router();

dataReadinessRouter.use(authMiddleware);
dataReadinessRouter.get('/', (req, res, next) => dataReadinessController.list(req, res, next));
dataReadinessRouter.get('/:id', (req, res, next) => dataReadinessController.getById(req, res, next));
dataReadinessRouter.post('/', (req, res, next) => dataReadinessController.create(req, res, next));
dataReadinessRouter.patch('/:id', (req, res, next) => dataReadinessController.update(req, res, next));
dataReadinessRouter.delete('/:id', (req, res, next) => dataReadinessController.delete(req, res, next));
