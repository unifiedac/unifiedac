import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/request-logger';
import { authRouter } from './modules/auth/auth.routes';
import { auditsRouter } from './modules/audits/audits.routes';
import { dataReadinessRouter } from './modules/data-readiness/data-readiness.routes';
import { departmentsRouter } from './modules/departments/departments.routes';
import { exportsRouter } from './modules/exports/exports.routes';
import { painPointsRouter } from './modules/pain-points/pain-points.routes';
import { recommendationsRouter } from './modules/recommendations/recommendations.routes';
import { reportSectionsRouter } from './modules/report-sections/report-sections.routes';
import { scoringRouter } from './modules/scoring/scoring.routes';
import { taskBreakdownsRouter } from './modules/task-breakdowns/task-breakdowns.routes';
import { workflowsRouter } from './modules/workflows/workflows.routes';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(requestLogger);

  app.get('/healthz', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/auth', authRouter);
  app.use('/audits', auditsRouter);
  app.use('/departments', departmentsRouter);
  app.use('/workflows', workflowsRouter);
  app.use('/task-breakdowns', taskBreakdownsRouter);
  app.use('/pain-points', painPointsRouter);
  app.use('/data-readiness', dataReadinessRouter);
  app.use('/scoring', scoringRouter);
  app.use('/recommendations', recommendationsRouter);
  app.use('/report-sections', reportSectionsRouter);
  app.use('/exports', exportsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
