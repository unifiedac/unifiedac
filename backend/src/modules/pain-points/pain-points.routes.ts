import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { painPointsController } from './pain-points.controller';

export const painPointsRouter = Router();

painPointsRouter.use(authMiddleware);
painPointsRouter.get('/', (req, res, next) => painPointsController.list(req, res, next));
painPointsRouter.get('/:id', (req, res, next) => painPointsController.getById(req, res, next));
painPointsRouter.post('/', (req, res, next) => painPointsController.create(req, res, next));
painPointsRouter.patch('/:id', (req, res, next) => painPointsController.update(req, res, next));
painPointsRouter.delete('/:id', (req, res, next) => painPointsController.delete(req, res, next));
