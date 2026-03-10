/**
 * Nebula Mini-App Framework - TypeScript API
 */

import { NativeModules } from 'react-native';
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import NebulaNativeModuleSpec from '../../specs/NativeNebulaModule';

export type MiniAppRuntimeMode = 'development' | 'production';

type MiniAppResult = {
  success: boolean;
  appId: string;
  mode?: string;
};

type InstalledMiniAppsResult = {
  apps: string[];
};

type NavigationResult = {
  errMsg: string;
};

type NebulaNativeModuleType = TurboModule & {
  openMiniApp: (appId: string, initialProps: Record<string, unknown>) => Promise<MiniAppResult>;
  preloadMiniApp: (appId: string) => Promise<MiniAppResult>;
  preloadMiniAppWithMode: (
    appId: string,
    bundleURL: string,
    mode: MiniAppRuntimeMode,
  ) => Promise<MiniAppResult>;
  installMiniApp: (appId: string, bundleURL: string) => Promise<MiniAppResult>;
  installMiniAppWithMode: (
    appId: string,
    bundleURL: string,
    mode: MiniAppRuntimeMode,
  ) => Promise<MiniAppResult>;
  getInstalledMiniApps: () => Promise<InstalledMiniAppsResult>;
  
  // Navigation APIs
  navigateTo: (appId: string, url: string) => Promise<NavigationResult>;
  redirectTo: (appId: string, url: string) => Promise<NavigationResult>;
  reLaunch: (appId: string, url: string) => Promise<NavigationResult>;
  navigateBack: (appId: string, delta: number) => Promise<NavigationResult>;
  showToast: (title: string) => Promise<NavigationResult>;
  getDeviceInfo: () => Record<string, unknown>;
};

const turboNebulaNativeModule =
  (NebulaNativeModuleSpec as unknown as NebulaNativeModuleType | null) ??
  TurboModuleRegistry.get<NebulaNativeModuleType>('NebulaNativeModule');
const { NebulaNativeModule: legacyNebulaNativeModule } = NativeModules as {
  NebulaNativeModule?: NebulaNativeModuleType;
};
const NebulaNativeModule = turboNebulaNativeModule ?? legacyNebulaNativeModule;

let currentMiniAppId: string | null = null;

if (!NebulaNativeModule) {
  console.warn('[Nebula] NebulaNativeModule not found. Make sure Nebula framework is integrated.');
}

function getNebulaNativeModule(): NebulaNativeModuleType {
  if (!NebulaNativeModule) {
    throw new Error('[Nebula] NebulaNativeModule not available');
  }
  return NebulaNativeModule;
}

export class NebulaAPI {
  static async openMiniApp(
    appId: string,
    initialProps: Record<string, unknown> = {},
  ): Promise<MiniAppResult> {
    const nativeModule = getNebulaNativeModule();
    try {
      const result = await nativeModule.openMiniApp(appId, initialProps);
      console.log(`[Nebula] Opened mini-app: ${appId}`, result);
      return result;
    } catch (error) {
      console.error(`[Nebula] Failed to open mini-app: ${appId}`, error);
      throw error;
    }
  }

  static async preloadMiniApp(appId: string): Promise<MiniAppResult> {
    const nativeModule = getNebulaNativeModule();
    try {
      const result = await nativeModule.preloadMiniApp(appId);
      console.log(`[Nebula] Preloaded mini-app: ${appId}`, result);
      return result;
    } catch (error) {
      console.error(`[Nebula] Failed to preload mini-app: ${appId}`, error);
      throw error;
    }
  }

  static async preloadMiniAppWithMode(
    appId: string,
    bundleURL: string,
    mode: MiniAppRuntimeMode,
  ): Promise<MiniAppResult> {
    const nativeModule = getNebulaNativeModule();
    try {
      const result = await nativeModule.preloadMiniAppWithMode(appId, bundleURL, mode);
      console.log(`[Nebula] Preloaded mini-app: ${appId}, mode=${mode}`, result);
      return result;
    } catch (error) {
      console.error(`[Nebula] Failed to preload mini-app: ${appId}, mode=${mode}`, error);
      throw error;
    }
  }

