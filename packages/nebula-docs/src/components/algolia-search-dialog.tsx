'use client';

import AlgoliaSearchDialog from 'fumadocs-ui/components/dialog/search-algolia';
import type { SharedProps } from 'fumadocs-ui/contexts/search';
import { liteClient } from 'algoliasearch/lite';

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;
const indexName =
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ??
  process.env.NEXT_PUBLIC_ALGOLIA_DOCS_INDEX_NAME;

const client = appId && apiKey ? liteClient(appId, apiKey) : null;

export function hasAlgoliaSearchConfig() {
  return Boolean(client && indexName);
}

export default function NebulaAlgoliaSearchDialog(props: SharedProps) {
  if (!client || !indexName) {
    return null;
  }

  return (
    <AlgoliaSearchDialog
      {...props}
      searchOptions={{
        client,
        indexName,
      }}
    />
  );
}
