import Nebula from '../../index'

declare module '../../index' {
  namespace getExtConfigSync {
    interface ExtInfo {
      
      extConfig: NebulaGeneral.IAnyObject
    }
  }

  namespace getExtConfig {
    interface Option {
      
      
      
    }

    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      extConfig: NebulaGeneral.IAnyObject
      
      errMsg: string
    }
  }

  interface NebulaStatic {
    
    getExtConfigSync(): NebulaGeneral.IAnyObject

    
    getExtConfig(option?: getExtConfig.Option): Promise<getExtConfig.SuccessCallbackResult>
  }
}
