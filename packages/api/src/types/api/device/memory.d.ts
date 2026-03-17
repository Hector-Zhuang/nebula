import Nebula from '../../index'

declare module '../../index' {
  namespace onMemoryWarning {
    
    type Callback = (
      result: CallbackResult,
    ) => void

    interface CallbackResult {
      
      level: keyof Level
    }

    interface Level {
      /** TRIM_MEMORY_RUNNING_MODERATE */
      5
      /** TRIM_MEMORY_RUNNING_LOW */
      10
      /** TRIM_MEMORY_RUNNING_CRITICAL */
      15
    }
  }

  interface NebulaStatic {
    
    onMemoryWarning(
      
      callback: onMemoryWarning.Callback,
    ): void

    
    offMemoryWarning(
      
      callback?: onMemoryWarning.Callback,
    ): void
  }
}
