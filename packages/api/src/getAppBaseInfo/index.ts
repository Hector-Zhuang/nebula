import { invokeHostApi } from '../runtime/host';

export function getAppBaseInfo() {
  return invokeHostApi<{
    version: string;
    language: string;
    enableDebug: boolean;
    theme: string;
  }>('getAppBaseInfo');
}
