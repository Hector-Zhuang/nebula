import { type FormEvent, useCallback, useEffect, useState } from 'react';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/state/auth';
import type { AuditLog, User } from '@/types';
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

const STATUS_OPTIONS = ['ACTIVE', 'DISABLED'] as const;

type UserFormState = {
  email: string;
  displayName: string;
  password: string;
  status: string;
  notes: string;
  avatarUrl: string;
};

const INITIAL_FORM: UserFormState = {
  email: '',
  displayName: '',
  password: '',
  status: 'ACTIVE',
  notes: '',
  avatarUrl: '',
};

function toFormState(user?: User | null): UserFormState {
  if (!user) {
    return INITIAL_FORM;
  }

  return {
    email: user.email,
    displayName: user.displayName,
    password: '',
    status: user.status || 'ACTIVE',
    notes: user.notes || '',
    avatarUrl: user.avatarUrl || '',
  };
}

export function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [createForm, setCreateForm] = useState<UserFormState>(INITIAL_FORM);
  const [editForm, setEditForm] = useState<UserFormState>(INITIAL_FORM);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!token) {
      return;
    }
    try {
      const response = await api.listAdminUsers(token);
      setUsers(response.users);
      setAuditLogs(response.auditLogs);
      setError('');
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : String(nextError),
      );
    }
  }, [token]);

  useEffect(() => {
    const run = async () => {
      await load();
    };

    run();
  }, [load]);

  const createUser = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) {
      return;
    }
    try {
      await api.createAdminUser(token, {
        email: createForm.email,
        displayName: createForm.displayName,
        password: createForm.password,
        status: createForm.status,
        notes: createForm.notes,
      });
      setCreateForm(INITIAL_FORM);
      setCreateOpen(false);
      await load();
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : String(nextError),
      );
    }
  };

  const updateUser = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !editingUser) {
      return;
    }
    try {
      await api.updateAdminUser(token, editingUser.id, {
        email: editForm.email,
        displayName: editForm.displayName,
        password: editForm.password || undefined,
        status: editForm.status,
        notes: editForm.notes,
        avatarUrl: editForm.avatarUrl,
      });
      setEditOpen(false);
      setEditingUser(null);
      setEditForm(INITIAL_FORM);
      await load();
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : String(nextError),
      );
    }
  };

  const openEdit = (targetUser: User) => {
    setEditingUser(targetUser);
    setEditForm(toFormState(targetUser));
    setEditOpen(true);
  };

  const updateStatus = async (targetUser: User, status: string) => {
    if (!token) {
      return;
    }
    try {
      await api.updateAdminUser(token, targetUser.id, { status });
      await load();
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : String(nextError),
      );
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Members</h1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger
            render={
              <Button size="sm">
                <PlusIcon className="mr-2 size-4" />
                New member
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create member</DialogTitle>
              <DialogDescription>
                Add a new dashboard login account.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={createUser}>
              <DialogBody className="grid gap-3">
                <UserFormFields form={createForm} setForm={setCreateForm} />
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
                  onClick={() => setCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create member</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(currentUser => (
              <TableRow key={currentUser.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {currentUser.avatarUrl ? (
                      <img
                        src={
                          currentUser.avatarUrl.startsWith('http') ||
                          currentUser.avatarUrl.startsWith('data:')
                            ? currentUser.avatarUrl
                            : `http://localhost:3001${currentUser.avatarUrl}`
                        }
                        alt={currentUser.displayName}
                        className="size-8 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                        {currentUser.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-medium">
                        {currentUser.displayName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{currentUser.status || 'ACTIVE'}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {currentUser.notes || '—'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(currentUser)}
                    >
                      <PencilIcon className="mr-2 size-3.5" />
                      Edit
                    </Button>
                    {currentUser.status === 'DISABLED' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          await updateStatus(currentUser, 'ACTIVE');
                        }}
                      >
                        Enable
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          await updateStatus(currentUser, 'DISABLED');
                        }}
                      >
                        Disable
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {auditLogs.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            Audit trail
          </h2>
          <div className="space-y-1">
            {auditLogs.slice(0, 10).map(log => (
              <div key={log.id} className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">·</span>
                <span>{log.summary || log.action}</span>
                <span className="text-xs text-muted-foreground">
                  {log.actor.displayName} ·{' '}
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog
        open={editOpen}
        onOpenChange={open => {
          setEditOpen(open);
          if (!open) {
            setEditingUser(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit member</DialogTitle>
            <DialogDescription>
              Update dashboard access and metadata for this member.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={updateUser}>
            <DialogBody className="grid gap-3">
              <UserFormFields
                form={editForm}
                setForm={setEditForm}
                passwordOptional
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
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UserFormFields({
  form,
  setForm,
  passwordOptional = false,
}: {
  form: UserFormState;
  setForm: React.Dispatch<React.SetStateAction<UserFormState>>;
  passwordOptional?: boolean;
}) {
  return (
    <>
      <ImageUpload
        value={form.avatarUrl}
        onChange={url => setForm(c => ({ ...c, avatarUrl: url }))}
        label="Avatar"
        placeholder="Upload avatar"
      />
      <Input
        placeholder="Email"
        value={form.email}
        onChange={event =>
          setForm(current => ({ ...current, email: event.target.value }))
        }
      />
      <Input
        placeholder="Display name"
        value={form.displayName}
        onChange={event =>
          setForm(current => ({ ...current, displayName: event.target.value }))
        }
      />
      <Input
        placeholder={
          passwordOptional
            ? 'Password (leave blank to keep current)'
            : 'Password'
        }
        type="password"
        value={form.password}
        onChange={event =>
          setForm(current => ({ ...current, password: event.target.value }))
        }
      />
      <label className="grid gap-1 text-sm">
        <span>Status</span>
        <select
          className="rounded-lg border border-input bg-background px-3 py-2"
          value={form.status}
          onChange={event =>
            setForm(current => ({ ...current, status: event.target.value }))
          }
        >
          {STATUS_OPTIONS.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <Input
        placeholder="Notes"
        value={form.notes}
        onChange={event =>
          setForm(current => ({ ...current, notes: event.target.value }))
        }
      />
    </>
  );
}
