import { useMemo, useState } from 'react';
import { FormField } from '../../components/form/FormField';
import { TextareaBlock } from '../../components/form/TextareaBlock';
import { EditableTable } from '../../components/form/EditableTable';
import { PainPoint } from '../../types/audit';
import { SectionScaffold } from './SectionScaffold';

interface PainPointsSectionProps {
  rows: PainPoint[];
  onAdd: (item: PainPoint) => void;
  onGenerateRecommendation: () => void;
}

const defaultForm = {
  title: '',
  department: '',
  impact: 3,
  frequency: 3,
  effortToFix: 3,
  notes: '',
};

export function PainPointsSection({ rows, onAdd, onGenerateRecommendation }: PainPointsSectionProps) {
  const [form, setForm] = useState(defaultForm);

  const score = useMemo(() => form.impact * form.frequency - form.effortToFix, [form.effortToFix, form.frequency, form.impact]);

  const submit = () => {
    if (!form.title.trim()) return;

    onAdd({
      id: crypto.randomUUID(),
      title: form.title,
      department: form.department,
      impact: Number(form.impact),
      frequency: Number(form.frequency),
      effortToFix: Number(form.effortToFix),
      notes: form.notes,
    });

    setForm(defaultForm);
  };

  return (
    <SectionScaffold title="Pain Points">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <FormField id="pain-title" label="Pain Point" placeholder="Ex: Manual invoice reconciliation" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
          <FormField id="pain-department" label="Department" placeholder="Ex: Finance" value={form.department} onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            <FormField id="pain-impact" label="Impact (1-5)" type="number" min={1} max={5} value={form.impact} onChange={(e) => setForm((prev) => ({ ...prev, impact: Number(e.target.value) }))} />
            <FormField id="pain-frequency" label="Frequency (1-5)" type="number" min={1} max={5} value={form.frequency} onChange={(e) => setForm((prev) => ({ ...prev, frequency: Number(e.target.value) }))} />
            <FormField id="pain-effort" label="Effort (1-5)" type="number" min={1} max={5} value={form.effortToFix} onChange={(e) => setForm((prev) => ({ ...prev, effortToFix: Number(e.target.value) }))} />
          </div>
          <TextareaBlock id="pain-notes" label="Notes" value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={submit}>Add pain point</button>
            <strong>Calculated score: {score}</strong>
            <button onClick={onGenerateRecommendation}>Generate recommendation</button>
          </div>
        </div>

        <EditableTable
          rows={rows}
          columns={[
            { key: 'title', title: 'Pain Point' },
            { key: 'department', title: 'Department' },
            { key: 'impact', title: 'Impact' },
            { key: 'frequency', title: 'Frequency' },
            { key: 'effortToFix', title: 'Effort' },
          ]}
          emptyText="No pain points captured yet."
        />
      </div>
    </SectionScaffold>
  );
}
