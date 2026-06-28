import type { TurboModule } from 'react-native';
import type { NebulaPageStyle } from './specs/NativeNebulaModule';

export type { MiniAppUpdateStrategy } from './specs/NativeNebulaModule';
export type { NebulaPageStyle } from './specs/NativeNebulaModule';
export type {
  NebulaCapabilitiesResult as NebulaNativeCapabilitiesResult,
  NebulaCapabilityMap as NebulaNativeCapabilityMap,
} from './specs/NativeNebulaModule';

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
  updateStrategy?: 'auto' | 'manual' | null;
};

export type InstalledMiniAppInfoResult = {
  installed: boolean;
  app?: InstalledMiniAppInfo | null;
};

export type MiniAppUpdateInfo = {
  appId: string;
  currentVersion?: string | null;
  latestVersion?: string | null;
  hasUpdate: boolean;
  updateStrategy: 'auto' | 'manual';
  mode?: string | null;
  sourceUrl?: string | null;
};

export type MiniAppVersionType = 'release' | 'experience';

export type MiniappLoadingStatus = 'installing' | 'loading' | 'ready' | 'error';

export type MiniappLoadingResolveContext = {
  appId: string;
  mode: 'development' | 'production';
  status: MiniappLoadingStatus;
  title?: string | null;
  iconUrl?: string | null;
  errorMessage?: string | null;
  installedInfo?: InstalledMiniAppInfo | null;
};

export type MiniappLoadingResolvedProps = Partial<
  Pick<MiniappLoadingResolveContext, 'title' | 'iconUrl'>
>;

export type ServerBaseURLResult = {
  serverBaseURL?: string | null;
};

export type MiniappLoadingDelayResult = {
  delayMs: number;
};

export type NavigationResult = {
  errMsg: string;
};

export type HostVisibilityResult = {
  success: boolean;
  token?: string | null;
};

export type RegisteredMiniAppManifest = {
  entryPagePath?: string;
  pageConfigs?: Record<string, NebulaPageStyle>;
  pages: Record<string, string>;
  updateStrategy?: 'auto' | 'manual';
  version?: string;
  window?: NebulaPageStyle;
};

export type BridgeMessage = {
  appId: string;
  message: Record<string, unknown>;
  timestamp?: number;
};

export type NebulaApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type NebulaApiInvokeResult<T = unknown> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: NebulaApiError;
    };

export type NebulaHostCapabilityDescriptor = {
  supported: boolean;
  version: string;
};

export type NebulaHostCapabilityMap = Record<
  string,
  NebulaHostCapabilityDescriptor
>;

export type NebulaApiFieldDescriptor = {
  name: string;
  type: string;
  required?: boolean;
  description: string;
};

export type NebulaApiExampleDescriptor = {
  title: string;
  code: string;
};

export type NebulaHostApiDescription = {
  summary: string;
  description?: string;
  params?: NebulaApiFieldDescriptor[];
  returns?: {
    type: string;
    description: string;
  };
  tags?: string[];
  examples?: NebulaApiExampleDescriptor[];
};

export type NebulaHostApiDescriptionMap = Record<
  string,
  NebulaHostApiDescription
>;

export type NebulaProtocolRequest =
  | {
      __nebulaProtocol: 'api.v1';
      kind: 'getCapabilities';
      requestId: string;
    }
  | {
      __nebulaProtocol: 'api.v1';
      kind: 'getApiDescriptions';
      requestId: string;
    }
  | {
      __nebulaProtocol: 'api.v1';
      kind: 'invoke';
      requestId: string;
      api: string;
      version?: string;
      payload?: Record<string, unknown>;
    };

export type NebulaProtocolResponse =
  | {
      __nebulaProtocol: 'api.v1';
      kind: 'capabilities';
      requestId: string;
      data: {
        bridgeVersion: string;
        capabilities: NebulaHostCapabilityMap;
      };
    }
  | {
      __nebulaProtocol: 'api.v1';
      kind: 'apiDescriptions';
      requestId: string;
      data: NebulaHostApiDescriptionMap;
    }
  | {
      __nebulaProtocol: 'api.v1';
      kind: 'invokeResult';
      requestId: string;
      result: NebulaApiInvokeResult;
    };

export type NebulaHostApiContext = {
  appId: string;
  requestId: string;
  version?: string;
};

