import Nebula from '../../index'

declare module '../../index' {
  interface VideoDecoder {
    
    getFrameData(): Promise<VideoDecoder.getFrameData.Result>
    
    off(
      
      eventName: keyof VideoDecoder.on.EventName,
      
      callback: VideoDecoder.on.Callback
    ): void
    
    on(
      
      eventName: keyof VideoDecoder.on.EventName,
      
      callback: VideoDecoder.on.Callback
    ): void
    
    remove(): Promise<void>
    
    seek(
      
      position: number
    ): Promise<void>
    
    start(option: VideoDecoder.start.Option): Promise<void>
    
    stop(): Promise<void>
  }

  namespace VideoDecoder {
    namespace getFrameData {
      interface Result {
        
        width: number
        
        height: number
        
        data: ArrayBuffer
        
        pkPts: number
        
        pkDts: number
      }
    }
    namespace on {
      
      interface EventName {
        
        start 
        
        stop
        
        seek
        
        bufferchange
        
        ended
      }
      
      type Callback = (res?: {
        width: number
        height: number
      }) => void
    }
    namespace start {
      interface Option {
        
        source: string 
        
        mode?: number
        
        abortAudio?: boolean
        
        abortVideo?: boolean
      }
    }
  }

  interface NebulaStatic {
    
    createVideoDecoder(): VideoDecoder
  }
}
