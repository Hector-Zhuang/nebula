import React from 'react'

import Nebula from '../index'

declare module '../index' {
  namespace getAppInfo {
    /** Documentation in English. */
    interface AppInfo {
      platform: string
      taroVersion: string
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
      /** Documentation in English. */
      rnNavigationRef?: React.RefObject<any>
    }
  }

  namespace setGlobalDataPlugin {
    /** Documentation in English. */
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

    /** Documentation in English. */
    eventCenter: NebulaGeneral.Events

    /** @ignore */
    ENV_TYPE: TARO_ENV_TYPE

    /** Documentation in English. */
    getEnv(): NebulaGeneral.ENV_TYPE

    /** Documentation in English. */
    pxTransform(size: number): string

    /** Documentation in English. */
    initPxTransform(config: {
      baseFontSize?: number
      deviceRatio?: NebulaGeneral.TDeviceRatio
      designWidth?: number | ((size?: string | number) => number)
      targetUnit?: string
      unitPrecision?: number
    }): void

    /** Documentation in English. */
    getAppInfo(): getAppInfo.AppInfo

    getEnvInfoSync(): {
      /** Documentation in English. */
      microapp: {
        /** Documentation in English. */
        mpVersion: string
        /** Documentation in English. */
        envType: string
        /** Documentation in English. */
        appId: string
      }
      /** Documentation in English. */
      plugin: Record<string, unknown>
      /** Documentation in English. */
      common: {
        /** Documentation in English. */
        USER_DATA_PATH: string
        /** Documentation in English. */
        location: string | undefined
        launchFrom: string | undefined
        schema: string | undefined
      }
    }

    /** Documentation in English. */
    requirePlugin: {
      (pluginName: string): any
      /** @supported weapp */
      async?: (pluginName: string) => Promise<any>
    }

    /** Documentation in English. */
    getCurrentInstance(): getCurrentInstance.Current

    /** @ignore */
    Current: getCurrentInstance.Current

    /** Documentation in English. */
    setGlobalDataPlugin: setGlobalDataPlugin.Plugin

    /** Documentation in English. */
    getTabBar<T>(page: getCurrentInstance.Current['page']): T | undefined

    /** Documentation in English. */
    getRenderer(): 'webview' | 'skyline'

    /** Documentation in English. */
    interceptorify<T, R>(api: interceptorify.promisifyApi<T, R>): interceptorify.Interceptorify<T, R>
  }
}
