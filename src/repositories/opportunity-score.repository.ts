import { OpportunityScore } from '../models/opportunity-score';

export interface OpportunityScoreRepository {
  upsert(opportunityScore: OpportunityScore): Promise<OpportunityScore>;
  findAll(): Promise<OpportunityScore[]>;
}

export class InMemoryOpportunityScoreRepository
  implements OpportunityScoreRepository
{
  private readonly records = new Map<string, OpportunityScore>();

  async upsert(opportunityScore: OpportunityScore): Promise<OpportunityScore> {
    this.records.set(opportunityScore.id, opportunityScore);
    return opportunityScore;
  }

  async findAll(): Promise<OpportunityScore[]> {
    return [...this.records.values()];
  }
}
