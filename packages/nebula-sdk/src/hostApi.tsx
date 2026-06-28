import React from 'react';
import { AppRegistry } from 'react-native';
import { NebulaAPI } from './NebulaAPI';
import type {
  NebulaApiInvokeResult,
  NebulaHostApiDescription,
  NebulaHostApiHandler,
} from './NebulaAPI';

export function createHostApiFailure(
  code: string,
  message: string,
): NebulaApiInvokeResult {
  return {
    ok: false,
    error: {
      code,
      message,
    },
  };
}

export function createHostApiSuccess<TData>(
  data: TData,
): NebulaApiInvokeResult<TData> {
  return {
    ok: true,
    data,
  };
}

type PendingRequest<TRequest extends object> = TRequest & {
  resolve: (result: NebulaApiInvokeResult) => void;
};

type Listener<TRequest extends object> = (request: TRequest | null) => void;

export type HostModalChannel<TRequest extends object> = {
  clear: () => void;
  getCurrent: () => TRequest | null;
  open: (request: TRequest) => Promise<NebulaApiInvokeResult>;
  settle: (result: NebulaApiInvokeResult) => void;
  subscribe: (listener: Listener<TRequest>) => () => void;
};

export type NebulaHostFeature = {
  name: string;
  description?: NebulaHostApiDescription;
  register: () => void | (() => void);
};

export function createHostModalChannel<
  TRequest extends object,
