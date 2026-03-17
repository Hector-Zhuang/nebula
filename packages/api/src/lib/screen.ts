import * as Brightness from 'expo-brightness'

import { shouldBeObject } from '../utils'

export async function setScreenBrightness (opts: setScreenBrightness.Option): Promise<CallbackResult> {
  const { value } = opts
  let res = { errMsg: 'setScreenBrightness:ok' }

  const isObject = shouldBeObject(opts)
  if (!isObject.res) {
    res = { errMsg: `setScreenBrightness${isObject.msg}` }
    return Promise.reject(res)
  }

  try {
    await (Brightness as any).setBrightnessAsync(value)
    return Promise.resolve(res)
  } catch (e) {
    res.errMsg = `setScreenBrightness:fail invalid ${e}`
    return Promise.reject(res)
  }
}


export async function getScreenBrightness (opts: getScreenBrightness.Option = {}): Promise<CallbackResult> {
  const isObject = shouldBeObject(opts)
  if (!isObject.res) {
    const res = { errMsg: `getScreenBrightness${isObject.msg}` }
    return Promise.reject(res)
  }

  try {
    const value = await Brightness.getBrightnessAsync()
    const res = {
      errMsg: 'getScreenBrightness: ok',
      value
    }

    // @ts-ignore
    return Promise.resolve(res)
  } catch (e) {
    const res = {
      errMsg: `getScreenBrightness:fail invalid ${e}`
    }
    return Promise.reject(res)
  }
}
