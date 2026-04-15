import { Link } from 'react-router-dom';

export function DashboardPage() {
  return (
    <main style={{ padding: 24, display: 'grid', gap: 12 }}>
      <h1>Dashboard</h1>
      <p>Welcome to the audit dashboard.</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link to="/audits/new">Create New Audit</Link>
        <Link to="/audits/a-1001">Open Sample Audit</Link>
      </div>
    </main>
  );
}
