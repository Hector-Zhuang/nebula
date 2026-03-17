import Nebula from '../../index'

declare module '../../index' {
  namespace startAccelerometer {
    type Option = {
      
      interval?: keyof Interval
      
      
      
    }

    type Interval = {
      
      game: 'game',
      
      ui: 'ui',
      
      normal: 'normal'
    }
  }

  namespace stopAccelerometer {
    type Option = {
      
      
      
    }
  }

  namespace onAccelerometerChange {
    type Callback = (res: Result) => void
    type Result = {
      
      x: number
      
      y: number
      
      z: number
    }
  }

  interface NebulaStatic {
    
    startAccelerometer (res?: startAccelerometer.Option): Promise<NebulaGeneral.CallbackResult>

    
    stopAccelerometer (res?: stopAccelerometer.Option): Promise<NebulaGeneral.CallbackResult>

    
    onAccelerometerChange(
      callback: onAccelerometerChange.Callback
    ): void

    
    offAccelerometerChange(
      
      callback?: onAccelerometerChange.Callback
    ): void
  }
}
