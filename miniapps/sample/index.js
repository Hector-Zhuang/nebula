import { AppRegistry } from 'react-native';
import { NebulaAPI } from '../../src/nebula/NebulaAPI';
import appConfig from './app.json';
import components from './src/components';

const APP_ID = 'sample-miniapp';

/**
 * Mini-App Page Registration
 *
 * Pages are driven entirely by app.json - no hardcoding here.
 * app.json maps route paths to component names, and this file
 * maps those component names to actual constructors via the components registry.
 */

// Collect unique component names from all routes in app.json
const componentNames = [...new Set(Object.values(appConfig.pages))];

componentNames.forEach((componentName) => {
  const component = components[componentName];
  if (component) {
    AppRegistry.registerComponent(componentName, () => component);
  } else {
    console.warn(`[Nebula] No component found for "${componentName}" - add it to src/components.js`);
  }
});

// Register route table with native host so it knows which component handles each path
NebulaAPI.registerRoutes(APP_ID, appConfig.pages);

// Register the default "NebulaApp" entry name that native uses as fallback before routes are registered.
// This is the bootstrap entry point for the first open of the mini-app.
const defaultComponentName = appConfig.pages['/'] || appConfig.pages['/home'];
const DefaultComponent = defaultComponentName ? components[defaultComponentName] : null;
if (DefaultComponent) {
  AppRegistry.registerComponent('NebulaApp', () => DefaultComponent);
}


