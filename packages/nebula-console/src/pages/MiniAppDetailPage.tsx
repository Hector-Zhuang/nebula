import { type FormEvent, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  PencilIcon,
  QrCodeIcon,
  RefreshCcwIcon,
  RocketIcon,
  EyeIcon,
  Trash2Icon,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/state/auth';
import type { MiniApp, MiniAppVersion } from '@/types';
import { Button } from '@/components/ui/button';
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
    return (
      <div className="p-6">
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error || 'Loading workspace...'}
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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {miniApp.thumbnailUrl ? (
            <img
              src={miniApp.thumbnailUrl}
              alt={`${miniApp.name} thumbnail`}
              className="size-16 rounded-xl border object-cover"
            />
          ) : null}
          <div>
            <h1 className="text-xl font-semibold">{miniApp.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {miniApp.appId}
            </p>
            {miniApp.description ? (
              <p className="mt-2 max-w-lg text-sm text-muted-foreground">
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
              <DialogBody className="grid gap-3">
                <div className="grid gap-1.5">
                  <div className="text-xs font-medium text-muted-foreground">
                    Mini app ID
                  </div>
                  <Input value={miniApp.appId} readOnly disabled />
                </div>
                <Input
                  placeholder="Display name"
                  value={metaForm.name}
                  onChange={event =>
                    setMetaForm(c => ({ ...c, name: event.target.value }))
                  }
                />
                <Input
                  placeholder="Description"
                  value={metaForm.description}
                  onChange={event =>
                    setMetaForm(c => ({
                      ...c,
                      description: event.target.value,
                    }))
                  }
                />
                <ImageUpload
                  value={metaForm.iconUrl}
                  onChange={url => setMetaForm(c => ({ ...c, iconUrl: url }))}
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

      {/* Release QR */}
      {releaseQrImage ? (
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-medium">
            <QrCodeIcon className="size-4" />
            Production QR
          </div>
          <div className="mt-4 flex items-center gap-5">
            <img
              src={releaseQrImage}
              alt="Production QR"
              className="size-32 rounded-lg border bg-white p-2"
            />
            <div className="space-y-1">
              <div className="text-sm font-medium">
                {miniApp.currentReleaseVersion?.version}
              </div>
              <div className="font-mono text-xs text-muted-foreground">
                {releaseQrUrl}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Rollback section */}
      {rollbackTargets.length ? (
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <RefreshCcwIcon className="size-4" />
            Rollback to previous version
          </div>
          <div className="flex flex-wrap gap-2">
            {rollbackTargets.map(target => (
              <Button
                key={target.id}
                size="sm"
                variant="outline"
                onClick={() => handleRollback(target)}
              >
                <RefreshCcwIcon className="mr-2 size-4" />
                {target.version}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {/* Versions table */}
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created by</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead className="w-[280px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allVersions.length ? (
              allVersions.map(version => (
                <TableRow key={version.id} className="hover:bg-muted/40">
                  <TableCell className="font-semibold">
                    {version.version}
                  </TableCell>
                  <TableCell>{version.status}</TableCell>
                  <TableCell>{version.createdBy.displayName}</TableCell>
                  <TableCell>{formatDateTime(version.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {version.accessCode ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setQrVersion(version)}
                        >
                          <QrCodeIcon className="mr-2 size-4" />
                          QR
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPopupVersion(version)}
                      >
                        <EyeIcon className="mr-2 size-4" />
                        Details
                      </Button>
                      {version.status === 'DRAFT' ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handlePublishRelease(version)}
                          >
                            <RocketIcon className="mr-2 size-4" />
                            Publish
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteVersion(version)}
                          >
                            <Trash2Icon className="mr-2 size-4" />
                            Delete
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No versions yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
            <DialogBody className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="mt-1 text-sm font-medium">
                    {popupVersion.status}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Created by
                  </div>
                  <div className="mt-1 text-sm font-medium">
                    {popupVersion.createdBy.displayName}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Created at
                  </div>
                  <div className="mt-1 text-sm font-medium">
                    {formatDateTime(popupVersion.createdAt)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Entry page
                  </div>
                  <div className="mt-1 text-sm font-mono">
                    {popupVersion.entryPagePath || '—'}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium">Bundles</div>
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
                          {popupVersion.bundles?.ios ? (
                            <span className="text-green-600">Uploaded</span>
                          ) : (
                            <span className="text-muted-foreground">
                              Missing
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatBundleSize(popupVersion.bundleSizes?.ios)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Android</TableCell>
                        <TableCell>
                          {popupVersion.bundles?.android ? (
                            <span className="text-green-600">Uploaded</span>
                          ) : (
                            <span className="text-muted-foreground">
                              Missing
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatBundleSize(popupVersion.bundleSizes?.android)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
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
                className="size-48 rounded-lg border bg-white p-2"
              />
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
