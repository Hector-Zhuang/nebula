import React from 'react';
import { Platform } from 'react-native';
import type { NebulaHostFeature } from './hostApi';
import {
  configureMiniappLoadingComponent,
  ensureInternalMiniappLoadingComponentRegistered,
  getMiniappLoadingDelayMs,
  hideMiniappLoading,
  setMiniappLoadingState,
} from './miniappLoading';
import { Miniapp } from './miniappRuntime';
import { getNebulaNativeModule } from './nebulaNative';
import {
  registerHostApiHandler,
  resolveHostApiDescriptions,
  resolveHostCapabilities,
  startHostApiServer,
  stopHostApiServer,
  unregisterHostApiHandler,
} from './hostProtocol';
import type {
  HostVisibilityResult,
  InstalledMiniAppInfoResult,
  InstalledMiniAppsResult,
  MiniAppResult,
  MiniAppUpdateInfo,
  MiniAppVersionType,
  MiniappLoadingDelayResult,
  MiniappLoadingResolveContext,
  MiniappLoadingResolvedProps,
  NavigationResult,
  NebulaHostApiDescriptionMap,
  NebulaHostApiHandler,
  NebulaHostCapabilityMap,
  RegisteredMiniAppManifest,
  ServerBaseURLResult,
} from './nebulaTypes';

export * from './nebulaTypes';
export { Miniapp } from './miniappRuntime';
export {
  createMiniAppPage,
  usePageOnHide,
  usePageOnLoad,
  usePageOnReady,
  usePageOnShow,
  usePageOnUnload,
} from './miniappPage';

type NebulaHostOptions = {
  hostApis?: NebulaHostFeature[];
  miniappLoading?: {
    component: React.ComponentType<MiniappLoadingResolveContext>;
    delayMs?: number;
    enterContentDelayMs?: number;
    resolveProps?: (
      context: MiniappLoadingResolveContext,
    ) => MiniappLoadingResolvedProps;
  };
  serverBaseURL?: string | null;
};

type MiniAppInstallPayload = {
  appId: string;
  appName?: string;
  iconUrl?: string | null;
  versionId?: string;
  version?: string;
  bundles?: {
    ios?: string;
    android?: string;
  } | null;
  assetsUrl: {
    ios: string;
    android: string;
  };
  manifestUrl: string;
};

function compareMiniAppVersions(
  left?: string | null,
  right?: string | null,
): number {
  if (!left && !right) {
    return 0;
  }
  if (!left) {
    return -1;
  }
  if (!right) {
    return 1;
  }
  return compareCapabilityVersions(left, right);
}

function compareCapabilityVersions(left: string, right: string): number {
  const leftParts = left.split('.').map(part => Number(part) || 0);
  const rightParts = right.split('.').map(part => Number(part) || 0);
  const maxLength = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const leftPart = leftParts[index] ?? 0;
    const rightPart = rightParts[index] ?? 0;
    if (leftPart > rightPart) {
      return 1;
    }
    if (leftPart < rightPart) {
      return -1;
    }
  }

  return 0;
}

function normalizeUpdateStrategy(strategy?: string | null): 'auto' | 'manual' {
  return strategy === 'auto' ? 'auto' : 'manual';
}

function isDevelopmentMiniAppMode(mode?: string | null): boolean {
  return mode?.toLowerCase() === 'development';
}

function canCheckForRemoteUpdate(
  sourceUrl?: string | null,
  mode?: string | null,
) {
  if (!sourceUrl) {
    return false;
  }
  if (isDevelopmentMiniAppMode(mode)) {
    return false;
  }
  return /^https?:\/\//i.test(sourceUrl);
}

