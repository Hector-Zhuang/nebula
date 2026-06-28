import {
  NebulaAPI,
  createHostApiFailure,
  createHostApiSuccess,
} from '@nebula-rn/sdk';
import type { NebulaApiInvokeResult } from '@nebula-rn/sdk';

export type HostApiEventMessage<TPayload = unknown> = {
  __nebulaApiEvent: 'v1';
  apiName: string;
  channel: string;
  subscriptionId?: string;
  taskId?: string;
  payload?: TPayload;
};

export function createHostBridgeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function emitHostApiEvent<TPayload>(
  appId: string,
  message: HostApiEventMessage<TPayload>,
): Promise<void> {
  await NebulaAPI.postMessageToMiniApp(
    appId,
    message as Record<string, unknown>,
  );
}

export function createSubscriptionStartResult(subscriptionId: string) {
  return createHostApiSuccess({
    subscriptionId,
  });
}

export function createTaskStartResult(taskId: string) {
  return createHostApiSuccess({
    taskId,
  });
}

export function emitSubscriptionEvent<TPayload>(
  appId: string,
  apiName: string,
  subscriptionId: string,
  payload: TPayload,
): Promise<void> {
  return emitHostApiEvent(appId, {
    __nebulaApiEvent: 'v1',
    apiName,
    channel: 'subscription',
    subscriptionId,
    payload,
  });
}

export function emitTaskProgress<TPayload>(
  appId: string,
  apiName: string,
  taskId: string,
  payload: TPayload,
): Promise<void> {
  return emitHostApiEvent(appId, {
    __nebulaApiEvent: 'v1',
    apiName,
    channel: 'task.progress',
    taskId,
    payload,
  });
}

export function emitTaskHeaders<TPayload>(
  appId: string,
  apiName: string,
  taskId: string,
  payload: TPayload,
): Promise<void> {
  return emitHostApiEvent(appId, {
    __nebulaApiEvent: 'v1',
    apiName,
    channel: 'task.headers',
    taskId,
    payload,
  });
}

export function emitTaskResult<TPayload>(
  appId: string,
  apiName: string,
  taskId: string,
  result: NebulaApiInvokeResult<TPayload>,
): Promise<void> {
  return emitHostApiEvent(appId, {
    __nebulaApiEvent: 'v1',
    apiName,
    channel: 'task.result',
    taskId,
    payload: result,
  });
}

export { createHostApiFailure, createHostApiSuccess };
