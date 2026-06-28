import { NativeEventEmitter, NativeModules } from 'react-native';
import type { EmitterSubscription, NativeModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import NebulaNativeModuleSpec from './specs/NativeNebulaModule';
import type {
  BridgeMessage,
  NebulaNativeModuleType,
  NebulaProtocolRequest,
  NebulaProtocolResponse,
} from './nebulaTypes';

const turboNebulaNativeModule =
  (NebulaNativeModuleSpec as unknown as NebulaNativeModuleType | null) ??
  TurboModuleRegistry.get<NebulaNativeModuleType>('NebulaNativeModule');

const { NebulaNativeModule: legacyNebulaNativeModule } = NativeModules as {
  NebulaNativeModule?: NebulaNativeModuleType;
};

const NebulaNativeModule = turboNebulaNativeModule ?? legacyNebulaNativeModule;

export const nebulaEventEmitter = legacyNebulaNativeModule
  ? new NativeEventEmitter(legacyNebulaNativeModule as unknown as NativeModule)
  : null;

export const NEBULA_HOST_MESSAGE_EVENT = 'NebulaHostMessage';
export const NEBULA_MINI_APP_MESSAGE_EVENT = 'NebulaMiniAppMessage';
export const NEBULA_PAGE_LIFECYCLE_EVENT = 'NebulaPageLifecycle';
export const NEBULA_INTERNAL_MINIAPP_LOADING_MODULE =
  'NebulaInternalMiniappLoading';

export const PAGE_RESERVED_PROP_KEYS = new Set([
  'appId',
  'instanceId',
  'sandboxPath',
  'title',
  '__pageConfig',
  '__routePath',
  '__routeUrl',
]);

if (!NebulaNativeModule) {
  console.warn(
    '[Nebula] NebulaNativeModule not found. Make sure Nebula framework is integrated.',
  );
}

export function getNebulaNativeModule(): NebulaNativeModuleType {
  if (!NebulaNativeModule) {
    throw new Error('[Nebula] NebulaNativeModule not available');
  }
  return NebulaNativeModule;
}

export function addNebulaEventListener<TEvent = BridgeMessage>(
  eventName: string,
  listener: (event: TEvent) => void,
): (() => void) | null {
  if (!nebulaEventEmitter) {
    return null;
  }
  const sub: EmitterSubscription = nebulaEventEmitter.addListener(
    eventName,
    listener,
  );
  return () => sub.remove();
}

export function isProtocolRequest(
  message: Record<string, unknown>,
): message is NebulaProtocolRequest {
  return (
    message.__nebulaProtocol === 'api.v1' &&
    typeof message.kind === 'string' &&
    typeof message.requestId === 'string'
  );
}

export function isProtocolResponse(
  message: Record<string, unknown>,
): message is NebulaProtocolResponse {
  return (
    message.__nebulaProtocol === 'api.v1' &&
    typeof message.kind === 'string' &&
    typeof message.requestId === 'string'
  );
}
