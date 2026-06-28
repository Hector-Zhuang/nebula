import { Link, useOutletContext } from 'react-router-dom';
import { BoxesIcon, PlusIcon } from 'lucide-react';
import type { PlatformShellOutletContext } from '@/components/platform-shell';
import { Button } from '@/components/ui/button';
import { CreateMiniAppDialog } from '@/components/create-miniapp-dialog';

export function DashboardPage() {
  const { miniApps, reloadMiniApps } =
    useOutletContext<PlatformShellOutletContext>();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {miniApps.length} {miniApps.length === 1 ? 'mini app' : 'mini apps'}
        </p>
        <CreateMiniAppDialog
          onCreated={reloadMiniApps}
          trigger={
            <Button size="sm">
              <PlusIcon className="mr-2 size-4" />
              Create
            </Button>
          }
        />
      </div>

      {miniApps.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {miniApps.map(miniApp => (
            <Link
              to={`/mini-apps/${miniApp.id}`}
              className="group rounded-xl border bg-card p-5 transition hover:border-primary/50"
              key={miniApp.id}
            >
              <div className="flex items-start gap-3">
                {miniApp.thumbnailUrl ? (
                  <img
                    src={miniApp.thumbnailUrl}
                    alt={`${miniApp.name} thumbnail`}
                    className="size-10 rounded-lg border object-cover"
                  />
                ) : (
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <BoxesIcon className="size-4 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{miniApp.name}</div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">
                    {miniApp.appId}
                  </div>
                </div>
              </div>
              {miniApp.description ? (
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                  {miniApp.description}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
          No mini apps yet. Click "Create" to add one.
        </div>
      )}
    </div>
  );
}
