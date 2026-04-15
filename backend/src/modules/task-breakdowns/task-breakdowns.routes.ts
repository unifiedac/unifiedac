import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { taskBreakdownsController } from './task-breakdowns.controller';

export const taskBreakdownsRouter = Router();

taskBreakdownsRouter.use(authMiddleware);
taskBreakdownsRouter.get('/', (req, res, next) => taskBreakdownsController.list(req, res, next));
taskBreakdownsRouter.get('/:id', (req, res, next) => taskBreakdownsController.getById(req, res, next));
taskBreakdownsRouter.post('/', (req, res, next) => taskBreakdownsController.create(req, res, next));
taskBreakdownsRouter.patch('/:id', (req, res, next) => taskBreakdownsController.update(req, res, next));
taskBreakdownsRouter.delete('/:id', (req, res, next) => taskBreakdownsController.delete(req, res, next));
