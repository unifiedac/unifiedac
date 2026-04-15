export type AuditStatus = 'draft' | 'in_progress' | 'completed';

export interface PainPoint {
  id: string;
  title: string;
  department: string;
  impact: number;
  frequency: number;
  effortToFix: number;
  notes: string;
}

export interface Recommendation {
  id: string;
  painPointId: string;
  aiOutput: string;
  finalTitle: string;
  finalDescription: string;
  edited: boolean;
}

export interface PrioritizationItem {
  id: string;
  name: string;
  impactScore: number;
  effortScore: number;
  totalScore: number;
  department: string;
  isQuickWin: boolean;
}

export interface Audit {
  id: string;
  name: string;
  status: AuditStatus;
  completionPercent: number;
  painPoints: PainPoint[];
  recommendations: Recommendation[];
  prioritizationItems: PrioritizationItem[];
}
