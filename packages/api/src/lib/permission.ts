import { Camera } from 'expo-camera'
import { getMediaLibraryPermissionsAsync, requestMediaLibraryPermissionsAsync } from 'expo-image-picker'
import {
  getForegroundPermissionsAsync,
  // getBackgroundPermissionsAsync,
  requestForegroundPermissionsAsync,
  // requestBackgroundPermissionsAsync
} from 'expo-location'
import { AppState, Linking, NativeEventSubscription } from 'react-native'

const {
  getCameraPermissionsAsync,
  getMicrophonePermissionsAsync,
  requestCameraPermissionsAsync,
  requestMicrophonePermissionsAsync
} = Camera

const scopeMap = {
  'scope.userLocation': [getForegroundPermissionsAsync, requestForegroundPermissionsAsync],
  'scope.record': [getMicrophonePermissionsAsync, requestMicrophonePermissionsAsync],
  'scope.writePhotosAlbum': [getMediaLibraryPermissionsAsync, requestMediaLibraryPermissionsAsync],
  'scope.camera': [getCameraPermissionsAsync, requestCameraPermissionsAsync],
  // 'scope.userLocationBackground': [getBackgroundPermissionsAsync, requestBackgroundPermissionsAsync],
  // 'scope.NOTIFICATIONS': Permissions.NOTIFICATIONS,
  // 'scope.USER_FACING_NOTIFICATIONS': Permissions.USER_FACING_NOTIFICATIONS,
  // 'scope.CONTACTS': Permissions.CONTACTS,
  // 'scope.CALENDAR': Permissions.CALENDAR,
  // 'scope.REMINDERS': Permissions.REMINDERS, // ios only
  // 'scope.SYSTEM_BRIGHTNESS': Permissions.SYSTEM_BRIGHTNESS
}

let stateListener // Documentation in English.
let appStateSubscription: NativeEventSubscription | undefined

const getAuthSetting = async () => {
  const auths = {}

  await Promise.all(Object.keys(scopeMap).map(async key => {
    const { granted } = await scopeMap[key][0]()
    auths[key] = granted
  }))

  return auths
}

const handleAppStateChange = async (_nextAppState, resolve, reject, opts) => {
  const res: any = {}

  if (AppState.currentState === 'active') {
    try {
      res.authSetting = await getAuthSetting()
      res.errMsg = 'openSetting:ok'

      appStateSubscription?.remove()
      resolve(res)
    } catch (error) {
      res.errMsg = 'openSetting:fail'

      reject(error)
    }
  }
  // AppState.currentState = nextAppState;
}

export async function authorize(opts: authorize.Option): Promise<CallbackResult> {
  const { scope } = opts
  const res: any = {}

  try {
    const { granted } = await scopeMap[scope][1]()
    if (granted) {
      res.errMsg = 'authorize:ok'
      return Promise.resolve(res)
    } else {
      res.errMsg = 'authorize:denied/undetermined'
      return Promise.reject(res)
    }
  } catch (error) {
    res.errMsg = 'authorize:fail'
    return Promise.reject(res)
  }
}

export async function getSetting(opts: getSetting.Option = {}): Promise<getSetting.SuccessCallbackResult> {
  const res: any = {}

  try {
    res.authSetting = await getAuthSetting()
    res.errMsg = 'getSetting:ok'
    return Promise.resolve(res)
  } catch (error) {
    res.errMsg = 'getSetting:fail'
    return Promise.reject(res)
  }
}

export function openSetting(opts: openSetting.Option = {}): Promise<openSetting.SuccessCallbackResult> {
  return new Promise((resolve, reject) => {
    stateListener = (next) => handleAppStateChange(next, resolve, reject, opts)
    appStateSubscription = AppState.addEventListener('change', stateListener)
    Linking.openSettings()
  })
}
