const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname; // packages/sample-host/
const workspaceRoot = path.resolve(__dirname, '../..'); // monorepo root

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  projectRoot,
  watchFolders: [workspaceRoot],
  resolver: {
    nodeModulesPaths: [
      path.join(projectRoot, 'node_modules'),
      path.join(workspaceRoot, 'node_modules'),
    ],
  },
  server: {
    enhanceMiddleware: middleware => {
      return (req, res, next) => {
        // Serve mini-app app.json files at /<appId>/app.json
        const match = req.url.match(/^\/([^/]+)\/app\.json$/);
        if (match) {
          const appId = match[1];
          const manifestPath = path.join(
            workspaceRoot,
            'packages',
            appId,
            'app.json',
          );
          if (fs.existsSync(manifestPath)) {
            res.setHeader('Content-Type', 'application/json');
            res.end(fs.readFileSync(manifestPath));
            return;
          }
        }
        // Also serve at /app.json for the default mini-app
        if (req.url === '/app.json') {
          const manifestPath = path.join(
            workspaceRoot,
            'packages',
            'sample-miniapp',
            'app.json',
          );
          if (fs.existsSync(manifestPath)) {
            res.setHeader('Content-Type', 'application/json');
            res.end(fs.readFileSync(manifestPath));
            return;
          }
        }
        return middleware(req, res, next);
      };
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
