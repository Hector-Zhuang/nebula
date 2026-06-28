import * as React from 'react';

import { cn } from '@/lib/utils';

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-group"
      className={cn('grid gap-3', className)}
      {...props}
    />
  );
}

function Field({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field"
      className={cn('grid gap-1.5', className)}
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      data-slot="field-label"
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="field-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

function FieldSeparator({
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & { children?: React.ReactNode }) {
  return (
    <div
      data-slot="field-separator"
      className={cn('relative flex items-center py-2', className)}
      {...props}
    >
      <div className="border-border flex-1 border-t" />
      {children && (
        <span
          data-slot="field-separator-content"
          className="text-muted-foreground px-3 text-sm"
        >
          {children}
        </span>
      )}
      <div className="border-border flex-1 border-t" />
    </div>
  );
}

export { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator };
