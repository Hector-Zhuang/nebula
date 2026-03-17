import DeviceInfo from 'react-native-device-info'
export function getAppBaseInfo(): getAppBaseInfo.Result {
  return {
    SDKVersion: '', // not supportted
    version: DeviceInfo.getVersion(),
    language: '', // todo
    enableDebug: !!__DEV__,
    theme: 'light' // Documentation in English.
  }
}
