import Nebula from '../../index'

declare module '../../index' {
  namespace stopBackgroundAudio {
    interface Option {
      
      
      
    }
  }

  namespace seekBackgroundAudio {
    interface Option {
      
      position: number
      
      
      
    }
  }

  namespace playBackgroundAudio {
    interface Option {
      
      dataUrl: string
      
      
      coverImgUrl?: string
      
      
      
      title?: string
    }
  }

  namespace pauseBackgroundAudio {
    interface Option {
      
      
      
    }
  }

  namespace getBackgroundAudioPlayerState {
    interface Option {
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      currentPosition: number
      
      dataUrl: string
      
      downloadPercent: number
      
      duration: number
      
      status: keyof Status
      
      errMsg: string
    }
    interface Status {
      
      0
      
      1
      
      2
    }
  }

  
  interface BackgroundAudioManager {
    
    src: string
    
    startTime: number
    
    title: string
    
    epname: string
    
    singer: string
    
    coverImgUrl: string
    
    webUrl: string
    
    protocol: string
    
    playbackRate?: number
    
    duration: number
    
    currentTime: number
    
    paused: boolean
    
    buffered: number
    
    referrerPolicy?: 'origin' | 'no-referrer' | string
    
    play(): void
    
    pause(): void
    
    seek(position: any): void
    
    stop(): void
    
    onCanplay(callback?: () => void): void
    
    onWaiting(callback?: () => void): void
    
    onError(callback?: () => void): void
    
    onPlay(callback?: () => void): void
    
    onPause(callback?: () => void): void
    
    onSeeking(callback?: () => void): void
    
    onSeeked(callback?: () => void): void
    
    onEnded(callback?: () => void): void
    
    onStop(callback?: () => void): void
    
    onTimeUpdate(callback?: () => void): void
    
    onPrev(callback?: () => void): void
    
    onNext(callback?: () => void): void
  }

  interface NebulaStatic {
    
    stopBackgroundAudio(option?: stopBackgroundAudio.Option): void

    
    seekBackgroundAudio(option: seekBackgroundAudio.Option): Promise<NebulaGeneral.CallbackResult>

    
    playBackgroundAudio(option: playBackgroundAudio.Option): Promise<NebulaGeneral.CallbackResult>

    
    pauseBackgroundAudio(option?: pauseBackgroundAudio.Option): void

    
    onBackgroundAudioStop(
      
      callback: (res: NebulaGeneral.CallbackResult) => void,
    ): void

    
    onBackgroundAudioPlay(
      
      callback: (res: NebulaGeneral.CallbackResult) => void,
    ): void

    
    onBackgroundAudioPause(
      
      callback: (res: NebulaGeneral.CallbackResult) => void,
    ): void

    
    getBackgroundAudioPlayerState(option?: getBackgroundAudioPlayerState.Option): Promise<getBackgroundAudioPlayerState.SuccessCallbackResult>

    
    getBackgroundAudioManager(): BackgroundAudioManager
  }
}
