import AsyncStorage from '@react-native-async-storage/async-storage'

import { errorHandler, successHandler } from '../../utils'
export async function clearStorage(option: clearStorage.Option = {}): Promise<CallbackResult> {
  const { success, fail, complete } = option
  const res = { errMsg: 'clearStorage:ok' }

  try {
    await AsyncStorage.clear()
    return successHandler(success, complete)(res)
  } catch (err) {
    res.errMsg = err.message
    return errorHandler(fail, complete)(res)
  }
}
