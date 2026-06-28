const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const fs = require('fs');
const { bundleModeMetroConfig } = require('react-native-worklets/bundleMode');

const projectRoot = __dirname;

function findWorkspaceRoot(startDir) {
  let currentDir = startDir;

  while (true) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, 'utf8'),
        );
        if (packageJson.workspaces) {
          return currentDir;
        }
      } catch {}
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      return projectRoot;
    }
    currentDir = parentDir;
  }
}

const workspaceRoot = findWorkspaceRoot(projectRoot);
const defaultConfig = getDefaultConfig(projectRoot);
const defaultResolver = defaultConfig.resolver?.resolveRequest;

const customConfig = {
  projectRoot,
  watchFolders: [
    ...defaultConfig.watchFolders,
    workspaceRoot,
    projectRoot,
    path.resolve(workspaceRoot, 'node_modules/react-native-worklets/.worklets'),
  ],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
    extraNodeModules: {
      'react-native': path.resolve(workspaceRoot, 'node_modules/react-native'),
    },
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName.startsWith('react-native-worklets/.worklets/')) {
        return bundleModeMetroConfig.resolver.resolveRequest(
          context,
          moduleName,
          platform,
        );
      }
      if (defaultResolver) {
        return defaultResolver(context, moduleName, platform);
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(
  defaultConfig,
  bundleModeMetroConfig,
  customConfig,
);
