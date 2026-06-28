import { source } from '@/lib/source';
import type { DocumentRecord } from 'fumadocs-core/search/algolia';
import { structure } from 'fumadocs-core/mdx-plugins';

type SourcePage = ReturnType<typeof source.getPages>[number];

type PageWithStructuredData = SourcePage & {
  data: ReturnType<typeof source.getPages>[number]['data'] & {
    structuredData: DocumentRecord['structured'];
    load?: () => Promise<{
      structuredData?: DocumentRecord['structured'];
    }>;
    getText?: (kind: 'processed') => Promise<string>;
  };
};

function isStructuredData(
  value: unknown,
): value is DocumentRecord['structured'] & {
  headings: unknown[];
  contents: unknown[];
} {
  return Boolean(
    value &&
    typeof value === 'object' &&
    'headings' in value &&
    'contents' in value &&
    Array.isArray((value as { headings?: unknown[] }).headings) &&
    Array.isArray((value as { contents?: unknown[] }).contents),
  );
}

export async function exportSearchIndexes() {
  const results: DocumentRecord[] = [];
  const pages: SourcePage[] =
    '_i18n' in source && source._i18n
      ? source.getLanguages().flatMap(entry => entry.pages as SourcePage[])
      : source.getPages();

  for (const page of pages) {
    const runtimePage = page as PageWithStructuredData;
    let structured: DocumentRecord['structured'] | null = null;

    try {
      if (isStructuredData(runtimePage.data.structuredData)) {
        structured = runtimePage.data.structuredData;
      } else if (typeof runtimePage.data.load === 'function') {
        const loaded = await runtimePage.data.load();
        structured = isStructuredData(loaded?.structuredData)
          ? loaded.structuredData
          : null;
      }

      if (
        !isStructuredData(structured) &&
        typeof runtimePage.data.getText === 'function'
      ) {
        const processed = await runtimePage.data.getText('processed');
        structured = structure(processed);
      }
    } catch {
      structured = null;
    }

    if (!isStructuredData(structured)) {
      continue;
    }

    results.push({
      _id: runtimePage.url,
      structured,
      url: runtimePage.url,
      title: runtimePage.data.title ?? runtimePage.url,
      description: runtimePage.data.description,
    });
  }

  return results;
}
