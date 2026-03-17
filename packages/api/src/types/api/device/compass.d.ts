import Nebula from '../../index'

declare module '../../index' {
  namespace stopCompass {
    interface Option {
      
      
      
    }
  }

  namespace startCompass {
    interface Option {
      
      
      
    }
  }

  namespace onCompassChange {
    
    type Callback = (
      result: OnCompassChangeCallbackResult,
    ) => void
    interface OnCompassChangeCallbackResult {
      
      accuracy: number | keyof accuracy | string
      
      direction: number
    }

    interface accuracy {
      
      high
      
      medium
      
      low
      
      'no-contact'
      
      unreliable
      
      'unknow ${value}'
    }
  }

  interface NebulaStatic {
    
    stopCompass(option?: stopCompass.Option): Promise<NebulaGeneral.CallbackResult>

    
    startCompass(option?: startCompass.Option): Promise<NebulaGeneral.CallbackResult>

    
    onCompassChange(
      
      callback: onCompassChange.Callback,
    ): void

    
    offCompassChange(
      
      callback?: onCompassChange.Callback,
    ): void
  }
}
