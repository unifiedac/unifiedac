import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlaceholderSection } from '../audits/sections/PlaceholderSection';
import { PainPointsSection } from '../audits/sections/PainPointsSection';
import { RecommendationsSection } from '../audits/sections/RecommendationsSection';
import { PrioritizationSection } from '../audits/sections/PrioritizationSection';
import { ProgressIndicator } from '../components/common/ProgressIndicator';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingState } from '../components/states/LoadingState';
import { ErrorState } from '../components/states/ErrorState';
import { Audit, Recommendation } from '../types/audit';

type TabId =
  | 'executive-intake'
  | 'technology-stack'
  | 'departments'
  | 'workflows'
  | 'pain-points'
  | 'data-readiness'
  | 'scoring-prioritization'
  | 'ai-recommendations'
  | 'risks-governance'
  | 'final-report';

const tabs: { id: TabId; label: string }[] = [
  { id: 'executive-intake', label: 'Executive Intake' },
  { id: 'technology-stack', label: 'Technology Stack' },
  { id: 'departments', label: 'Departments' },
  { id: 'workflows', label: 'Workflows' },
  { id: 'pain-points', label: 'Pain Points' },
  { id: 'data-readiness', label: 'Data Readiness' },
  { id: 'scoring-prioritization', label: 'Scoring & Prioritization' },
  { id: 'ai-recommendations', label: 'AI Recommendations' },
  { id: 'risks-governance', label: 'Risks & Governance' },
  { id: 'final-report', label: 'Final Report' },
];

const initialAudit: Audit = {
  id: 'a-1001',
  name: 'Q2 Operations Audit',
  status: 'in_progress',
  completionPercent: 35,
  painPoints: [],
  recommendations: [],
  prioritizationItems: [
    {
      id: 'p-1',
      name: 'Automate invoice validation',
      impactScore: 5,
      effortScore: 2,
      totalScore: 8,
      department: 'Finance',
      isQuickWin: true,
    },
    {
      id: 'p-2',
      name: 'Unified ticket routing rules',
      impactScore: 4,
      effortScore: 3,
      totalScore: 6,
      department: 'Support',
      isQuickWin: false,
    },
  ],
};

export function AuditDetailPage() {
  const { id } = useParams();
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('executive-intake');
  const [audit, setAudit] = useState(initialAudit);

  const completionPercent = useMemo(() => {
    const completedTabCount = tabs.findIndex((tab) => tab.id === activeTab) + 1;
    return Math.max(audit.completionPercent, Math.round((completedTabCount / tabs.length) * 100));
  }, [activeTab, audit.completionPercent]);

  const addPainPoint = (painPoint: Audit['painPoints'][number]) => {
    setAudit((prev) => ({ ...prev, painPoints: [...prev.painPoints, painPoint] }));
  };

  const generateRecommendations = () => {
    setAudit((prev) => {
      const newRecommendations: Recommendation[] = prev.painPoints.map((pain) => ({
        id: `rec-${pain.id}`,
        painPointId: pain.id,
        aiOutput: `Suggested automation pathway for ${pain.title.toLowerCase()} in ${pain.department}.`,
        finalTitle: `Resolve ${pain.title}`,
        finalDescription: `Implement phased automation for ${pain.title.toLowerCase()} with stakeholders from ${pain.department}.`,
        edited: false,
      }));

      return { ...prev, recommendations: newRecommendations };
    });
  };

  const updateRecommendation = (id: string, changes: Partial<Recommendation>) => {
    setAudit((prev) => ({
      ...prev,
      recommendations: prev.recommendations.map((rec) => (rec.id === id ? { ...rec, ...changes } : rec)),
    }));
  };

  if (loading) return <LoadingState text="Loading audit details..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  return (
    <main style={{ padding: 24, display: 'grid', gap: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ marginBottom: 6 }}>Audit #{id ?? audit.id}</h1>
          <p style={{ marginTop: 0 }}>{audit.name}</p>
        </div>
        <StatusBadge status={audit.status} />
      </header>

      <ProgressIndicator percent={completionPercent} />

      <nav style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              border: activeTab === tab.id ? '2px solid #5b82f5' : '1px solid #ddd',
              background: activeTab === tab.id ? '#eef3ff' : 'white',
              borderRadius: 999,
              padding: '6px 12px',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'executive-intake' && <PlaceholderSection title="Executive Intake" />}
      {activeTab === 'technology-stack' && <PlaceholderSection title="Technology Stack" />}
      {activeTab === 'departments' && <PlaceholderSection title="Departments" />}
      {activeTab === 'workflows' && <PlaceholderSection title="Workflows" />}
      {activeTab === 'pain-points' && <PainPointsSection rows={audit.painPoints} onAdd={addPainPoint} onGenerateRecommendation={generateRecommendations} />}
      {activeTab === 'data-readiness' && <PlaceholderSection title="Data Readiness" />}
      {activeTab === 'scoring-prioritization' && <PrioritizationSection items={audit.prioritizationItems} />}
      {activeTab === 'ai-recommendations' && (
        <RecommendationsSection recommendations={audit.recommendations} painPoints={audit.painPoints} onUpdate={updateRecommendation} />
      )}
      {activeTab === 'risks-governance' && <PlaceholderSection title="Risks & Governance" />}
      {activeTab === 'final-report' && <PlaceholderSection title="Final Report" />}
    </main>
  );
}
