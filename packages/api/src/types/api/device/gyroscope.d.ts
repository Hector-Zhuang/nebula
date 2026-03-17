import Nebula from '../../index'

declare module '../../index' {
  namespace stopGyroscope {
    interface Option {
      
      
      
    }
  }


  namespace startGyroscope {
    interface Option {
      
      
      
      interval?: keyof Interval
      
    }

    
    interface Interval {
      
      game
      
      ui
      
      normal
    }
  }

  namespace onGyroscopeChange {
    
    type Callback = (
      result: CallbackResult,
    ) => void
    interface CallbackResult {
      
      x: number
      
      y: number
      
      z: number
    }
  }

  interface NebulaStatic {
    
    stopGyroscope(option?: stopGyroscope.Option): Promise<NebulaGeneral.CallbackResult>

    
    startGyroscope(option: startGyroscope.Option): Promise<NebulaGeneral.CallbackResult>

    
    onGyroscopeChange(
      
      callback: onGyroscopeChange.Callback,
    ): void

    
    offGyroscopeChange(
      
      callback?: onGyroscopeChange.Callback,
    ): void
  }
}
