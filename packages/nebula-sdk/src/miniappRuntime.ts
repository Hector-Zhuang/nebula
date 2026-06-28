import {
  addNebulaEventListener,
  getNebulaNativeModule,
  isProtocolResponse,
  NEBULA_MINI_APP_MESSAGE_EVENT,
  NEBULA_PAGE_LIFECYCLE_EVENT,
} from './nebulaNative';
import type {
  BridgeMessage,
  HostVisibilityResult,
  NavigationResult,
  NebulaApiInvokeResult,
  NebulaHostApiDescriptionMap,
  NebulaHostCapabilityMap,
  NebulaPageStyle,
  PageLifecycleEvent,
  PendingProtocolRequest,
} from './nebulaTypes';

let currentMiniAppId: string | null = null;
let miniAppProtocolListening = false;
const pendingProtocolRequests = new Map<string, PendingProtocolRequest>();

export function compareCapabilityVersions(left: string, right: string): number {
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

function createProtocolRequestId(): string {
  return `nebula-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function ensureMiniAppProtocolListener(): void {
  if (miniAppProtocolListening) {
    return;
  }

  const unsubscribe = addNebulaEventListener(
    NEBULA_MINI_APP_MESSAGE_EVENT,
    (event: BridgeMessage) => {
      const message = event.message;
      if (!isProtocolResponse(message)) {
        return;
      }

      const pending = pendingProtocolRequests.get(message.requestId);
      if (!pending) {
        console.warn('[NebulaMiniAppAPI] missing pending request', {
          kind: message.kind,
          requestId: message.requestId,
          pendingRequestIds: Array.from(pendingProtocolRequests.keys()),
        });
        return;
      }

      clearTimeout(pending.timeoutId);
      pendingProtocolRequests.delete(message.requestId);

      if (message.kind === 'capabilities') {
        pending.resolve(message.data);
        return;
      }

      if (message.kind === 'apiDescriptions') {
        pending.resolve(message.data);
        return;
      }

      if (message.kind === 'invokeResult') {
        pending.resolve(message.result);
      }
    },
  );

  if (!unsubscribe) {
    return;
  }

  miniAppProtocolListening = true;
}

export class Miniapp {
  static bootstrap(appId?: string | null): void {
    if (typeof appId === 'string' && appId.length > 0) {
      currentMiniAppId = appId;
      (globalThis as any).__nebulaCurrentAppId = appId;
    }
  }

  static async navigateTo(url: string): Promise<NavigationResult> {
    return getNebulaNativeModule().navigateTo(currentMiniAppId || '', url);
  }

  static async redirectTo(url: string): Promise<NavigationResult> {
    return getNebulaNativeModule().redirectTo(currentMiniAppId || '', url);
  }

  static async reLaunch(url: string): Promise<NavigationResult> {
    return getNebulaNativeModule().reLaunch(currentMiniAppId || '', url);
  }

  static async navigateBack(delta = 1): Promise<NavigationResult> {
    return getNebulaNativeModule().navigateBack(currentMiniAppId || '', delta);
  }

  static async setPageStyle(style: NebulaPageStyle): Promise<NavigationResult> {
    return getNebulaNativeModule().setPageStyle(currentMiniAppId || '', style);
  }

  static async setNavigationBarTitle(title: string): Promise<NavigationResult> {
    return this.setPageStyle({ navigationBarTitleText: title });
  }

  static async setNavigationBarColor(options: {
    backgroundColor?: string;
    frontColor?: string;
  }): Promise<NavigationResult> {
    return this.setPageStyle({
      navigationBarBackgroundColor: options.backgroundColor,
      navigationBarTextColor: options.frontColor,
    });
  }

  static getDeviceInfo(): unknown {
    return getNebulaNativeModule().getDeviceInfo();
  }

  static getAppId(): string | null {
    return currentMiniAppId;
  }

  static getSandboxPath(): string {
    return `/Documents/MiniApps/${currentMiniAppId || ''}`;
  }

  static async showToast(title: string): Promise<NavigationResult> {
    return getNebulaNativeModule().showToast(title);
  }

  static async postMessageToHost(
    message: Record<string, unknown>,
  ): Promise<NavigationResult> {
    return getNebulaNativeModule().postMessageToHost(
      currentMiniAppId || '',
      message,
    );
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

  static async invokeHostApi<TData = unknown>(
    apiName: string,
    payload: Record<string, unknown> = {},
    version = '1.0.0',
    timeoutMs = 15000,
  ): Promise<NebulaApiInvokeResult<TData>> {
    ensureMiniAppProtocolListener();

    return new Promise<NebulaApiInvokeResult<TData>>((resolve, reject) => {
      const requestId = createProtocolRequestId();
      const timeoutId =
        timeoutMs > 0
          ? setTimeout(() => {
              console.warn('[NebulaMiniAppAPI] invokeHostApi timeout', {
                apiName,
                requestId,
                pendingRequestIds: Array.from(pendingProtocolRequests.keys()),
              });
              pendingProtocolRequests.delete(requestId);
              reject(new Error(`Timed out waiting for host API: ${apiName}`));
            }, timeoutMs)
          : setTimeout(() => {}, 2147483647);

      pendingProtocolRequests.set(requestId, {
        resolve,
        reject,
        timeoutId,
      });

      this.postMessageToHost({
        __nebulaProtocol: 'api.v1',
        kind: 'invoke',
        requestId,
        api: apiName,
        version,
        payload,
      }).catch(error => {
        clearTimeout(timeoutId);
        pendingProtocolRequests.delete(requestId);
        console.error(
          '[NebulaMiniAppAPI] invokeHostApi postMessageToHost failed',
          {
            apiName,
            requestId,
            error,
          },
        );
        reject(error);
      });
    });
  }

  static async getCapabilities(): Promise<{
    bridgeVersion: string;
    capabilities: NebulaHostCapabilityMap;
  }> {
    ensureMiniAppProtocolListener();

    return new Promise((resolve, reject) => {
      const requestId = createProtocolRequestId();
      const timeoutId = setTimeout(() => {
        pendingProtocolRequests.delete(requestId);
        reject(new Error('Timed out waiting for host capabilities'));
      }, 15000);

      pendingProtocolRequests.set(requestId, {
        resolve,
        reject,
        timeoutId,
      });

      this.postMessageToHost({
        __nebulaProtocol: 'api.v1',
        kind: 'getCapabilities',
        requestId,
      }).catch(error => {
        clearTimeout(timeoutId);
        pendingProtocolRequests.delete(requestId);
        reject(error);
      });
    });
  }

  static async isSupported(
    apiName: string,
    minimumVersion?: string,
  ): Promise<boolean> {
    const { capabilities } = await this.getCapabilities();
    const capability = capabilities[apiName];

    if (!capability?.supported) {
      return false;
    }

    if (!minimumVersion) {
      return true;
    }

    return compareCapabilityVersions(capability.version, minimumVersion) >= 0;
  }

  static async getHostApiDescriptions(
    timeoutMs = 15000,
  ): Promise<NebulaHostApiDescriptionMap> {
    ensureMiniAppProtocolListener();

    return new Promise((resolve, reject) => {
      const requestId = createProtocolRequestId();
      const timeoutId = setTimeout(() => {
        pendingProtocolRequests.delete(requestId);
        reject(new Error('Timed out waiting for host API descriptions'));
      }, timeoutMs);

      pendingProtocolRequests.set(requestId, {
        resolve,
        reject,
        timeoutId,
      });

      this.postMessageToHost({
        __nebulaProtocol: 'api.v1',
        kind: 'getApiDescriptions',
        requestId,
      }).catch(error => {
        clearTimeout(timeoutId);
        pendingProtocolRequests.delete(requestId);
        reject(error);
      });
    });
  }

  static onHostMessage(listener: (event: BridgeMessage) => void): () => void {
    const unsubscribe = addNebulaEventListener(
      NEBULA_MINI_APP_MESSAGE_EVENT,
      listener,
    );
    if (!unsubscribe) {
      console.warn(
        '[Nebula] Native event emitter unavailable for host messages',
      );
      return () => {};
    }
    return unsubscribe;
  }

  static onPageLifecycle(
    listener: (event: PageLifecycleEvent) => void,
  ): () => void {
    const unsubscribe = addNebulaEventListener(
      NEBULA_PAGE_LIFECYCLE_EVENT,
      listener,
    );
    if (!unsubscribe) {
      console.warn(
        '[Nebula] Native event emitter unavailable for page lifecycle events',
      );
      return () => {};
    }
    return unsubscribe;
  }
}
