import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, i18nUI } from '@/lib/layout.shared';
import DocsRootProvider from '@/components/docs-root-provider';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsRootProvider i18n={i18nUI.provider('en')}>
      <DocsLayout tree={source.getPageTree()} {...baseOptions('en')} i18n>
        {children}
      </DocsLayout>
    </DocsRootProvider>
  );
}
