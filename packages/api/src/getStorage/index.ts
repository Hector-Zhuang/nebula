import { deserializeStorageValue, getStorageItem } from '../storage';

export const getStorage = async <T>(key: string): Promise<T> => {
  const data = await getStorageItem(key);
  if (data !== undefined && data !== null) {
    return deserializeStorageValue<T>(data);
  }

  throw new Error('getStorage:fail data not found');
};
