import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthGate } from './components/AuthGate';
import LoginPage from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MiniAppDetailPage } from './pages/MiniAppDetailPage';
import { CliAuthPage } from './pages/CliAuthPage';
import { PlatformShell } from './components/platform-shell';
import { UsersPage } from './pages/UsersPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cli-auth/:code" element={<CliAuthPage />} />
      <Route
        path="/forgot-password"
        element={
          <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
              <ForgotPasswordPage />
            </div>
          </div>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
              <ResetPasswordPage />
            </div>
          </div>
        }
      />
      <Route
        element={
          <AuthGate>
            <PlatformShell />
          </AuthGate>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/mini-apps/:miniAppId" element={<MiniAppDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