function deriveMiniAppManifestUrl(sourceUrl: string): string | null {
  try {
    const match = sourceUrl.match(
      /^(https?:\/\/[^/?#]+)(\/[^?#]*)?(\?[^#]*)?(#.*)?$/i,
    );
    if (!match) {
      return null;
    }
    const origin = match[1];
    const path = match[2] || '';
    const parentPath = path.includes('/')
      ? path.slice(0, path.lastIndexOf('/'))
      : '';
    const manifestPath = `${parentPath}/app.json`.replace(/\/{2,}/g, '/');
    return `${origin}${manifestPath.startsWith('/') ? manifestPath : `/${manifestPath}`}`;
  } catch {
    return null;
  }
}

function joinApiUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

function normalizeDevelopmentBundleURL(inputURL: string): string {
  const trimmedURL = inputURL.trim();
  if (!trimmedURL) {
    return trimmedURL;
  }

  if (trimmedURL.match(/\.nebula\/generated/)) {
    return trimmedURL;
  }

  try {
    const parsed = new URL(trimmedURL);

    if (parsed.pathname === '/') {
      return `${trimmedURL}/.nebula/generated/index.bundle?platform=${Platform.OS}&dev=true&minify=false`;
    }

    return trimmedURL;
  } catch {
    return trimmedURL;
  }
}

function resolveBundleUrlForPlatform(
  payload: MiniAppInstallPayload,
): string | null {
  if (Platform.OS === 'android') {
    return payload.bundles?.android ?? null;
  }
  return payload.bundles?.ios ?? null;
}

function resolveAssetsUrlForPlatform(payload: MiniAppInstallPayload): string {
  if (Platform.OS === 'android') {
    return payload.assetsUrl.android;
  }
  return payload.assetsUrl.ios;
}

export class NebulaAPI {
  static wrap(options: NebulaHostOptions) {
    configureMiniappLoadingComponent(
      options.miniappLoading?.component ?? null,
      options.miniappLoading?.resolveProps ?? null,
      options.miniappLoading?.delayMs ?? 0,
    );
    ensureInternalMiniappLoadingComponentRegistered();

    return function wrapNebulaHost<P extends object>(
      AppComponent: React.ComponentType<P>,
    ) {
      function NebulaWrappedApp(props: P) {
        React.useEffect(() => {
          configureMiniappLoadingComponent(
            options.miniappLoading?.component ?? null,
            options.miniappLoading?.resolveProps ?? null,
            options.miniappLoading?.delayMs ?? 0,
          );
          NebulaAPI.startApiServer();
          const unregisterCallbacks =
            options.hostApis
              ?.map(feature => feature.register())
              .filter(Boolean) ?? [];
          const unsubscribePageLifecycle = Miniapp.onPageLifecycle(event => {
            if (event.type === 'ready') {
              const delayMs = getMiniappLoadingDelayMs();
              if (delayMs > 0) {
                setTimeout(() => hideMiniappLoading(event.appId), delayMs);
              } else {
                hideMiniappLoading(event.appId);
              }
            }
          });

          NebulaAPI.setMiniappLoadingDelay(
            options.miniappLoading?.delayMs ?? 0,
          ).catch(error => {
            console.error(
              '[Nebula] Failed to apply miniapp loading delay',
              error,
            );
          });
          NebulaAPI.setMiniappLoadingEnterContentDelay(
            options.miniappLoading?.enterContentDelayMs ?? 0,
          ).catch(error => {
            console.error(
              '[Nebula] Failed to apply miniapp content enter delay',
              error,
            );
          });

          NebulaAPI.setMiniappLoadingEnabled(
            !!options.miniappLoading?.component,
          ).catch(error => {
            console.error(
              '[Nebula] Failed to apply miniapp loading enabled',
              error,
            );
          });

          if (typeof options.serverBaseURL !== 'undefined') {
            NebulaAPI.setServerBaseURL(options.serverBaseURL).catch(error => {
              console.error(
                '[Nebula] Failed to apply host configuration',
                error,
              );
            });
          }

          return () => {
            unsubscribePageLifecycle();
            unregisterCallbacks.forEach(unregister => {
              if (typeof unregister === 'function') {
                unregister();
              }
            });
          };
        }, []);

        return React.createElement(AppComponent, props);
      }

      NebulaWrappedApp.displayName = `NebulaWrapped(${AppComponent.displayName ?? AppComponent.name ?? 'App'})`;
      return NebulaWrappedApp;
    };
  }

  static async registerRoutes(
    appId: string,
    routes: Record<string, string>,
  ): Promise<void> {
    return this.registerManifest(appId, { pages: routes });
  }

  static async registerManifest(
    appId: string,
    manifest: RegisteredMiniAppManifest,
  ): Promise<void> {
    const nativeModule = getNebulaNativeModule();
    try {
      await nativeModule.registerManifest(appId, manifest);
    } catch (e) {
      console.warn(`[Nebula] registerManifest failed for ${appId}:`, e);
    }
  }

  static async openMiniApp(
    appId: string,
    initialProps: Record<string, unknown> = {},
    versionType: MiniAppVersionType = 'release',
  ): Promise<MiniAppResult> {
    const nativeModule = getNebulaNativeModule();
    console.log('nativeModule', nativeModule);

    try {
      let installedInfo = await this.getInstalledMiniAppInfo(appId);
      let appName: string | undefined;
      if (!installedInfo.installed) {
        const serverBaseURLResult = await this.getServerBaseURL();
        const serverBaseURL = serverBaseURLResult.serverBaseURL?.trim();
        if (!serverBaseURL) {
          throw new Error(
            `Miniapp ${appId} is not installed and no serverBaseURL is configured for auto-install.`,
          );
        }

        setMiniappLoadingState({
          appId,
          mode: 'production',
          status: 'installing',
          title: appId,
          installedInfo: null,
          errorMessage: null,
          visible: true,
        });

        const installPayloadResponse = await fetch(
          joinApiUrl(
            serverBaseURL,
            `/mini-apps/access/apps/${encodeURIComponent(appId)}/${encodeURIComponent(versionType)}/install`,
          ),
        );
        if (!installPayloadResponse.ok) {
          throw new Error(
            `Failed to fetch ${versionType} install payload for ${appId}: ${installPayloadResponse.status}`,
          );
        }
        const installPayload =
          (await installPayloadResponse.json()) as MiniAppInstallPayload;

        appName = installPayload.appName;

        setMiniappLoadingState({
          title: appName ?? appId,
          iconUrl: installPayload.iconUrl ?? undefined,
        });
        const bundleURL = resolveBundleUrlForPlatform(installPayload);
        if (!bundleURL) {
          throw new Error(
            `No bundle URL available for platform ${Platform.OS}`,
          );
        }

        const assetsURL = resolveAssetsUrlForPlatform(installPayload);

        await nativeModule.installMiniAppFromURLs(
          appId,
          bundleURL,
          installPayload.manifestUrl,
          assetsURL,
          false,
        );
        installedInfo = await this.getInstalledMiniAppInfo(appId);
      }
      const nextMode =
        installedInfo.app?.mode?.toLowerCase() === 'development'
          ? 'development'
          : 'production';
      if (!isDevelopmentMiniAppMode(installedInfo.app?.mode)) {
        setMiniappLoadingState({
          appId,
          mode: nextMode,
          status: 'loading',
          title: appName ?? appId,
          installedInfo: installedInfo.app ?? null,
          errorMessage: null,
          visible: true,
        });
      }
      if (
        installedInfo.installed &&
        !isDevelopmentMiniAppMode(installedInfo.app?.mode) &&
        normalizeUpdateStrategy(installedInfo.app?.updateStrategy) === 'auto'
      ) {
        await this.applyMiniAppUpdate(appId).catch(error => {
          console.warn(
            `[Nebula] Failed to auto-update mini-app before open: ${appId}`,
            error,
          );
        });
      }
      const result = await nativeModule.openMiniApp(appId, initialProps);
      console.log(`[Nebula] Opened mini-app: ${appId}`, result);
      return result;
    } catch (error) {
      hideMiniappLoading(appId);
      console.error(`[Nebula] Failed to open mini-app: ${appId}`, error);
      throw error;
    }
  }

  static async preloadMiniApp(appId: string): Promise<MiniAppResult> {
    const result = await getNebulaNativeModule().preloadMiniApp(appId);
    console.log(`[Nebula] Preloaded mini-app: ${appId}`, result);
    return result;
  }

  static async preloadMiniAppWithBundleURL(
    appId: string,
    bundleURL: string,
    connectToURLMetroServer = false,
  ): Promise<MiniAppResult> {
    const resolvedBundleURL = connectToURLMetroServer
      ? normalizeDevelopmentBundleURL(bundleURL)
      : bundleURL;
    const result = await getNebulaNativeModule().preloadMiniAppWithBundleURL(
      appId,
      resolvedBundleURL,
      connectToURLMetroServer,
    );
    console.log(
      `[Nebula] Preloaded mini-app: ${appId}, metro=${connectToURLMetroServer}`,
      result,
    );
    return result;
  }

  static async installMiniApp(
    appId: string,
    bundleURL: string,
  ): Promise<MiniAppResult> {
    const result = await getNebulaNativeModule().installMiniApp(
      appId,
      bundleURL,
    );
    console.log(`[Nebula] Installed mini-app: ${appId}`, result);
    return result;
  }

  static async installMiniAppWithBundleURL(
    appId: string,
    bundleURL: string,
    connectToURLMetroServer = false,
  ): Promise<MiniAppResult> {
    const resolvedBundleURL = connectToURLMetroServer
      ? normalizeDevelopmentBundleURL(bundleURL)
      : bundleURL;
    const result = await getNebulaNativeModule().installMiniAppWithBundleURL(
      appId,
      resolvedBundleURL,
      connectToURLMetroServer,
    );
    console.log(
      `[Nebula] Installed mini-app: ${appId}, metro=${connectToURLMetroServer}`,
      result,
    );
    return result;
  }

  static async uninstallMiniApp(appId: string): Promise<MiniAppResult> {
    const result = await getNebulaNativeModule().uninstallMiniApp(appId);
    console.log(`[Nebula] Uninstalled mini-app: ${appId}`, result);
    return result;
  }

  static async closeMiniApp(appId: string): Promise<MiniAppResult> {
    hideMiniappLoading(appId);
    const result = await getNebulaNativeModule().closeMiniApp(appId);
    console.log(`[Nebula] Closed mini-app: ${appId}`, result);
    return result;
  }

  static async openMiniAppWithBundleURL(
    appId: string,
    bundleURL: string,
    initialProps: Record<string, unknown> = {},
    connectToURLMetroServer = false,
  ): Promise<MiniAppResult> {
    const resolvedBundleURL = connectToURLMetroServer
      ? normalizeDevelopmentBundleURL(bundleURL)
      : bundleURL;
    if (connectToURLMetroServer) {
      hideMiniappLoading(appId);
    } else {
      setMiniappLoadingState({
        appId,
        mode: 'production',
        status: 'installing',
        title: appId,
        installedInfo: null,
        errorMessage: null,
        visible: true,
      });
    }
    await this.installMiniAppWithBundleURL(
      appId,
      resolvedBundleURL,
      connectToURLMetroServer,
    );
    return this.openMiniApp(appId, initialProps);
  }

  static async getInstalledMiniApps(): Promise<InstalledMiniAppsResult> {
    const result = await getNebulaNativeModule().getInstalledMiniApps();
    console.log('[Nebula] Installed mini-apps:', result);
    return result;
  }

  static async getInstalledMiniAppInfo(
    appId: string,
  ): Promise<InstalledMiniAppInfoResult> {
    return getNebulaNativeModule().getInstalledMiniAppInfo(appId);
  }

  static async checkMiniAppUpdate(appId: string): Promise<MiniAppUpdateInfo> {
    const installedInfo = await this.getInstalledMiniAppInfo(appId);
    const app = installedInfo.app;
    const isDevelopmentMode = isDevelopmentMiniAppMode(app?.mode);
    const updateStrategy = isDevelopmentMode
      ? 'manual'
      : normalizeUpdateStrategy(app?.updateStrategy);

    if (!installedInfo.installed || !app) {
      return {
        appId,
        currentVersion: null,
        latestVersion: null,
        hasUpdate: false,
        updateStrategy,
      };
    }

    if (!canCheckForRemoteUpdate(app.sourceUrl, app.mode)) {
      return {
        appId,
        currentVersion: isDevelopmentMode ? null : (app.version ?? null),
        latestVersion: isDevelopmentMode ? null : (app.version ?? null),
        hasUpdate: false,
        updateStrategy,
        mode: app.mode ?? null,
        sourceUrl: app.sourceUrl ?? null,
      };
    }

    const manifestUrl = deriveMiniAppManifestUrl(app.sourceUrl as string);
    if (!manifestUrl) {
      return {
        appId,
        currentVersion: app.version ?? null,
        latestVersion: null,
        hasUpdate: false,
        updateStrategy,
        mode: app.mode ?? null,
        sourceUrl: app.sourceUrl ?? null,
      };
    }

    try {
      const response = await fetch(manifestUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch update manifest: ${response.status}`);
      }
      const remoteManifest =
        (await response.json()) as RegisteredMiniAppManifest & {
          version?: string;
        };
      const latestVersion = remoteManifest.version ?? null;
      const hasUpdate =
        latestVersion != null &&
        compareMiniAppVersions(latestVersion, app.version ?? null) > 0;

      return {
        appId,
        currentVersion: app.version ?? null,
        latestVersion,
        hasUpdate,
        updateStrategy,
        mode: app.mode ?? null,
        sourceUrl: app.sourceUrl ?? null,
      };
    } catch (error) {
      console.warn(`[Nebula] Failed to check mini-app update: ${appId}`, error);
      return {
        appId,
        currentVersion: app.version ?? null,
        latestVersion: null,
        hasUpdate: false,
        updateStrategy,
        mode: app.mode ?? null,
        sourceUrl: app.sourceUrl ?? null,
      };
    }
  }

  static async applyMiniAppUpdate(appId: string): Promise<MiniAppUpdateInfo> {
    const updateInfo = await this.checkMiniAppUpdate(appId);
    if (!updateInfo.hasUpdate || !updateInfo.sourceUrl) {
      return updateInfo;
    }

    await this.installMiniAppWithBundleURL(appId, updateInfo.sourceUrl, false);
    return this.checkMiniAppUpdate(appId);
  }

  static async getServerBaseURL(): Promise<ServerBaseURLResult> {
    return getNebulaNativeModule().getServerBaseURL();
  }

  static async setServerBaseURL(
    serverBaseURL?: string | null,
  ): Promise<ServerBaseURLResult> {
    return getNebulaNativeModule().setServerBaseURL(serverBaseURL);
  }

  static async setMiniappLoadingDelay(
    delayMs?: number | null,
  ): Promise<MiniappLoadingDelayResult> {
    return getNebulaNativeModule().setMiniappLoadingDelay(delayMs);
  }

  static async setMiniappLoadingEnterContentDelay(
    delayMs?: number | null,
  ): Promise<MiniappLoadingDelayResult> {
    return getNebulaNativeModule().setMiniappLoadingEnterContentDelay(delayMs);
  }

  static async setMiniappLoadingEnabled(
    enabled: boolean,
  ): Promise<{ enabled: boolean }> {
    return getNebulaNativeModule().setMiniappLoadingEnabled(enabled);
  }

  static async postMessageToMiniApp(
    appId: string,
    message: Record<string, unknown>,
  ): Promise<NavigationResult> {
    return getNebulaNativeModule().postMessageToMiniApp(appId, message);
  }

  static async bringHostToFront(): Promise<HostVisibilityResult> {
    return getNebulaNativeModule().bringHostToFront();
  }

  static async restoreMiniApp(
    token?: string | null,
  ): Promise<HostVisibilityResult> {
    return getNebulaNativeModule().restoreMiniApp(token);
  }

  static async presentHostModal(
    moduleName: string,
    props: Record<string, unknown> = {},
  ): Promise<NavigationResult> {
    return getNebulaNativeModule().presentHostModal(moduleName, props);
  }

  static async dismissHostModal(): Promise<NavigationResult> {
    return getNebulaNativeModule().dismissHostModal();
  }

  static addMiniAppMessageListener(
    listener: (event: {
      appId: string;
      message: Record<string, unknown>;
      timestamp?: number;
    }) => void,
  ): () => void {
    return Miniapp.onHostMessage(listener);
  }

  static startApiServer(): void {
    startHostApiServer((appId, message) =>
      this.postMessageToMiniApp(appId, message),
    );
  }

  static stopApiServer(): void {
    stopHostApiServer();
  }

  static registerApiHandler(
    apiName: string,
    handler: NebulaHostApiHandler,
  ): void {
    registerHostApiHandler(apiName, handler);
    this.startApiServer();
  }

  static unregisterApiHandler(apiName: string): void {
    unregisterHostApiHandler(apiName);
  }

  static async getRegisteredCapabilities(): Promise<NebulaHostCapabilityMap> {
    return resolveHostCapabilities();
  }

  static getRegisteredApiDescriptions(): NebulaHostApiDescriptionMap {
    return resolveHostApiDescriptions();
  }
}
