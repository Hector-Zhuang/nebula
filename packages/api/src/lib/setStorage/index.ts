import { errorHandler, successHandler } from '../../utils'
import { setStorageItem } from '../../utils/storage'

export async function setStorage(option: setStorage.Option): Promise<CallbackResult> {
  const { key, data, success, fail, complete } = option
  const res = { errMsg: 'setStorage:ok' }

  try {
    setStorageItem(key, data)
    return successHandler(success, complete)(res)
  } catch (err: any) {
    res.errMsg = err.message
    return errorHandler(fail, complete)(res)
  }
}
