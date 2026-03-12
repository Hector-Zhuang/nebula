import { errorHandler, successHandler } from '../../utils'
import { removeStorageItem } from '../../utils/storage'

export async function removeStorage(option: removeStorage.Option): Promise<CallbackResult> {
  const { key, success, fail, complete } = option
  const res = { errMsg: 'removeStorage:ok' }

  try {
    removeStorageItem(key)
    return successHandler(success, complete)(res)
  } catch (err) {
    res.errMsg = err.message
    return errorHandler(fail, complete)(res)
  }
}
