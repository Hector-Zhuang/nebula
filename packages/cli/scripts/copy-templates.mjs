import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const cliRoot = path.resolve(here, '..');
const packagesRoot = path.resolve(cliRoot, '..');
const sourceTemplateRoot = path.join(packagesRoot, 'template');
const targetTemplateRoot = path.join(cliRoot, 'templates');

const KINDS = ['host', 'miniapp', 'runner'];

function readVersion(packageDir) {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8'),
  );
  return pkg.version || '0.0.1';
}

function rmrf(target) {
  fs.rmSync(target, { recursive: true, force: true });
}

rmrf(targetTemplateRoot);
fs.mkdirSync(targetTemplateRoot, { recursive: true });

for (const kind of KINDS) {
  const source = path.join(sourceTemplateRoot, kind);
  const target = path.join(targetTemplateRoot, kind);
  if (!fs.existsSync(source)) {
    throw new Error(`Cannot bundle templates: missing ${source}`);
  }
  fs.cpSync(source, target, {
    recursive: true,
    filter: filePath => {
      const base = path.basename(filePath);
      if (base === 'node_modules' || base === '.git') {
        return false;
      }
      return true;
    },
  });
}

// Freeze dependency versions so scaffolded projects pin the same versions
// that were current when the CLI was published.
const versions = {
  sdk: readVersion(path.join(packagesRoot, 'nebula-sdk')),
  host: readVersion(path.join(packagesRoot, 'host')),
  hostApis: readVersion(path.join(packagesRoot, 'host-apis')),
  client: readVersion(path.join(packagesRoot, 'api')),
};
fs.writeFileSync(
  path.join(targetTemplateRoot, 'versions.json'),
  `${JSON.stringify(versions, null, 2)}\n`,
);

console.log(
  `[nebula-cli] Bundled templates (${KINDS.join(', ')}) with versions ${JSON.stringify(versions)}`,
);
