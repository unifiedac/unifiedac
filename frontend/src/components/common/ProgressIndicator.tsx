export function ProgressIndicator({ percent }: { percent: number }) {
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
        <span>Audit Completion</span>
        <strong>{percent}%</strong>
      </div>
      <div style={{ height: 10, borderRadius: 999, background: '#eceff7' }}>
        <div
          style={{
            width: `${Math.max(0, Math.min(100, percent))}%`,
            height: '100%',
            borderRadius: 999,
            background: 'linear-gradient(90deg, #4f7cff, #41c8ff)',
            transition: 'width 220ms ease',
          }}
        />
      </div>
    </div>
  );
}
