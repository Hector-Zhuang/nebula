import { createMMKV } from 'react-native-mmkv'

export const storage = createMMKV({
  id: 'nebula.api.storage'
})

export function serializeStorageValue(data: any): string {
  return JSON.stringify(data)
}

export function deserializeStorageValue<T = any>(data: string): T {
  return JSON.parse(data) as T
}

export function setStorageItem(key: string, data: any): void {
  storage.set(key, serializeStorageValue(data))
}

export function getStorageItem(key: string): string | undefined {
  return storage.getString(key)
}

export function removeStorageItem(key: string): void {
  storage.remove(key)
}

export function clearStorageItems(): void {
  storage.clearAll()
  storage.trim()
}

export function getStorageKeys(): string[] {
  return storage.getAllKeys()
}

export function getStorageCurrentSize(): number {
  const size = getStorageKeys().reduce((total, key) => {
    const value = getStorageItem(key)
    return total + (value?.length ?? 0)
  }, 0)

  return Number((size / 1024).toFixed(2))
}