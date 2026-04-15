export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div style={{ border: '1px solid #f2b3b3', background: '#fff4f4', borderRadius: 8, padding: 16 }}>
      <p style={{ marginTop: 0, marginBottom: 12, color: '#892c2c' }}>{message}</p>
      {onRetry ? <button onClick={onRetry}>Retry</button> : null}
    </div>
  );
}
