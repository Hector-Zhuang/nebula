#!/usr/bin/env node
import { createProject } from './create';
import { runMiniApp } from './miniapp';
import {
  configureServer,
  loginPlatform,
  logoutPlatform,
  uploadMiniApp,
} from './platform';
import { exitWithError, omitFlags, parseFlags } from './utils';

async function main() {
  const [, , scope, action, ...extraArgs] = process.argv;

  if (
    scope === 'create' &&
    (action === 'host' || action === 'miniapp' || action === 'runner')
  ) {
    const flags = parseFlags(extraArgs);
    const projectName = omitFlags(extraArgs, [
      'directory',
      'app-id',
      'display-name',
      'bundle-id',
    ])[0];

    if (!projectName) {
      exitWithError(
        `Usage: nebula create ${action} <name> [--directory <path>] [--app-id <id>] [--display-name <name>] [--bundle-id <id>]`,
      );
    }

    const result = createProject(action, {
      appId: flags['app-id'],
      bundleId: flags['bundle-id'],
      directory: flags.directory,
      displayName: flags['display-name'],
      name: projectName,
    });
    console.log(`[nebula] Created ${action} project at ${result.targetDir}`);
    return;
  }

  if (scope === 'config' && action === 'server') {
    configureServer(extraArgs);
    return;
  }

  if (scope === 'auth' && action === 'login') {
    await loginPlatform(extraArgs);
    return;
  }

  if (scope === 'auth' && action === 'logout') {
    logoutPlatform();
    return;
  }

  if (scope === 'miniapp' && action === 'upload') {
    await uploadMiniApp(extraArgs);
    return;
  }

  if (scope === 'miniapp') {
    await runMiniApp(action, extraArgs);
    return;
  }

  exitWithError(
    'Usage: nebula create <host|miniapp|runner> <name> [...args], nebula miniapp <dev|build|upload> [...args], nebula auth <login|logout> [...args], or nebula config server [--url <url>|--clear]',
  );
}

main().catch(error => {
  const message = error instanceof Error ? error.message : String(error);
  exitWithError(message);
});
