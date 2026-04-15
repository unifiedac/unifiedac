import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { departmentsController } from './departments.controller';

export const departmentsRouter = Router();

departmentsRouter.use(authMiddleware);
departmentsRouter.get('/', (req, res, next) => departmentsController.list(req, res, next));
departmentsRouter.get('/:id', (req, res, next) => departmentsController.getById(req, res, next));
departmentsRouter.post('/', (req, res, next) => departmentsController.create(req, res, next));
departmentsRouter.patch('/:id', (req, res, next) => departmentsController.update(req, res, next));
departmentsRouter.delete('/:id', (req, res, next) => departmentsController.delete(req, res, next));
