import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { recommendationsController } from './recommendations.controller';

export const recommendationsRouter = Router();

recommendationsRouter.use(authMiddleware);
recommendationsRouter.get('/', (req, res, next) => recommendationsController.list(req, res, next));
recommendationsRouter.get('/:id', (req, res, next) => recommendationsController.getById(req, res, next));
recommendationsRouter.post('/', (req, res, next) => recommendationsController.create(req, res, next));
recommendationsRouter.patch('/:id', (req, res, next) => recommendationsController.update(req, res, next));
recommendationsRouter.delete('/:id', (req, res, next) => recommendationsController.delete(req, res, next));
