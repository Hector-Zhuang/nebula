import Nebula from '../../index'

declare module '../../index' {
  namespace updateWeChatApp {
    interface Option {
      
      
      
    }
  }

  namespace UpdateManager {
    
    type OnCheckForUpdateCallback = (
      result: OnCheckForUpdateResult,
    ) => void
    interface OnCheckForUpdateResult {
      
      hasUpdate: boolean
    }
  }

  
  interface UpdateManager {
    
    applyUpdate(): void
    
    onCheckForUpdate(
        
        callback: UpdateManager.OnCheckForUpdateCallback,
    ): void
    
    onUpdateReady(
        
        callback: (res: NebulaGeneral.CallbackResult) => void,
    ): void
    
    onUpdateFailed(
        
        callback: (res: NebulaGeneral.CallbackResult) => void,
    ): void
  }

  interface NebulaStatic {
    
    updateWeChatApp(option: updateWeChatApp.Option): Promise<NebulaGeneral.CallbackResult>

    
    getUpdateManager(): UpdateManager
  }
}
