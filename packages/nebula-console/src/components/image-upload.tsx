import { useRef, useState } from 'react';
import { Loader2Icon, UploadIcon, XIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/state/auth';
import { cn } from '@/lib/utils';

type ImageUploadProps = {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
};

const API_BASE_URL =
  (import.meta as ImportMeta & { env: { VITE_API_BASE_URL?: string } }).env
    .VITE_API_BASE_URL || 'http://localhost:3001/api';

function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:')
  ) {
    return url;
  }
  return `${API_BASE_URL.replace(/\/api$/, '')}${url}`;
}

export function ImageUpload({
  value,
  onChange,
  label,
  placeholder = 'Upload image',
  className,
}: ImageUploadProps) {
  const { token } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const previewUrl = resolveImageUrl(value);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    // Reset input value so the same file can be selected again
    e.target.value = '';

    try {
      setUploading(true);
      setError('');
      const result = await api.uploadImage(token, file);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className={cn('grid gap-1.5', className)}>
      {label ? (
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
      ) : null}

      <div className="relative flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            'group relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            previewUrl ? 'border-solid' : '',
          )}
        >
          {uploading ? (
            <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
          ) : previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="size-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <UploadIcon className="size-5" />
              <span className="text-[10px] leading-tight">{placeholder}</span>
            </div>
          )}
        </button>

        {previewUrl && !uploading ? (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm transition-opacity hover:opacity-80"
          >
            <XIcon className="size-3" />
          </button>
        ) : null}
      </div>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
