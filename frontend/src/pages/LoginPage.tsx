import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };

  const onLogin = () => {
    login();
    navigate(location.state?.from ?? '/dashboard', { replace: true });
  };

  return (
    <main style={{ maxWidth: 380, margin: '40px auto', display: 'grid', gap: 12 }}>
      <h1>Login</h1>
      <p>Authenticate to continue to the audit workspace.</p>
      <button onClick={onLogin}>Sign in</button>
    </main>
  );
}
