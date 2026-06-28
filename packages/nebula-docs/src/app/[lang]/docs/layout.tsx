import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, i18nUI } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import type { ReactNode } from 'react';
import DocsRootProvider from '@/components/docs-root-provider';

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <DocsRootProvider dir={dir} i18n={i18nUI.provider(lang)}>
      <DocsLayout tree={source.getPageTree(lang)} {...baseOptions(lang)} i18n>
        {children}
      </DocsLayout>
    </DocsRootProvider>
  );
}
