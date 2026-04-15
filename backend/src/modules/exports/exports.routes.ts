import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { exportsController } from './exports.controller';

export const exportsRouter = Router();

exportsRouter.use(authMiddleware);
exportsRouter.get('/', (req, res, next) => exportsController.list(req, res, next));
exportsRouter.get('/opportunities.csv', (req, res, next) => exportsController.exportOpportunitiesCsv(req, res, next));
exportsRouter.get('/:id', (req, res, next) => exportsController.getById(req, res, next));
exportsRouter.post('/', (req, res, next) => exportsController.create(req, res, next));
exportsRouter.patch('/:id', (req, res, next) => exportsController.update(req, res, next));
exportsRouter.delete('/:id', (req, res, next) => exportsController.delete(req, res, next));
