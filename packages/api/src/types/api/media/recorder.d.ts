import Nebula from '../../index'

declare module '../../index' {
  namespace stopRecord {
    interface Option {
      
      
      
    }
  }

  namespace startRecord {
    interface Option {
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      tempFilePath: string
      
      errMsg: string
    }
  }

  namespace RecorderManager {
    
    type OnErrorCallback = (
      result: OnErrorCallbackResult,
    ) => void
    interface OnErrorCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
    
    type OnFrameRecordedCallback = (
      result: OnFrameRecordedCallbackResult,
    ) => void
    interface OnFrameRecordedCallbackResult {
      
      frameBuffer: ArrayBuffer
      
      isLastFrame: boolean
    }
    
    type OnStopCallback = (result: OnStopCallbackResult) => void
    interface OnStopCallbackResult {
      
      duration: number
      
      fileSize: number
      
      tempFilePath: string
    }
    interface StartOption {
      
      audioSource?: keyof AudioSource
      
      duration?: number
      
      encodeBitRate?: number
      
      format?: keyof Format
      
      frameSize?: number
      
      numberOfChannels?: keyof NumberOfChannels
      
      sampleRate?: keyof SampleRate
    }
    
    interface AudioSource {
      
      'auto'
      
      'buildInMic'
      
      'headsetMic'
      
      'mic'
      
      'camcorder'
      
      'voice_communication'
      
      'voice_recognition'
    }
    
    interface Format {
      
      mp3
      
      aac
      
      wav
      
      PCM
    }
    
    interface NumberOfChannels {
      
      1
      
      2
    }
    
    interface SampleRate {
      
      8000
      
      11025
      
      12000
      
      16000
      
      22050
      
      24000
      
      32000
      
      44100
      
      48000
    }
  }

  
  interface RecorderManager {
    
    onError(
      
      callback: RecorderManager.OnErrorCallback,
    ): void
    
    onFrameRecorded(
      
      callback: RecorderManager.OnFrameRecordedCallback,
    ): void
    
    onInterruptionBegin(
      
      callback: (res: NebulaGeneral.CallbackResult) => void,
    ): void
    
    onInterruptionEnd(
      
      callback: (res: NebulaGeneral.CallbackResult) => void,
    ): void
    
    onPause(
      
      callback: (res: NebulaGeneral.CallbackResult) => void,
    ): void
    
    onResume(
      
      callback: (res: NebulaGeneral.CallbackResult) => void,
    ): void
    
    onStart(
      
      callback: (res: NebulaGeneral.CallbackResult) => void,
    ): void
    
    onStop(
      
      callback: RecorderManager.OnStopCallback,
    ): void
    
    pause(): void
    
    resume(): void
    
    start(option: RecorderManager.StartOption): void
    
    stop(): void
  }

  interface NebulaStatic {
    
    stopRecord(option?: stopRecord.Option): void

    
    startRecord(option: startRecord.Option): Promise<startRecord.SuccessCallbackResult>

    
    getRecorderManager(): RecorderManager
  }
}
