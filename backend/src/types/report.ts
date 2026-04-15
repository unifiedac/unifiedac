export type ReportSectionKey =
  | 'executiveSummary'
  | 'organizationalContext'
  | 'currentStateAssessment'
  | 'riskAndControlAnalysis'
  | 'recommendationsRoadmap'
  | 'implementationPlan'
  | 'changeManagement'
  | 'kpiAndSuccessMetrics'
  | 'appendix';

export interface AuditRecommendation {
  id: string;
  category: string;
  title: string;
  detail: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
}

export interface SavedAuditData {
  clientName: string;
  auditDate: string;
  scope: string[];
  findings: string[];
  strengths: string[];
  risks: string[];
  opportunities: string[];
  kpis: string[];
  constraints?: string[];
}

export interface ReportSection {
  key: ReportSectionKey;
  title: string;
  order: number;
  content: string;
  generated: boolean;
  updatedAt: string;
}

export interface FinalReport {
  id: string;
  auditId: string;
  generatedAt: string;
  updatedAt: string;
  sections: ReportSection[];
}
