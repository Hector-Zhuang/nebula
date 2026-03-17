import Nebula from '../../index'

declare module '../../index' {
  namespace stopVoice {
    interface Option {
      
      
      
    }
  }

  namespace setInnerAudioOption {
    interface Option {
      
      
      
      mixWithOther?: boolean
      
      obeyMuteSwitch?: boolean
      
    }
  }

  namespace playVoice {
    interface Option {
      
      filePath: string
      
      
      duration?: number
      
      
    }
  }

  namespace pauseVoice {
    interface Option {
      
      
      
    }
  }

  namespace getAvailableAudioSources {
    interface Option {
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      audioSources: Array<keyof audioSources>
      
      errMsg: string
    }
    
    interface audioSources {
      
      'auto'
      
      'buildInMic'
      
      'headsetMic'
      
      'mic'
      
      'camcorder'
      
      'voice_communication'
      
      'voice_recognition'
    }
  }

  
  interface AudioBuffer {
    
    sampleRate: number

    
    length: number

    
    duration: number

    
    numberOfChannels: number

    
    getChannelData(channel: number): Float32Array

    
    copyFromChannel(): void

    
    copyToChannel(
      
      source: Float32Array,
      
      channelNumber: number,
      
      startInChannel: number
    ): void
  }

  
  interface AudioContext {
    
    pause(): void
    
    play(): void
    
    seek(
      
      position: number,
    ): void
    
    setSrc(
      
      src: string,
    ): void
  }
  
  interface InnerAudioContext {
    
    src: string
    
    startTime: number
    
    autoplay: boolean
    
    loop: boolean
    
    obeyMuteSwitch: boolean
    
    volume: number
    
    playbackRate: number
    
    duration: number
    
    currentTime: number
    
    paused: boolean
    
    buffered: number
    
    referrerPolicy?: 'origin' | 'no-referrer' | string
    
    play(): void
    
    pause(): void
    
    stop(): void
    
    seek(position: number): void
    
    destroy(): void
    
    onCanplay(callback?: InnerAudioContext.OnCanplayCallback): void
    
    onPlay(callback?: InnerAudioContext.OnPlayCallback): void
    
    onPause(callback?: InnerAudioContext.OnPauseCallback): void
    
    onStop(callback?: InnerAudioContext.OnStopCallback): void
    
    onEnded(callback?: InnerAudioContext.OnEndedCallback): void
    
    onTimeUpdate(callback?: InnerAudioContext.OnTimeUpdateCallback): void
    
    onError(callback?: InnerAudioContext.OnErrorCallback): void
    
    onWaiting(callback?: InnerAudioContext.OnWaitingCallback): void
    
    onSeeking(callback?: InnerAudioContext.OnSeekingCallback): void
    
    onSeeked(callback?: InnerAudioContext.OnSeekedCallback): void
    
    offCanplay(callback?: InnerAudioContext.OnCanplayCallback): void
    
    offPlay(callback?: InnerAudioContext.OnPlayCallback): void
    
    offPause(callback?: InnerAudioContext.OnPauseCallback): void
    
    offStop(callback?: InnerAudioContext.OnStopCallback): void
    
    offEnded(callback?: InnerAudioContext.OnEndedCallback): void
    
    offTimeUpdate(callback?: InnerAudioContext.OnTimeUpdateCallback): void
    
    offError(callback?: InnerAudioContext.OnErrorCallback): void
    
    offWaiting(callback?: InnerAudioContext.OnWaitingCallback): void
    
    offSeeking(callback?: InnerAudioContext.OnSeekingCallback): void
    
    offSeeked(callback?: InnerAudioContext.OnSeekedCallback): void
  }

  namespace InnerAudioContext {
    interface onErrorDetail extends NebulaGeneral.CallbackResult {
      
      errCode: number
      
      errMsg: string
    }

    interface onErrorDetailErrCode {
      
      10001
      
      10002
      
      10003
      
      10004
      
      '-1'
    }
    
    type OnCanplayCallback = (res: Partial<NebulaGeneral.CallbackResult>) => void
    
    type OnPlayCallback = (res: Partial<NebulaGeneral.CallbackResult>) => void
    
    type OnPauseCallback = (res: Partial<NebulaGeneral.CallbackResult>) => void
    
    type OnStopCallback = (res: Partial<NebulaGeneral.CallbackResult>) => void
    
