import Nebula from '../../index'

declare module '../../index' {
  namespace saveVideoToPhotosAlbum {
    interface Option {
      
      filePath: string
      
      
      
    }
  }

  namespace openVideoEditor {
    interface Option {
      
      filePath: string
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      duration: number
      
      size: number
      
      tempFilePath: string
      
      tempThumbPath: string
    }
  }

  namespace getVideoInfo {
    interface Option {
      
      src: string
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      orientation: keyof Orientation
      
      type: string
      
      duration: number
      
      size: number
      
      height: number
      
      width: number
      
      fps: number
      
      bitrate: number
    }
    interface Orientation {
      
      up
      
      down
      
      left
      
      right
      
      'up-mirrored'
      
      'down-mirrored'
      
      'left-mirrored'
      
      'right-mirrored'
    }
  }

  
  interface VideoContext {
    
    exitBackgroundPlayback(): void
    
    exitFullScreen(): void
    
    exitPictureInPicture(option: VideoContext.ExitPictureInPictureOption): void
    
    hideStatusBar(): void
    
    pause(): void
    
    play(): void
    
    playbackRate(
      
      rate: number,
    ): void
    
    requestBackgroundPlayback(): void
    
    requestFullScreen(option: VideoContext.RequestFullScreenOption): void
    
    seek(
      
      position: number,
    ): void
    
    sendDanmu(
      
      data: VideoContext.Danmu,
    ): void
    
    showStatusBar(): void
    
    stop(): void
  }

  namespace VideoContext {
    interface ExitPictureInPictureOption {
      
      
      
    }
    interface RequestFullScreenOption {
      
      direction?: 0 | 90 | -90
    }
    
    interface Danmu {
      
      text: string
      
      color?: string
    }
  }

  namespace compressVideo {
    interface Option {
      
      src: string
      
      quality: keyof Quality
      
      bitrate: number
      
      fps: number
      
      resolution: number
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      tempFilePath: string
      
      size: number
    }
    interface Quality {
      
      low
      
      medium
      
      high
    }
  }

  namespace chooseVideo {
    interface Option {
      
      camera?: keyof Camera
      
      compressed?: boolean
      
      maxDuration?: number
      
      sourceType?: Array<keyof sourceType>
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      tempFilePath: string
      
      duration: number
      
      size: number
      
      height: number
      
      width: number
      
      errMsg: string
    }
    interface Camera {
      
      back
      
      front
    }
    interface sourceType {
      
      album
      
      camera
    }
  }

  namespace chooseMedia {
    interface Option {
      
      count?: number
      
      mediaType?: Array<keyof mediaType>
      
      sourceType?: Array<keyof sourceType>
      
      maxDuration?: number
      
      sizeType?: Array<'original' | 'compressed'>
      
      camera?: string
      
      
      
      
      mediaId?: string
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      tempFiles: ChooseMedia[]
      
      type: string
    }
    
    interface ChooseMedia {
      
      tempFilePath: string
      
      size: number
      
      duration: number
      
      height: number
      
      width: number
      
      thumbTempFilePath: string
      
      fileType: string
      
      originalFileObj?: File
    }
    interface mediaType {
      
      video
      
      image
      
      mix
    }
    interface sourceType {
      
      album
      
      camera
    }
    interface camera {
      
      back
      
      front
    }
  }

  interface NebulaStatic {
    
    saveVideoToPhotosAlbum(option: saveVideoToPhotosAlbum.Option): Promise<NebulaGeneral.CallbackResult>

    
    openVideoEditor(option: openVideoEditor.Option): Promise<openVideoEditor.SuccessCallbackResult>

    
    getVideoInfo(option: getVideoInfo.Option): Promise<getVideoInfo.SuccessCallbackResult>

    
    createVideoContext(
      
      id: string,
      
      component?: NebulaGeneral.IAnyObject,
    ): VideoContext

    
    compressVideo(option: compressVideo.Option): Promise<compressVideo.SuccessCallbackResult>

    
    chooseVideo(option: chooseVideo.Option): Promise<chooseVideo.SuccessCallbackResult>

    
    chooseMedia(option: chooseMedia.Option): Promise<chooseMedia.SuccessCallbackResult>
  }
}
