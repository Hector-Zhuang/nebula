import { type FormEvent, type ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackagePlusIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/state/auth';
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

type CreateMiniAppDialogProps = {
  trigger?: ReactElement;
  compact?: boolean;
  onCreated?: () => Promise<void> | void;
};

export function CreateMiniAppDialog({
  trigger,
  compact = false,
  onCreated,
}: CreateMiniAppDialogProps) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    appId: '',
    name: '',
    description: '',
    iconUrl: '',
  });

  const onCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) {
      return;
    }

    try {
      setSubmitting(true);
      const miniApp = await api.createMiniApp(token, form);
      setForm({ appId: '', name: '', description: '', iconUrl: '' });
      setError('');
      setOpen(false);
      await onCreated?.();
      navigate(`/mini-apps/${miniApp.id}`);
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : String(nextError),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger || (
            <Button size={compact ? 'sm' : 'default'}>
              <PackagePlusIcon className="mr-2 size-4" />
              Add mini app
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add mini app</DialogTitle>
          <DialogDescription>
            Create a new mini app workspace and open it immediately in Nebula
            Console.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onCreate}>
          <DialogBody className="grid gap-3">
            <Input
              placeholder="appId, for example travel-mini-app"
              value={form.appId}
              onChange={event =>
                setForm(current => ({ ...current, appId: event.target.value }))
              }
            />
            <Input
              placeholder="Display name"
              value={form.name}
              onChange={event =>
                setForm(current => ({ ...current, name: event.target.value }))
              }
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={event =>
                setForm(current => ({
                  ...current,
                  description: event.target.value,
                }))
              }
            />
            <ImageUpload
              value={form.iconUrl}
              onChange={url => setForm(c => ({ ...c, iconUrl: url }))}
              label="Icon"
              placeholder="Upload icon"
            />
            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}
          </DialogBody>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Add mini app'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
