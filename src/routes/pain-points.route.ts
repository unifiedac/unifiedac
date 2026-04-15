import { Router } from 'express';
import { PainPointFilterMode } from '../models/opportunity-score';
import { ScoringService } from '../services/scoring.service';

const FILTER_MODES: ReadonlyArray<PainPointFilterMode> = [
  'all',
  'quick wins',
  'high value opportunities',
  'by department',
];

export const createPainPointsRouter = (
  scoringService: ScoringService,
): Router => {
  const router = Router();

  router.get('/pain-points', async (req, res, next) => {
    try {
      const mode = req.query.mode as PainPointFilterMode | undefined;
      const department = req.query.department as string | undefined;

      if (mode && !FILTER_MODES.includes(mode)) {
        res.status(400).json({
          message: `Invalid mode. Supported modes: ${FILTER_MODES.join(', ')}`,
        });
        return;
      }

      if (mode === 'by department' && !department) {
        res.status(400).json({
          message: 'department query parameter is required for by department mode.',
        });
        return;
      }

      const result = await scoringService.getPainPointsByPriority({
        mode,
        department,
      });

      res.json({
        mode: mode ?? 'all',
        count: result.length,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