>(): HostModalChannel<TRequest> {
  let pendingRequest: PendingRequest<TRequest> | null = null;
  const listeners = new Set<Listener<TRequest>>();

  const notify = () => {
    listeners.forEach(listener => listener(pendingRequest));
  };

  return {
    clear() {
      pendingRequest = null;
      notify();
    },
    getCurrent() {
      return pendingRequest;
    },
    open(request) {
      return new Promise(resolve => {
        pendingRequest = {
          ...request,
          resolve: result => {
            pendingRequest = null;
            notify();
            resolve(result);
          },
        };
        notify();
      });
    },
    settle(result) {
      pendingRequest?.resolve(result);
    },
    subscribe(listener) {
      listeners.add(listener);
      listener(pendingRequest);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

type HostModalApiOptions<TPayload extends object, TRequest extends object> = {
  apiName: string;
  description?: NebulaHostApiDescription;
  component: React.ComponentType<any>;
  channel: HostModalChannel<TRequest>;
  createRequest: (payload: TPayload) => TRequest;
  modalProps?:
    | Record<string, unknown>
    | ((payload: TPayload, request: TRequest) => Record<string, unknown>);
  onBeforeOpen?: (
    payload: TPayload,
  ) => Promise<NebulaApiInvokeResult | null | void>;
  onUnmountErrorMessage?: string;
  version?: string;
};

export type RegisterHostModalApiOptions<
  TPayload extends object,
  TRequest extends object,
> = HostModalApiOptions<TPayload, TRequest>;

export type RegisterHostApiOptions = {
  apiName: string;
  supported?: NebulaHostApiHandler['supported'];
  version?: string;
  description?: NebulaHostApiDescription;
  handle: NebulaHostApiHandler['handle'];
};

export type CreateMockHostApiOptions = {
  apiName: string;
  version?: string;
  description?: NebulaHostApiDescription;
  delayMs?: number;
  result?:
    | unknown
    | ((payload: Record<string, unknown>) => unknown | Promise<unknown>);
  error?:
    | {
        code: string;
        message: string;
        details?: Record<string, unknown>;
      }
    | ((payload: Record<string, unknown>) =>
        | {
            code: string;
            message: string;
            details?: Record<string, unknown>;
          }
        | Promise<{
            code: string;
            message: string;
            details?: Record<string, unknown>;
          }>);
};

function getHostModalModuleName(apiName: string): string {
  const normalizedName = apiName.replace(/[^a-zA-Z0-9_]+/g, '_');
  return `NebulaHostModal_${normalizedName}`;
}

function createHostModalApiHandler<
  TPayload extends object,
  TRequest extends object,
>({
  apiName,
  channel,
  createRequest,
  modalProps,
  onBeforeOpen,
  version = '1.0',
  description,
}: Omit<HostModalApiOptions<TPayload, TRequest>, 'component'>) {
  const modalModuleName = getHostModalModuleName(apiName);
  let requestInFlight = false;

  return {
    version,
    description,
    handle: async (payload: Record<string, unknown>) => {
      if (requestInFlight) {
        return createHostApiFailure(
          'SCAN_FAILED',
          `${apiName}:fail another request is already in progress`,
        );
      }

      const typedPayload = payload as TPayload;
      requestInFlight = true;

      try {
        const precheckResult = onBeforeOpen
          ? await onBeforeOpen(typedPayload)
          : null;
        if (precheckResult) {
          return precheckResult;
        }

        const request = createRequest(typedPayload);
        const resultPromise = channel.open(request);
        const resolvedModalProps =
          typeof modalProps === 'function'
            ? modalProps(typedPayload, request)
            : (modalProps ?? {});

        await NebulaAPI.presentHostModal(modalModuleName, {
          __transparentBackground: true,
          ...resolvedModalProps,
        });

        return await resultPromise;
      } catch (error) {
        channel.settle(
          createHostApiFailure(
            'SCAN_FAILED',
            `${apiName}:fail host modal flow interrupted`,
          ),
        );
        return createHostApiFailure(
          'SCAN_FAILED',
          error instanceof Error
            ? error.message
            : `${apiName}:fail unable to present host modal`,
        );
      } finally {
        requestInFlight = false;
      }
    },
    cleanup: () => {
      requestInFlight = false;
    },
  };
}

export function registerHostModalApi<
  TPayload extends object,
  TRequest extends object,
>({
  apiName,
  component,
  channel,
  createRequest,
  modalProps,
  onBeforeOpen,
  onUnmountErrorMessage,
  version = '1.0',
  description,
}: RegisterHostModalApiOptions<TPayload, TRequest>): () => void {
  const modalModuleName = getHostModalModuleName(apiName);
  AppRegistry.registerComponent(modalModuleName, () => component);

  const handler = createHostModalApiHandler({
    apiName,
    channel,
    createRequest,
    modalProps,
    onBeforeOpen,
    version,
    description,
  });

  NebulaAPI.registerApiHandler(apiName, {
    version: handler.version,
    description: handler.description,
    handle: handler.handle,
  });

  return () => {
    NebulaAPI.unregisterApiHandler(apiName);
    handler.cleanup();
    channel.settle(
      createHostApiFailure(
        'SCAN_FAILED',
        onUnmountErrorMessage ??
          `${apiName}:fail host modal was unmounted before completion`,
      ),
    );
    NebulaAPI.dismissHostModal().catch(() => {});
  };
}

export function createHostApiFeature({
  apiName,
  supported,
  version = '1.0',
  description,
  handle,
}: RegisterHostApiOptions): NebulaHostFeature {
  return {
    name: apiName,
    description,
    register() {
      NebulaAPI.registerApiHandler(apiName, {
        version,
        supported,
        description,
        handle,
      });

      return () => {
        NebulaAPI.unregisterApiHandler(apiName);
      };
    },
  };
}

export function createMockHostApiFeature({
  apiName,
  version = '1.0.0',
  description,
  delayMs = 0,
  result,
  error,
}: CreateMockHostApiOptions): NebulaHostFeature {
  return createHostApiFeature({
    apiName,
    version,
    description,
    handle: async payload => {
      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }

      if (error) {
        const resolvedError =
          typeof error === 'function' ? await error(payload) : error;
        return createHostApiFailure(resolvedError.code, resolvedError.message);
      }

      const resolvedResult =
        typeof result === 'function' ? await result(payload) : result;
      return createHostApiSuccess(
        typeof resolvedResult === 'undefined' ? null : resolvedResult,
      );
    },
  });
}

export function createHostModalApiFeature<
  TPayload extends object,
  TRequest extends object,
>(options: RegisterHostModalApiOptions<TPayload, TRequest>): NebulaHostFeature {
  return {
    name: options.apiName,
    description: options.description,
    register() {
      return registerHostModalApi(options);
    },
  };
}

export function createHostModalApiBridge<
  TPayload extends object,
  TRequest extends object,
>(options: HostModalApiOptions<TPayload, TRequest>) {
  return function HostModalApiBridge(): React.ReactElement | null {
    React.useEffect(() => registerHostModalApi(options), []);

    return null;
  };
}

export function registerHostModalComponent<P extends object>(
  moduleName: string,
  component: React.ComponentType<P>,
): string {
  AppRegistry.registerComponent(moduleName, () => component);
  return moduleName;
}
