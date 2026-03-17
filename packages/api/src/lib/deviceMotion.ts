import { DeviceMotion } from 'expo-sensors'

import { createCallbackManager } from '../utils'
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


function startDeviceMotionListening (object: startDeviceMotionListening.Option = {}): Promise<CallbackResult> {
  const { interval = 'normal' } = object
  const res = { errMsg: 'startDeviceMotionListening:ok' }
  try {
    // Documentation in English.
    if (_listener) {
      console.error('startDeviceMotionListening:fail')
      throw new Error('startDeviceMotionListening:fail')
    }
    _listener = DeviceMotion.addListener((res: any) => {
      const { rotation } = res
      _cbManager.trigger(rotation)
    })
    DeviceMotion.setUpdateInterval(intervalMap[interval] || intervalMap.normal)

    return Promise.resolve(res)
  } catch (error) {
    res.errMsg = 'startDeviceMotionListening:fail'
    return Promise.reject(res)
  }
}


function stopDeviceMotionListening (object: stopDeviceMotionListening.Option = {}): Promise<CallbackResult> {
  const res = { errMsg: 'stopDeviceMotionListening:ok' }
  try {
    _listener.remove()
    _listener = null

    return Promise.resolve(res)
  } catch (error) {
    res.errMsg = 'stopDeviceMotionListening:fail'
    return Promise.reject(res)
  }
}

export {
  offDeviceMotionChange,
  onDeviceMotionChange,
  startDeviceMotionListening,
  stopDeviceMotionListening
}