    type OnEndedCallback = (res: Partial<NebulaGeneral.CallbackResult>) => void
    
    type OnTimeUpdateCallback = (res: Partial<NebulaGeneral.CallbackResult>) => void
    
    type OnErrorCallback = (res: onErrorDetail) => void
    
    type OnWaitingCallback = (res: Partial<NebulaGeneral.CallbackResult>) => void
    
    type OnSeekingCallback = (res: Partial<NebulaGeneral.CallbackResult>) => void
    
    type OnSeekedCallback = (res: Partial<NebulaGeneral.CallbackResult>) => void
  }

  
  interface MediaAudioPlayer {
    
    volume: number

    
    start(): Promise<void>

    
    addAudioSource(
      
      source: VideoDecoder
    ): Promise<void>

    
    removeAudioSource(
      
      source: VideoDecoder
    ): Promise<void>

    
    stop(): Promise<void>

    
    destroy(): Promise<void>
  }

  
  interface WebAudioContext {
    
    state: string

    
    onstatechange: () => void

    
    currentTime: number

    
    destination: WebAudioContextNode

    
    listener: AudioListener

    
    sampleRate: number

    
    close(): Promise<void>

    
    resume(): Promise<void>

    
    suspend(): Promise<void>

    
    createIIRFilter(
      
      feedforward: number[],
      
      feedback: number[]
    ): IIRFilterNode

    
    createWaveShaper(): WaveShaperNode

    
    createConstantSource(): ConstantSourceNode

    
    createOscillator(): OscillatorNode

    
    createGain(): GainNode

    
    createPeriodicWave(
      
      real: Float32Array,
      
      imag: Float32Array,
      
      constraints: WebAudioContext.createPeriodicWave.Constraints
    ): PeriodicWave

    
    createBiquadFilter(): BiquadFilterNode

    
    createBufferSource(): AudioBufferSourceNode

    
    createChannelMerger(
      
      numberOfInputs: number
    ): ChannelMergerNode

    
    createChannelSplitter(
      
      numberOfOutputs: number
    ): ChannelSplitterNode

    
    createDelay(
      
      maxDelayTime: number
    ): DelayNode

    
    createDynamicsCompressor(): DynamicsCompressorNode

    
    createScriptProcessor(
      
      bufferSize: number,
      
      numberOfInputChannels: number,
      
      numberOfOutputChannels: number
    ): ScriptProcessorNode

    
    createPanner(): PannerNode

    
    createBuffer(
      
      numOfChannels: number,
      
      length: number,
      
      sampleRate: number
    ): AudioBuffer

    
    decodeAudioData(
      audioData: ArrayBuffer,
      successCallback: (buffer: AudioBuffer) => void,
      errorCallback: (error: any) => void
    ): Promise<AudioBuffer>
  }

  namespace WebAudioContext {
    namespace createPeriodicWave {
      
      interface Constraints {
        
        disableNormalization?: boolean
      }
    }
  }

  
  interface WebAudioContextNode {
    
    positionX: number

    
    positionY: number

    
    positionZ: number

    
    forwardX: number

    
    forwardY: number

    
    forwardZ: number

    
    upX: number

    
    upY: number

    
    upZ: number

    
    setOrientation(...args: any[]): void

    
    setPosition(...args: any[]): void
  }

  namespace createInnerAudioContext {
    interface Option {
      
      useWebAudioImplement: boolean
    }
  }

  interface NebulaStatic {
    
    stopVoice(option?: stopVoice.Option): void

    
    setInnerAudioOption(option: setInnerAudioOption.Option): Promise<NebulaGeneral.CallbackResult>

    
    playVoice(option: playVoice.Option): Promise<NebulaGeneral.CallbackResult>

    
    pauseVoice(option?: pauseVoice.Option): void

    
    getAvailableAudioSources(option?: getAvailableAudioSources.Option): Promise<getAvailableAudioSources.SuccessCallbackResult>

    
    createWebAudioContext(): WebAudioContext

    
    createMediaAudioPlayer(): MediaAudioPlayer

    
    createInnerAudioContext(option?: createInnerAudioContext.Option): InnerAudioContext

    
    createAudioContext(
      
      id: string,
      
      component?: NebulaGeneral.IAnyObject,
    ): AudioContext
  }
}
