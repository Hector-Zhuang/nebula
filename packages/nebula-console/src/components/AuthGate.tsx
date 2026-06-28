import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../state/auth';

export function AuthGate({ children }: { children: ReactNode }) {
  const { isReady, token } = useAuth();
  if (!isReady) {
    return <div className="center-panel">Loading platform...</div>;
  }
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
