import { Vibration } from 'react-native'

function vibrate (DURATION, API, OPTS): Promise<CallbackResult> {
  const res = { errMsg: `${API}:ok` }
  try {
    Vibration.vibrate(DURATION)
    return Promise.resolve(res)
  } catch (err) {
    res.errMsg = err.message
    return Promise.reject(res)
  }
}

function vibrateShort (opts: vibrateShort.Option = {}): Promise<CallbackResult> {
  return vibrate(15, 'vibrateShort', opts)
}

function vibrateLong (opts: vibrateLong.Option = {}): Promise<CallbackResult> {
  return vibrate(400, 'vibrateLong', opts)
}

export {
  vibrateLong,
  vibrateShort
}
