import Nebula from '../../index'

declare module '../../index' {
  namespace request {
    interface Option<T = any, U extends string | NebulaGeneral.IAnyObject | ArrayBuffer = any | any> {
      
      url: string
      
      data?: U
      
      header?: NebulaGeneral.IAnyObject
      
      timeout?: number
      
      method?: keyof Method
      
      dataType?: keyof DataType | string
      
      responseType?: keyof ResponseType
      
      useHighPerformanceMode?: boolean
      
      enableHttp2?: boolean
      
      enableQuic?: boolean
      
      enableCache?: boolean
      
      enableHttpDNS?: boolean
      
      httpDNSServiceId?: string
      
      enableChunked?: boolean
      
      forceCellularNetwork?: boolean
      
      enableCookie?: boolean
      
      referrerStrategy?: keyof ReferrerStrategy
      
      
      
      
      jsonp?: boolean | string
      
      jsonpCache?: RequestCache
      
      mode?: keyof CorsMode
      
      credentials?: keyof Credentials
      
      cache?: keyof Cache
      
      retryTimes?: number
      
      backup?: string | string[]
      
      signal?: AbortSignal
      
      dataCheck?(): boolean
      
      useStore?: boolean
      
      storeCheckKey?: string
      
      storeSign?: string
      
      storeCheck?(): boolean
    }

    interface SuccessCallbackResult<T extends string | NebulaGeneral.IAnyObject | ArrayBuffer = any | any>
      extends NebulaGeneral.CallbackResult {
      
      data: T
      
      header: NebulaGeneral.IAnyObject
      
      statusCode: number
      
      errMsg: string
      /** cookies */
      cookies?: string[]
    }

    
    interface DataType {
      
      json
      
      text
      
      base64
      
      arraybuffer
    }

    
    interface Method {
      
      OPTIONS
      
      GET
      
      HEAD
      
      POST
      
      PUT
      
      PATCH
      
      DELETE
      
      TRACE
      
      CONNECT
    }

    
    interface ResponseType {
      
      text
      
      arraybuffer
    }

    
    interface CorsMode {
      
      'no-cors'
      
      cors
      
      'same-origin'
    }
    
    interface Credentials {
      
      include
      
      'same-origin'
      
      omit
    }
    
    interface Cache {
      
      default
      
      'no-cache'
      
      reload
      
      'force-cache'
      
      'only-if-cached'
    }
    
    interface ReferrerStrategy {
      
      index
      
      page
      
      querystring
    }
  }

  
  interface RequestTask<T> extends Promise<request.SuccessCallbackResult<T>> {
    
    abort(): void
    
    onHeadersReceived(
      
      callback: RequestTask.onHeadersReceived.Callback
    ): void
    
    offHeadersReceived(
      
      callback: RequestTask.onHeadersReceived.Callback
    ): void
    
    onChunkReceived(
      
      callback: RequestTask.onChunkReceived.Callback
    ): void
    
    offChunkReceived(
      
      callback: RequestTask.onChunkReceived.Callback
    ): void
  }

  namespace RequestTask {
    namespace onHeadersReceived {
      
      type Callback = (result: CallbackResult) => void
      interface CallbackResult {
        
        header: NebulaGeneral.IAnyObject
      }
    }
    namespace onChunkReceived {
      
      type Callback = (result: CallbackResult) => void
      
      interface CallbackResult {
        
        data: ArrayBuffer
      }
    }
  }

  /** @ignore */
  type interceptor = (chain: Chain) => any

  /** @ignore */
  interface Chain {
    index: number
    requestParams: RequestParams
    interceptors: interceptor[]
    proceed(requestParams: RequestParams): any
  }

  /** @ignore */
  interface interceptors {
    logInterceptor(chain: Chain): Promise<any>

    timeoutInterceptor(chain: Chain): Promise<any>
  }

  interface NebulaStatic {
    
    request<T = any, U = any>(option: request.Option<T, U>): RequestTask<T>

    
    addInterceptor(interceptor: interceptor): any

    
    cleanInterceptors(): void

    interceptors: interceptors
  }
}
