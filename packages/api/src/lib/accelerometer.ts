import { Accelerometer } from 'expo-sensors'

import { createCallbackManager } from '../utils'
const _cbManager = createCallbackManager()
let _listener: any

const intervalMap: any = {
  game: 20,
  ui: 60,
  normal: 200
}

function offAccelerometerChange(fnc?: onAccelerometerChange.Callback): void {
  if (fnc && typeof fnc === 'function') {
    _cbManager.remove(fnc)
  } else if (fnc === undefined) {
    _cbManager.clear()
  } else {
    console.warn('offAccelerometerChange failed')
  }
}

function onAccelerometerChange(fnc: onAccelerometerChange.Callback): void {
  _cbManager.add(fnc)
}


function startAccelerometer(opts: startAccelerometer.Option = {}): Promise<CallbackResult> {
  const { interval = 'normal' } = opts
  const res = { errMsg: 'startAccelerometer:ok' }
  try {
    // Documentation in English.
    if (_listener) {
      console.error('startAccelerometer:fail')
      throw new Error('startAccelerometer:fail')
    }
    _listener = Accelerometer.addListener((e: onAccelerometerChange.Result) => {
      _cbManager.trigger(e)
    })
    Accelerometer.setUpdateInterval(intervalMap[interval])

    return Promise.resolve(res)
  } catch (error) {
    res.errMsg = 'startAccelerometer:fail'
    return Promise.reject(res)
  }
}


function stopAccelerometer(opts: stopAccelerometer.Option = {}): Promise<CallbackResult> {
  const res = { errMsg: 'stopAccelerometer:ok' }
  try {
    _listener && _listener.remove()
    _listener = null
    return Promise.resolve(res)
  } catch (error) {
    res.errMsg = 'stopAccelerometer:fail'
    return Promise.reject(res)
  }
}

export {
  offAccelerometerChange,
  onAccelerometerChange,
  startAccelerometer,
  stopAccelerometer
}
