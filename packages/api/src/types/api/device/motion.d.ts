import Nebula from '../../index'

declare module '../../index' {
  namespace startDeviceMotionListening {
    interface Option {
      
      
      
      interval?: keyof Interval
      
    }
    interface Interval {
      
      game
      
      ui
      
      normal
    }
  }

  namespace stopDeviceMotionListening {
    interface Option {
      
      
      
    }
  }

  namespace onDeviceMotionChange {
    
    type Callback = (result: CallbackResult) => void

    interface CallbackResult {
      
      alpha: number
      
      beta: number
      
      gamma: number
    }
  }

  interface NebulaStatic {
    
    startDeviceMotionListening(
      option: startDeviceMotionListening.Option,
    ): void

    
    stopDeviceMotionListening(
      option?: stopDeviceMotionListening.Option,
    ): void

    
    onDeviceMotionChange(
      callback: onDeviceMotionChange.Callback
    ): void

    
    offDeviceMotionChange(
      
      callback?: onDeviceMotionChange.Callback
    ): void
  }
}
