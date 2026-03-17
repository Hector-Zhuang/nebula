import Nebula from '../../index'

declare module '../../index' {
  namespace LivePusherContext {
    interface PauseOption {
      
      
      
    }
    interface PauseBGMOption {
      
      
      
    }
    interface PlayBGMOption {
      
      url: string
      
      
      
    }
    interface ResumeOption {
      
      
      
    }
    interface ResumeBGMOption {
      
      
      
    }
    interface SendMessageOption {
      
      msg: string
      
      
      
    }
    interface SetBGMVolumeOption {
      
      volume: number
      
      
      
    }
    interface SetMICVolumeOption {
      
      volume: number
      
      
      
    }
    interface SnapshotOption {
      
      
      
    }
    interface StartOption {
      
      
      
    }
    interface StartPreviewOption {
      
      
      
    }
    interface StopOption {
      
      
      
    }
    interface StopBGMOption {
      
      
      
    }
    interface StopPreviewOption {
      
      
      
    }
    interface SwitchCameraOption {
      
      
      
    }
    interface ToggleTorchOption {
      
      
      
    }
  }
  
  interface LivePusherContext {
    
    pause(option?: LivePusherContext.PauseOption): void
    
    pauseBGM(option?: LivePusherContext.PauseBGMOption): void
    
    playBGM(option: LivePusherContext.PlayBGMOption): void
    
    resume(option?: LivePusherContext.ResumeOption): void
    
    resumeBGM(option?: LivePusherContext.ResumeBGMOption): void
    
    sendMessage(option?: LivePusherContext.SendMessageOption): void
    
    setBGMVolume(option: LivePusherContext.SetBGMVolumeOption): void
    
    setMICVolume(option: LivePusherContext.SetMICVolumeOption): void
    
    snapshot(option?: LivePusherContext.SnapshotOption): void
    
    start(option?: LivePusherContext.StartOption): void
    
    startPreview(option?: LivePusherContext.StartPreviewOption): void
    
    stop(option?: LivePusherContext.StopOption): void
    
    stopBGM(option?: LivePusherContext.StopBGMOption): void
    
    stopPreview(option?: LivePusherContext.StopPreviewOption): void
    
    switchCamera(option?: LivePusherContext.SwitchCameraOption): void
    
    toggleTorch(option?: LivePusherContext.ToggleTorchOption): void
  }
  namespace LivePlayerContext {
    interface ExitCastingOption {
      
      
      
    }
    interface ExitFullScreenOption {
      
      
      
    }
    interface ExitPictureInPictureOption {
      
      
      
    }
    interface MuteOption {
      
      
      
    }
    interface PauseOption {
      
      
      
    }
    interface PlayOption {
      
      
      
    }
    interface ReconnectCastingOption {
      
      
      
    }
    interface RequestFullScreenOption {
      
      
      direction?: 0 | 90 | -90
      
      
    }
    interface RequestPictureInPictureOption {
      
      
      
    }
    interface ResumeOption {
      
      
      
    }
    interface SnapshotOption {
      
      
      
    }
    interface SnapshotSuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      height: string
      
      tempImagePath: string
      
      width: string
      
      errMsg: string
    }
    interface StartCastingOption {
      
      
      
    }
    interface StopOption {
      
      
      
    }
    interface SwitchCastingOption {
      
      
      
    }
  }

  
  interface LivePlayerContext {
    
    exitCasting(option?: LivePlayerContext.ExitCastingOption): void
    
    exitFullScreen(option?: LivePlayerContext.ExitFullScreenOption): void
    
    exitPictureInPicture(option?: LivePlayerContext.ExitPictureInPictureOption): void
    
    mute(option?: LivePlayerContext.MuteOption): void
    
    pause(option?: LivePlayerContext.PauseOption): void
    
    play(option?: LivePlayerContext.PlayOption): void
    
    reconnectCasting(option?: LivePlayerContext.ReconnectCastingOption): void
    
    requestFullScreen(
      option: LivePlayerContext.RequestFullScreenOption,
    ): void
    
    requestPictureInPicture(
      option: LivePlayerContext.RequestPictureInPictureOption,
    ): void
    
    resume(option?: LivePlayerContext.ResumeOption): void
    
    snapshot(option?: LivePlayerContext.SnapshotOption): void
    
    startCasting(option?: LivePlayerContext.StartCastingOption): void
    
    stop(option?: LivePlayerContext.StopOption): void
    
    switchCasting(option?: LivePlayerContext.SwitchCastingOption): void
  }

  interface NebulaStatic {
    
    createLivePusherContext(): LivePusherContext

    
    createLivePlayerContext(
      
      id: string,
      
      component?: NebulaGeneral.IAnyObject,
    ): LivePlayerContext
  }
}
