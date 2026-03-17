import Nebula from '../../index'

declare module '../../index' {
  namespace downloadFile {
    interface Option {
      
      url: string
      
      filePath?: string
      
      header?: NebulaGeneral.IAnyObject
      
      timeout?: number
      
      withCredentials?: boolean
      
      
      
    }

    interface FileSuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      filePath: string
      
      statusCode: number
      
      tempFilePath: string
      
      errMsg: string
      
      header?: NebulaGeneral.IAnyObject
      
      dataLength?: number
      
      cookies?: string[]
      
      profile?: NebulaGeneral.IAnyObject
    }
  }

  namespace DownloadTask {
    
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
      
      totalBytesExpectedToWrite: number
      
      totalBytesWritten: number
    }

    type DownloadTaskPromise = Promise<downloadFile.FileSuccessCallbackResult> & DownloadTask & {
      headersReceive: DownloadTask['onHeadersReceived']
      progress: DownloadTask['onProgressUpdate']
    }
  }

  
  interface DownloadTask {
    
    abort(): void
    
    onProgressUpdate(
      
      callback: DownloadTask.OnProgressUpdateCallback,
    ): void
    
    offProgressUpdate(
      
      callback: DownloadTask.OnProgressUpdateCallback,
    ): void
    
    onHeadersReceived(
      
      callback: DownloadTask.OnHeadersReceivedCallback,
    ): void
    
    offHeadersReceived(
      
      callback: DownloadTask.OnHeadersReceivedCallback,
    ): void
  }

  interface NebulaStatic {
    
    downloadFile(option: downloadFile.Option): DownloadTask.DownloadTaskPromise
  }
}
