import Nebula from '../../index'

declare module '../../index' {
  /** @ignore */
  type TypedArray =
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array

  namespace setStorage {
    interface Option {
      
      data: any
      
      key: string
      
      
      
    }
  }

  namespace removeStorage {
    interface Option {
      
      key: string
      
      
      
    }
  }

  namespace getStorageInfoSync {
    interface Option {
      
      currentSize: number
      
      keys: string[]
      
      limitSize: number
      
      success?: boolean
    }
  }

  namespace getStorageInfo {
    interface Option {
      
      
      
    }

    interface SuccessCallbackOption {
      
      currentSize: number
      
      keys: string[]
      
      limitSize: number
    }
  }

  namespace getStorage {
    interface Option<T> {
      
      key: string
      
      
      
    }
    interface SuccessCallbackResult<T> extends NebulaGeneral.CallbackResult {
      
      data: T
      
      errMsg: string
    }
  }

  namespace clearStorage {
    interface Option {
      
      
      
    }
  }

  namespace batchSetStorageSync {
    interface Option {
      /** [{ key, value }] */
      kvList: kv[]
    }
    interface kv {
      
      key: string
      
      value: any
    }
  }

  namespace batchSetStorage {
    interface Option {
      /** [{ key, value }] */
      kvList: kv[]
      
      
      
    }
    interface kv {
      
      key: string
      
      value: any
    }
  }

  namespace batchGetStorage {
    interface Option {
      
      keyList: string[]
      
      
      
    }
  }

  interface NebulaStatic {
    
    setStorageSync(
      
      key: string,
      
      data: any,
    ): void

    
    setStorage(option: setStorage.Option): Promise<NebulaGeneral.CallbackResult>

    
    revokeBufferURL(
      
      url: string
    ): void

    
    removeStorageSync(
      
      key: string,
    ): void

    
    removeStorage(option: removeStorage.Option): Promise<NebulaGeneral.CallbackResult>

    
    getStorageSync<T = any>(
      
      key: string,
    ): T

    
    getStorageInfoSync(): getStorageInfoSync.Option

    
    getStorageInfo(option?: getStorageInfo.Option): Promise<NebulaGeneral.CallbackResult>

    
    getStorage<T = any>(option: getStorage.Option<T>): Promise<getStorage.SuccessCallbackResult<T>>

    
    createBufferURL(
      
      buffer: ArrayBuffer | TypedArray
    ): string

    
    clearStorageSync(): void

    
    clearStorage(option?: clearStorage.Option): Promise<NebulaGeneral.CallbackResult>

    
    batchSetStorageSync(option: batchSetStorageSync.Option): void

    
    batchSetStorage(option: batchSetStorage.Option): Promise<NebulaGeneral.CallbackResult>

    
    batchGetStorageSync<T = any>(
      
      keyList: string[]
    ): T[]

    
    batchGetStorage(option: batchGetStorage.Option): Promise<NebulaGeneral.CallbackResult>
  }
}
