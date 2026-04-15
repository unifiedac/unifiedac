import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { scoringController } from './scoring.controller';

export const scoringRouter = Router();

scoringRouter.use(authMiddleware);
scoringRouter.get('/', (req, res, next) => scoringController.list(req, res, next));
scoringRouter.get('/:id', (req, res, next) => scoringController.getById(req, res, next));
scoringRouter.post('/', (req, res, next) => scoringController.create(req, res, next));
scoringRouter.patch('/:id', (req, res, next) => scoringController.update(req, res, next));
scoringRouter.delete('/:id', (req, res, next) => scoringController.delete(req, res, next));
