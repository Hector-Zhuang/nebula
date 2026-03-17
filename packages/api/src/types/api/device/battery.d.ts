import Nebula from '../../index'

declare module '../../index' {
  namespace getBatteryInfoSync {
    interface Result {
      
      isCharging: boolean
      
      level: number
    }
  }

  namespace getBatteryInfo {
    interface Option {
      
      
      
    }

    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      isCharging: boolean
      
      level: number
      
      errMsg: string
    }
  }

  interface NebulaStatic {
    
    getBatteryInfoSync(): getBatteryInfoSync.Result

    
    getBatteryInfo(option?: getBatteryInfo.Option): Promise<getBatteryInfo.SuccessCallbackResult>
  }
}
