import Nebula from '../../index'

declare module '../../index' {
  namespace hideKeyboard {
    interface Option {
      
      
      
    }
  }

  namespace getSelectedTextRange {
    interface Option {
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      end: number
      
      start: number
      
      errMsg: string
    }
  }

  namespace onKeyboardHeightChange {
    type Callback = (
      result: CallbackResult,
    ) => void
    interface CallbackResult {
      
      height: number
    }
  }

  interface NebulaStatic {
    
    hideKeyboard(option?: hideKeyboard.Option): Promise<NebulaGeneral.CallbackResult>

    
    getSelectedTextRange(option?: getSelectedTextRange.Option): Promise<getSelectedTextRange.SuccessCallbackResult>

    
    onKeyboardHeightChange(
      callback: onKeyboardHeightChange.Callback
    ): void

    
    offKeyboardHeightChange(
      
      callback?: onKeyboardHeightChange.Callback
    ): void
  }
}
