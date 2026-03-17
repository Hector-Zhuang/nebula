import React from 'react'

import Nebula from '../index'

declare module '../index' {
  namespace getAppInfo {
    
    interface AppInfo {
      platform: string
      nebulaVersion: string
      designWidth: number | ((size?: string | number) => number)
    }
  }

  namespace getCurrentInstance {
    interface Current {
      app: AppInstance | null
      router: RouterInfo | null
      page: PageInstance | null
      onReady: string
      onHide: string
      onShow: string
      preloadData?: Record<any, any>
      
      rnNavigationRef?: React.RefObject<any>
    }
  }

  namespace setGlobalDataPlugin {
    
    interface Plugin {
      install(app: any, data: any): void
    }
  }

  /** @ignore */
  interface TARO_ENV_TYPE {
    [NebulaGeneral.ENV_TYPE.WEAPP]: NebulaGeneral.ENV_TYPE.WEAPP
    [NebulaGeneral.ENV_TYPE.SWAN]: NebulaGeneral.ENV_TYPE.SWAN
    [NebulaGeneral.ENV_TYPE.ALIPAY]: NebulaGeneral.ENV_TYPE.ALIPAY
    [NebulaGeneral.ENV_TYPE.TT]: NebulaGeneral.ENV_TYPE.TT
    [NebulaGeneral.ENV_TYPE.QQ]: NebulaGeneral.ENV_TYPE.QQ
    [NebulaGeneral.ENV_TYPE.JD]: NebulaGeneral.ENV_TYPE.JD
    [NebulaGeneral.ENV_TYPE.WEB]: NebulaGeneral.ENV_TYPE.WEB
    [NebulaGeneral.ENV_TYPE.RN]: NebulaGeneral.ENV_TYPE.RN
    [NebulaGeneral.ENV_TYPE.HARMONY]: NebulaGeneral.ENV_TYPE.HARMONY
    [NebulaGeneral.ENV_TYPE.QUICKAPP]: NebulaGeneral.ENV_TYPE.QUICKAPP
    [NebulaGeneral.ENV_TYPE.HARMONYHYBRID]: NebulaGeneral.ENV_TYPE.HARMONYHYBRID
    [NebulaGeneral.ENV_TYPE.ASCF]: NebulaGeneral.ENV_TYPE.ASCF
  }

  namespace interceptorify {
    type promisifyApi<T, R> = (requestParams: T) => Promise<R>
    interface InterceptorifyChain<T, R> {
      requestParams: T
      proceed: promisifyApi<T, R>
    }
    type InterceptorifyInterceptor<T, R> = (chain: InterceptorifyChain<T, R>) => Promise<R>
    interface Interceptorify<T, R> {
      request(requestParams: T): Promise<R>
      addInterceptor(interceptor: InterceptorifyInterceptor<T, R>): void
      cleanInterceptors(): void
    }
  }

  interface NebulaStatic {
    /** @ignore */
    Events: {
      new (): NebulaGeneral.Events
    }

    
    eventCenter: NebulaGeneral.Events

    /** @ignore */
    ENV_TYPE: TARO_ENV_TYPE

    
    getEnv(): NebulaGeneral.ENV_TYPE

    
    pxTransform(size: number): string

    
    initPxTransform(config: {
      baseFontSize?: number
      deviceRatio?: NebulaGeneral.TDeviceRatio
      designWidth?: number | ((size?: string | number) => number)
      targetUnit?: string
      unitPrecision?: number
    }): void

    
    getAppInfo(): getAppInfo.AppInfo

    getEnvInfoSync(): {
      
      microapp: {
        
        mpVersion: string
        
        envType: string
        
        appId: string
      }
      
      plugin: Record<string, unknown>
      
      common: {
        
        USER_DATA_PATH: string
        
        location: string | undefined
        launchFrom: string | undefined
        schema: string | undefined
      }
    }

    
    requirePlugin: {
      (pluginName: string): any
      /** @supported weapp */
      async?: (pluginName: string) => Promise<any>
    }

    
    getCurrentInstance(): getCurrentInstance.Current

    /** @ignore */
    Current: getCurrentInstance.Current

    
    setGlobalDataPlugin: setGlobalDataPlugin.Plugin

    
    getTabBar<T>(page: getCurrentInstance.Current['page']): T | undefined

    
    getRenderer(): 'webview' | 'skyline'

    
    interceptorify<T, R>(api: interceptorify.promisifyApi<T, R>): interceptorify.Interceptorify<T, R>
  }
}