export type NebulaHostApiHandler = {
  version: string;
  supported?: boolean | (() => boolean | Promise<boolean>);
  description?: NebulaHostApiDescription;
  handle: (
    payload: Record<string, unknown>,
    context: NebulaHostApiContext,
  ) => Promise<NebulaApiInvokeResult> | NebulaApiInvokeResult;
};

export type PendingProtocolRequest = {
  reject: (reason?: unknown) => void;
  resolve: (value: any) => void;
  timeoutId: ReturnType<typeof setTimeout>;
};

export type PageLifecycleEvent = {
  appId: string;
  instanceId: string;
  routePath?: string;
  type: 'show' | 'hide' | 'unload' | 'ready';
};

export type MiniAppPageContextValue = {
  appId: string | null;
  instanceId: string | null;
  params: Record<string, unknown>;
  routePath: string;
  routeUrl: string;
  pageStyle: Record<string, unknown>;
};

export type NebulaNativeModuleType = TurboModule & {
  openMiniApp: (
    appId: string,
    initialProps: Record<string, unknown>,
  ) => Promise<MiniAppResult>;
  openMiniAppWithBundleURL: (
    appId: string,
    bundleURL: string,
    connectToURLMetroServer: boolean,
    initialProps: Record<string, unknown>,
  ) => Promise<MiniAppResult>;
  preloadMiniApp: (appId: string) => Promise<MiniAppResult>;
  preloadMiniAppWithBundleURL: (
    appId: string,
    bundleURL: string,
    connectToURLMetroServer: boolean,
  ) => Promise<MiniAppResult>;
  installMiniApp: (appId: string, bundleURL: string) => Promise<MiniAppResult>;
  installMiniAppWithBundleURL: (
    appId: string,
    bundleURL: string,
    connectToURLMetroServer: boolean,
  ) => Promise<MiniAppResult>;
  installMiniAppFromURLs: (
    appId: string,
    bundleURL: string,
    manifestURL: string,
    assetsURL: string,
    connectToURLMetroServer: boolean,
  ) => Promise<MiniAppResult>;
  closeMiniApp: (appId: string) => Promise<MiniAppResult>;
  uninstallMiniApp: (appId: string) => Promise<MiniAppResult>;
  getCapabilities: () => Promise<{
    bridgeVersion: string;
    capabilities: Record<string, string>;
  }>;
  getServerBaseURL: () => Promise<ServerBaseURLResult>;
  setServerBaseURL: (
    serverBaseURL?: string | null,
  ) => Promise<ServerBaseURLResult>;
  setMiniappLoadingDelay: (
    delayMs?: number | null,
  ) => Promise<MiniappLoadingDelayResult>;
  setMiniappLoadingEnterContentDelay: (
    delayMs?: number | null,
  ) => Promise<MiniappLoadingDelayResult>;
  setMiniappLoadingEnabled: (enabled: boolean) => Promise<{ enabled: boolean }>;
  registerRoutes: (
    appId: string,
    routes: Record<string, string>,
  ) => Promise<{ success: boolean; appId: string; count: number }>;
  registerManifest: (
    appId: string,
    manifest: RegisteredMiniAppManifest,
  ) => Promise<{ success: boolean; appId: string; count: number }>;
  postMessageToHost: (
    appId: string,
    message: Record<string, unknown>,
  ) => Promise<NavigationResult>;
  postMessageToMiniApp: (
    appId: string,
    message: Record<string, unknown>,
  ) => Promise<NavigationResult>;
  bringHostToFront: () => Promise<HostVisibilityResult>;
  restoreMiniApp: (token?: string | null) => Promise<HostVisibilityResult>;
  presentHostModal: (
    moduleName: string,
    props: Record<string, unknown>,
  ) => Promise<NavigationResult>;
  dismissHostModal: () => Promise<NavigationResult>;
  getInstalledMiniApps: () => Promise<InstalledMiniAppsResult>;
  getInstalledMiniAppInfo: (
    appId: string,
  ) => Promise<InstalledMiniAppInfoResult>;
  navigateTo: (appId: string, url: string) => Promise<NavigationResult>;
  redirectTo: (appId: string, url: string) => Promise<NavigationResult>;
  reLaunch: (appId: string, url: string) => Promise<NavigationResult>;
  navigateBack: (appId: string, delta: number) => Promise<NavigationResult>;
  setPageStyle: (
    appId: string,
    style: NebulaPageStyle,
  ) => Promise<NavigationResult>;
  showToast: (title: string) => Promise<NavigationResult>;
  getDeviceInfo: () => Record<string, unknown>;
};
