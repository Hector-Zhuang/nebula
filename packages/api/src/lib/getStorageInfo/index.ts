import { errorHandler, successHandler } from '../../utils'
import { getStorageCurrentSize, getStorageKeys } from '../../utils/storage'

export async function getStorageInfo(option: getStorageInfo.Option = {}): Promise<CallbackResult> {
  const { success, fail, complete } = option
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
    return successHandler(success, complete)(result)
  } catch (err) {
    res.errMsg = err.message
    return errorHandler(fail, complete)(res)
  }
}
