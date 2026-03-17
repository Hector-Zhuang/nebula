import Nebula from '../../index'

declare module '../../index' {
  namespace stopPullDownRefresh {
    interface Option {
      
      
      
    }
  }

  namespace startPullDownRefresh {
    interface Option {
      
      
      
    }
  }

  interface NebulaStatic {
    
    stopPullDownRefresh(option?: stopPullDownRefresh.Option): void

    
    startPullDownRefresh(option?: startPullDownRefresh.Option): Promise<NebulaGeneral.CallbackResult>
  }
}
