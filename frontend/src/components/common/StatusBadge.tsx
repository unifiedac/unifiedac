import { AuditStatus } from '../../types/audit';

const badgeMap: Record<AuditStatus, { label: string; color: string; background: string }> = {
  draft: { label: 'Draft', color: '#666', background: '#f0f0f0' },
  in_progress: { label: 'In Progress', color: '#8a5a00', background: '#fff4cc' },
  completed: { label: 'Completed', color: '#116329', background: '#d8f6e0' },
};

export function StatusBadge({ status }: { status: AuditStatus }) {
  const badge = badgeMap[status];

  return (
    <span style={{ color: badge.color, background: badge.background, borderRadius: 999, padding: '4px 10px', fontSize: 12, fontWeight: 700 }}>
      {badge.label}
    </span>
  );
}
