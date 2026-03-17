import Nebula from '../../index'

declare module '../../index' {
  namespace openSystemBluetoothSetting {
    interface Option {
      
      
      
    }
  }

  namespace openAppAuthorizeSetting {
    interface Option {
      
      
      
    }
  }

  namespace getWindowInfo {
    interface Result {
      
      pixelRatio: number
      
      screenWidth: number
      
      screenHeight: number
      
      windowWidth: number
      
      windowHeight: number
      
      statusBarHeight?: number
      
      safeArea?: NebulaGeneral.SafeAreaResult
    }
  }

  namespace getSystemSetting {
    interface Result {
      
      bluetoothEnabled?: boolean
      
      locationEnabled?: boolean
      
      wifiEnabled?: boolean
      
      deviceOrientation?: keyof DeviceOrientation
    }
    
    interface DeviceOrientation {
      
      portrait
      
      landscape
    }
  }

  namespace getSystemInfoSync {
    interface Result {
      
      brand: string
      
      model: string
      
      pixelRatio: number
      
      screenWidth: number
      
      screenHeight: number
      
      windowWidth: number
      
      windowHeight: number
      
      statusBarHeight?: number
      
      language: string
      
      version?: string
      
      system: string
      
      platform: string
      
      fontSizeSetting?: number
      
      SDKVersion?: string
      
      benchmarkLevel: number
      
      albumAuthorized?: boolean
      
      cameraAuthorized?: boolean
      
      locationAuthorized?: boolean
      
      microphoneAuthorized?: boolean
      
      notificationAuthorized?: boolean
      
      notificationAlertAuthorized?: boolean
      
      notificationBadgeAuthorized?: boolean
      
      notificationSoundAuthorized?: boolean
      
      phoneCalendarAuthorized?: boolean
      
      bluetoothEnabled?: boolean
      
      locationEnabled?: boolean
      
      wifiEnabled?: boolean
      
      safeArea?: NebulaGeneral.SafeAreaResult
      
      locationReducedAccuracy?: boolean
      
      theme?: keyof Theme
      
      host?: Host
      
      enableDebug?: boolean
      
      deviceOrientation?: keyof DeviceOrientation
      
      environment?: string
      
      screen?: {
        
        width: number
        
        height: number
      }
    }
    
    interface Theme {
      
      dark
      
      light
    }
    interface Host {
      
      appId: string
    }
    
    interface DeviceOrientation {
      
      portrait
      
      landscape
    }
  }

  namespace getSystemInfoAsync {
    interface Option {
      
      
      
    }
    interface Result extends NebulaGeneral.CallbackResult {
      
      brand: string
      
      model: string
      
      pixelRatio: number
      
      screenWidth: number
      
      screenHeight: number
      
      windowWidth: number
      
      windowHeight: number
      
      statusBarHeight?: number
      
      language: string
      
      version?: string
      
      system: string
      
      platform: string
      
      fontSizeSetting?: number
      
      SDKVersion?: string
      
      benchmarkLevel: number
      
      albumAuthorized?: boolean
      
      cameraAuthorized?: boolean
      
      locationAuthorized?: boolean
      
      microphoneAuthorized?: boolean
      
      notificationAuthorized?: boolean
      
      notificationAlertAuthorized?: boolean
      
      notificationBadgeAuthorized?: boolean
      
      notificationSoundAuthorized?: boolean
      
      phoneCalendarAuthorized?: boolean
      
      bluetoothEnabled?: boolean
      
      locationEnabled?: boolean
      
      wifiEnabled?: boolean
      
      safeArea?: NebulaGeneral.SafeAreaResult
      
      locationReducedAccuracy?: boolean
      
      theme?: keyof Theme
      
      host?: Host
      
      enableDebug?: boolean
      
      deviceOrientation?: keyof DeviceOrientation
      
      environment?: string
      
      screen?: {
        
        width: number
        
        height: number
      }
    }
    
    interface Theme {
      
      dark
      
      light
    }
    interface Host {
      
      appId: string
    }
    
    interface DeviceOrientation {
      
      portrait
      
      landscape
    }
  }

  namespace getSystemInfo {
    interface Option {
      
      
      
    }
    interface Result extends NebulaGeneral.CallbackResult {
      
      brand: string
      
      model: string
      
      pixelRatio: number
      
      screenWidth: number
      
      screenHeight: number
      
      windowWidth: number
      
