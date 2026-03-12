import { errorHandler, successHandler } from '../../utils'
import { deserializeStorageValue, getStorageItem } from '../../utils/storage'
export async function getStorage(option: getStorage.Option<any>): Promise<getStorage.SuccessCallbackResult<any>> {
  const { key, success, fail, complete } = option
  const res = { errMsg: 'getStorage:ok' }

  try {
    const data = getStorageItem(key)
    if (data) {
      const result = {
        data: deserializeStorageValue(data),
        ...res
      }
      return successHandler(success, complete)(result)
    } else {
      res.errMsg = 'getStorage:fail data not found'
      return errorHandler(fail, complete)(res)
    }
  } catch (err) {
    res.errMsg = err.message
    return errorHandler(fail, complete)(res)
  }
}
