import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';
import type {UnsafeObject} from 'react-native/Libraries/Types/CodegenTypes';

export type MiniAppRuntimeMode = 'development' | 'production';

export type MiniAppResult = {
  success: boolean;
  appId: string;
  mode?: string;
};

export type InstalledMiniAppsResult = {
  apps: string[];
};

export type NavigationResult = {
  errMsg: string;
};

export interface Spec extends TurboModule {
  openMiniApp(appId: string, initialProps: UnsafeObject): Promise<MiniAppResult>;
  preloadMiniApp(appId: string): Promise<MiniAppResult>;
  preloadMiniAppWithMode(
    appId: string,
    bundleURL: string,
    mode: MiniAppRuntimeMode,
  ): Promise<MiniAppResult>;
  installMiniApp(appId: string, bundleURL: string): Promise<MiniAppResult>;
  installMiniAppWithMode(
    appId: string,
    bundleURL: string,
    mode: MiniAppRuntimeMode,
  ): Promise<MiniAppResult>;
  getInstalledMiniApps(): Promise<InstalledMiniAppsResult>;
  registerRoutes(appId: string, routes: UnsafeObject): Promise<UnsafeObject>;
  postMessageToHost(appId: string, message: UnsafeObject): Promise<NavigationResult>;
  postMessageToMiniApp(appId: string, message: UnsafeObject): Promise<NavigationResult>;

  // Mini-app navigation APIs
  navigateTo(appId: string, url: string): Promise<NavigationResult>;
  redirectTo(appId: string, url: string): Promise<NavigationResult>;
  reLaunch(appId: string, url: string): Promise<NavigationResult>;
  navigateBack(appId: string, delta: number): Promise<NavigationResult>;
  showToast(title: string): Promise<NavigationResult>;
  getDeviceInfo(): UnsafeObject;
}

export default TurboModuleRegistry.get<Spec>('NebulaNativeModule');
