import { randomUUID } from 'node:crypto';
import {
  AuditRecommendation,
  FinalReport,
  ReportSection,
  ReportSectionKey,
  SavedAuditData,
} from '../types/report';

const SECTION_META: Array<{ key: ReportSectionKey; title: string }> = [
  { key: 'executiveSummary', title: '1. Executive Summary' },
  { key: 'organizationalContext', title: '2. Organizational Context & Scope' },
  { key: 'currentStateAssessment', title: '3. Current State Assessment' },
  { key: 'riskAndControlAnalysis', title: '4. Risk & Control Analysis' },
  { key: 'recommendationsRoadmap', title: '5. Recommendations Roadmap' },
  { key: 'implementationPlan', title: '6. Implementation Plan' },
  { key: 'changeManagement', title: '7. Change Management Considerations' },
  { key: 'kpiAndSuccessMetrics', title: '8. KPI & Success Metrics' },
  { key: 'appendix', title: '9. Appendix' },
];

const reportsByAuditId = new Map<string, FinalReport>();

const bulletList = (items: string[]) =>
  items.length > 0 ? items.map((item) => `- ${item}`).join('\n') : '- No items captured during audit.';

const summarizeRecommendations = (recommendations: AuditRecommendation[]) => {
  if (recommendations.length === 0) {
    return '- No recommendations captured.';
  }

  return recommendations
    .map(
      (rec) =>
        `- [${rec.category}] ${rec.title}: ${rec.detail} (Impact: ${rec.impact.toUpperCase()}, Effort: ${rec.effort.toUpperCase()})`,
    )
    .join('\n');
};

const sectionContentBuilders: Record<
  ReportSectionKey,
  (audit: SavedAuditData, recommendations: AuditRecommendation[]) => string
> = {
  executiveSummary: (audit, recommendations) =>
    [
      `This report summarizes the operational and control posture for ${audit.clientName} based on audit activity completed on ${audit.auditDate}.`,
      `The engagement reviewed ${audit.scope.length} scope areas and produced ${recommendations.length} prioritized recommendations.`,
      'Primary outcomes include core strengths, notable risks, and a practical roadmap for execution over the next two quarters.',
    ].join('\n\n'),
  organizationalContext: (audit) =>
    [`Audit scope for ${audit.clientName}:`, bulletList(audit.scope), 'Known constraints:', bulletList(audit.constraints ?? [])].join(
      '\n\n',
    ),
  currentStateAssessment: (audit) =>
    ['Validated strengths:', bulletList(audit.strengths), 'Observed findings:', bulletList(audit.findings)].join('\n\n'),
  riskAndControlAnalysis: (audit) => ['Key risks identified:', bulletList(audit.risks)].join('\n\n'),
  recommendationsRoadmap: (_audit, recommendations) =>
    ['Prioritized recommendations:', summarizeRecommendations(recommendations)].join('\n\n'),
  implementationPlan: (_audit, recommendations) => {
    const quickWins = recommendations.filter((item) => item.effort === 'low');
    const midTerm = recommendations.filter((item) => item.effort !== 'low');

    return [
      'Phase 1 (0-30 days):',
      bulletList(quickWins.map((item) => `${item.title} (${item.category})`)),
      'Phase 2 (31-90 days):',
      bulletList(midTerm.map((item) => `${item.title} (${item.category})`)),
    ].join('\n\n');
  },
  changeManagement: (audit) =>
    [
      'Change enablement priorities:',
      bulletList([
        `Align leadership sponsors across ${audit.scope.length} audited domains`,
        'Define accountability and communication cadence for each workstream',
        'Create targeted enablement content for teams impacted by control updates',
      ]),
    ].join('\n\n'),
  kpiAndSuccessMetrics: (audit) => ['KPIs to monitor progress:', bulletList(audit.kpis)].join('\n\n'),
  appendix: (audit, recommendations) =>
    [
      `Audit date: ${audit.auditDate}`,
      `Total findings: ${audit.findings.length}`,
      `Total recommendations: ${recommendations.length}`,
      `Report generated at runtime and editable section-by-section before publishing.`,
    ].join('\n'),
};

const nowIso = () => new Date().toISOString();

export class ReportService {
  generateFromAudit(auditId: string, auditData: SavedAuditData, recommendations: AuditRecommendation[]): FinalReport {
    const now = nowIso();

    const sections: ReportSection[] = SECTION_META.map((meta, idx) => ({
      key: meta.key,
      title: meta.title,
      order: idx + 1,
      generated: true,
      updatedAt: now,
      content: sectionContentBuilders[meta.key](auditData, recommendations),
    }));

    const report: FinalReport = {
      id: randomUUID(),
      auditId,
      generatedAt: now,
      updatedAt: now,
      sections,
    };

    reportsByAuditId.set(auditId, report);
    return report;
  }

  getReport(auditId: string): FinalReport | null {
    return reportsByAuditId.get(auditId) ?? null;
  }

  listSections(auditId: string): ReportSection[] {
    return this.getReport(auditId)?.sections ?? [];
  }

  upsertSection(auditId: string, sectionKey: ReportSectionKey, content: string): ReportSection | null {
    const report = this.getReport(auditId);
    if (!report) {
      return null;
    }

    const target = report.sections.find((section) => section.key === sectionKey);
    if (!target) {
      return null;
    }

    target.content = content;
    target.generated = false;
    target.updatedAt = nowIso();
    report.updatedAt = nowIso();

    return target;
  }

  resetSectionToGenerated(
    auditId: string,
    sectionKey: ReportSectionKey,
    auditData: SavedAuditData,
    recommendations: AuditRecommendation[],
  ): ReportSection | null {
    const report = this.getReport(auditId);
    if (!report) {
      return null;
    }

    const target = report.sections.find((section) => section.key === sectionKey);
    if (!target) {
      return null;
    }

    target.content = sectionContentBuilders[sectionKey](auditData, recommendations);
    target.generated = true;
    target.updatedAt = nowIso();
    report.updatedAt = nowIso();

    return target;
  }

  toPrintHtml(report: FinalReport): string {
    const body = report.sections
      .sort((a, b) => a.order - b.order)
      .map(
        (section) => `
        <section class="report-section">
          <h2>${section.title}</h2>
          <div>${section.content.replace(/\n/g, '<br/>')}</div>
        </section>`,
      )
      .join('\n');

    return `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Final Report</title>
          <style>
            body { font-family: 'Georgia', serif; color: #1e293b; line-height: 1.65; margin: 40px auto; max-width: 980px; }
            h1 { font-size: 32px; margin-bottom: 0; }
            .meta { color: #475569; margin-bottom: 32px; }
            .report-section { break-inside: avoid; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid #cbd5e1; }
            h2 { font-size: 22px; margin-bottom: 10px; color: #0f172a; }
          </style>
        </head>
        <body>
          <h1>Final Advisory Report</h1>
          <p class="meta">Audit ID: ${report.auditId} | Updated: ${report.updatedAt}</p>
          ${body}
        </body>
      </html>`;
  }
}

export const reportService = new ReportService();
