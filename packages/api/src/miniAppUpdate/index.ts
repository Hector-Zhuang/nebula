import type { MiniAppUpdateInfo } from '@nebula-rn/sdk';
import { invokeHostApi } from '../runtime/host';

export function getMiniAppUpdateInfo(): Promise<MiniAppUpdateInfo> {
  return invokeHostApi<MiniAppUpdateInfo>(
    'getMiniAppUpdateInfo',
    {},
    '1.0',
    15000,
  );
}

export function applyMiniAppUpdate(): Promise<MiniAppUpdateInfo> {
  return invokeHostApi<MiniAppUpdateInfo>(
    'applyMiniAppUpdate',
    {},
    '1.0',
    120000,
  );
}
