import type { ReactNode } from 'react';
import { Callout } from 'fumadocs-ui/components/callout';

type InfoProps = {
  children: ReactNode;
  title?: ReactNode;
};

export function Info({ children, title = 'Info' }: InfoProps) {
  return (
    <Callout type="info" title={title}>
      {children}
    </Callout>
  );
}
