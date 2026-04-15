import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { workflowsController } from './workflows.controller';

export const workflowsRouter = Router();

workflowsRouter.use(authMiddleware);
workflowsRouter.get('/', (req, res, next) => workflowsController.list(req, res, next));
workflowsRouter.get('/:id', (req, res, next) => workflowsController.getById(req, res, next));
workflowsRouter.post('/', (req, res, next) => workflowsController.create(req, res, next));
workflowsRouter.patch('/:id', (req, res, next) => workflowsController.update(req, res, next));
workflowsRouter.delete('/:id', (req, res, next) => workflowsController.delete(req, res, next));
