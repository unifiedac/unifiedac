export function LoadingState({ text = 'Loading…' }: { text?: string }) {
  return <div style={{ padding: 16, color: '#555' }}>{text}</div>;
}
