import { type FormEvent, type ReactNode, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  BoxesIcon,
  CheckCircle2Icon,
  CircleAlertIcon,
  EyeIcon,
  FileTextIcon,
  HistoryIcon,
  LayersIcon,
  MinusCircleIcon,
  PackageIcon,
  PencilIcon,
  QrCodeIcon,
  RefreshCcwIcon,
  RocketIcon,
  Trash2Icon,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/state/auth';
import type { MiniApp, MiniAppVersion } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ImageUpload } from '@/components/image-upload';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type StatusTone = {
  label: string;
  className: string;
  dotClassName: string;
};

const STATUS_TONES: Record<string, StatusTone> = {
  PUBLISHED: {
    label: 'Published',
    className:
      'bg-emerald-500/10 text-emerald-700 ring-emerald-500/25 dark:text-emerald-400',
    dotClassName: 'bg-emerald-500',
  },
  DRAFT: {
    label: 'Draft',
    className:
      'bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-400',
    dotClassName: 'bg-amber-500',
  },
  ARCHIVED: {
    label: 'Archived',
    className:
      'bg-muted text-muted-foreground ring-border',
    dotClassName: 'bg-muted-foreground/60',
  },
};

const DEFAULT_STATUS_TONE: StatusTone = {
  label: 'Unknown',
  className: 'bg-muted text-muted-foreground ring-border',
  dotClassName: 'bg-muted-foreground/60',
};

function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const tone = STATUS_TONES[status.toUpperCase()] ?? {
    ...DEFAULT_STATUS_TONE,
    label: status,
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        tone.className,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', tone.dotClassName)} />
      {tone.label}
    </span>
  );
}

function BundleStatus({ uploaded }: { uploaded: boolean }) {
  if (uploaded) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-500/25 dark:text-emerald-400">
        <CheckCircle2Icon className="size-3" />
        Uploaded
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border">
      <MinusCircleIcon className="size-3" />
      Missing
    </span>
  );
}

function DetailMetaItem({
  label,
  mono = false,
  children,
}: {
  label: string;
  mono?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="bg-card p-3.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          'mt-1 text-sm font-medium',
          mono && 'break-all font-mono text-[13px] font-normal',
        )}
      >
        {children}
      </dd>
    </div>
  );
}

