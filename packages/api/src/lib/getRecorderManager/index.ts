import { Audio } from 'expo-av'
import * as FileSystem from 'expo-file-system'

class RecorderManager {
  private static instance: RecorderManager
  private static recordInstance?: Audio.Recording
  private onStartCallback
  private onStopCallback
  private onPauseCallback
  private onResumeCallback
  private onErrorCallback
  private preStatus

  private static RecordingOptions = {
    android: {
      extension: '.m4a',
      // Documentation in English.
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4 || Audio.AndroidOutputFormat.MPEG_4,
      // Documentation in English.
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC || Audio.AndroidAudioEncoder.AAC,
      sampleRate: 8000,
      numberOfChannels: 2,
      bitRate: 48000
    },
    ios: {
      extension: '.caf',
      // Documentation in English.
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX || Audio.IOSAudioQuality.MAX,
      sampleRate: 8000,
      numberOfChannels: 2,
      bitRate: 48000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false
    }
  }

  static getInstance () {
    if (!RecorderManager.instance) {
      RecorderManager.instance = new RecorderManager()
    }
    return RecorderManager.instance
  }

  
  async start (opts = {}) {
    const { granted } = await Audio.requestPermissionsAsync()
    if (!granted) {
      const res = { errMsg: 'Permissions denied!' }
      return Promise.reject(res)
    }

    const {
      // duration = 60000,
      sampleRate = 8000,
      numberOfChannels = 2,
      encodeBitRate = 48000,
      // format = 'aac',
      // frameSize,
      // audioSource = 'auto'
    }: any = opts
    const options = {
      android: Object.assign({}, RecorderManager.RecordingOptions.android, { sampleRate, numberOfChannels, bitRate: encodeBitRate }),
      ios: Object.assign({}, RecorderManager.RecordingOptions.ios, { sampleRate, numberOfChannels, bitRate: encodeBitRate }),
      web: {}
    }
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: 1, // InterruptionModeIOS.DoNotMix
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        interruptionModeAndroid: 1, // InterruptionModeAndroid.DoNotMix
        playThroughEarpieceAndroid: true
      } as any)

      if (RecorderManager.recordInstance) {
        const recordStatus = await RecorderManager.recordInstance.getStatusAsync()
        if (recordStatus.canRecord) {
          await RecorderManager.recordInstance.stopAndUnloadAsync()
        }
        RecorderManager.recordInstance.setOnRecordingStatusUpdate(null)
        RecorderManager.recordInstance = undefined
      }

      const recording = new Audio.Recording()
      RecorderManager.recordInstance = recording
      RecorderManager.recordInstance.setOnRecordingStatusUpdate(this.onRecordingStatusUpdate)
      await RecorderManager.recordInstance.prepareToRecordAsync(options)
      // const res2 = RecorderManager.recordInstance.getStatusAsync()
      // console.log('res2', res2)
      await RecorderManager.recordInstance.startAsync()
      this.onStartCallback?.()
    } catch (error) {
      this.onErrorCallback && this.onErrorCallback({ errMsg: error.message })
    }
  }

  
  async pause () {
    try {
      const recordInstance = RecorderManager.recordInstance
      if (recordInstance) {
        await recordInstance.pauseAsync()
        this.onPauseCallback && this.onPauseCallback()
      }
    } catch (error) {
      this.onErrorCallback && this.onErrorCallback({ errMsg: error.message })
    }
  }

  
  async resume () {
    try {
      const recordInstance = RecorderManager.recordInstance
      if (recordInstance) {
        await recordInstance.startAsync()
        this.onResumeCallback && this.onResumeCallback()
      }
    } catch (error) {
      this.onErrorCallback && this.onErrorCallback({ errMsg: error.message })
    }
  }

  
  async stop () {
    try {
      const recordInstance = RecorderManager.recordInstance
      if (recordInstance) {
        const recordStatus = await recordInstance.stopAndUnloadAsync()
        const uri = recordInstance.getURI() || ''
        const info = await FileSystem.getInfoAsync(uri)
        // console.log(`FILE INFO: ${JSON.stringify(info)}`)

        const result = {
          tempFilePath: uri,
          duration: recordStatus.durationMillis,
          // @ts-ignore
          fileSize: info.size
        }
        this.onStopCallback && this.onStopCallback(result)
      }
    } catch (error) {
      this.onErrorCallback && this.onErrorCallback({ errMsg: error.message })
    }
  }

  private onRecordingStatusUpdate (status) {
    if (this.preStatus === undefined) {
      this.preStatus = status
      return
    }
    if (!this.preStatus.isRecording && status.isRecording) {
      console.log('start')
    }
  }

  
  onError (callback) {
    this.onErrorCallback = callback
  }

  
  onStart (callback) {
    this.onStartCallback = callback
  }

  
  onStop (callback) {
    this.onStopCallback = callback
  }

  
  onPause (callback) {
    this.onPauseCallback = callback
  }

  
  onResume (callback) {
    this.onResumeCallback = callback
  }

  
  // onFrameRecorded (callback) {
  //   console.log('not achieve')
  // }

  
  // onInterruptionBegin (callback) {
  //   console.log('not achieve')
  // }

  
  // onInterruptionEnd (callback) {
  //   console.log('not achieve')
  // }
}



function getRecorderManager (): any {
  return RecorderManager.getInstance()
}

export { getRecorderManager }
