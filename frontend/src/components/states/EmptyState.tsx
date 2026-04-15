export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div style={{ border: '1px dashed #bbb', borderRadius: 8, padding: 16 }}>
      <h4 style={{ marginTop: 0 }}>{title}</h4>
      <p style={{ marginBottom: 0, color: '#666' }}>{description}</p>
    </div>
  );
}
