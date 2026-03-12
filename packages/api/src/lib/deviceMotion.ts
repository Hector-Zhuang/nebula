import { DeviceMotion } from 'expo-sensors'

import { createCallbackManager, errorHandler, successHandler } from '../utils'
const _cbManager = createCallbackManager()
let _listener: any

const intervalMap: any = {
  game: 20,
  ui: 60,
  normal: 200
}

function onDeviceMotionChange (fnc: onDeviceMotionChange.Callback): void {
  _cbManager.add(fnc)
}

function offDeviceMotionChange(fnc: onDeviceMotionChange.Callback): void {
  if (fnc && typeof fnc === 'function') {
    _cbManager.remove(fnc)
  } else if (fnc === undefined) {
    _cbManager.clear()
  } else {
    console.warn('offDeviceMotionChange failed')
  }
}

/**
 * 开始监听设备方向的变化
 * @param object
 * @param {string} [object.interval='normal'] - 监听设备方向的变化回调函数的执行频率
 */
function startDeviceMotionListening (object: startDeviceMotionListening.Option = {}): Promise<CallbackResult> {
  const { interval = 'normal', success, fail, complete } = object
  const res = { errMsg: 'startDeviceMotionListening:ok' }
  try {
    // 适配微信小程序行为：重复 start 失败
    if (_listener) {
      console.error('startDeviceMotionListening:fail')
      throw new Error('startDeviceMotionListening:fail')
    }
    _listener = DeviceMotion.addListener((res: any) => {
      const { rotation } = res
      _cbManager.trigger(rotation)
    })
    DeviceMotion.setUpdateInterval(intervalMap[interval] || intervalMap.normal)

    return successHandler(success, complete)(res)
  } catch (error) {
    res.errMsg = 'startDeviceMotionListening:fail'
    return errorHandler(fail, complete)(res)
  }
}

/**
 * 停止监听设备方向的变化
 * @param object
 */
function stopDeviceMotionListening (object: stopDeviceMotionListening.Option = {}): Promise<CallbackResult> {
  const { success, fail, complete } = object
  const res = { errMsg: 'stopDeviceMotionListening:ok' }
  try {
    _listener.remove()
    _listener = null

    return successHandler(success, complete)(res)
  } catch (error) {
    res.errMsg = 'stopDeviceMotionListening:fail'
    return errorHandler(fail, complete)(res)
  }
}

export {
  offDeviceMotionChange,
  onDeviceMotionChange,
  startDeviceMotionListening,
  stopDeviceMotionListening
}
