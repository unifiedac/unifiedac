import {
  ListPainPointsQuery,
  OpportunityScore,
  PainPointFilterMode,
  UpsertOpportunityScoreInput,
} from '../models/opportunity-score';
import { OpportunityScoreRepository } from '../repositories/opportunity-score.repository';

export class ScoringService {
  constructor(private readonly repository: OpportunityScoreRepository) {}

  async upsertOpportunityScore(
    payload: UpsertOpportunityScoreInput,
  ): Promise<OpportunityScore> {
    const now = new Date();
    const existing = (await this.repository.findAll()).find(
      (record) => record.id === payload.id,
    );

    const calculatedPriorityScore = this.calculatePriorityScore(payload);
    const priorityScore =
      payload.manualPriorityOverride ?? calculatedPriorityScore;

    const record: OpportunityScore = {
      id: payload.id,
      painPoint: payload.painPoint,
      department: payload.department,
      impactScore: payload.impactScore,
      frequencyScore: payload.frequencyScore,
      timeSavingsScore: payload.timeSavingsScore,
      effortScore: payload.effortScore,
      consultantNote: payload.consultantNote,
      manualPriorityOverride: payload.manualPriorityOverride,
      priorityScore,
      quickWin: this.isQuickWin(payload.impactScore, payload.effortScore),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    return this.repository.upsert(record);
  }

  async getPainPointsByPriority(
    query: ListPainPointsQuery = {},
  ): Promise<OpportunityScore[]> {
    const mode: PainPointFilterMode = query.mode ?? 'all';
    const allPainPoints = await this.repository.findAll();

    const filtered = allPainPoints.filter((record) =>
      this.matchesMode(record, mode, query.department),
    );

    return filtered.sort((a, b) => b.priorityScore - a.priorityScore);
  }

  private calculatePriorityScore(payload: UpsertOpportunityScoreInput): number {
    return (
      (payload.impactScore +
        payload.frequencyScore +
        payload.timeSavingsScore) /
      Math.max(payload.effortScore, 1)
    );
  }

  private isQuickWin(impactScore: number, effortScore: number): boolean {
    const HIGH_IMPACT_THRESHOLD = 7;
    const LOW_EFFORT_THRESHOLD = 3;
    return impactScore >= HIGH_IMPACT_THRESHOLD && effortScore <= LOW_EFFORT_THRESHOLD;
  }

  private matchesMode(
    record: OpportunityScore,
    mode: PainPointFilterMode,
    department?: string,
  ): boolean {
    switch (mode) {
      case 'all':
        return true;
      case 'quick wins':
        return record.quickWin;
      case 'high value opportunities':
        return record.priorityScore >= 5;
      case 'by department':
        return Boolean(department) && record.department === department;
      default:
        return true;
    }
  }
}
