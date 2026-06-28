import * as fs from 'fs';
import * as path from 'path';

type CreateProjectKind = 'host' | 'miniapp' | 'runner';

type CreateProjectOptions = {
  name: string;
  directory?: string;
  appId?: string;
  displayName?: string;
  bundleId?: string;
};

type PackageJson = {
  version?: string;
};

type PackageVersions = {
  client: string;
  host: string;
  hostApis: string;
  sdk: string;
};

type TemplateReplacements = Record<string, string>;

const TEMPLATE_PACKAGE_ROOT = path.resolve(__dirname, '../../template');

const TEXT_TEMPLATE_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.swift',
  '.json',
  '.gradle',
  '.kt',
  '.plist',
  '.storyboard',
  '.pbxproj',
  '.xml',
  '.rb',
  '.xcprivacy',
  '.properties',
  '.md',
]);

const TEXT_TEMPLATE_BASENAMES = new Set([
  '.watchmanconfig',
  '.eslintrc.js',
  '.xcode.env',
  'Podfile',
  'Gemfile',
  'gradlew',
  'gradlew.bat',
]);

function fail(message: string): never {
  throw new Error(`[nebula] ${message}`);
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function readPackageVersion(packageDir: string): string {
  const packageJson = readJson<PackageJson>(
    path.join(packageDir, 'package.json'),
  );
  return packageJson.version || '0.0.1';
}

function resolvePackageVersions(): PackageVersions {
  const packagesDir = path.resolve(__dirname, '../..');
  return {
    sdk: readPackageVersion(path.join(packagesDir, 'nebula-sdk')),
    host: readPackageVersion(path.join(packagesDir, 'host')),
    hostApis: readPackageVersion(path.join(packagesDir, 'host-apis')),
    client: readPackageVersion(path.join(packagesDir, 'api')),
  };
}

function toKebabCase(value: string): string {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function toPascalCase(value: string): string {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map(segment => segment[0].toUpperCase() + segment.slice(1))
    .join('');
}

function toDisplayName(value: string): string {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map(segment => segment[0].toUpperCase() + segment.slice(1))
    .join(' ');
}

function toBundleId(value: string): string {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
    .replace(/\.{2,}/g, '.');

  const segments = normalized
    .split('.')
    .filter(Boolean)
    .map(segment => segment.replace(/^[^a-z]+/, '').replace(/[^a-z0-9]/g, ''))
    .filter(Boolean);

  if (segments.length === 0) {
    return 'com.nebula.app';
  }

  return `com.${segments.join('.')}`;
}

function ensureTargetDirectory(targetDir: string): void {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    return;
  }

  if (fs.readdirSync(targetDir).length > 0) {
    fail(`Target directory is not empty: ${targetDir}`);
  }
}

function getTemplateRoot(kind: CreateProjectKind): string {
  const templateRoot = path.join(TEMPLATE_PACKAGE_ROOT, kind);
  if (!fs.existsSync(templateRoot)) {
    fail(`Missing ${kind} template at ${templateRoot}`);
  }
  return templateRoot;
}

function isTextTemplateFile(filePath: string): boolean {
  const basename = path.basename(filePath);
  if (TEXT_TEMPLATE_BASENAMES.has(basename)) {
    return true;
  }

  const extension = path.extname(filePath);
  return TEXT_TEMPLATE_EXTENSIONS.has(extension);
}

function replaceTemplateTokens(
  value: string,
  replacements: TemplateReplacements,
): string {
  let nextValue = value;

  for (const [token, replacement] of Object.entries(replacements)) {
    nextValue = nextValue.split(token).join(replacement);
  }

  return nextValue;
}

function applyTemplateReplacements(
  targetRoot: string,
  replacements: TemplateReplacements,
): void {
  const visit = (currentPath: string) => {
    const stats = fs.statSync(currentPath);

    if (stats.isDirectory()) {
      for (const entry of fs.readdirSync(currentPath)) {
        visit(path.join(currentPath, entry));
      }
      return;
    }

    if (!isTextTemplateFile(currentPath)) {
      return;
    }

    const original = fs.readFileSync(currentPath, 'utf8');
    const replaced = replaceTemplateTokens(original, replacements);

    if (original !== replaced) {
      fs.writeFileSync(currentPath, replaced);
    }
  };

  visit(targetRoot);
}

function buildReplacements(
  kind: CreateProjectKind,
  options: CreateProjectOptions,
  versions: PackageVersions,
): TemplateReplacements {
  const slug = toKebabCase(options.name);
  const displayName = options.displayName || toDisplayName(options.name);
  const appId = options.appId || slug || 'nebula-miniapp';

  const componentName =
    kind === 'runner'
      ? toPascalCase(options.name) || 'NebulaDevRunner'
      : kind === 'host'
        ? toPascalCase(options.name) || 'NebulaHostApp'
        : 'NebulaMiniapp';

  const bundleId = options.bundleId || toBundleId(options.name);

  return {
    __PACKAGE_NAME__: slug,
    __DISPLAY_NAME__: displayName,
    __COMPONENT_NAME__: componentName,
    __BUNDLE_ID__: bundleId,
    __APP_ID__: appId,
    __NEBULA_CLIENT_VERSION__: versions.client,
    __NEBULA_HOST_VERSION__: versions.host,
    __NEBULA_HOST_APIS_VERSION__: versions.hostApis,
    __NEBULA_SDK_VERSION__: versions.sdk,
  };
}

function copyTemplateProject(
  kind: CreateProjectKind,
  targetDir: string,
  options: CreateProjectOptions,
): void {
  const templateRoot = getTemplateRoot(kind);
  const versions = resolvePackageVersions();
  const replacements = buildReplacements(kind, options, versions);

  ensureTargetDirectory(targetDir);
  fs.cpSync(templateRoot, targetDir, { recursive: true });
  applyTemplateReplacements(targetDir, replacements);
}

export function createProject(
  kind: CreateProjectKind,
  options: CreateProjectOptions,
): { targetDir: string } {
  const slug = toKebabCase(options.name);
  if (!slug) {
    fail('Project name cannot be empty.');
  }

  const targetDir = path.resolve(
    process.cwd(),
    options.directory || options.name,
  );

  copyTemplateProject(kind, targetDir, options);

  return { targetDir };
}
