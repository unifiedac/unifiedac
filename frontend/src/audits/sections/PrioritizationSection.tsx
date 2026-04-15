import { useMemo, useState } from 'react';
import { EditableTable } from '../../components/form/EditableTable';
import { PrioritizationItem } from '../../types/audit';
import { SectionScaffold } from './SectionScaffold';

interface PrioritizationSectionProps {
  items: PrioritizationItem[];
}

export function PrioritizationSection({ items }: PrioritizationSectionProps) {
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [quickWinsOnly, setQuickWinsOnly] = useState(false);

  const departments = useMemo(() => [...new Set(items.map((item) => item.department))], [items]);

  const filtered = useMemo(
    () =>
      items
        .filter((item) => (departmentFilter === 'all' ? true : item.department === departmentFilter))
        .filter((item) => (quickWinsOnly ? item.isQuickWin : true))
        .sort((a, b) => b.totalScore - a.totalScore),
    [departmentFilter, items, quickWinsOnly],
  );

  return (
    <SectionScaffold title="Scoring & Prioritization">
      <div style={{ display: 'flex', gap: 12 }}>
        <label>
          Department{' '}
          <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
            <option value="all">All</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </label>
        <label>
          <input type="checkbox" checked={quickWinsOnly} onChange={(e) => setQuickWinsOnly(e.target.checked)} /> Show quick wins only
        </label>
      </div>

      <EditableTable
        rows={filtered.map((item, index) => ({ ...item, rank: index + 1 }))}
        columns={[
          { key: 'rank', title: 'Rank' } as never,
          { key: 'name', title: 'Initiative' },
          { key: 'department', title: 'Department' },
          { key: 'impactScore', title: 'Impact' },
          { key: 'effortScore', title: 'Effort' },
          { key: 'totalScore', title: 'Total Score' },
          {
            key: 'isQuickWin',
            title: 'Quick Win',
            render: (row) => (row.isQuickWin ? <span style={{ background: '#e5f7ea', color: '#1f6a39', borderRadius: 999, padding: '3px 8px', fontSize: 12 }}>Quick Win</span> : '—'),
          },
        ]}
        emptyText="No prioritization items available yet."
      />
    </SectionScaffold>
  );
}
