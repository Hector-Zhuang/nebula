import Nebula from '../../index'

declare module '../../index' {
  namespace uploadFile {
    interface Option {
      
      url: string
      
      filePath: string
      
      name: string
      
      header?: NebulaGeneral.IAnyObject
      
      formData?: NebulaGeneral.IAnyObject
      
      timeout?: number
      
      fileName?: string
      
      withCredentials?: boolean
      
      
      
        result: SuccessCallbackResult,
      ) => void
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      data: string
      
      statusCode: number
      
      errMsg: string
      
      header?: NebulaGeneral.IAnyObject
      
      cookies?: string[]
    }
  }

  namespace UploadTask {
    
    type OnHeadersReceivedCallback = (
      result: OnHeadersReceivedCallbackResult,
    ) => void
    
    type OnProgressUpdateCallback = (
      result: OnProgressUpdateCallbackResult,
    ) => void
    interface OnHeadersReceivedCallbackResult {
      
      header: NebulaGeneral.IAnyObject
    }
    interface OnProgressUpdateCallbackResult {
      
      progress: number
      
      totalBytesExpectedToSend: number
      
      totalBytesSent: number
    }

    type UploadTaskPromise = Promise<uploadFile.SuccessCallbackResult> & UploadTask & {
      headersReceive: UploadTask['onHeadersReceived']
      progress: UploadTask['onProgressUpdate']
    }
  }

  
  interface UploadTask {
    
    abort(): void
    
    onProgressUpdate(
      
      callback: UploadTask.OnProgressUpdateCallback,
    ): void
    
    offProgressUpdate(
      
      callback: UploadTask.OnProgressUpdateCallback,
    ): void
    
    onHeadersReceived(
      
      callback: UploadTask.OnHeadersReceivedCallback,
    ): void
    
    offHeadersReceived(
      
      callback: UploadTask.OnHeadersReceivedCallback,
    ): void
  }

  interface NebulaStatic {
    
    uploadFile(option: uploadFile.Option): UploadTask.UploadTaskPromise
  }
}
