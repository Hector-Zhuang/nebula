import { invokeHostApi } from './runtime/host';

export const storage = null;

export function serializeStorageValue(data: unknown): string {
  return JSON.stringify(data);
}

export function deserializeStorageValue<T = unknown>(data: string): T {
  return JSON.parse(data) as T;
}

export function setStorageItem(key: string, data: unknown): Promise<void> {
  return invokeHostApi<void>('storage.setItem', {
    key,
    data: serializeStorageValue(data),
  });
}

export async function getStorageItem(key: string): Promise<string | undefined> {
  const result = await invokeHostApi<{ value?: string | null }>(
    'storage.getItem',
    {
      key,
    },
  );

  return result.value ?? undefined;
}

export function removeStorageItem(key: string): Promise<void> {
  return invokeHostApi<void>('storage.removeItem', {
    key,
  });
}

export function clearStorageItems(): Promise<void> {
  return invokeHostApi<void>('storage.clearItems');
}

export async function getStorageKeys(): Promise<string[]> {
  const result = await invokeHostApi<{ keys: string[] }>('storage.getKeys');
  return result.keys;
}

export async function getStorageCurrentSize(): Promise<number> {
  const result = await invokeHostApi<{ size: number }>(
    'storage.getCurrentSize',
  );
  return result.size;
}
