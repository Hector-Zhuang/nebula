declare namespace NebulaGeneral {
  type IAnyObject = Record<string, any>
  type Optional<F> = F extends (arg: infer P) => infer R ? (arg?: P) => R : F
  type OptionalInterface<T> = { [K in keyof T]: Optional<T[K]> }
  type TFunc = (...args: any[]) => any
  
  type EventCallback = (
    
    ...args: any
  ) => void
  
  interface CallbackResult {
    
    errMsg: string
  }
  type CommonEventFunction<T = any> = (event: BaseEventOrig<T>) => any
  interface BaseEventOrig<T> {
    
    type: string

    
    timeStamp: number

    
    target: Target

    
    currentTarget: currentTarget

    
    detail: T

    
    preventDefault: () => void

    
    stopPropagation: () => void
  }
  interface currentTarget extends Target { }
  interface Target {
    
    id: string
    
    tagName: string
    
    dataset: {
      [key: string]: any
    }
  }
  
  interface BluetoothError extends CallbackResult {
    
    errMsg: string
    
    errCode: keyof BluetoothErrCode
  }
  
  interface WifiError extends CallbackResult {
    
    errMsg: string
    
    errCode: keyof WifiErrCode
  }
  
  interface NFCError extends CallbackResult {
    
    errMsg: string
    
    errCode: keyof NFCErrCode
  }

  
  interface IBeaconError extends CallbackResult {
    
    errMsg: string
    
    errCode: keyof IBeaconErrCode
  }

  
  interface SafeAreaResult {
    
    bottom: number
    
    height: number
    
    left: number
    
    right: number
    
    top: number
    
    width: number
  }
  
  interface AdErrCode {
    
    1000
    
    1001
    
    1002
    
    1003
    
    1004
    
    1005
    
    1006
    
    1007
    
    1008
    // [key: number]: string
  }
  
  interface BluetoothErrCode {
    
    0
    
    10000
    
    10001
    
    10002
    
    10003
    
    10004
    
    10005
    
    10006
    
    10007
    
    10008
    
    10009
    
    10012
    
    10013
  }
  
  interface IBeaconErrCode {
    
    0
    
    11000
    
    11001
    
    11002
    
    11003
    
    11004
    
    11005
    
    11006
  }
  
  interface WifiErrCode {
    
    0
    
    12000
    
    12001
    
    12002
    
    12003
    
    12004
    
    12005
    
    12006
    
    12007
    
    12008
    
    12009
    
    12010
    
    12011
    
    12013
  }
  
  interface NFCErrCode {
    
    0
    
    13000
    
    13001
    
    13002
    
    13003
    
    13004
    
    13005
    
    13006
    
    13010
    
    13019
    
    13011
    
    13012
    
    13013
    
    13014
    
    13015
    
    13016
    
    13017
    
    13018
    
    13021
    
    13022
    
    13023
    
    13024
  }
  type EventName = string | symbol
  // Events
  class Events {
    
    on (eventName: EventName, listener: (...args: any[]) => void): this

    
    once (eventName: EventName, listener: (...args: any[]) => void): this

    
    off (eventName: EventName, listener?: (...args: any[]) => void): this

    
    off (): this

    
    trigger (eventName: EventName, ...args: any[]): this
  }

  // ENV_TYPE
  enum ENV_TYPE {
    ASCF = 'ASCF',
    WEAPP = 'WEAPP',
    SWAN = 'SWAN',
    ALIPAY = 'ALIPAY',
    TT = 'TT',
    QQ = 'QQ',
    JD = 'JD',
    WEB = 'WEB',
    RN = 'RN',
    HARMONY = 'HARMONY',
    QUICKAPP = 'QUICKAPP',
    HARMONYHYBRID = 'HARMONYHYBRID'
  }

  type TDeviceRatio = Record<string, number>
}
