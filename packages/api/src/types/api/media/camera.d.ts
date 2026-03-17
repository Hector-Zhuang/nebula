import Nebula from '../../index'

declare module '../../index' {
  /**
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/CameraContext.html
   */
  interface CameraContext {
    
    onCameraFrame(
      
      callback: CameraContext.OnCameraFrameCallback,
    ): CameraFrameListener
    
    setZoom(option: CameraContext.SetZoomOption): void
    
    startRecord(option: CameraContext.StartRecordOption): void
    
    stopRecord(option?: CameraContext.StopRecordOption): void
    
    takePhoto(option: CameraContext.TakePhotoOption): void
  }

  namespace CameraContext {
    interface SetZoomOption {
      
      
      
      
      zoom: number
    }
    interface StartRecordSuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      zoom: number
      /**
       * @supported alipay
       * @alipay on android
       */
      setZoom:number
    }
    interface StartRecordOption {
      
      
      
      
      timeoutCallback?: StartRecordTimeoutCallback
    }
    
    type StartRecordTimeoutCallback = (
      result: StartRecordTimeoutCallbackResult,
    ) => void
    interface StartRecordTimeoutCallbackResult {
      
      tempThumbPath: string
      
      tempVideoPath: string
      
      height: string
      
      width: string
      
      size: string
      
      duration: string
    }
    interface StopRecordOption {
      
      
      
    }
    interface StopRecordSuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      tempThumbPath: string
      
      tempVideoPath: string
      
      errMsg: string
    }
    interface TakePhotoOption {
      
      
      
      quality?: keyof Quality
      
    }
    interface TakePhotoSuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      tempImagePath: string
      
      errMsg: string
    }
    
    type OnCameraFrameCallback = (result: OnCameraFrameCallbackResult) => void
    interface OnCameraFrameCallbackResult {
      
      data: ArrayBuffer
      
      height: number
      
      width: number
    }
    interface Quality {
      
      high
      
      normal
      
      low
      
      original
    }
  }

  
  interface CameraFrameListener {
    
    start(option?: CameraFrameListener.StartOption): void
    
    stop(option?: CameraFrameListener.StopOption): void
  }

  namespace CameraFrameListener {
    interface StartOption {
      
      
      
    }
    interface StopOption {
      
      
      
    }
  }

  interface NebulaStatic {
    
    createCameraContext(id?: string): CameraContext
  }
}
