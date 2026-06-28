import fs from 'fs';
import path from 'path';
import Module from 'module';
import {
  ensureFileExists,
  exitWithError,
  findWorkspaceRoot,
  getPackageVersion,
  omitFlags,
  parseFlags,
  resolveBin,
  spawnDetachedProcess,
  spawnProcess,
  writeFileIfChanged,
} from './utils';

type PageStyle = {
  backgroundColor?: string;
  navigationBarBackgroundColor?: string;
  navigationBarTextColor?: string;
  navigationBarTitleText?: string;
  navigationStyle?: 'default' | 'custom';
  visualEffectInBackground?: 'blur' | 'none';
};

type UserPageConfig = PageStyle & {
  route?: string;
};

export type UserMiniAppConfig = {
  appId: string;
  entryPagePath?: string;
  pages: string[] | Record<string, string>;
  updateStrategy?: 'auto' | 'manual';
  window?: PageStyle;
};

type RuntimeMiniAppManifest = {
  appId: string;
  bundlePath: string;
  bundleEntryFile?: string;
  entryPagePath: string;
  pageConfigs: Record<string, PageStyle>;
  pages: Record<string, string>;
  updateStrategy: 'auto' | 'manual';
  version: string;
  window?: PageStyle;
};

type PageDefinition = {
  componentName: string;
  importPath: string;
};

type GeneratedFiles = {
  buildManifestPath: string;
  bundlePath: string;
  bundleEntryFile: string;
  entryFilePath: string;
  metroConfigPath: string;
  runtimeManifestUrlPath: string;
};

export type BuiltMiniAppArtifacts = {
  manifestPath: string;
  iosBundlePath: string;
  androidBundlePath: string;
  iosAssetsDir: string;
  androidAssetsDir: string;
};

type RunnerPlatform = 'ios' | 'android';

