import Nebula from '../../index'

declare module '../../index' {
  
  interface Page {
    
    route?: string
    __route__?: string
    /** @ignore */
    [k: string]: any
  }

  namespace getApp {
    interface Option {
      
      allowDefault?: boolean
    }
    type Instance<T extends App> = Option & T
  }

  
  interface App extends NebulaGeneral.IAnyObject {
    /** @ignore */
    [key: string]: any
  }

  interface NebulaStatic {
    
    getCurrentPages(): Page[]

    
    getApp<T = NebulaGeneral.IAnyObject>(opts?: getApp.Option): getApp.Instance<T>
  }
}
