import DocsRootProvider from '@/components/docs-root-provider';

export default function Layout({ children }: LayoutProps<'/'>) {
  return <DocsRootProvider>{children}</DocsRootProvider>;
}
