import { Gyroscope } from 'expo-sensors'

import { createCallbackManager } from '../utils'
const _cbManager = createCallbackManager()
let _listener: any

const intervalMap: any = {
  game: 20,
  ui: 60,
  normal: 200
}


function startGyroscope(opts: startGyroscope.Option = {}): Promise<CallbackResult> {
  const { interval = 'normal' } = opts
  const res = { errMsg: 'startGyroscope:ok' }
  try {
    // Documentation in English.
    if (_listener) {
      console.error('startGyroscope:fail')
      throw new Error('startGyroscope:fail')
    }
    _listener = Gyroscope.addListener(e => {
      _cbManager.trigger(e)
    })
    Gyroscope.setUpdateInterval(intervalMap[interval])

    return Promise.resolve(res)
  } catch (error) {
    res.errMsg = 'startGyroscope:fail'
    return Promise.reject(res)
  }
}


function stopGyroscope(opts: stopGyroscope.Option = {}): Promise<CallbackResult> {
  const res = { errMsg: 'stopGyroscope:ok' }
  try {
    _listener && _listener.remove()
    _listener = null
    return Promise.resolve(res)
  } catch (error) {
    res.errMsg = 'stopGyroscope:fail'
    return Promise.reject(res)
  }
}


function onGyroscopeChange(fnc: onGyroscopeChange.Callback): void {
  _cbManager.add(fnc)
}


function offGyroscopeChange(fnc?: onGyroscopeChange.Callback) {
  if (fnc && typeof fnc === 'function') {
    _cbManager.remove(fnc)
  } else if (fnc === undefined) {
    _cbManager.clear()
  } else {
    console.warn('offGyroscopeChange failed')
  }
}

export {
  offGyroscopeChange,
  onGyroscopeChange,
  startGyroscope,
  stopGyroscope,
}
