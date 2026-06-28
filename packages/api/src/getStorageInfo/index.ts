import { getStorageCurrentSize, getStorageKeys } from '../storage';

export interface GetStorageInfoResult {
  keys: string[];
  currentSize: number;
  limitSize: number;
}

export const getStorageInfo = async (): Promise<GetStorageInfoResult> => {
  const [keys, currentSize] = await Promise.all([
    getStorageKeys(),
    getStorageCurrentSize(),
  ]);

  return {
    keys,
    currentSize,
    limitSize: 10240,
  };
};
