import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField } from '../components/form/FormField';

export function NewAuditPage() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const createAudit = () => {
    navigate('/audits/a-1001');
  };

  return (
    <main style={{ maxWidth: 600, margin: '20px auto', padding: 20 }}>
      <h1>New Audit</h1>
      <FormField id="new-audit-name" label="Audit Name" value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={createAudit} disabled={!name.trim()}>
        Create and continue
      </button>
    </main>
  );
}
