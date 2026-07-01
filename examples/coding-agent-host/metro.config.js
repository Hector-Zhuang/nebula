const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const fs = require('fs');

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
      } catch {
        // Ignore invalid package.json files while walking up the tree.
      }
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      return projectRoot;
    }
    currentDir = parentDir;
  }
}

const workspaceRoot = findWorkspaceRoot(projectRoot);

/** @type {import('@react-native/metro-config').MetroConfig} */
const config = {
  projectRoot,
  watchFolders: [
    ...(workspaceRoot === projectRoot ? [] : [workspaceRoot]),
  ],
  resolver: {
    nodeModulesPaths: [
      path.join(projectRoot, 'node_modules'),
      ...(workspaceRoot === projectRoot
        ? []
        : [path.join(workspaceRoot, 'node_modules')]),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
