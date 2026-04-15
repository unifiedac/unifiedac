import { Router, type Request, type Response } from 'express';
import {
  buildRecommendationUserPrompt,
  CONSULTANT_SYSTEM_PROMPT,
  type RecommendationPromptContext,
} from './promptTemplate';
import {
  recommendationResponseJsonSchema,
  recommendationResponseSchema,
  type RecommendationResponse,
} from './schema';

export interface PainPointRecord {
  id: string;
  auditId: string;
  department: string;
  workflow: string;
  title: string;
  description: string;
  dataReadinessSummary: string;
  currentSystems?: string[];
  constraints?: string[];
  recommendationGeneratedAt?: string | null;
}

export interface RecommendationPersistencePayload {
  painPointId: string;
  aiSummary: string;
  recommendedSolution: string;
  suggestedTools: string[];
  effortLevel: RecommendationResponse['effortLevel'];
  expectedROI: string;
  implementationConsiderations: string;
  risks: string;
  confidenceScore?: number;
}

export interface PainPointRepository {
  findById(painPointId: string): Promise<PainPointRecord | null>;
  findByAuditId(auditId: string): Promise<PainPointRecord[]>;
  saveRecommendation(payload: RecommendationPersistencePayload): Promise<void>;
}

export interface AiJsonClient {
  generateJson(args: {
    systemPrompt: string;
    userPrompt: string;
    responseJsonSchema: object;
  }): Promise<unknown>;
}

export interface RecommendationServiceOptions {
  retries?: number;
  retryDelayMs?: number;
}

class RecommendationService {
  private readonly retries: number;
  private readonly retryDelayMs: number;

  constructor(
    private readonly repo: PainPointRepository,
    private readonly aiClient: AiJsonClient,
    options: RecommendationServiceOptions = {},
  ) {
    this.retries = options.retries ?? 3;
    this.retryDelayMs = options.retryDelayMs ?? 500;
  }

  async generateForPainPoint(painPointId: string) {
    const painPoint = await this.repo.findById(painPointId);
    if (!painPoint) {
      return { status: 'not_found' as const, painPointId };
    }

    if (painPoint.recommendationGeneratedAt) {
      return { status: 'skipped_existing' as const, painPointId };
    }

    const promptContext: RecommendationPromptContext = {
      auditId: painPoint.auditId,
      department: painPoint.department,
      workflow: painPoint.workflow,
      painPointId: painPoint.id,
      painPointTitle: painPoint.title,
      painPointDescription: painPoint.description,
      dataReadinessSummary: painPoint.dataReadinessSummary,
      currentSystems: painPoint.currentSystems,
      constraints: painPoint.constraints,
    };

    const userPrompt = buildRecommendationUserPrompt(promptContext);

    const aiPayload = await this.withRetry(async () =>
      this.aiClient.generateJson({
        systemPrompt: CONSULTANT_SYSTEM_PROMPT,
        userPrompt,
        responseJsonSchema: recommendationResponseJsonSchema,
      }),
    );

    const parsed = recommendationResponseSchema.safeParse(aiPayload);
    if (!parsed.success) {
      return {
        status: 'invalid_ai_output' as const,
        painPointId,
        details: parsed.error.flatten(),
      };
    }

    await this.repo.saveRecommendation({
      painPointId: painPoint.id,
      aiSummary: parsed.data.aiSummary,
      recommendedSolution: parsed.data.recommendedSolution,
      suggestedTools: parsed.data.suggestedTools,
      effortLevel: parsed.data.effortLevel,
      expectedROI: parsed.data.expectedROI,
      implementationConsiderations: parsed.data.implementationConsiderations,
      risks: parsed.data.risks,
      confidenceScore: parsed.data.confidenceScore,
    });

    return {
      status: 'generated' as const,
      painPointId,
      confidenceScore: parsed.data.confidenceScore,
    };
  }

  async generateForAudit(auditId: string) {
    const painPoints = await this.repo.findByAuditId(auditId);
    const results = [] as Awaited<
      ReturnType<RecommendationService['generateForPainPoint']>
    >[];

    for (const painPoint of painPoints) {
      const result = await this.generateForPainPoint(painPoint.id);
      results.push(result);
    }

    return {
      auditId,
      total: painPoints.length,
      generated: results.filter((r) => r.status === 'generated').length,
      skippedExisting: results.filter((r) => r.status === 'skipped_existing').length,
      notFound: results.filter((r) => r.status === 'not_found').length,
      invalidAiOutput: results.filter((r) => r.status === 'invalid_ai_output').length,
      results,
    };
  }

  private async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= this.retries; attempt += 1) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (attempt < this.retries) {
          await sleep(this.retryDelayMs * attempt);
        }
      }
    }

    throw lastError;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createRecommendationRouter(
  repo: PainPointRepository,
  aiClient: AiJsonClient,
  options?: RecommendationServiceOptions,
) {
  const service = new RecommendationService(repo, aiClient, options);
  const router = Router();

  router.post(
    '/recommendations/generate/:painPointId',
    async (req: Request, res: Response) => {
      const { painPointId } = req.params;

      try {
        const result = await service.generateForPainPoint(painPointId);

        if (result.status === 'not_found') {
          res.status(404).json(result);
          return;
        }

        if (result.status === 'invalid_ai_output') {
          res.status(422).json(result);
          return;
        }

        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({
          status: 'error',
          painPointId,
          message:
            error instanceof Error
              ? error.message
              : 'Failed to generate recommendation',
        });
      }
    },
  );

  router.post(
    '/recommendations/generate-all/:auditId',
    async (req: Request, res: Response) => {
      const { auditId } = req.params;

      try {
        const result = await service.generateForAudit(auditId);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({
          status: 'error',
          auditId,
          message:
            error instanceof Error
              ? error.message
              : 'Failed to generate recommendations',
        });
      }
    },
  );

  return router;
}

export { RecommendationService };
