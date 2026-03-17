import Nebula from '../../index'

declare module '../../index' {
  namespace sendSocketMessage {
    interface Option {
      
      data: string | ArrayBuffer
      
      
      
    }
  }

  namespace onSocketOpen {
    
    type Callback = (result: OpenCallbackResult) => void
    interface OpenCallbackResult {
      
      header: NebulaGeneral.IAnyObject
    }
  }

  namespace onSocketMessage {
    
    type Callback<T = any> = (result: CallbackResult<T>) => void
    interface CallbackResult<T extends any | string | ArrayBuffer = any> {
      
      data: T
    }
  }

  namespace onSocketError {
    
    type Callback = (result: CallbackResult) => void
    interface CallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
  }

  namespace onSocketClose {
    
    type Callback = (result: CallbackResult) => void
    interface CallbackResult {
      
      code: number
      
      reason: string
    }
  }

  namespace connectSocket {
    interface Option {
      
      url: string
      
      
      
      header?: NebulaGeneral.IAnyObject
      
      protocols?: string[]
      
      
      tcpNoDelay?: boolean
    }
  }

  namespace closeSocket {
    interface Option {
      
      code?: number
      
      
      
      reason?: string
      
    }
  }

  namespace SocketTask {
    interface CloseOption {
      
      code?: number
      
      
      
      reason?: string
      
    }
    
    type OnCloseCallback = (result: OnCloseCallbackResult) => void
    interface OnCloseCallbackResult {
      
      code: number
      
      reason: string
    }
    
    type OnErrorCallback = (result: OnErrorCallbackResult) => void
    interface OnErrorCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
    
    type OnMessageCallback<T = any> = (result: OnMessageCallbackResult<T>) => void
    interface OnMessageCallbackResult<T extends any | string | ArrayBuffer = any> {
      
      data: T
    }
    
    type OnOpenCallback = (result: OnOpenCallbackResult) => void
    interface OnOpenCallbackResult {
      
      header: NebulaGeneral.IAnyObject
    }
    interface SendOption {
      
      data: string | ArrayBuffer
      
      
      
    }
  }

  
  interface SocketTask {
    
    send(option: SocketTask.SendOption): void
    
    close(option: SocketTask.CloseOption): void
    
    onOpen(
      
      callback: SocketTask.OnOpenCallback
    ): void
    
    onClose(
      
      callback: SocketTask.OnCloseCallback
    ): void
    
    onError(
      
      callback: SocketTask.OnErrorCallback
    ): void
    
    onMessage<T = any>(
      
      callback: SocketTask.OnMessageCallback<T>
    ): void

    
    readonly socketTaskId: number
    
    readonly readyState: number
    
    readonly errMsg: string
    
    readonly CONNECTING: number
    
    readonly OPEN: number
    
    readonly CLOSING: number
    
    readonly CLOSED: number
    
    readonly ws: WebSocket
  }

  interface NebulaStatic {
    
    sendSocketMessage(option: sendSocketMessage.Option): Promise<NebulaGeneral.CallbackResult>

    
    onSocketOpen(
      
      callback: onSocketOpen.Callback
    ): void

    
    onSocketMessage<T = any>(
      
      callback: onSocketMessage.Callback<T>
    ): void

    
    onSocketError(
      
      callback: onSocketError.Callback
    ): void

    
    onSocketClose(
      
      callback: onSocketClose.Callback
    ): void

    
    connectSocket(option: connectSocket.Option): Promise<SocketTask>

    
    closeSocket(option?: closeSocket.Option): Promise<NebulaGeneral.CallbackResult>
  }
}
