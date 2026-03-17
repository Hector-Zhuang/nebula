import { removeStorageItem } from '../../utils/storage'

export async function removeStorage(option: removeStorage.Option): Promise<CallbackResult> {
  const { key } = option
  const res = { errMsg: 'removeStorage:ok' }

  try {
    removeStorageItem(key)
    return Promise.resolve(res)
  } catch (err) {
    res.errMsg = err.message
    return Promise.reject(res)
  }
}
