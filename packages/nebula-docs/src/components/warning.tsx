import type { ReactNode } from 'react';
import { Callout } from 'fumadocs-ui/components/callout';

type WarningProps = {
  children: ReactNode;
  title?: ReactNode;
};

export function Warning({ children, title = 'Warning' }: WarningProps) {
  return (
    <Callout type="warn" title={title}>
      {children}
    </Callout>
  );
}
