import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { UnsafeObject } from 'react-native/Libraries/Types/CodegenTypes';

export type MiniAppUpdateStrategy = 'auto' | 'manual';

export type MiniAppResult = {
  success: boolean;
  appId: string;
  mode?: string;
};

export type InstalledMiniAppsResult = {
  apps: string[];
};

export type InstalledMiniAppInfo = {
  appId: string;
  mode?: string | null;
  bundlePath?: string | null;
  sourceUrl?: string | null;
  version?: string | null;
  updateStrategy?: MiniAppUpdateStrategy | null;
};

export type InstalledMiniAppInfoResult = {
  installed: boolean;
  app?: InstalledMiniAppInfo | null;
};

export type ServerBaseURLResult = {
  serverBaseURL?: string | null;
};

export type MiniappLoadingDelayResult = {
  delayMs: number;
};

export type NebulaCapabilityMap = {
  [capabilityName: string]: string;
};

export type NebulaCapabilitiesResult = {
  bridgeVersion: string;
  capabilities: NebulaCapabilityMap;
};

export type NavigationResult = {
  errMsg: string;
};

export type HostVisibilityResult = {
  success: boolean;
  token?: string | null;
};

export type NebulaPageStyle = {
  backgroundColor?: string;
  navigationBarBackgroundColor?: string;
  navigationBarTextColor?: string;
  navigationBarTitleText?: string;
  navigationStyle?: 'default' | 'custom';
  visualEffectInBackground?: 'blur' | 'none';
};

export interface Spec extends TurboModule {
  openMiniApp(
    appId: string,
    initialProps: UnsafeObject,
  ): Promise<MiniAppResult>;
  openMiniAppWithBundleURL(
    appId: string,
    bundleURL: string,
    connectToURLMetroServer: boolean,
    initialProps: UnsafeObject,
  ): Promise<MiniAppResult>;
  preloadMiniApp(appId: string): Promise<MiniAppResult>;
  preloadMiniAppWithBundleURL(
    appId: string,
    bundleURL: string,
    connectToURLMetroServer: boolean,
  ): Promise<MiniAppResult>;
  installMiniApp(appId: string, bundleURL: string): Promise<MiniAppResult>;
  installMiniAppWithBundleURL(
    appId: string,
    bundleURL: string,
    connectToURLMetroServer: boolean,
  ): Promise<MiniAppResult>;
  installMiniAppFromURLs(
    appId: string,
    bundleURL: string,
    manifestURL: string,
    assetsURL: string,
    connectToURLMetroServer: boolean,
  ): Promise<MiniAppResult>;
  closeMiniApp(appId: string): Promise<MiniAppResult>;
  uninstallMiniApp(appId: string): Promise<MiniAppResult>;
  getCapabilities(): Promise<NebulaCapabilitiesResult>;
  getServerBaseURL(): Promise<ServerBaseURLResult>;
  setServerBaseURL(serverBaseURL?: string | null): Promise<ServerBaseURLResult>;
  setMiniappLoadingDelay(
    delayMs?: number | null,
  ): Promise<MiniappLoadingDelayResult>;
  setMiniappLoadingEnterContentDelay(
    delayMs?: number | null,
  ): Promise<MiniappLoadingDelayResult>;
  setMiniappLoadingEnabled(enabled: boolean): Promise<{ enabled: boolean }>;
  getInstalledMiniApps(): Promise<InstalledMiniAppsResult>;
  getInstalledMiniAppInfo(appId: string): Promise<InstalledMiniAppInfoResult>;
  registerRoutes(appId: string, routes: UnsafeObject): Promise<UnsafeObject>;
  registerManifest(
    appId: string,
    manifest: UnsafeObject,
  ): Promise<UnsafeObject>;
  postMessageToHost(
    appId: string,
    message: UnsafeObject,
  ): Promise<NavigationResult>;
  postMessageToMiniApp(
    appId: string,
    message: UnsafeObject,
  ): Promise<NavigationResult>;
  bringHostToFront(): Promise<HostVisibilityResult>;
  restoreMiniApp(token?: string | null): Promise<HostVisibilityResult>;
  presentHostModal(
    moduleName: string,
    props: UnsafeObject,
  ): Promise<NavigationResult>;
  dismissHostModal(): Promise<NavigationResult>;

  // Mini-app navigation APIs
  navigateTo(appId: string, url: string): Promise<NavigationResult>;
  redirectTo(appId: string, url: string): Promise<NavigationResult>;
  reLaunch(appId: string, url: string): Promise<NavigationResult>;
  navigateBack(appId: string, delta: number): Promise<NavigationResult>;
  setPageStyle(appId: string, style: UnsafeObject): Promise<NavigationResult>;
  showToast(title: string): Promise<NavigationResult>;
  getDeviceInfo(): UnsafeObject;
}

export default TurboModuleRegistry.get<Spec>('NebulaNativeModule');
