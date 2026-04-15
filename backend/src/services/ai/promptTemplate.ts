export type EffortLevel = 'low' | 'medium' | 'high';

export interface RecommendationPromptContext {
  auditId: string;
  department: string;
  workflow: string;
  painPointId: string;
  painPointTitle: string;
  painPointDescription: string;
  dataReadinessSummary: string;
  currentSystems?: string[];
  constraints?: string[];
}

/**
 * Consultant-style system prompt tuned for medium-business practicality.
 */
export const CONSULTANT_SYSTEM_PROMPT = `You are a senior digital transformation consultant advising medium-sized businesses. Your recommendations must be practical, budget-aware, and implementation-ready within typical mid-market constraints. Favor solutions that can be piloted quickly, integrate with common business tools, and provide measurable operational gains.

You must return STRICT JSON only. No markdown. No prose outside JSON.

Base your recommendation on:
1) audit context and business objectives,
2) department operating realities,
3) workflow bottlenecks,
4) pain point impact,
5) data readiness and system constraints.

If context quality is weak, still provide a practical phased recommendation and clearly state assumptions inside implementationConsiderations and risks.`;

export function buildRecommendationUserPrompt(
  context: RecommendationPromptContext,
): string {
  const systems = context.currentSystems?.length
    ? context.currentSystems.join(', ')
    : 'Not provided';
  const constraints = context.constraints?.length
    ? context.constraints.join('; ')
    : 'Not provided';

  return [
    'Generate one structured recommendation for this audit pain point.',
    '',
    `Audit ID: ${context.auditId}`,
    `Department: ${context.department}`,
    `Workflow: ${context.workflow}`,
    `Pain Point ID: ${context.painPointId}`,
    `Pain Point Title: ${context.painPointTitle}`,
    `Pain Point Description: ${context.painPointDescription}`,
    `Data Readiness Context: ${context.dataReadinessSummary}`,
    `Current Systems: ${systems}`,
    `Constraints: ${constraints}`,
    '',
    'Return JSON with these keys only:',
    '- aiSummary',
    '- recommendedSolution',
    '- suggestedTools (array of strings)',
    '- effortLevel (low|medium|high)',
    '- expectedROI',
    '- implementationConsiderations',
    '- risks',
    '- confidenceScore (number 0..1, optional if unsupported)',
  ].join('\n');
}
