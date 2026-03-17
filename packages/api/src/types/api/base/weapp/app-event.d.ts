import Nebula from '../../../index'

declare module '../../../index' {
  namespace onPageNotFound {
    interface Result {
      
      isEntryPage: boolean
      
      path: string
      
      query: NebulaGeneral.IAnyObject
    }
    
    type Callback = (res: Result) => void
  }

  namespace onError {
    
    type Callback = (
      
      error: string | ErrorEvent | Error,
    ) => void
  }

  namespace onAppShow {
    interface CallbackResult {
      
      path: string
      
      query: NebulaGeneral.IAnyObject
      
      shareTicket: string
      
      scene: number
      
      referrerInfo: ResultReferrerInfo
      
      forwardMaterials?: ForwardMaterial[]
      
      chatType?: keyof ChatType
      
      apiCategory?: keyof ApiCategory
    }
    
    interface ResultReferrerInfo {
      
      appId?: string
      
      extraData?: NebulaGeneral.IAnyObject
    }
    
    interface ForwardMaterial {
      
      type: string
      
      name: string
      
      path: string
      
      size: number
    }
    
    interface ChatType {
      
      1
      
      2
      
      3
      
      4
    }
    
    interface ApiCategory {
      
      default
      
      nativeFunctionalized
      
      browseOnly
      
      embedded
    }
  }

  namespace onUnhandledRejection {
    type Callback<T = any> = (res: Result<T>) => void
    type Result<T = any> = {
      
      reason: string | Error
      
      promise: Promise<T>
    }
  }

  namespace onThemeChange {
    
    type Callback = (res: Result) => void
    interface Result {
      
      theme: keyof ITheme
    }
    interface ITheme {
      
      light
      
      dark
    }
  }

  interface NebulaStatic {
    
    onUnhandledRejection<T = any>(callback: onUnhandledRejection.Callback<T>): void

    
    onThemeChange(callback: onThemeChange.Callback): void

    
    onPageNotFound(callback: onPageNotFound.Callback): void

    
    onError(callback: onError.Callback): void

    
    onAudioInterruptionEnd (
      
      callback: (res: NebulaGeneral.CallbackResult) => void,
    ): void

    
    onAudioInterruptionBegin(
      
      callback: (res: NebulaGeneral.CallbackResult) => void,
    ): void

    
    onAppShow(
      
      callback: (res: onAppShow.CallbackResult) => void,
    ): void

    
    onAppHide(
      
      callback: (res: onAppShow.CallbackResult) => void,
    ): void

    
    offUnhandledRejection<T = any>(callback: onUnhandledRejection.Callback<T>): void

    
    offThemeChange(callback: onThemeChange.Callback): void

    
    offPageNotFound(
      
      callback: onPageNotFound.Callback,
    ): void

    

    offError(
      
      callback: onError.Callback,
    ): void

    
    offAudioInterruptionEnd(
      
      callback: (res: NebulaGeneral.CallbackResult) => void,
    ): void

    
    offAudioInterruptionBegin(
      
      callback: (res: NebulaGeneral.CallbackResult) => void,
    ): void

    
    offAppShow(
      
      callback: (res: onAppShow.CallbackResult) => void,
    ): void

    
    offAppHide(
      
      callback: (res: onAppShow.CallbackResult) => void,
    ): void
  }
}
