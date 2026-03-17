import { setStorageItem } from '../../utils/storage'

export async function setStorage(option: setStorage.Option): Promise<CallbackResult> {
  const { key, data } = option
  const res = { errMsg: 'setStorage:ok' }

  try {
    setStorageItem(key, data)
    return Promise.resolve(res)
  } catch (err: any) {
    res.errMsg = err.message
    return Promise.reject(res)
  }
}
