import { invokeHostApi } from '../runtime/host';

export const getScreenBrightness = () => {
  return invokeHostApi<number>('getScreenBrightness');
};