export function MiniAppDetailPage() {
  const { token } = useAuth();
  const { miniAppId = '' } = useParams();
  const [miniApp, setMiniApp] = useState<MiniApp | null>(null);
  const [error, setError] = useState('');
  const [savingMeta, setSavingMeta] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [popupVersion, setPopupVersion] = useState<MiniAppVersion | null>(null);
  const [qrVersion, setQrVersion] = useState<MiniAppVersion | null>(null);
  const [metaForm, setMetaForm] = useState({
    name: '',
    description: '',
    iconUrl: '',
  });

  const loadWorkspace = useCallback(async () => {
    if (!token || !miniAppId) {
      return;
    }
    try {
      const workspace = await api.getMiniAppWorkspace(token, miniAppId);
      setMiniApp(workspace);
      setMetaForm({
        name: workspace.name,
        description: workspace.description || '',
        iconUrl: workspace.iconUrl || '',
      });
      setError('');
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : String(nextError),
      );
    }
  }, [token, miniAppId]);

  useEffect(() => {
    const run = async () => {
      await loadWorkspace();
    };
    run();
  }, [loadWorkspace]);

  const updateVersionAction = async (action: () => Promise<unknown>) => {
    try {
      await action();
      await loadWorkspace();
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : String(nextError),
      );
    }
  };

  const handleRollback = async (version: MiniAppVersion) => {
    await updateVersionAction(() =>
      api.rollbackVersion(
        token!,
        miniApp!.id,
        version.id,
        `Rollback to ${version.version}`,
      ),
    );
  };

  const handleDeleteVersion = async (version: MiniAppVersion) => {
    await updateVersionAction(() =>
      api.deleteVersion(token!, miniApp!.id, version.id),
    );
  };

  const handlePublishRelease = async (version: MiniAppVersion) => {
    await updateVersionAction(() =>
      api.publishVersion(
        token!,
        miniApp!.id,
        version.id,
        'Published from console',
      ),
    );
  };

  const onSaveMeta = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !miniApp) {
      return;
    }
    try {
      setSavingMeta(true);
      await api.updateMiniApp(token, miniApp.id, metaForm);
      setDetailsOpen(false);
      await loadWorkspace();
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : String(nextError),
      );
    } finally {
      setSavingMeta(false);
    }
  };

  if (!miniApp) {
    if (error) {
      return (
        <div className="p-6">
          <div className="flex items-start gap-3 rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <CircleAlertIcon className="mt-0.5 size-4 shrink-0" />
            <div className="space-y-3">
              <p>{error}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => void loadWorkspace()}
              >
                <RefreshCcwIcon className="size-3.5" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 p-6">
        <div className="flex items-start gap-4 rounded-xl border bg-card p-6 shadow-sm">
          <Skeleton className="size-16 shrink-0 rounded-2xl" />
          <div className="flex-1 space-y-2.5 pt-1">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3.5 w-96 max-w-full" />
          </div>
        </div>
        <div className="space-y-3 rounded-xl border bg-card p-5 shadow-sm">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const allVersions = miniApp.versions || [];
  const rollbackTargets = allVersions.filter(
    v => v.status === 'PUBLISHED' && v.id !== miniApp.currentReleaseVersion?.id,
  );

  const releaseQrUrl = miniApp.accessCodes?.release?.openUrl;
  const releaseQrImage = releaseQrUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=${encodeURIComponent(releaseQrUrl)}`
    : null;

  const stats = [
    {
      label: 'Current release',
      value: miniApp.currentReleaseVersion?.version ?? 'Not published',
      icon: RocketIcon,
    },
    {
      label: 'Versions',
      value: String(allVersions.length),
      icon: LayersIcon,
    },
    {
      label: 'Created',
      value: formatDateTime(miniApp.createdAt),
      icon: HistoryIcon,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            {miniApp.thumbnailUrl ? (
              <img
                src={miniApp.thumbnailUrl}
                alt={`${miniApp.name} thumbnail`}
                className="size-16 shrink-0 rounded-2xl border object-cover"
              />
            ) : (
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border bg-muted">
                <BoxesIcon className="size-7 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {miniApp.name}
                </h1>
                {miniApp.currentReleaseVersion ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-500/25 dark:text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Current · {miniApp.currentReleaseVersion.version}
                  </span>
                ) : null}
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                {miniApp.appId}
              </p>
              {miniApp.description ? (
                <p className="max-w-2xl pt-0.5 text-sm text-muted-foreground">
                  {miniApp.description}
                </p>
              ) : null}
            </div>
          </div>

          <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
            <DialogTrigger
              render={
                <Button variant="outline" size="sm">
                  <PencilIcon className="mr-2 size-4" />
                  Edit
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Mini app details</DialogTitle>
                <DialogDescription>
                  Edit the display name, description, and icon metadata.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={onSaveMeta}>
                <DialogBody className="grid gap-4">
                  <div className="grid gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Mini app ID
                    </label>
                    <Input value={miniApp.appId} readOnly disabled />
                  </div>
                  <div className="grid gap-1.5">
                    <label
                      htmlFor="miniapp-name"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Name
                    </label>
                    <Input
                      id="miniapp-name"
                      placeholder="Display name"
                      value={metaForm.name}
                      onChange={event =>
                        setMetaForm(c => ({ ...c, name: event.target.value }))
                      }
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label
                      htmlFor="miniapp-description"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Description
                    </label>
                    <Input
                      id="miniapp-description"
                      placeholder="Description"
                      value={metaForm.description}
                      onChange={event =>
                        setMetaForm(c => ({
                          ...c,
                          description: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <ImageUpload
                    value={metaForm.iconUrl}
                    onChange={url =>
                      setMetaForm(c => ({ ...c, iconUrl: url }))
                    }
                    label="Icon"
                    placeholder="Upload icon"
                  />
                  {error ? (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {error}
                    </div>
                  ) : null}
                </DialogBody>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDetailsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={savingMeta}>
                    {savingMeta ? 'Saving...' : 'Save'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <stat.icon className="size-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">{stat.label}</div>
              <div className="mt-0.5 truncate text-sm font-semibold">
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Release QR */}
      {releaseQrImage ? (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <QrCodeIcon className="size-4" />
              Production access
            </div>
            <StatusBadge status="PUBLISHED" />
          </div>
          <div className="mt-4 flex items-center gap-5">
            <img
              src={releaseQrImage}
              alt="Production QR"
              className="size-28 shrink-0 rounded-xl border bg-white p-2.5 shadow-sm"
            />
            <div className="min-w-0 space-y-1.5">
              <div className="text-sm font-semibold">
                Version {miniApp.currentReleaseVersion?.version ?? '—'}
              </div>
              <p
                className="truncate font-mono text-xs text-muted-foreground"
                title={releaseQrUrl ?? undefined}
              >
                {releaseQrUrl}
              </p>
              <p className="text-xs text-muted-foreground">
                Scan the code to open the published mini app on a device.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Rollback section */}
      {rollbackTargets.length ? (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <RefreshCcwIcon className="size-4" />
            Rollback to a previous version
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Re-publish one of the previously published builds as the current
            release.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {rollbackTargets.map(target => (
              <Button
                key={target.id}
                size="sm"
                variant="outline"
                onClick={() => handleRollback(target)}
              >
                <RefreshCcwIcon className="mr-2 size-3.5" />
                {target.version}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <CircleAlertIcon className="mt-0.5 size-4 shrink-0" />
          {error}
        </div>
      ) : null}

      {/* Versions */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold">Versions</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {allVersions.length}{' '}
              {allVersions.length === 1 ? 'version' : 'versions'} in total
            </p>
          </div>
        </div>

        {allVersions.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created by</TableHead>
                <TableHead>Created at</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allVersions.map(version => {
                const isCurrent =
                  version.id === miniApp.currentReleaseVersion?.id;

                return (
                  <TableRow
                    key={version.id}
                    className={cn(
                      'hover:bg-muted/40',
                      isCurrent && 'bg-emerald-500/5',
                    )}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{version.version}</span>
                        {isCurrent ? (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-500/25 dark:text-emerald-400">
                            Current
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={version.status} />
                    </TableCell>
                    <TableCell className="text-sm">
                      {version.createdBy.displayName}
                    </TableCell>
                    <TableCell className="text-sm tabular-nums text-muted-foreground">
                      {formatDateTime(version.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {version.accessCode ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setQrVersion(version)}
                          >
                            <QrCodeIcon className="mr-1.5 size-3.5" />
                            QR
                          </Button>
                        ) : null}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPopupVersion(version)}
                        >
                          <EyeIcon className="mr-1.5 size-3.5" />
                          Details
                        </Button>
                        {version.status === 'DRAFT' ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handlePublishRelease(version)}
                            >
                              <RocketIcon className="mr-1.5 size-3.5" />
                              Publish
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteVersion(version)}
                            >
                              <Trash2Icon className="mr-1.5 size-3.5" />
                              Delete
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <PackageIcon className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No versions yet</p>
            <p className="text-xs text-muted-foreground">
              Upload a build with the CLI to see it listed here.
            </p>
          </div>
        )}
      </div>

      {/* Version detail popup */}
      <Dialog
        open={!!popupVersion}
        onOpenChange={open => {
          if (!open) setPopupVersion(null);
        }}
      >
        {popupVersion ? (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Version {popupVersion.version}</DialogTitle>
              <DialogDescription>
                Build details and platform bundles
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="space-y-5">
              <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2">
                <DetailMetaItem label="Status">
                  <StatusBadge status={popupVersion.status} />
                </DetailMetaItem>
                <DetailMetaItem label="Created by">
                  {popupVersion.createdBy.displayName}
                </DetailMetaItem>
                <DetailMetaItem label="Created at">
                  <span className="tabular-nums">
                    {formatDateTime(popupVersion.createdAt)}
                  </span>
                </DetailMetaItem>
                <DetailMetaItem label="Entry page" mono>
                  {popupVersion.entryPagePath || '—'}
                </DetailMetaItem>
                {popupVersion.publishedAt ? (
                  <DetailMetaItem label="Published at">
                    <span className="tabular-nums">
                      {formatDateTime(popupVersion.publishedAt)}
                    </span>
                  </DetailMetaItem>
                ) : null}
              </dl>

              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <PackageIcon className="size-4 text-muted-foreground" />
                  Bundles
                </div>
                <div className="overflow-hidden rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Platform</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Size</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">iOS</TableCell>
                        <TableCell>
                          <BundleStatus uploaded={!!popupVersion.bundles?.ios} />
                        </TableCell>
                        <TableCell className="tabular-nums text-muted-foreground">
                          {formatBundleSize(popupVersion.bundleSizes?.ios)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Android</TableCell>
                        <TableCell>
                          <BundleStatus
                            uploaded={!!popupVersion.bundles?.android}
                          />
                        </TableCell>
                        <TableCell className="tabular-nums text-muted-foreground">
                          {formatBundleSize(popupVersion.bundleSizes?.android)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {popupVersion.changelog ? (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <FileTextIcon className="size-4 text-muted-foreground" />
                    Changelog
                  </div>
                  <p className="whitespace-pre-wrap rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
                    {popupVersion.changelog}
                  </p>
                </div>
              ) : null}
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPopupVersion(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        ) : null}
      </Dialog>

      {/* Draft QR popup */}
      <Dialog
        open={!!qrVersion}
        onOpenChange={open => {
          if (!open) setQrVersion(null);
        }}
      >
        {qrVersion?.accessCode ? (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Version {qrVersion.version} QR</DialogTitle>
              <DialogDescription>
                Scan this code to install the draft version on a device.
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="flex flex-col items-center gap-4">
              <img
                src={qrVersion.accessCode.qrCodeDataUrl}
                alt={`Version ${qrVersion.version} QR`}
                className="size-48 rounded-xl border bg-white p-2.5 shadow-sm"
              />
              <div className="w-full rounded-lg border bg-muted/40 p-2.5">
                <div className="text-xs text-muted-foreground">Open URL</div>
                <p className="mt-0.5 break-all font-mono text-xs">
                  {qrVersion.accessCode.openUrl}
                </p>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setQrVersion(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  );
}

function formatDateTime(value?: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

function formatBundleSize(value?: number) {
  if (!value || value <= 0) return '—';
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(2)} MB`;
}
