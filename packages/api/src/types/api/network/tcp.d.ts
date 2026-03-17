import Nebula from '../../index'

declare module '../../index' {
  
  interface TCPSocket {
    
    connect(option: TCPSocket.connect.Option): void
    
    write(
      
      data: string | ArrayBuffer
    ): void
    
    close(): void
    
    onClose(
      
      callback: TCPSocket.onClose.Callback,
    ): void
    
    offClose(
      
      callback: TCPSocket.onClose.Callback,
    ): void
    
    onConnect(
      
      callback: TCPSocket.onConnect.Callback,
    ): void
    
    offConnect(
      
      callback: TCPSocket.onConnect.Callback,
    ): void
    
    onError(
      
      callback: TCPSocket.onError.Callback,
    ): void
    
    offError(
      
      callback: TCPSocket.onError.Callback,
    ): void
    
    onMessage(
      
      callback: TCPSocket.onMessage.Callback,
    ): void
    
    offMessage(
      
      callback: TCPSocket.onMessage.Callback,
    ): void
  }

  namespace TCPSocket {
    namespace connect {
      interface Option {
        
        address: string
        
        port: number
      }
    }
    namespace onClose {
      
      type Callback = (...args: unknown[]) => void
    }
    namespace onConnect {
      
      type Callback = (...args: unknown[]) => void
    }
    namespace onError {
      
      type Callback = (result: CallbackResult) => void
      interface CallbackResult extends NebulaGeneral.CallbackResult {
        
        errMsg: string
      }
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
        
        size: number
      }
      
      interface LocalInfo {
        
        address: string
        
        family: string
        
        port: number
      }
    }
  }

  interface NebulaStatic {
    
    createTCPSocket(): TCPSocket
  }
}
