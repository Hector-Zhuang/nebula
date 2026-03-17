import Nebula from '../../index'

declare module '../../index' {
  // Documentation in English.

  namespace setBackgroundFetchToken {
    interface Option {
      
      token: string
      
      
      
    }
  }

  namespace onBackgroundFetchData {
    interface Option {
      
      
      
    }

    type Callback = (
      result: CallbackResult,
    ) => void

    interface CallbackResult {
      
      fetchType: string
      
      fetchedData: string
      
      timeStamp: number
      
      path: string
      
      query: string
      
      scene: number
    }
  }

  namespace getBackgroundFetchToken {
    interface Option {
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      token: string
      
      errMsg: string
    }
  }

  namespace getBackgroundFetchData {
    interface Option {
      
      fetchType: string
      
      
      
    }

    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      fetchedData: string | Object
      
      timeStamp: number
      
      path: string
      
      query: string
      
      scene: number
      
      fetchType?: string
      
      timestamp?: number
    }
  }

  interface NebulaStatic {
    
    setBackgroundFetchToken(option: setBackgroundFetchToken.Option): Promise<NebulaGeneral.CallbackResult>

    
    onBackgroundFetchData(option?: onBackgroundFetchData.Option | onBackgroundFetchData.Callback): void

    
    getBackgroundFetchToken(option?: getBackgroundFetchToken.Option): Promise<NebulaGeneral.CallbackResult>

    
    getBackgroundFetchData(option: getBackgroundFetchData.Option): Promise<getBackgroundFetchData.SuccessCallbackResult>
  }
}
