import Nebula from '../../index'

declare module '../../index' {
  interface MediaRecorder {
    
    destroy(): Promise<void>
    
    off(
      
      eventName: keyof MediaRecorder.on.EventName,
      
      callback: MediaRecorder.on.Callback
    ): Promise<void>
    
    on(
      
      eventName: keyof MediaRecorder.on.EventName,
      
      callback: MediaRecorder.on.Callback
    ): Promise<void>
    
    pause(): Promise<void>
    
    requestFrame(callback: MediaRecorder.requestFrame.Callback): Promise<void>
    
    resume(): Promise<void>
    
    start(): Promise<void>
    
    stop(): Promise<void>
  }

  namespace MediaRecorder {
    namespace on {
      
      interface EventName {
        
        start 
        
        stop
        
        pause
        
        resume
        
        timeupdate
      }
      
      type Callback = (res?: {
        tempFilePath: string
        duration: number
        fileSize: number
      }) => void
    }
    namespace requestFrame {
      
      type Callback = () => void
    }
  }

  namespace createMediaRecorder {
    /**
     * createMediaRecorder Option
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/media-recorder/wx.createMediaRecorder.html
     */
    interface Option {
      
      duration?: number
      
      videoBitsPerSecond?: number
      
      gop?: number
      
      fps?: number
    }
  }

  interface NebulaStatic {
    
    createMediaRecorder(canvas?: Canvas | OffscreenCanvas, option?: createMediaRecorder.Option): MediaRecorder
  }
}
