import Nebula from '../../index'

declare module '../../index' {
  namespace stopLocalServiceDiscovery {
    interface Option {
      
      
      
    }
    interface FailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
  }
  namespace startLocalServiceDiscovery {
    interface Option {
      
      
      
    }
    interface FailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
  }

  namespace onLocalServiceResolveFail {
    
    type Callback = (result: CallbackResult) => void
    interface CallbackResult {
      
      serviceName: string
      
      serviceType: string
    }
  }

  namespace onLocalServiceLost {
    
    type Callback = (result: CallbackResult) => void
    interface CallbackResult {
      
      serviceName: string
      
      serviceType: string
    }
  }

  namespace onLocalServiceFound {
    
    type Callback = (result: CallbackResult) => void
    interface CallbackResult {
      
      ip: string
      
      port: number
      
      serviceName: string
      
      serviceType: string
    }
  }

  namespace onLocalServiceDiscoveryStop {
    
    type Callback = (res: NebulaGeneral.CallbackResult) => void
  }

  namespace offLocalServiceResolveFail {
    
    type Callback = (res: NebulaGeneral.CallbackResult) => void
  }

  namespace offLocalServiceLost {
    
    type Callback = (res: NebulaGeneral.CallbackResult) => void
  }

  namespace offLocalServiceFound {
    
    type Callback = (res: NebulaGeneral.CallbackResult) => void
  }

  namespace offLocalServiceDiscoveryStop {
    
    type Callback = (res: NebulaGeneral.CallbackResult) => void
  }

  interface NebulaStatic {
    
    stopLocalServiceDiscovery(option?: stopLocalServiceDiscovery.Option): void

    
    startLocalServiceDiscovery(option: startLocalServiceDiscovery.Option): void

    
    onLocalServiceResolveFail(
      
      callback: onLocalServiceResolveFail.Callback
    ): void

    
    onLocalServiceLost(
      
      callback: onLocalServiceLost.Callback
    ): void

    
    onLocalServiceFound(
      
      callback: onLocalServiceFound.Callback
    ): void

    
    onLocalServiceDiscoveryStop(
      
      callback: onLocalServiceDiscoveryStop.Callback
    ): void

    
    offLocalServiceResolveFail(
      
      callback: offLocalServiceResolveFail.Callback
    ): void

    
    offLocalServiceLost(
      
      callback: offLocalServiceLost.Callback
    ): void

    
    offLocalServiceFound(
      
      callback: offLocalServiceFound.Callback
    ): void

    
    offLocalServiceDiscoveryStop(
      
      callback: offLocalServiceDiscoveryStop.Callback
    ): void
  }
}