  static async installMiniApp(appId: string, bundleURL: string): Promise<MiniAppResult> {
    const nativeModule = getNebulaNativeModule();
    try {
      const result = await nativeModule.installMiniApp(appId, bundleURL);
      console.log(`[Nebula] Installed mini-app: ${appId}`, result);
      return result;
    } catch (error) {
      console.error(`[Nebula] Failed to install mini-app: ${appId}`, error);
      throw error;
    }
  }

  static async installMiniAppWithMode(
    appId: string,
    bundleURL: string,
    mode: MiniAppRuntimeMode,
  ): Promise<MiniAppResult> {
    const nativeModule = getNebulaNativeModule();
    try {
      const result = await nativeModule.installMiniAppWithMode(appId, bundleURL, mode);
      console.log(`[Nebula] Installed mini-app: ${appId}, mode=${mode}`, result);
      return result;
    } catch (error) {
      console.error(`[Nebula] Failed to install mini-app: ${appId}, mode=${mode}`, error);
      throw error;
    }
  }

  static async openMiniAppWithMode(
    appId: string,
    bundleURL: string,
    mode: MiniAppRuntimeMode,
    initialProps: Record<string, unknown> = {},
  ): Promise<MiniAppResult> {
    await this.installMiniAppWithMode(appId, bundleURL, mode);
    return this.openMiniApp(appId, initialProps);
  }

  static async getInstalledMiniApps(): Promise<InstalledMiniAppsResult> {
    const nativeModule = getNebulaNativeModule();
    try {
      const result = await nativeModule.getInstalledMiniApps();
      console.log('[Nebula] Installed mini-apps:', result);
      return result;
    } catch (error) {
      console.error('[Nebula] Failed to get installed mini-apps', error);
      throw error;
    }
  }
}

export class MiniAppAPI {
  static bootstrap(appId?: string | null): void {
    if (typeof appId === 'string' && appId.length > 0) {
      currentMiniAppId = appId;
    }
  }

  static async navigateTo(url: string): Promise<{ errMsg: string }> {
    const nativeModule = getNebulaNativeModule();
    const appId = currentMiniAppId || '';
    return nativeModule.navigateTo(appId, url);
  }

  static async redirectTo(url: string): Promise<{ errMsg: string }> {
    const nativeModule = getNebulaNativeModule();
    const appId = currentMiniAppId || '';
    return nativeModule.redirectTo(appId, url);
  }

  static async reLaunch(url: string): Promise<{ errMsg: string }> {
    const nativeModule = getNebulaNativeModule();
    const appId = currentMiniAppId || '';
    return nativeModule.reLaunch(appId, url);
  }

  static async navigateBack(delta = 1): Promise<{ errMsg: string }> {
    const nativeModule = getNebulaNativeModule();
    const appId = currentMiniAppId || '';
    return nativeModule.navigateBack(appId, delta);
  }

  static getDeviceInfo(): unknown {
    const nativeModule = getNebulaNativeModule();
    return nativeModule.getDeviceInfo();
  }

  static getAppId(): string | null {
    return currentMiniAppId;
  }

  static getSandboxPath(): string {
    // Calculate locally - no native call needed
    const appId = currentMiniAppId || '';
    return `/Documents/MiniApps/${appId}`;
  }

  static async showToast(title: string): Promise<{ errMsg: string }> {
    const nativeModule = getNebulaNativeModule();
    return nativeModule.showToast(title);
  }
}

export const wx = {
  navigateTo: ({ url }: { url: string }) => MiniAppAPI.navigateTo(url),
  redirectTo: ({ url }: { url: string }) => MiniAppAPI.redirectTo(url),
  reLaunch: ({ url }: { url: string }) => MiniAppAPI.reLaunch(url),
  navigateBack: ({ delta = 1 }: { delta?: number } = {}) => MiniAppAPI.navigateBack(delta),
  showToast: ({ title }: { title: string }) => MiniAppAPI.showToast(title),
  getSystemInfo: () => Promise.resolve(MiniAppAPI.getDeviceInfo()),
};
