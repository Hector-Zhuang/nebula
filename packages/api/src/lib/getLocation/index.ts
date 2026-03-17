import Geolocation from '@react-native-community/geolocation'

export async function getLocation(opts: getLocation.Option = {}): Promise<getLocation.SuccessCallbackResult> {
  const { isHighAccuracy = false, highAccuracyExpireTime = 3000 } = opts
  const requestAuthorization = () => {
    return new Promise((resolve, reject) => {
      Geolocation.requestAuthorization(() => resolve({ granted: true }), (err) => reject(err))
    })
  }

  try {
    // @ts-ignore
    // todo: fix types
    const { granted } = await requestAuthorization()
    if (!granted) {
      const res = { errMsg: 'Permissions denied!' }
      return Promise.reject(res)
    }
  } catch (err) {
    const res = { errMsg: 'Permissions denied!' }
    return Promise.reject(res)
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude, altitude, accuracy, speed } = coords
        const res = {
          latitude,
          longitude,
          speed: speed ?? 0,
          altitude: altitude ?? 0,
          accuracy,
          verticalAccuracy: 0,
          horizontalAccuracy: 0,
          errMsg: 'getLocation:ok'
        }
        resolve(res)
      },
      (err) => {
        const res = {
          errMsg: 'getLocation fail',
          err
        }
        reject(res)
      },
      {
        // Documentation in English.
        timeout: highAccuracyExpireTime,
        // Documentation in English.
        maximumAge: 0,
        enableHighAccuracy: isHighAccuracy
      }
    )
  })
}
