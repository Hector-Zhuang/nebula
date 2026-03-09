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

type AsyncCallback = {
  onSuccess: (resultJson: string) => void;
  onFail: (errorJson: string) => void;
};

type NebulaNativeInvoke = {
  appId?: string;
  invokeSync: (method: string, paramsJson: string) => string;
  invokeAsync: (method: string, paramsJson: string, callback: AsyncCallback) => void;
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
  installJSI?: (appId: string) => void;
};

declare global {
  var __NebulaNativeInvoke: NebulaNativeInvoke | undefined;
}

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
      this.ensureNativeInvoke();
    }
  }

  private static ensureNativeInvoke(): void {
    if (typeof __NebulaNativeInvoke !== 'undefined') {
      return;
    }
    if (!currentMiniAppId) {
      return;
    }

    const nativeModule = getNebulaNativeModule();
    if (!nativeModule.installJSI) {
      return;
    }

    try {
      nativeModule.installJSI(currentMiniAppId);
    } catch (error) {
      console.warn('[Nebula] installJSI failed', error);
    }
  }

  static invokeSync(method: string, params: Record<string, unknown> = {}): unknown {
    this.ensureNativeInvoke();
    if (typeof __NebulaNativeInvoke === 'undefined') {
      throw new Error('[Nebula] __NebulaNativeInvoke not available. Are you inside a mini-app?');
    }

    const paramsJson = JSON.stringify(params);
    const resultJson = __NebulaNativeInvoke.invokeSync(method, paramsJson);

    try {
      return JSON.parse(resultJson);
    } catch {
      return resultJson;
    }
  }

  static invokeAsync(method: string, params: Record<string, unknown> = {}): Promise<unknown> {
    this.ensureNativeInvoke();
    if (typeof __NebulaNativeInvoke === 'undefined') {
      throw new Error('[Nebula] __NebulaNativeInvoke not available. Are you inside a mini-app?');
    }
    const nativeInvoke = __NebulaNativeInvoke;

    return new Promise((resolve, reject) => {
      const paramsJson = JSON.stringify(params);
      nativeInvoke.invokeAsync(method, paramsJson, {
        onSuccess: (resultJson: string) => {
          try {
            resolve(JSON.parse(resultJson));
          } catch {
            resolve(resultJson);
          }
        },
        onFail: (errorJson: string) => {
          try {
            reject(JSON.parse(errorJson));
          } catch {
            reject(new Error(errorJson));
          }
        },
      });
    });
  }

  static async navigateTo(url: string): Promise<{ errMsg: string }> {
    return this.invokeAsync('navigateTo', { url }) as Promise<{ errMsg: string }>;
  }

  static async redirectTo(url: string): Promise<{ errMsg: string }> {
    return this.invokeAsync('redirectTo', { url }) as Promise<{ errMsg: string }>;
  }

  static async reLaunch(url: string): Promise<{ errMsg: string }> {
    return this.invokeAsync('reLaunch', { url }) as Promise<{ errMsg: string }>;
  }

  static async navigateBack(delta = 1): Promise<{ errMsg: string }> {
    return this.invokeAsync('navigateBack', { delta }) as Promise<{ errMsg: string }>;
  }

  static getDeviceInfo(): unknown {
    return this.invokeSync('getDeviceInfo', {});
  }

  static getAppId(): string | null {
    if (typeof __NebulaNativeInvoke === 'undefined') {
      return null;
    }
    return __NebulaNativeInvoke.appId ?? null;
  }

  static getSandboxPath(): unknown {
    return this.invokeSync('getSandboxPath', {});
  }

  static async showToast(title: string): Promise<{ errMsg: string }> {
    return this.invokeAsync('showToast', { title }) as Promise<{ errMsg: string }>;
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
