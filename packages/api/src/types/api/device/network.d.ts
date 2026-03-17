import Nebula from '../../index'

declare module '../../index' {
  namespace onNetworkWeakChange {
    
    type Callback = (
        result: CallbackResult,
    ) => void

    interface CallbackResult {
      
      weakNet: boolean
      
      networkType: keyof getNetworkType.NetworkType
    }
  }

  namespace onNetworkStatusChange {
    
    type Callback = (
        result: CallbackResult,
    ) => void

    interface CallbackResult {
      
      isConnected: boolean
      
      networkType: keyof getNetworkType.NetworkType
    }
  }

  namespace getNetworkType {
    interface Option {
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      networkType: keyof NetworkType
      
      signalStrength?: number
      
      hasSystemProxy?: boolean
      
      errMsg: string
    }

    
    interface NetworkType {
      
      wifi
      
      '2g'
      
      '3g'
      
      '4g'
      
      '5g'
      
      'unknown'
      
      'none'
    }
  }

  namespace getLocalIPAddress {
    interface Option {
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      localip: string
      
      netmask?: string
      
      errMsg: string
    }
  }

  interface NebulaStatic {
    
    onNetworkWeakChange(
      
      callback: onNetworkWeakChange.Callback,
    ): void

    
    onNetworkStatusChange(
      
      callback: onNetworkStatusChange.Callback,
    ): void

    
    offNetworkWeakChange(
      
      callback?: onNetworkWeakChange.Callback,
    ): void

    
    offNetworkStatusChange(
      
      callback?: onNetworkStatusChange.Callback,
    ): void

    
    getNetworkType(option?: getNetworkType.Option): Promise<getNetworkType.SuccessCallbackResult>

    
    getLocalIPAddress(option?: getLocalIPAddress.Option): Promise<getLocalIPAddress.SuccessCallbackResult>
  }
}
