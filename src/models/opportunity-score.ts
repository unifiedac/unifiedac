export interface OpportunityScore {
  id: string;
  painPoint: string;
  department: string;
  impactScore: number;
  frequencyScore: number;
  timeSavingsScore: number;
  effortScore: number;
  consultantNote?: string;
  manualPriorityOverride?: number;
  priorityScore: number;
  quickWin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PainPointFilterMode =
  | 'all'
  | 'quick wins'
  | 'high value opportunities'
  | 'by department';

export interface ListPainPointsQuery {
  mode?: PainPointFilterMode;
  department?: string;
}

export interface UpsertOpportunityScoreInput {
  id: string;
  painPoint: string;
  department: string;
  impactScore: number;
  frequencyScore: number;
  timeSavingsScore: number;
  effortScore: number;
  consultantNote?: string;
  manualPriorityOverride?: number;
}
