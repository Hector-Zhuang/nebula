import Nebula from '../../index'

declare module '../../index' {
  
  interface UDPSocket {
    
    bind(
      
      port: number,
    ): number
    
    setTTL(
      
      ttl: number
    ): void
    
    send(option: UDPSocket.send.Option): void
    
    connect(option: UDPSocket.connect.Option): void
    
    write(): void
    
    close(): void
    
    onClose(
      
      callback: UDPSocket.onClose.Callback,
    ): void
    
    offClose(
      
      callback: UDPSocket.onClose.Callback,
    ): void
    
    onError(
      
      callback: UDPSocket.onError.Callback,
    ): void
    
    offError(
      
      callback: UDPSocket.onError.Callback,
    ): void
    
    onListening(
      
      callback: UDPSocket.onListening.Callback,
    ): void
    
    offListening(
      
      callback: UDPSocket.onListening.Callback,
    ): void
    
    onMessage(
      
      callback: UDPSocket.onMessage.Callback,
    ): void
    
    offMessage(
      
      callback: UDPSocket.onMessage.Callback,
    ): void
  }

  namespace UDPSocket {
    namespace connect {
      interface Option {
        
        address: string
        
        port: number
      }
    }
    namespace onClose {
      
      type Callback = (...args: unknown[]) => void
    }
    namespace onError {
      
      type Callback = (result: CallbackResult) => void
      interface CallbackResult extends NebulaGeneral.CallbackResult {
        
        errMsg: string
      }
    }
    namespace onListening {
      
      type Callback = (...args: unknown[]) => void
    }
    namespace onMessage {
      
      type Callback = (result: CallbackResult) => void
      interface CallbackResult extends NebulaGeneral.CallbackResult {
        
        message: ArrayBuffer
        
        remoteInfo: RemoteInfo
        
        localInfo: LocalInfo
      }
      
      interface RemoteInfo {
        
        address: string
        
        family: string
        
        port: number
      }
      
      interface LocalInfo {
        
        address: string
        
        family: string
        
        port: number
        
        size: number
      }
    }
    namespace send {
      interface Option {
        
        address: string
        
        port: number
        
        message: string | ArrayBuffer
        
        offset?: number
        
        length?: number
      }
    }
  }

  interface NebulaStatic {
    
    createUDPSocket(): UDPSocket
  }
}
