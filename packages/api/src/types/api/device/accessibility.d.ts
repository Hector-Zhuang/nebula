import Nebula from '../../index'

declare module '../../index' {
  namespace checkIsOpenAccessibility {
    interface Option {
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      open: boolean
    }
  }

  interface NebulaStatic {
    
    checkIsOpenAccessibility(option: checkIsOpenAccessibility.Option): Promise<NebulaGeneral.CallbackResult>
  }
}