function registerTypeScriptRequire(): void {
  const globalKey = '__nebulaTsRequireRegistered';
  if ((globalThis as Record<string, unknown>)[globalKey]) {
    return;
  }

  const workspaceRoot = findWorkspaceRoot(process.cwd());

  const moduleLoadKey = '__nebulaPageConfigModuleLoadPatched';
  if (!(globalThis as Record<string, unknown>)[moduleLoadKey]) {
    const moduleInternal = Module as typeof Module & {
      _load: (
        request: string,
        parent: NodeModule | null,
        isMain: boolean,
      ) => unknown;
    };
    const originalLoad = moduleInternal._load;

    moduleInternal._load = function patchedNebulaModuleLoad(
      request: string,
      parent: NodeModule | null,
      isMain: boolean,
    ) {
      if (request === '@nebula-rn/sdk') {
        const sdkPageConfigEntry = path.join(
          workspaceRoot,
          'packages',
          'nebula-sdk',
          'page-config.ts',
        );
        if (fs.existsSync(sdkPageConfigEntry)) {
          return Reflect.apply(originalLoad, this, [
            sdkPageConfigEntry,
            parent,
            isMain,
          ]);
        }
      }

      return Reflect.apply(originalLoad, this, [request, parent, isMain]);
    };

    (globalThis as Record<string, unknown>)[moduleLoadKey] = true;
  }

  const compileExtension = (module: NodeModule, filename: string): void => {
    const ts = require('typescript') as typeof import('typescript');
    const source = fs.readFileSync(filename, 'utf8');
    const compiled = ts.transpileModule(source, {
      compilerOptions: {
        esModuleInterop: true,
        jsx: ts.JsxEmit.React,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
      fileName: filename,
    });
    (
      module as NodeModule & {
        _compile(code: string, filename: string): void;
      }
    )._compile(compiled.outputText, filename);
  };

  require.extensions['.ts'] = compileExtension;
  require.extensions['.tsx'] = compileExtension;
  (globalThis as Record<string, unknown>)[globalKey] = true;
}

function normalizeRoute(route: string): string {
  if (!route || route === '/') {
    return '/';
  }
  const normalized = route.replace(/^\/+/, '').replace(/\/+$/, '');
  return `/${normalized}`;
}

function normalizeImportPath(fromDir: string, targetPath: string): string {
  const relativePath = path
    .relative(fromDir, targetPath)
    .split(path.sep)
    .join('/')
    .replace(/\.(tsx?|jsx?)$/, '');
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

function toComponentName(pageId: string): string {
  return `NebulaPage_${pageId
    .split(/[\/_-]/)
    .filter(Boolean)
    .map(segment => segment[0].toUpperCase() + segment.slice(1))
    .join('')}`;
}

function resolveDevRunnerRoot(startDir: string): string {
  const candidates = [
    path.join(startDir, 'packages', 'dev-runner'),
    path.join(startDir, 'node_modules', '@nebula', 'dev-runner'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'package.json'))) {
      return candidate;
    }
  }

  let currentDir = startDir;
  while (true) {
    const candidate = path.join(
      currentDir,
      'node_modules',
      '@nebula',
      'dev-runner',
    );
    if (fs.existsSync(path.join(candidate, 'package.json'))) {
      return candidate;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }

  exitWithError(
    'Unable to locate @nebula-rn/dev-runner. Install it or use `nebula miniapp dev --no-runner`.',
  );
}

function resolveRunnerPlatform(value?: string): RunnerPlatform {
  if (value === 'android' || value === 'ios') {
    return value;
  }
  return process.platform === 'darwin' ? 'ios' : 'android';
}

function getMiniappServerBaseUrl(platform: RunnerPlatform): string {
  return platform === 'android'
    ? 'http://10.0.2.2:8082'
    : 'http://localhost:8082';
}

function getRunnerLaunchUrl(
  platform: RunnerPlatform,
  manifestPath: string,
  bundlePath: string,
): string {
  const baseUrl = getMiniappServerBaseUrl(platform);
  const manifestUrl = `${baseUrl}${manifestPath}`;
  const bundleUrl = `${baseUrl}${bundlePath}?platform=${platform}&dev=true&minify=false`;
  return `devrunner://open?manifestUrl=${encodeURIComponent(manifestUrl)}&bundleUrl=${encodeURIComponent(bundleUrl)}&t=${Date.now()}`;
}

function launchRunnerControlUrl(
  platform: RunnerPlatform,
  manifestPath: string,
  bundlePath: string,
): void {
  const runnerUrl = getRunnerLaunchUrl(platform, manifestPath, bundlePath);

  if (platform === 'ios') {
    spawnDetachedProcess(
      'xcrun',
      ['simctl', 'openurl', 'booted', runnerUrl],
      process.cwd(),
    );
    return;
  }

  spawnDetachedProcess(
    'adb',
    [
      'shell',
      'am',
      'start',
      '-a',
      'android.intent.action.VIEW',
      '-d',
      runnerUrl,
    ],
    process.cwd(),
  );
}

function ensureDevRunner(
  workspaceRoot: string,
  platform: RunnerPlatform,
  manifestPath: string,
  bundlePath: string,
): void {
  const devRunnerRoot = resolveDevRunnerRoot(workspaceRoot);
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  spawnDetachedProcess(npmCommand, ['run', 'start'], devRunnerRoot);
  spawnDetachedProcess(
    npmCommand,
    ['run', platform === 'ios' ? 'ios' : 'android'],
    devRunnerRoot,
  );

  const launchDelays = platform === 'ios' ? [6000, 12000] : [8000, 15000];
  launchDelays.forEach(delay => {
    setTimeout(() => {
      launchRunnerControlUrl(platform, manifestPath, bundlePath);
    }, delay);
  });
}

function resolvePageModuleFile(projectRoot: string, pageId: string): string {
  const pageDir = path.join(projectRoot, 'src', 'pages', pageId);
  const candidates = ['index.tsx', 'index.ts', 'index.jsx', 'index.js'];
  for (const candidate of candidates) {
    const filePath = path.join(pageDir, candidate);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  exitWithError(`Missing page entry for "${pageId}" in ${pageDir}`);
}

function readPageConfig(projectRoot: string, pageId: string): UserPageConfig {
  registerTypeScriptRequire();
  const pageConfigPath = path.join(
    projectRoot,
    'src',
    'pages',
    pageId,
    'page.config.ts',
  );
  ensureFileExists(pageConfigPath);
  try {
    const resolvedPath = require.resolve(pageConfigPath);
    delete require.cache[resolvedPath];
    const pageConfigModule = require(resolvedPath) as
      | UserPageConfig
      | { default?: UserPageConfig; pageConfig?: UserPageConfig };
    let pageConfig: UserPageConfig | null = null;

    if (
      typeof pageConfigModule === 'object' &&
      pageConfigModule !== null &&
      ('default' in pageConfigModule || 'pageConfig' in pageConfigModule)
    ) {
      pageConfig =
        pageConfigModule.default ?? pageConfigModule.pageConfig ?? null;
    } else if (
      typeof pageConfigModule === 'object' &&
      pageConfigModule !== null
    ) {
      pageConfig = pageConfigModule as UserPageConfig;
    }

    if (!pageConfig || typeof pageConfig !== 'object') {
      exitWithError(`Invalid page config export in ${pageConfigPath}`);
    }

    return pageConfig;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    exitWithError(`Failed to load ${pageConfigPath}: ${message}`);
  }
}

function validateMiniAppConfig(appConfig: UserMiniAppConfig): void {
  if (!appConfig || typeof appConfig !== 'object') {
    exitWithError('app.json must export a JSON object');
  }
  if (!appConfig.appId || typeof appConfig.appId !== 'string') {
    exitWithError('app.json must contain a string "appId"');
  }
  if (
    !appConfig.pages ||
    (typeof appConfig.pages !== 'object' && !Array.isArray(appConfig.pages))
  ) {
    exitWithError('app.json must contain a "pages" array or object');
  }
  if (
    appConfig.updateStrategy &&
    appConfig.updateStrategy !== 'auto' &&
    appConfig.updateStrategy !== 'manual'
  ) {
    exitWithError('app.json updateStrategy must be either "auto" or "manual"');
  }
}

function buildRuntimeManifest(
  projectRoot: string,
  appConfig: UserMiniAppConfig,
): {
  manifest: RuntimeMiniAppManifest;
  pageDefinitions: PageDefinition[];
} {
  validateMiniAppConfig(appConfig);
  const version = getPackageVersion(projectRoot);
  const updateStrategy = appConfig.updateStrategy ?? 'manual';

  if (!Array.isArray(appConfig.pages)) {
    const routes = appConfig.pages;
    const entryPagePath = normalizeRoute(appConfig.entryPagePath || '/');
    const pages: Record<string, string> = {};
    for (const [route, componentName] of Object.entries(routes)) {
      pages[normalizeRoute(route)] = componentName;
    }
    return {
      manifest: {
        appId: appConfig.appId,
        bundlePath: '/index.bundle',
        entryPagePath,
        pageConfigs: {},
        pages,
        updateStrategy,
        version,
        window: appConfig.window,
      },
      pageDefinitions: [],
    };
  }

  const pageDefinitions: PageDefinition[] = [];
  const pageConfigs: Record<string, PageStyle> = {};
  const pages: Record<string, string> = {};

  for (const pageId of appConfig.pages) {
    const pageConfig = readPageConfig(projectRoot, pageId);
    const route = normalizeRoute(pageConfig.route || pageId);
    const componentName = toComponentName(pageId);
    const moduleFilePath = resolvePageModuleFile(projectRoot, pageId);
    const style = { ...pageConfig, route: undefined };

    pages[route] = componentName;
    pageConfigs[route] = style;
    pageDefinitions.push({
      componentName,
      importPath: moduleFilePath,
    });
  }

  const entryPagePath = normalizeRoute(
    appConfig.entryPagePath || appConfig.pages[0] || '/',
  );
  if (!pages[entryPagePath]) {
    exitWithError(
      `entryPagePath "${entryPagePath}" does not match any configured page`,
    );
  }
  pages['/'] = pages[entryPagePath];
  pageConfigs['/'] = pageConfigs[entryPagePath];

  return {
    manifest: {
      appId: appConfig.appId,
      bundlePath: '/index.bundle',
      entryPagePath,
      pageConfigs,
      pages,
      updateStrategy,
      version,
      window: appConfig.window,
    },
    pageDefinitions,
  };
}

function generateMiniAppFiles(
  projectRoot: string,
  workspaceRoot: string,
  appConfig: UserMiniAppConfig,
): GeneratedFiles {
  const { manifest, pageDefinitions } = buildRuntimeManifest(
    projectRoot,
    appConfig,
  );
  const generatedDir = path.join(projectRoot, '.nebula', 'generated');
  const runtimeBundlePath = '/.nebula/generated/index.bundle';
  const runtimeBundleEntryFile = '.nebula/generated/index.js';
  const runtimeManifestUrlPath = '/.nebula/generated/app.json';
  manifest.bundlePath = runtimeBundlePath;
  manifest.bundleEntryFile = runtimeBundleEntryFile;

  const entryFilePath = path.join(generatedDir, 'index.js');
  const metroConfigPath = path.join(generatedDir, 'metro.config.cjs');
  const runtimeManifestPath = path.join(generatedDir, 'app.json');
  const buildManifestPath = path.join(projectRoot, 'build', 'app.json');

  fs.mkdirSync(generatedDir, { recursive: true });

  const loaderEntries = pageDefinitions.map(definition => {
    const importPath = normalizeImportPath(generatedDir, definition.importPath);
    return `  ${JSON.stringify(definition.componentName)}: () => {
    const module = require(${JSON.stringify(importPath)});
    return module?.default ?? module;
  },`;
  });

  const entryContents = `import { AppRegistry } from 'react-native';
import { createMiniAppPage, Miniapp, NebulaAPI } from '@nebula-rn/sdk';

const manifest = ${JSON.stringify(manifest, null, 2)};
const componentLoaders = {
${loaderEntries.join('\n')}
};

Miniapp.bootstrap(manifest.appId);
NebulaAPI.registerManifest(manifest.appId, manifest);

Object.entries(manifest.pages).forEach(([routePath, componentName]) => {
  const loadComponent = componentLoaders[componentName];
  if (!loadComponent) {
    console.warn(\`[Nebula] No component found for route "\${routePath}" and component "\${componentName}"\`);
    return;
  }
  AppRegistry.registerComponent(componentName, () => {
    const component = loadComponent();
    return createMiniAppPage(component);
  });
});

const defaultComponentName =
  manifest.pages[manifest.entryPagePath] ||
  manifest.pages['/'] ||
  Object.values(manifest.pages)[0];
const loadDefaultComponent = defaultComponentName
  ? componentLoaders[defaultComponentName]
  : null;

if (loadDefaultComponent) {
  AppRegistry.registerComponent('NebulaApp', () => {
    const component = loadDefaultComponent();
    return createMiniAppPage(component);
  });
}
`;

  const metroConfigContents = `const fs = require('fs');
const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const projectRoot = ${JSON.stringify(projectRoot)};
const workspaceRoot = ${JSON.stringify(workspaceRoot)};
const generatedManifestPath = ${JSON.stringify(runtimeManifestPath)};
const runtimeManifestUrlPath = ${JSON.stringify(runtimeManifestUrlPath)};

/** @type {import('metro-config').MetroConfig} */
const config = {
  projectRoot,
  watchFolders: [workspaceRoot],
  server: {
    enhanceMiddleware: middleware => {
      return (req, res, next) => {
        const requestUrl = new URL(req.url || '/', 'http://localhost');
        if (
          requestUrl.pathname === runtimeManifestUrlPath &&
          fs.existsSync(generatedManifestPath)
        ) {
          res.setHeader('Content-Type', 'application/json');
          res.end(fs.readFileSync(generatedManifestPath, 'utf8'));
          return;
        }
        return middleware(req, res, next);
      };
    },
  },
  resolver: {
    nodeModulesPaths: [
      path.join(projectRoot, 'node_modules'),
      path.join(workspaceRoot, 'node_modules'),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
`;

  writeFileIfChanged(entryFilePath, entryContents);
  writeFileIfChanged(metroConfigPath, metroConfigContents);
  writeFileIfChanged(
    runtimeManifestPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  return {
    buildManifestPath,
    bundlePath: runtimeBundlePath,
    bundleEntryFile: runtimeBundleEntryFile,
    entryFilePath,
    metroConfigPath,
    runtimeManifestUrlPath,
  };
}

async function runReactNative(
  projectRoot: string,
  args: string[],
): Promise<void> {
  const reactNativeBin = resolveBin('react-native', projectRoot);
  await spawnProcess(projectRoot, reactNativeBin, args);
}

export async function buildMiniAppArtifacts(
  projectRoot: string,
  workspaceRoot: string,
  appConfig: UserMiniAppConfig,
  extraArgs: string[],
): Promise<BuiltMiniAppArtifacts> {
  const generatedFiles = generateMiniAppFiles(
    projectRoot,
    workspaceRoot,
    appConfig,
  );
  const buildDir = path.join(projectRoot, 'build');
  const iosBundlePath = path.join(buildDir, 'main.ios.jsbundle');
  const androidBundlePath = path.join(buildDir, 'main.android.bundle');
  fs.mkdirSync(buildDir, { recursive: true });
  fs.copyFileSync(
    path.join(path.dirname(generatedFiles.entryFilePath), 'app.json'),
    generatedFiles.buildManifestPath,
  );
  const iosAssetsDir = path.join(buildDir, 'ios-assets');
  const androidAssetsDir = path.join(buildDir, 'android-assets');
  await Promise.all([
    runReactNative(projectRoot, [
      'bundle',
      '--config',
      generatedFiles.metroConfigPath,
      '--platform',
      'ios',
      '--dev',
      'false',
      '--entry-file',
      generatedFiles.entryFilePath,
      '--bundle-output',
      iosBundlePath,
      '--assets-dest',
      iosAssetsDir,
      ...extraArgs,
    ]),
    runReactNative(projectRoot, [
      'bundle',
      '--config',
      generatedFiles.metroConfigPath,
      '--platform',
      'android',
      '--dev',
      'false',
      '--entry-file',
      generatedFiles.entryFilePath,
      '--bundle-output',
      androidBundlePath,
      '--assets-dest',
      androidAssetsDir,
      ...extraArgs,
    ]),
  ]);
  return {
    androidBundlePath,
    iosBundlePath,
    iosAssetsDir,
    androidAssetsDir,
    manifestPath: generatedFiles.buildManifestPath,
  };
}

export async function runMiniApp(
  action: string,
  extraArgs: string[],
): Promise<void> {
  const projectRoot = process.cwd();
  const workspaceRoot = findWorkspaceRoot(projectRoot);
  const appJsonPath = path.join(projectRoot, 'app.json');
  const packageJsonPath = path.join(projectRoot, 'package.json');

  ensureFileExists(appJsonPath);
  ensureFileExists(packageJsonPath);

  const appConfig = JSON.parse(
    fs.readFileSync(appJsonPath, 'utf8'),
  ) as UserMiniAppConfig;
  const generatedFiles = generateMiniAppFiles(
    projectRoot,
    workspaceRoot,
    appConfig,
  );

  if (action === 'dev') {
    const flags = parseFlags(extraArgs);
    const runnerPlatform = resolveRunnerPlatform(flags.platform);
    const shouldAutoLaunchRunner = flags['no-runner'] !== 'true';
    const metroArgs = omitFlags(extraArgs, ['platform', 'no-runner']);

    console.log(`[nebula] Starting ${appConfig.appId} in development mode...`);

    if (shouldAutoLaunchRunner) {
      console.log(
        `[nebula] Opening ${appConfig.appId} on ${runnerPlatform}...`,
      );
      ensureDevRunner(
        workspaceRoot,
        runnerPlatform,
        generatedFiles.runtimeManifestUrlPath,
        generatedFiles.bundlePath,
      );
    } else {
      console.log(
        '[nebula] Runner auto-launch is disabled. Only the miniapp dev server will be started.',
      );
    }

    await runReactNative(projectRoot, [
      'start',
      '--config',
      generatedFiles.metroConfigPath,
      '--port',
      '8082',
      ...metroArgs,
    ]);
    return;
  }

  if (action === 'build') {
    await buildMiniAppArtifacts(
      projectRoot,
      workspaceRoot,
      appConfig,
      extraArgs,
    );
    return;
  }

  exitWithError(
    `Unsupported miniapp action "${action}". Use "dev" / "build" / "upload".`,
  );
}
