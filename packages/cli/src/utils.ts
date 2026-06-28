import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';

export type NebulaPlatformConfig = {
  accessToken?: string;
  serverUrl?: string;
  user?: {
    id: string;
    email: string;
    displayName: string;
  };
};

export function exitWithError(message: string): never {
  console.error(`[nebula] ${message}`);
  process.exit(1);
}

export function ensureFileExists(filePath: string): void {
  if (!fs.existsSync(filePath)) {
    exitWithError(`Missing required file: ${filePath}`);
  }
}

export function readJson<T>(filePath: string): T {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    exitWithError(`Failed to parse ${filePath}: ${message}`);
  }
}

export function writeFileIfChanged(filePath: string, contents: string): void {
  const previousContents = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, 'utf8')
    : null;
  if (previousContents !== contents) {
    fs.writeFileSync(filePath, contents);
  }
}

export function resolveBin(binName: string, cwd: string): string {
  const extensions = process.platform === 'win32' ? ['.cmd', '.exe', ''] : [''];
  let currentDir = cwd;

  while (true) {
    for (const extension of extensions) {
      const candidate = path.join(
        currentDir,
        'node_modules',
        '.bin',
        `${binName}${extension}`,
      );
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }

  exitWithError(`Unable to find "${binName}" from ${cwd}`);
}

export function findWorkspaceRoot(startDir: string): string {
  let currentDir = startDir;

  while (true) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = readJson<{
        workspaces?: string[] | Record<string, unknown>;
      }>(packageJsonPath);
      if (packageJson.workspaces) {
        return currentDir;
      }
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }

  exitWithError(`Unable to locate workspace root from ${startDir}`);
}

export function parseFlags(args: string[]): Record<string, string> {
  const flags: Record<string, string> = {};
  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];
    if (!current.startsWith('--')) {
      continue;
    }
    const key = current.slice(2);
    const next = args[index + 1];
    if (!next || next.startsWith('--')) {
      flags[key] = 'true';
      continue;
    }
    flags[key] = next;
    index += 1;
  }
  return flags;
}

export function omitFlags(args: string[], excludedKeys: string[]): string[] {
  const excluded = new Set(excludedKeys);
  const result: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];
    if (!current.startsWith('--')) {
      result.push(current);
      continue;
    }

    const key = current.slice(2);
    if (!excluded.has(key)) {
      result.push(current);
      const next = args[index + 1];
      if (next && !next.startsWith('--')) {
        result.push(next);
        index += 1;
      }
      continue;
    }

    const next = args[index + 1];
    if (next && !next.startsWith('--')) {
      index += 1;
    }
  }

  return result;
}

export function getPackageVersion(projectRoot: string): string {
  const packageJson = readJson<{ version?: string }>(
    path.join(projectRoot, 'package.json'),
  );
  return packageJson.version || '0.0.1';
}

export function spawnProcess(
  projectRoot: string,
  command: string,
  args: string[],
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`Process terminated with signal ${signal}`));
        return;
      }
      if (code && code !== 0) {
        reject(new Error(`Process exited with code ${code}`));
        return;
      }
      resolve();
    });
  });
}

export async function httpRequest<T>(
  input: string,
  init: RequestInit,
): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const text = await response.text();
    exitWithError(text || `Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export function tryOpenUrl(url: string): void {
  const command =
    process.platform === 'darwin'
      ? 'open'
      : process.platform === 'win32'
        ? 'cmd'
        : 'xdg-open';
  const args = process.platform === 'win32' ? ['/c', 'start', '', url] : [url];

  const child = spawn(command, args, {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
}

export function spawnDetachedProcess(
  command: string,
  args: string[],
  cwd: string,
): void {
  const child = spawn(command, args, {
    cwd,
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
}

export function getNebulaConfigPath(): string {
  return path.join(os.homedir(), '.nebula', 'config.json');
}

export function readNebulaConfig(): NebulaPlatformConfig {
  const configPath = getNebulaConfigPath();
  if (!fs.existsSync(configPath)) {
    return {};
  }
  return readJson<NebulaPlatformConfig>(configPath);
}

export function writeNebulaConfig(config: NebulaPlatformConfig): void {
  const configPath = getNebulaConfigPath();
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
}

export function normalizeServerUrl(rawValue: string): string {
  const value = rawValue.trim();
  if (!value) {
    exitWithError('Server URL cannot be empty.');
  }
  return value.replace(/\/$/, '');
}
