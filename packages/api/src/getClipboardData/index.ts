import { invokeHostApi } from '../runtime/host';

export function getClipboardData() {
  return invokeHostApi<string>('getClipboardData');
}
