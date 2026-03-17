import Nebula from '../../index'

declare module '../../index' {
  namespace setClipboardData {
    interface Promised extends NebulaGeneral.CallbackResult {
      
      errMsg: string
      
      data: string
    }
    interface Option {
      
      data: string
      
      
      
    }
  }

  namespace getClipboardData {
    interface Promised extends NebulaGeneral.CallbackResult {
      
      errMsg: string
      
      data: string
    }
    interface Option {
      
      
      
    }
    interface SuccessCallbackOption {
      
      data: string
    }
  }

  interface NebulaStatic {
    
    setClipboardData(option: setClipboardData.Option): Promise<setClipboardData.Promised>

    
    getClipboardData(res?: getClipboardData.Option): Promise<getClipboardData.Promised>
  }
}
