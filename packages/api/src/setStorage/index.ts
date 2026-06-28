import { setStorageItem } from '../storage';

export interface SetStorageOption {
  key: string;
  data: unknown;
}

export const setStorage = (options: SetStorageOption) => {
  const { key, data } = options;
  return setStorageItem(key, data);
};
