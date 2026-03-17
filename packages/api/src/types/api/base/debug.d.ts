import Nebula from '../../index'

declare module '../../index' {
  namespace setEnableDebug {
    type Option = {
      
      enableDebug: boolean
      
      
      
    }
    interface Promised extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
  }

  namespace getLogManager {
    type Option = {
      /**
       * @default 0
       */
      level?: keyof Level
    }

    type Level = {
      
      0
      
      1
    }
  }

  
  interface console {
    
    debug(
      
      ...args: any[]
    ): void
    
    error(
      
      ...args: any[]
    ): void
    
    group(
      
      label?: string,
    ): void
    
    groupEnd(): void
    
    info(
      
      ...args: any[]
    ): void
    
    log(
      
      ...args: any[]
    ): void
    
    warn(
      
      ...args: any[]
    ): void
  }

  
  interface LogManager {
    
    debug(
      
      ...args: any[]
    ): void
    
    info(
      
      ...args: any[]
    ): void
    
    log(
      
      ...args: any[]
    ): void
    
    warn(
      
      ...args: any[]
    ): void
  }

  

  interface RealtimeLogManager {
    
    addFilterMsg(
      
      msg: string
    ): void
    
    error(
      
      ...args: any[]
    ): void
    
    in(
      
      pageInstance
    ): void
    
    info(
      
      ...args: any[]
    ): void
    
    setFilterMsg(
      
      msg: string
    ): void
    
    tag(
      
      tagName: string
    ): RealtimeTagLogManager
    
    warn(
      
      ...args: any[]
    ): void
  }

  
  interface RealtimeTagLogManager {
    
    addFilterMsg(
      
      msg: string
    ): void
    
    error(
      
      key: string,
      
      value: Object | any[] | number | string,
    ): void
    
    info(
      
      key: string,
      
      value: Object | any[] | number | string,
    ): void
    
    setFilterMsg(
      
      msg: string
    ): void
    
    warn(
      
      key: string,
      
      value: Object | any[] | number | string,
    ): void
  }

  interface NebulaStatic {
    
    setEnableDebug(res: setEnableDebug.Option): Promise<setEnableDebug.Promised>

    
    getRealtimeLogManager(): RealtimeLogManager

    
    getLogManager(res?: getLogManager.Option): LogManager
  }
}
