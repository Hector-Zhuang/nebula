import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function TabsList({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'inline-flex w-full flex-wrap gap-2 rounded-2xl border border-border/70 bg-background/85 p-2',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition',
        active
          ? 'bg-foreground text-background shadow-sm'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}
