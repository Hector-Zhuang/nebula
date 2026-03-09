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
  installJSI(appId: string): void;
}

export default TurboModuleRegistry.get<Spec>('NebulaNativeModule');
