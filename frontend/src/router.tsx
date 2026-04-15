import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthGuard } from './auth/AuthGuard';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { NewAuditPage } from './pages/NewAuditPage';
import { AuditDetailPage } from './pages/AuditDetailPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <AuthGuard />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/audits/new', element: <NewAuditPage /> },
      { path: '/audits/:id', element: <AuditDetailPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
