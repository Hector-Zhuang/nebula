import Nebula from '../../index'

declare module '../../index' {
  namespace Worker {
    type OnMessageCallback = (
      result: OnMessageCallbackResult,
    ) => void
    interface OnMessageCallbackResult {
      
      message: NebulaGeneral.IAnyObject
    }
  }
  interface Worker {
    
    onMessage(
      
      callback: Worker.OnMessageCallback,
    ): void
    
    onProcessKilled(
      
      callback: Worker.OnMessageCallback,
    ): void
    
    postMessage(
      
      message: NebulaGeneral.IAnyObject,
    ): void
    
    terminate(): void
  }

  interface NebulaStatic {
    
    createWorker(
      
      scriptPath: string,
    ): Worker
  }
}
