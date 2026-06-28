import fs from 'fs';
import path from 'path';
import {
  ensureFileExists,
  exitWithError,
  findWorkspaceRoot,
  getPackageVersion,
  httpRequest,
  normalizeServerUrl,
  omitFlags,
  parseFlags,
  readJson,
  readNebulaConfig,
  sleep,
  tryOpenUrl,
  writeNebulaConfig,
} from './utils';
import { buildMiniAppArtifacts, UserMiniAppConfig } from './miniapp';

async function ensureAuthenticatedSession(
  serverUrl: string,
  accessToken: string,
): Promise<{
  id: string;
  email: string;
  displayName: string;
}> {
  const response = await fetch(`${serverUrl.replace(/\/$/, '')}/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'GET',
  });

  if (response.status === 401 || response.status === 403) {
    const currentConfig = readNebulaConfig();
    writeNebulaConfig({
      ...currentConfig,
      accessToken: undefined,
      user: undefined,
    });
    exitWithError(
      'Saved CLI login is no longer valid. Please run `nebula auth login` again.',
    );
  }

  if (!response.ok) {
    const text = await response.text();
    exitWithError(
      text || `Failed to validate CLI login (status ${response.status})`,
    );
  }

  return (await response.json()) as {
    id: string;
    email: string;
    displayName: string;
  };
}

export async function loginPlatform(extraArgs: string[]): Promise<void> {
  const flags = parseFlags(extraArgs);
  const config = readNebulaConfig();
  const serverUrl = normalizeServerUrl(
    flags.server || config.serverUrl || 'http://localhost:3001/api',
  );
  const shouldOpen = flags.open !== 'false';

  const session = await httpRequest<{
    code: string;
    verificationUrl: string;
    expiresAt: string;
    intervalSeconds: number;
  }>(`${serverUrl.replace(/\/$/, '')}/auth/cli/sessions`, {
    method: 'POST',
  });

  console.log('[nebula] Open this URL in your browser to authorize the CLI:');
  console.log(session.verificationUrl);
  console.log(`[nebula] Session code: ${session.code}`);

  if (shouldOpen) {
    try {
      tryOpenUrl(session.verificationUrl);
    } catch {
      // Ignore open failures and keep the manual URL flow.
    }
  }

  const expiresAt = new Date(session.expiresAt).getTime();
  while (Date.now() < expiresAt) {
    const response = await httpRequest<{
      status: 'pending' | 'approved' | 'expired';
      accessToken?: string;
      user?: {
        id: string;
        email: string;
        displayName: string;
      };
    }>(`${serverUrl.replace(/\/$/, '')}/auth/cli/sessions/${session.code}`, {
      method: 'GET',
    });

    if (
      response.status === 'approved' &&
      response.accessToken &&
      response.user
    ) {
      writeNebulaConfig({
        accessToken: response.accessToken,
        serverUrl,
        user: response.user,
      });
      console.log(
        `[nebula] Logged in as ${response.user.displayName} <${response.user.email}>`,
      );
      return;
    }

    if (response.status === 'expired') {
      exitWithError(
        'CLI login session expired. Please run `nebula auth login` again.',
      );
    }

    await sleep((session.intervalSeconds || 2) * 1000);
  }

  exitWithError(
    'CLI login session expired. Please run `nebula auth login` again.',
  );
}

export function logoutPlatform(): void {
  writeNebulaConfig({});
  console.log('[nebula] Logged out');
}

export function configureServer(extraArgs: string[]): void {
  const flags = parseFlags(extraArgs);
  const currentConfig = readNebulaConfig();
  const requestedUrl =
    flags.url || extraArgs.find(arg => !arg.startsWith('--')) || '';

  if (flags.clear === 'true') {
    writeNebulaConfig({
      accessToken: undefined,
      serverUrl: undefined,
      user: undefined,
    });
    console.log('[nebula] Cleared saved server configuration');
    return;
  }

  if (!requestedUrl) {
    if (currentConfig.serverUrl) {
      console.log(`[nebula] Current server: ${currentConfig.serverUrl}`);
    } else {
      console.log('[nebula] No server configured');
    }
    return;
  }

  const nextServerUrl = normalizeServerUrl(requestedUrl);
  const serverChanged = currentConfig.serverUrl !== nextServerUrl;
  writeNebulaConfig({
    ...currentConfig,
    accessToken: serverChanged ? undefined : currentConfig.accessToken,
    serverUrl: nextServerUrl,
    user: serverChanged ? undefined : currentConfig.user,
  });
  console.log(`[nebula] Saved server: ${nextServerUrl}`);
  if (serverChanged && currentConfig.accessToken) {
    console.log('[nebula] Cleared saved login because the server changed');
  }
}

async function zipDirectory(
  dirPath: string,
  outputPath: string,
): Promise<void> {
  const ZipArchive = require('archiver').ZipArchive as any;

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = new ZipArchive({ zlib: { level: 9 } });
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(dirPath, false);
    archive.finalize();
  });
}

export async function uploadMiniApp(extraArgs: string[]): Promise<void> {
  const projectRoot = process.cwd();
  const workspaceRoot = findWorkspaceRoot(projectRoot);
  const flags = parseFlags(extraArgs);
  const config = readNebulaConfig();
  const serverUrl = flags.server
    ? normalizeServerUrl(flags.server)
    : config.serverUrl;
  const accessToken = config.accessToken;
  if (!serverUrl || !accessToken) {
    exitWithError(
      'Please configure a server and login first: nebula config server <url> && nebula auth login',
    );
  }

  const currentUser = await ensureAuthenticatedSession(serverUrl, accessToken);
  console.log(
    `[nebula] Authenticated as ${currentUser.displayName} <${currentUser.email}>`,
  );

  const appJsonPath = path.join(projectRoot, 'app.json');
  ensureFileExists(appJsonPath);

  const appConfig = readJson<UserMiniAppConfig>(appJsonPath);
  const buildArgs = omitFlags(extraArgs, [
    'server',
    'bundle',
    'bundle-ios',
    'bundle-android',
    'manifest',
    'version',
    'build-number',
    'changelog',
    'channel',
    'release-type',
  ]);
  const builtArtifacts = await buildMiniAppArtifacts(
    projectRoot,
    workspaceRoot,
    appConfig,
    buildArgs,
  );
  const manifestPath = builtArtifacts.manifestPath;
  const iosBundlePath = builtArtifacts.iosBundlePath;
  const androidBundlePath = builtArtifacts.androidBundlePath;
  const iosAssetsDir = builtArtifacts.iosAssetsDir;
  const androidAssetsDir = builtArtifacts.androidAssetsDir;

  ensureFileExists(iosBundlePath);
  ensureFileExists(androidBundlePath);
  ensureFileExists(manifestPath);

  const buildDir = path.join(projectRoot, 'build');
  const iosAssetsZipPath = path.join(buildDir, 'assets-ios.zip');
  const androidAssetsZipPath = path.join(buildDir, 'assets-android.zip');
  await zipDirectory(iosAssetsDir, iosAssetsZipPath);
  await zipDirectory(androidAssetsDir, androidAssetsZipPath);
  ensureFileExists(iosAssetsZipPath);
  ensureFileExists(androidAssetsZipPath);

  const version = flags.version || getPackageVersion(projectRoot);
  const changelog = flags.changelog || '';

  const formData = new FormData();
  formData.append('version', version);
  formData.append('changelog', changelog);
  formData.append('channel', 'stable');
  formData.append('releaseType', 'RELEASE');
  formData.append(
    'bundleIos',
    new Blob([fs.readFileSync(iosBundlePath)]),
    path.basename(iosBundlePath),
  );
  formData.append(
    'bundleAndroid',
    new Blob([fs.readFileSync(androidBundlePath)]),
    path.basename(androidBundlePath),
  );
  formData.append(
    'manifest',
    new Blob([fs.readFileSync(manifestPath)]),
    path.basename(manifestPath),
  );
  formData.append(
    'assetsIos',
    new Blob([fs.readFileSync(iosAssetsZipPath)]),
    'assets-ios.zip',
  );
  formData.append(
    'assetsAndroid',
    new Blob([fs.readFileSync(androidAssetsZipPath)]),
    'assets-android.zip',
  );

  writeNebulaConfig({
    ...config,
    serverUrl,
  });

  const response = await httpRequest<{
    buildNumber: number;
    id: string;
    status: string;
    version: string;
  }>(
    `${serverUrl.replace(/\/$/, '')}/mini-apps/by-app-id/${appConfig.appId}/versions/upload`,
    {
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'POST',
    },
  );

  console.log(
    `[nebula] Uploaded ${appConfig.appId}@${response.version} status=${response.status}`,
  );
}
