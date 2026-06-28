import type {
  NebulaHostApiDescriptionMap,
  NebulaHostApiHandler,
  NebulaHostCapabilityMap,
  NebulaProtocolResponse,
} from './nebulaTypes';
import {
  addNebulaEventListener,
  isProtocolRequest,
  NEBULA_HOST_MESSAGE_EVENT,
} from './nebulaNative';

const hostApiRegistry = new Map<string, NebulaHostApiHandler>();
let hostApiServerStarted = false;
let hostApiServerUnsubscribe: (() => void) | null = null;

export async function resolveHostCapabilities(): Promise<NebulaHostCapabilityMap> {
  const entries = await Promise.all(
    Array.from(hostApiRegistry.entries()).map(async ([apiName, handler]) => {
      const supported =
        typeof handler.supported === 'function'
          ? await handler.supported()
          : (handler.supported ?? true);

      return [
        apiName,
        {
          version: handler.version,
          supported,
        },
      ] as const;
    }),
  );

  return entries.reduce<NebulaHostCapabilityMap>((capabilities, entry) => {
    capabilities[entry[0]] = entry[1];
    return capabilities;
  }, {});
}

export function resolveHostApiDescriptions(): NebulaHostApiDescriptionMap {
  return Array.from(
    hostApiRegistry.entries(),
  ).reduce<NebulaHostApiDescriptionMap>((descriptions, [apiName, handler]) => {
    if (handler.description) {
      descriptions[apiName] = handler.description;
    }
    return descriptions;
  }, {});
}

export function startHostApiServer(
  postMessageToMiniApp: (
    appId: string,
    message: NebulaProtocolResponse,
  ) => Promise<{ errMsg: string }>,
): void {
  if (hostApiServerStarted) {
    return;
  }

  const unsubscribe = addNebulaEventListener(
    NEBULA_HOST_MESSAGE_EVENT,
    event => {
      const message = event.message;
      if (!isProtocolRequest(message)) {
        return;
      }

      const reply = async (response: NebulaProtocolResponse) => {
        await postMessageToMiniApp(event.appId, response);
      };

      if (message.kind === 'getCapabilities') {
        resolveHostCapabilities()
          .then(capabilities =>
            reply({
              __nebulaProtocol: 'api.v1',
              kind: 'capabilities',
              requestId: message.requestId,
              data: {
                bridgeVersion: '1.0.0',
                capabilities,
              },
            }),
          )
          .catch(error => {
            console.error(
              '[Nebula] Failed to resolve host capabilities',
              error,
            );
          });
        return;
      }

      if (message.kind === 'getApiDescriptions') {
        reply({
          __nebulaProtocol: 'api.v1',
          kind: 'apiDescriptions',
          requestId: message.requestId,
          data: resolveHostApiDescriptions(),
        }).catch(error => {
          console.error(
            '[Nebula] Failed to resolve host API descriptions',
            error,
          );
        });
        return;
      }

      if (message.kind !== 'invoke') {
        return;
      }

      const handler = hostApiRegistry.get(message.api);
      if (!handler) {
        reply({
          __nebulaProtocol: 'api.v1',
          kind: 'invokeResult',
          requestId: message.requestId,
          result: {
            ok: false,
            error: {
              code: 'UNSUPPORTED_API',
              message: `${message.api} is not supported by the current host`,
            },
          },
        }).catch(error => {
          console.error('[Nebula] Failed to send unsupported API reply', error);
        });
        return;
      }

      const resolveSupported = async () =>
        typeof handler.supported === 'function'
          ? handler.supported()
          : (handler.supported ?? true);

      Promise.resolve(resolveSupported())
        .then(async supported => {
          if (!supported) {
            await reply({
              __nebulaProtocol: 'api.v1',
              kind: 'invokeResult',
              requestId: message.requestId,
              result: {
                ok: false,
                error: {
                  code: 'UNSUPPORTED_API',
                  message: `${message.api} is not supported by the current host`,
                },
              },
            });
            return;
          }

          const result = await handler.handle(message.payload ?? {}, {
            appId: event.appId,
            requestId: message.requestId,
            version: message.version,
          });

          await reply({
            __nebulaProtocol: 'api.v1',
            kind: 'invokeResult',
            requestId: message.requestId,
            result,
          });
        })
        .catch(async error => {
          await reply({
            __nebulaProtocol: 'api.v1',
            kind: 'invokeResult',
            requestId: message.requestId,
            result: {
              ok: false,
              error: {
                code: 'INTERNAL_ERROR',
                message:
                  error instanceof Error
                    ? error.message
                    : 'Unexpected host error',
              },
            },
          });
        });
    },
  );

  hostApiServerUnsubscribe = unsubscribe ?? null;
  hostApiServerStarted = true;
}

export function stopHostApiServer(): void {
  hostApiServerUnsubscribe?.();
  hostApiServerUnsubscribe = null;
  hostApiServerStarted = false;
}

export function registerHostApiHandler(
  apiName: string,
  handler: NebulaHostApiHandler,
): void {
  hostApiRegistry.set(apiName, handler);
}

export function unregisterHostApiHandler(apiName: string): void {
  hostApiRegistry.delete(apiName);
}
