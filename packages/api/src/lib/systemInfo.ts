import {
  Dimensions,
  PixelRatio,
  Platform,
  StatusBar
} from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { initialWindowMetrics } from 'react-native-safe-area-context'

export function collectSystemInfo(): getSystemInfo.Result {
  const res: any = {}

  const brand = DeviceInfo.getBrand()
  const model = DeviceInfo.getModel()
  const pixelRatio = PixelRatio.get()
  const fontScale = PixelRatio.getFontScale()
  const os = Platform.OS
  const version = DeviceInfo.getVersion()
  const system = os + ' ' + Platform.Version
  const screenWidth = Dimensions.get('screen').width
  const screenHeight = Dimensions.get('screen').height
  const windowWidth = Dimensions.get('window').width
  const windowHeight = Dimensions.get('window').height
  const deviceOrientation = screenHeight > screenWidth ? 'portrait' : 'landscape'

  let safeArea = {}
  let { top = 0, bottom = 0 } = initialWindowMetrics?.insets || {}
  if (Platform.OS === 'android') { top = StatusBar.currentHeight || 0 }

  try {
    const w = Math.min(screenWidth, screenHeight)
    const h = Math.max(screenWidth, screenHeight)
    safeArea = {
      left: 0,
      right: w,
      top,
      bottom: h - bottom,
      height: h - bottom - top,
      width: w,
    }
  } catch (error) {
    console.log('calculate safeArea fail: ', error)
  }

  res.brand = brand
  res.model = model
  res.pixelRatio = pixelRatio
  res.safeArea = safeArea
  res.screenWidth = screenWidth
  res.screenHeight = screenHeight
  res.windowWidth = windowWidth
  res.windowHeight = windowHeight
  res.statusBarHeight = top
  res.language = null
  res.version = version
  res.system = system
  res.platform = os
  res.fontSizeSetting = fontScale
  res.SDKVersion = null
  res.deviceOrientation = deviceOrientation

  return res
}
