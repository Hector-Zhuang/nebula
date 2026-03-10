import { AppRegistry } from 'react-native';
import HomePage from './src/HomePage';
import Page1 from './src/Page1';
import Page2 from './src/Page2';
import Page3 from './src/Page3';

/**
 * Mini-App Page Registration
 * 
 * Each page must be registered separately as an independent component.
 * The native router will instantiate the correct component based on the route path.
 * 
 * Convention:
 * - Component names follow the pattern: NebulaApp_{PageName}
 * - Route path determines which component to load
 * - Each page receives initialProps with route information (__routePath, __routeUrl, query params)
 * 
 * Example routing:
 * nebula://sample-miniapp/         -> NebulaApp_Home
 * nebula://sample-miniapp/page1    -> NebulaApp_Page1
 * nebula://sample-miniapp/page2    -> NebulaApp_Page2
 */

// Register each page as a separate component
// The native side will determine which component to instantiate based on route path
AppRegistry.registerComponent('NebulaApp_Home', () => HomePage);
AppRegistry.registerComponent('NebulaApp_Page1', () => Page1);
AppRegistry.registerComponent('NebulaApp_Page2', () => Page2);
AppRegistry.registerComponent('NebulaApp_Page3', () => Page3);

// Default registration for backward compatibility
AppRegistry.registerComponent('NebulaApp', () => HomePage);

