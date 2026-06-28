import { invokeHostApi } from '../runtime/host';

export const setClipboardData = (data: string) =>
  invokeHostApi<void>('setClipboardData', { data });
