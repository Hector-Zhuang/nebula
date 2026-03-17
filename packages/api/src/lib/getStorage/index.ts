import { deserializeStorageValue, getStorageItem } from '../../utils/storage'
export async function getStorage(option: getStorage.Option<any>): Promise<getStorage.SuccessCallbackResult<any>> {
  const { key } = option
  const res = { errMsg: 'getStorage:ok' }

  try {
    const data = getStorageItem(key)
    if (data) {
      const result = {
        data: deserializeStorageValue(data),
        ...res
      }
      return Promise.resolve(result)
    } else {
      res.errMsg = 'getStorage:fail data not found'
      return Promise.reject(res)
    }
  } catch (err) {
    res.errMsg = err.message
    return Promise.reject(res)
  }
}
