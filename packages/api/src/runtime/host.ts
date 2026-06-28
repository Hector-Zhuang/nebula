import { Miniapp } from '@nebula-rn/sdk';
import type { NebulaApiInvokeResult } from '@nebula-rn/sdk';

export type HostApiEventMessage<TPayload = unknown> = {
  __nebulaApiEvent: 'v1';
  apiName: string;
  channel: string;
  subscriptionId?: string;
  taskId?: string;
  payload?: TPayload;
};

type HostEventListener<TPayload> = (payload: TPayload) => void;

type HostTaskProgressListener<TProgress> = (payload: TProgress) => void;
type HostTaskHeadersListener<THeaders> = (payload: THeaders) => void;

export type HostTask<TData, TProgress, THeaders> = {
  abort(): Promise<void>;
  onProgressUpdate(listener: HostTaskProgressListener<TProgress>): void;
  offProgressUpdate(listener: HostTaskProgressListener<TProgress>): void;
  onHeadersReceived(listener: HostTaskHeadersListener<THeaders>): void;
  offHeadersReceived(listener: HostTaskHeadersListener<THeaders>): void;
  then<TResult1 = TData, TResult2 = never>(
    onfulfilled?:
      ((value: TData) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?:
      | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
  ): Promise<TResult1 | TResult2>;
  catch<TResult = never>(
    onrejected?:
      ((reason: unknown) => TResult | PromiseLike<TResult>) | undefined | null,
  ): Promise<TData | TResult>;
};

export type HostSubscriptionHandle = {
  subscriptionId: string;
  unsubscribe: () => Promise<void>;
};

type HostApiError = {
  code?: unknown;
  message?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function isHostApiEventMessage(
  value: Record<string, unknown>,
): value is HostApiEventMessage {
  return (
    value.__nebulaApiEvent === 'v1' &&
    typeof value.apiName === 'string' &&
    typeof value.channel === 'string'
  );
}

export function createHostApiError(
  apiName: string,
  error: unknown,
  fallbackCode = 'HOST_API_FAILED',
): Error & { code: string } {
  const details = isRecord(error) ? (error as HostApiError) : undefined;
  const code = typeof details?.code === 'string' ? details.code : fallbackCode;
  const message =
    typeof details?.message === 'string'
      ? details.message
      : error instanceof Error
        ? error.message
        : `${apiName}:fail host request failed`;

  const hostError = new Error(message) as Error & { code: string };
  hostError.code = code;
  return hostError;
}

export async function invokeHostApi<TData = unknown>(
  apiName: string,
  payload: object = {},
  version = '1.0',
  timeoutMs = 15000,
): Promise<TData> {
  const result = await Miniapp.invokeHostApi<TData>(
    apiName,
    payload as Record<string, unknown>,
    version,
    timeoutMs,
  );

  if (!result.ok) {
    throw createHostApiError(apiName, result.error);
  }

  return result.data;
}

export async function invokeHostApiResult<TData = unknown>(
  apiName: string,
  payload: object = {},
  version = '1.0',
  timeoutMs = 15000,
): Promise<NebulaApiInvokeResult<TData>> {
  return Miniapp.invokeHostApi<TData>(
    apiName,
    payload as Record<string, unknown>,
    version,
    timeoutMs,
  );
}

export function addHostApiEventListener<TPayload = unknown>(
  apiName: string,
  channel: string,
  listener: HostEventListener<TPayload>,
  matcher?: (message: HostApiEventMessage<TPayload>) => boolean,
): () => void {
  return Miniapp.onHostMessage(event => {
    const { message } = event;
    if (!isRecord(message) || !isHostApiEventMessage(message)) {
      return;
    }

    if (message.apiName !== apiName || message.channel !== channel) {
      return;
    }

    const typedMessage = message as HostApiEventMessage<TPayload>;

    if (matcher && !matcher(typedMessage)) {
      return;
    }

    listener((typedMessage.payload ?? null) as TPayload);
  });
}

export async function subscribeToHostEvent<TPayload = unknown>(
  apiName: string,
  payload: object,
  onEvent: HostEventListener<TPayload>,
  options?: {
    version?: string;
    timeoutMs?: number;
    unsubscribePayload?: object;
  },
): Promise<HostSubscriptionHandle> {
  const version = options?.version ?? '1.0';
  const timeoutMs = options?.timeoutMs ?? 15000;
  const result = await invokeHostApi<{
    subscriptionId: string;
  }>(`${apiName}.subscribe`, payload, version, timeoutMs);

  const stopListening = addHostApiEventListener<TPayload>(
    apiName,
    'subscription',
    onEvent,
    message => message.subscriptionId === result.subscriptionId,
  );

  return {
    subscriptionId: result.subscriptionId,
    unsubscribe: async () => {
      stopListening();
      await invokeHostApi(
        `${apiName}.unsubscribe`,
        {
          subscriptionId: result.subscriptionId,
          ...(options?.unsubscribePayload ?? {}),
        },
        version,
        timeoutMs,
      );
    },
  };
}

class HostTaskImpl<TData, TProgress, THeaders> implements HostTask<
  TData,
  TProgress,
  THeaders
> {
  private readonly promise: Promise<TData>;
  private readonly aborter: () => Promise<void>;
  private readonly progressListeners = new Set<
    HostTaskProgressListener<TProgress>
  >();
  private readonly headersListeners = new Set<
    HostTaskHeadersListener<THeaders>
  >();
  private readonly cleanup: () => void;

  constructor(
    promise: Promise<TData>,
    aborter: () => Promise<void>,
    cleanup: () => void,
  ) {
    this.promise = promise;
    this.aborter = aborter;
    this.cleanup = cleanup;
  }

  abort(): Promise<void> {
    this.cleanup();
    return this.aborter();
  }

  onProgressUpdate(listener: HostTaskProgressListener<TProgress>): void {
    this.progressListeners.add(listener);
  }

  offProgressUpdate(listener: HostTaskProgressListener<TProgress>): void {
    this.progressListeners.delete(listener);
  }

  onHeadersReceived(listener: HostTaskHeadersListener<THeaders>): void {
    this.headersListeners.add(listener);
  }

  offHeadersReceived(listener: HostTaskHeadersListener<THeaders>): void {
    this.headersListeners.delete(listener);
  }

  emitProgress(payload: TProgress): void {
    this.progressListeners.forEach(listener => listener(payload));
  }

  emitHeaders(payload: THeaders): void {
    this.headersListeners.forEach(listener => listener(payload));
  }

  then<TResult1 = TData, TResult2 = never>(
    onfulfilled?:
      ((value: TData) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?:
      | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?:
      ((reason: unknown) => TResult | PromiseLike<TResult>) | undefined | null,
  ): Promise<TData | TResult> {
    return this.promise.catch(onrejected);
  }
}

export function createHostTask<TData, TProgress, THeaders>(
  apiName: string,
  payload: object,
  options?: {
    version?: string;
    timeoutMs?: number;
  },
): HostTask<TData, TProgress, THeaders> {
  const version = options?.version ?? '1.0';
  const timeoutMs = options?.timeoutMs ?? 15000;
  let stopResultListener = () => {};
  let stopProgressListener = () => {};
  let stopHeadersListener = () => {};
  let startedTaskId: string | null = null;

  function cleanup() {
    stopResultListener();
    stopProgressListener();
    stopHeadersListener();
  }

  const startTask = invokeHostApi<{ taskId: string }>(
    `${apiName}.start`,
    payload,
    version,
    timeoutMs,
  );
  const promise = startTask.then(
    ({ taskId }) =>
      new Promise<TData>((resolve, reject) => {
        startedTaskId = taskId;

        stopResultListener = addHostApiEventListener<
          NebulaApiInvokeResult<TData> | TData
        >(
          apiName,
          'task.result',
          resultPayload => {
            cleanup();
            if (
              isRecord(resultPayload) &&
              typeof resultPayload.ok === 'boolean'
            ) {
              const result = resultPayload as NebulaApiInvokeResult<TData>;
              if (result.ok) {
                resolve(result.data);
                return;
              }
              reject(createHostApiError(apiName, result.error));
              return;
            }
            resolve(resultPayload as TData);
          },
          message => message.taskId === taskId,
        );

        stopProgressListener = addHostApiEventListener<TProgress>(
          apiName,
          'task.progress',
          progressPayload => {
            task.emitProgress(progressPayload);
          },
          message => message.taskId === taskId,
        );

        stopHeadersListener = addHostApiEventListener<THeaders>(
          apiName,
          'task.headers',
          headersPayload => {
            task.emitHeaders(headersPayload);
          },
          message => message.taskId === taskId,
        );
      }),
  );

  const task = new HostTaskImpl<TData, TProgress, THeaders>(
    promise,
    async () => {
      cleanup();
      const taskId =
        startedTaskId ??
        (await startTask.then(
          result => result.taskId,
          () => null,
        ));
      if (!taskId) {
        return;
      }
      await invokeHostApi(
        `${apiName}.abort`,
        {
          taskId,
        },
        version,
        timeoutMs,
      );
    },
    cleanup,
  );

  return task;
}
