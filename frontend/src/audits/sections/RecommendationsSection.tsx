import { Recommendation, PainPoint } from '../../types/audit';
import { FormField } from '../../components/form/FormField';
import { TextareaBlock } from '../../components/form/TextareaBlock';
import { EmptyState } from '../../components/states/EmptyState';
import { SectionScaffold } from './SectionScaffold';

interface RecommendationsSectionProps {
  recommendations: Recommendation[];
  painPoints: PainPoint[];
  onUpdate: (id: string, changes: Partial<Recommendation>) => void;
}

export function RecommendationsSection({ recommendations, painPoints, onUpdate }: RecommendationsSectionProps) {
  if (!recommendations.length) {
    return (
      <SectionScaffold title="AI Recommendations">
        <EmptyState title="No recommendations yet" description="Generate recommendations from the Pain Points section first." />
      </SectionScaffold>
    );
  }

  return (
    <SectionScaffold title="AI Recommendations">
      <div style={{ display: 'grid', gap: 16 }}>
        {recommendations.map((item) => {
          const sourcePain = painPoints.find((pain) => pain.id === item.painPointId);

          return (
            <article key={item.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
              <p style={{ marginTop: 0 }}>
                <strong>Source pain point:</strong> {sourcePain?.title ?? 'Unknown'}
              </p>
              <p>
                <strong>AI output:</strong> {item.aiOutput}
              </p>
              <FormField
                id={`rec-title-${item.id}`}
                label="Final title"
                value={item.finalTitle}
                onChange={(e) => onUpdate(item.id, { finalTitle: e.target.value, edited: true })}
              />
              <TextareaBlock
                id={`rec-desc-${item.id}`}
                label="Final description"
                value={item.finalDescription}
                onChange={(e) => onUpdate(item.id, { finalDescription: e.target.value, edited: true })}
              />
              <small style={{ color: item.edited ? '#1f6a39' : '#666' }}>{item.edited ? 'Edited by user' : 'Unedited suggestion'}</small>
            </article>
          );
        })}
      </div>
    </SectionScaffold>
  );
}
