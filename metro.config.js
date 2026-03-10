const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const fs = require('fs');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  server: {
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        // Serve mini-app app.json files at /<appId>/app.json
        const match = req.url.match(/^\/([^/]+)\/app\.json$/);
        if (match) {
          const appId = match[1];
          const manifestPath = path.join(__dirname, 'miniapps', appId, 'app.json');
          if (fs.existsSync(manifestPath)) {
            res.setHeader('Content-Type', 'application/json');
            res.end(fs.readFileSync(manifestPath));
            return;
          }
        }
        // Also serve at /app.json for the default mini-app
        if (req.url === '/app.json') {
          const manifestPath = path.join(__dirname, 'miniapps', 'sample', 'app.json');
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

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
