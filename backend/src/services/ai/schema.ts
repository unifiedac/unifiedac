import { z } from 'zod';

export const recommendationResponseSchema = z
  .object({
    aiSummary: z.string().min(1),
    recommendedSolution: z.string().min(1),
    suggestedTools: z.array(z.string().min(1)).default([]),
    effortLevel: z.enum(['low', 'medium', 'high']),
    expectedROI: z.string().min(1),
    implementationConsiderations: z.string().min(1),
    risks: z.string().min(1),
    confidenceScore: z.number().min(0).max(1).optional(),
  })
  .strict();

export type RecommendationResponse = z.infer<typeof recommendationResponseSchema>;

// JSON Schema counterpart for LLM response-format / tool APIs.
export const recommendationResponseJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'aiSummary',
    'recommendedSolution',
    'suggestedTools',
    'effortLevel',
    'expectedROI',
    'implementationConsiderations',
    'risks',
  ],
  properties: {
    aiSummary: { type: 'string', minLength: 1 },
    recommendedSolution: { type: 'string', minLength: 1 },
    suggestedTools: {
      type: 'array',
      items: { type: 'string', minLength: 1 },
      default: [],
    },
    effortLevel: { type: 'string', enum: ['low', 'medium', 'high'] },
    expectedROI: { type: 'string', minLength: 1 },
    implementationConsiderations: { type: 'string', minLength: 1 },
    risks: { type: 'string', minLength: 1 },
    confidenceScore: { type: 'number', minimum: 0, maximum: 1 },
  },
} as const;
