import { getStorageCurrentSize, getStorageKeys } from '../../utils/storage'

export async function getStorageInfo(option: getStorageInfo.Option = {}): Promise<CallbackResult> {
  const res = { errMsg: 'getStorageInfo:ok' }

  try {
    const data = getStorageKeys()
    const result = {
      ...res,
      keys: data,
      currentSize: getStorageCurrentSize(),
      limitSize: Infinity
    }
    // @ts-ignore
    return Promise.resolve(result)
  } catch (err) {
    res.errMsg = err.message
    return Promise.reject(res)
  }
}
