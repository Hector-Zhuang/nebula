import Nebula from '../../index'

declare module '../../index' {
  namespace stopWifi {
    interface Option {
      
      
      
    }
  }

  namespace startWifi {
    interface Option {
      
      
      
    }
  }

  namespace setWifiList {
    interface Option {
      
      wifiList: WifiData[]
      
      
      
    }

    
    interface WifiData {
      
      BSSID?: string
      
      SSID?: string
      
      password?: string
    }
  }

  namespace onWifiConnectedWithPartialInfo {
    
    type Callback = (
        result: CallbackResult,
    ) => void
    interface CallbackResult {
      
      wifi: Pick<WifiInfo, 'SSID'>
    }
  }

  namespace onWifiConnected {
    
    type Callback = (
        result: CallbackResult,
    ) => void
    interface CallbackResult {
      
      wifi: WifiInfo
    }
  }

  namespace onGetWifiList {
    
    type Callback = (result: CallbackResult) => void
    interface CallbackResult {
      
      wifiList: WifiInfo[]
    }
  }

  namespace getWifiList {
    interface Option {
      
      
      
    }
  }

  namespace getConnectedWifi {
    interface Option {
      
      partialInfo?: boolean
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.WifiError {
      
      wifi: WifiInfo
      
      errMsg: string
    }
  }

  namespace connectWifi {
    interface Option {
      
      SSID: string
      
      password: string
      
      BSSID?: string
      
      maunal?: boolean
      
      partialInfo?: boolean
      
      
      
    }
  }

  
  interface WifiInfo {
    
    SSID: string
    
    BSSID: string
    
    secure: boolean
    
    signalStrength: number
    
    frequency?: number
  }

  interface NebulaStatic {
    
    stopWifi(option?: stopWifi.Option): Promise<NebulaGeneral.WifiError>

    
    startWifi(option?: startWifi.Option): Promise<NebulaGeneral.WifiError>

    
    setWifiList(option: setWifiList.Option): Promise<NebulaGeneral.WifiError>

    
    onWifiConnectedWithPartialInfo(
      
      callback: onWifiConnectedWithPartialInfo.Callback,
    ): void

    
    onWifiConnected(
      
      callback: onWifiConnected.Callback,
    ): void

    
    onGetWifiList(
      
      callback: onGetWifiList.Callback,
    ): void

    
     offWifiConnectedWithPartialInfo(
      
      callback?: onWifiConnectedWithPartialInfo.Callback,
    ): void

    
    offWifiConnected(
      
      callback?: onWifiConnected.Callback,
    ): void

    
    offGetWifiList(
      
      callback?: onGetWifiList.Callback,
    ): void

    
    getWifiList(option?: getWifiList.Option): Promise<NebulaGeneral.WifiError>

    
    getConnectedWifi(option?: getConnectedWifi.Option): Promise<NebulaGeneral.WifiError>

    
    connectWifi(option: connectWifi.Option): Promise<NebulaGeneral.WifiError>
  }
}
