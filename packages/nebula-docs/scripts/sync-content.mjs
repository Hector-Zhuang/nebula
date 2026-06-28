import fs from 'node:fs';
import path from 'node:path';
import nextEnv from '@next/env';
import { algoliasearch } from 'algoliasearch';
import { sync } from 'fumadocs-core/search/algolia';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const appId =
  process.env.ALGOLIA_APP_ID ?? process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const apiKey = process.env.ALGOLIA_ADMIN_API_KEY;
const indexName =
  process.env.ALGOLIA_INDEX_NAME ??
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ??
  process.env.NEXT_PUBLIC_ALGOLIA_DOCS_INDEX_NAME ??
  'document';

if (!appId || !apiKey) {
  console.log(
    '[algolia] Skipping index sync because ALGOLIA_APP_ID or ALGOLIA_ADMIN_API_KEY is missing.',
  );
  process.exit(0);
}

const filePath = path.join(process.cwd(), '.next/server/app/static.json.body');

if (!fs.existsSync(filePath)) {
  console.log(`[algolia] Skipping index sync because ${filePath} does not exist.`);
  process.exit(0);
}

const content = fs.readFileSync(filePath, 'utf8');
const records = JSON.parse(content);

const client = algoliasearch(appId, apiKey);

await sync(client, {
  indexName,
  documents: records,
});

console.log(`[algolia] Synced ${records.length} search records to index "${indexName}".`);
