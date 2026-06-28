import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { api } from '@/lib/api';
import type { MiniApp } from '@/types';
import { useAuth } from '@/state/auth';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export type PlatformShellOutletContext = {
  miniApps: MiniApp[];
  reloadMiniApps: () => Promise<void>;
};

export function PlatformShell() {
  const { logout, token, user } = useAuth();
  const location = useLocation();
  const [miniApps, setMiniApps] = useState<MiniApp[]>([]);
  const [error, setError] = useState('');

  const reloadMiniApps = useCallback(async () => {
    if (!token) {
      return;
    }
    try {
      setMiniApps(await api.listMiniApps(token));
      setError('');
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : String(nextError),
      );
    }
  }, [token]);

  useEffect(() => {
    reloadMiniApps();
  }, [reloadMiniApps]);

  return (
    <SidebarProvider>
      <AppSidebar
        activePath={location.pathname}
        miniApps={miniApps}
        onLogout={logout}
        user={user}
        onMiniAppCreated={reloadMiniApps}
      />
      <SidebarInset className="min-h-svh bg-background">
        {error ? (
          <div className="mx-4 mt-4 rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive md:mx-6">
            {error}
          </div>
        ) : null}
        <Outlet
          context={
            { miniApps, reloadMiniApps } satisfies PlatformShellOutletContext
          }
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
