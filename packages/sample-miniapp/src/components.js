/**
 * Component registry - maps component name strings to actual component constructors.
 * Add new pages here when adding routes to app.json.
 */
import HomePage from './HomePage';
import NebulaComponentsPage from './NebulaComponentsPage';
import ComponentsMediaPage from './ComponentsMediaPage';
import ComponentsSwiperPage from './ComponentsSwiperPage';
import ComponentsPickerPage from './ComponentsPickerPage';
import ComponentsRichTextPage from './ComponentsRichTextPage';
import ComponentsIconPage from './ComponentsIconPage';
import ComponentsMapPage from './ComponentsMapPage';
import ComponentsWebViewPage from './ComponentsWebViewPage';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';

const components = {
  NebulaApp_Home: HomePage,
  NebulaApp_Nebula: NebulaComponentsPage,
  NebulaApp_ComponentsMedia: ComponentsMediaPage,
  NebulaApp_ComponentsSwiper: ComponentsSwiperPage,
  NebulaApp_ComponentsPicker: ComponentsPickerPage,
  NebulaApp_ComponentsRichText: ComponentsRichTextPage,
  NebulaApp_ComponentsIcon: ComponentsIconPage,
  NebulaApp_ComponentsMap: ComponentsMapPage,
  NebulaApp_ComponentsWebView: ComponentsWebViewPage,
  NebulaApp_Page1: Page1,
  NebulaApp_Page2: Page2,
  NebulaApp_Page3: Page3,
  NebulaApp: HomePage, // default fallback
};

export default components;
