import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { reportSectionsController } from './report-sections.controller';

export const reportSectionsRouter = Router();

reportSectionsRouter.use(authMiddleware);
reportSectionsRouter.get('/', (req, res, next) => reportSectionsController.list(req, res, next));
reportSectionsRouter.get('/:id', (req, res, next) => reportSectionsController.getById(req, res, next));
reportSectionsRouter.post('/', (req, res, next) => reportSectionsController.create(req, res, next));
reportSectionsRouter.patch('/:id', (req, res, next) => reportSectionsController.update(req, res, next));
reportSectionsRouter.delete('/:id', (req, res, next) => reportSectionsController.delete(req, res, next));
