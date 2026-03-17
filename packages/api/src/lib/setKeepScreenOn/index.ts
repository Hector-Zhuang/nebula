import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake'


export async function setKeepScreenOn(opts: setKeepScreenOn.Option): Promise<setKeepScreenOn.Promised> {
  const res = { errMsg: 'setKeepScreenOn:ok' } as any
  const { keepScreenOn } = opts
  try {
    if (keepScreenOn) {
      activateKeepAwake()
    } else {
      deactivateKeepAwake()
    }
    return Promise.resolve(res)
  } catch (e) {
    res.errMsg = `setKeepScreenOn:fail invalid ${e}`
    return Promise.reject(res)
  }
}
