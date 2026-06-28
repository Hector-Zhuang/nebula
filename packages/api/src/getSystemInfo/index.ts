import { invokeHostApi } from '../runtime/host';

export function getSystemInfo() {
  return invokeHostApi<Record<string, unknown>>('getSystemInfo');
}
