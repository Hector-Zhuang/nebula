import Nebula from '../../index'

declare module '../../index' {
  namespace setVisualEffectOnCapture {
    interface Option {
      
      visualEffect?: 'none' | 'hidden'
      
      
      
    }
  }

  namespace setScreenBrightness {
    interface Option {
      
      value: number
      
      
      
    }
  }

  namespace setKeepScreenOn {
    interface Promised extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
    interface Option {
      
      keepScreenOn: boolean
      
      
      
    }
  }

  namespace onUserCaptureScreen {
    
    type Callback = (
        result: NebulaGeneral.CallbackResult,
    ) => void
  }

  namespace onScreenRecordingStateChanged {
    interface ScreenRecordingState {
      
      start
      
      stop
    }
    
    type Callback = (
      
      state: keyof ScreenRecordingState,
    ) => void
  }

  namespace getScreenRecordingState {
    interface Option {
      
      
      
    }
    interface ScreenRecordingState {
      
      on
      
      off
    }
    interface SuccessCallbackResult {
      
      state: keyof ScreenRecordingState
    }
  }

  namespace getScreenBrightness {
    interface Option {
      
      
      
    }

    interface SuccessCallbackOption {
      
      value: number
    }
  }

  interface NebulaStatic {
    
    setVisualEffectOnCapture(option: setVisualEffectOnCapture.Option): Promise<NebulaGeneral.CallbackResult>

    
    setScreenBrightness(option: setScreenBrightness.Option): Promise<NebulaGeneral.CallbackResult>

    
    setKeepScreenOn(option: setKeepScreenOn.Option): Promise<setKeepScreenOn.Promised>

    
    onUserCaptureScreen(
      
      callback: onUserCaptureScreen.Callback,
    ): void

    
    onScreenRecordingStateChanged(
      
      callback: onScreenRecordingStateChanged.Callback
    ): void

    
    offUserCaptureScreen(
      
      callback: onUserCaptureScreen.Callback,
    ): void

    
    offScreenRecordingStateChanged(
      
      callback?: onScreenRecordingStateChanged.Callback
    ): void

    
    getScreenRecordingState(
      option?: getScreenRecordingState.Option
    ): Promise<getScreenRecordingState.SuccessCallbackResult>

    
    getScreenBrightness(
      option?: getScreenBrightness.Option
    ): Promise<getScreenBrightness.SuccessCallbackOption>
  }
}
