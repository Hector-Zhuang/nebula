import { docs } from 'collections/server';
import { type InferPageType, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { i18n } from './i18n';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';

type RuntimePageWithText = InferPageType<typeof source> & {
  data: InferPageType<typeof source>['data'] & {
    getText: (kind: 'processed') => Promise<string>;
  };
};

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  i18n,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `${docsImageRoute}/${segments.join('/')}`,
  };
}

export function getPageMarkdownUrl(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    url: `${docsContentRoute}/${segments.join('/')}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const runtimePage = page as RuntimePageWithText;
  const processed = await runtimePage.data.getText('processed');

  return `# ${runtimePage.data.title} (${runtimePage.url})

${processed}`;
}
