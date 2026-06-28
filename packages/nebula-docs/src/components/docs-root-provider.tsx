'use client';

import type { RootProviderProps } from 'fumadocs-ui/provider/next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import NebulaAlgoliaSearchDialog, {
  hasAlgoliaSearchConfig,
} from './algolia-search-dialog';

type DocsRootProviderProps = Pick<
  RootProviderProps,
  'children' | 'dir' | 'i18n'
>;

export default function DocsRootProvider({
  children,
  dir,
  i18n,
}: DocsRootProviderProps) {
  const search = hasAlgoliaSearchConfig()
    ? {
        SearchDialog: NebulaAlgoliaSearchDialog,
      }
    : undefined;

  return (
    <RootProvider dir={dir} i18n={i18n} search={search}>
      {children}
    </RootProvider>
  );
}