      windowHeight: number
      
      statusBarHeight?: number
      
      language: string
      
      version?: string
      
      system: string
      
      platform: string
      
      fontSizeSetting?: number
      
      SDKVersion?: string
      
      benchmarkLevel: number
      
      albumAuthorized?: boolean
      
      cameraAuthorized?: boolean
      
      locationAuthorized?: boolean
      
      microphoneAuthorized?: boolean
      
      notificationAuthorized?: boolean
      
      notificationAlertAuthorized?: boolean
      
      notificationBadgeAuthorized?: boolean
      
      notificationSoundAuthorized?: boolean
      
      phoneCalendarAuthorized?: boolean
      
      bluetoothEnabled?: boolean
      
      locationEnabled?: boolean
      
      wifiEnabled?: boolean
      
      safeArea?: NebulaGeneral.SafeAreaResult
      
      locationReducedAccuracy?: boolean
      
      theme?: keyof Theme
      
      host?: Host
      
      enableDebug?: boolean
      
      deviceOrientation?: keyof DeviceOrientation
      
      environment?: string
      
      screen?: {
        
        width: number
        
        height: number
      }
    }
    
    interface Theme {
      
      dark
      
      light
    }
    interface Host {
      
      appId: string
    }
    
    interface DeviceOrientation {
      
      portrait
      
      landscape
    }
  }

  namespace getSkylineInfoSync {
    interface Result {
      
      isSupported: boolean
      
      version: string
      
      reason?: string
    }
  }

  namespace getSkylineInfo {
    interface Option {
      
      
      
    }
    interface Result {
      
      isSupported: boolean
      
      version: string
      
      reason?: string
    }
  }

  namespace getRendererUserAgent {
    interface Option {
      
      
      
    }
    interface Result {
      userAgent: string
    }
  }

  namespace getDeviceInfo {
    interface Result {
      
      abi?: string
      
      deviceAbi: string
      
      benchmarkLevel: number
      
      brand: string
      
      model: string
      
      system: string
      
      platform: string
      
      CPUType: string
    }
  }

  namespace getAppBaseInfo {
    interface Result {
      
      SDKVersion?: string
      
      enableDebug?: boolean
      
      host?: Host
      
      language: string
      
      version?: string
      
      theme?: keyof Theme
    }
    
    interface Theme {
      
      dark
      
      light
    }
    interface Host {
      
      appId: string
    }
  }

  namespace getAppAuthorizeSetting {
    interface Result {
      
      albumAuthorized: keyof Authorized
      
      bluetoothAuthorized: keyof Authorized
      
      cameraAuthorized: keyof Authorized
      
      locationAuthorized: keyof Authorized
      
      locationReducedAccuracy: boolean
      
      microphoneAuthorized: keyof Authorized
      
      notificationAuthorized: keyof Authorized
      
      notificationAlertAuthorized: keyof Authorized
      
      notificationBadgeAuthorized: keyof Authorized
      
      notificationSoundAuthorized: keyof Authorized
      
      phoneCalendarAuthorized: keyof Authorized
    }
    
    interface Authorized {
      
      authorized
      
      denied
      
      'not determined'
    }
  }

  interface NebulaStatic {
    
    openSystemBluetoothSetting(option: openSystemBluetoothSetting.Option): Promise<NebulaGeneral.CallbackResult>

    
    openAppAuthorizeSetting(option: openAppAuthorizeSetting.Option): Promise<NebulaGeneral.CallbackResult>

    
    getWindowInfo(): getWindowInfo.Result

    
    getSystemSetting(): getSystemSetting.Result

    
    getSystemInfoSync(): getSystemInfoSync.Result

    
    getSystemInfoAsync(res?: getSystemInfoAsync.Option): Promise<getSystemInfo.Result>

    
    getSystemInfo(res?: getSystemInfo.Option): Promise<getSystemInfo.Result>

    
    getSkylineInfoSync(): getSkylineInfoSync.Result

    
    getSkylineInfo(option?: getSkylineInfo.Option): Promise<getSkylineInfo.Result>

    
    getRendererUserAgent(option?: getRendererUserAgent.Option): Promise<getRendererUserAgent.Result>

    
    getDeviceInfo(): getDeviceInfo.Result

    
    getAppBaseInfo(): getAppBaseInfo.Result

    
    getAppAuthorizeSetting(): getAppAuthorizeSetting.Result
  }
}
