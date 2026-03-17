import { Audio } from 'expo-av'

import { isUrl } from '../../utils'


class InnerAudioContext {
  private _src: string // TODO asset path
  private _startTime: number
  private _autoplay = false
  private _loop = false
  private _obeyMuteSwitch = true // TODO
  private _volume = 1
  
  public duration: number
  
  public currentTime: number
  
  public paused: boolean
  
  public buffered: number //
  // private
  private soundObject: Audio.Sound
  private onCanplayCallback
  private onEndedCallback
  private onErrorCallback
  private onPauseCallback
  private onPlayCallback
  private onSeekedCallback
  private onSeekingCallback
  private onStopCallback
  private onTimeUpdateCallback
  private onWaitingCallback

  constructor () {
    this.soundObject = new Audio.Sound()
    this.soundObject.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate)
  }

  _onPlaybackStatusUpdate = playbackStatus => {
    this.duration = playbackStatus.durationMillis / 1000
    this.currentTime = playbackStatus.positionMillis / 1000
    this.buffered = playbackStatus.playableDurationMillis / 1000
    this.paused = !playbackStatus.isPlaying
    // Documentation in English.
    this.onTimeUpdateCallback && this.onTimeUpdateCallback(playbackStatus)
    if (!playbackStatus.isLoaded) {
      // Update your UI for the unloaded state
      if (playbackStatus.error) {
        console.log(`Encountered a fatal error during playback: ${playbackStatus.error}`)
      }
    } else {
      // Update your UI for the loaded state

      if (playbackStatus.isPlaying) {
        // Update your UI for the playing state
        console.log('isPlaying')
      } else {
        // paused state
        console.log('paused')
      }

      if (playbackStatus.isBuffering) {
        this.onWaitingCallback && this.onWaitingCallback()
      }

      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        this.soundObject.unloadAsync()
        this.onEndedCallback && this.onEndedCallback()
      }
    }
  }

  set src (value) {
    this._src = value
    if (this._autoplay) {
      this._firstPlay()
    }
  }

  get src () {
    return this._src
  }

  set autoplay (value) {
    this._autoplay = value
  }

  get autoplay () {
    return this._autoplay
  }

  set startTime (value) {
    this._startTime = value
  }

  get startTime () {
    return this._startTime
  }

  set volume (value) {
    this._volume = value
  }

  get volume () {
    return this._volume
  }

  set loop (value: boolean) {
    this._loop = value
  }

  get loop () {
    return this._loop
  }

  set obeyMuteSwitch (value: boolean) {
    this._obeyMuteSwitch = value
  }

  get obeyMuteSwitch () {
    return this._obeyMuteSwitch
  }

  private async _firstPlay () {
    if (!this._src) return { errMsg: 'src is undefined' }
    const source = isUrl(this._src) ? { uri: this._src } : this._src
    await this.soundObject.loadAsync(source as any, {}, true)
    this.onCanplayCallback && this.onCanplayCallback()
    await this.soundObject.playAsync()
    if (this._startTime) {
      await this.soundObject.playFromPositionAsync(this._startTime * 1000)
    }
    this.onPlayCallback && this.onPlayCallback()
  }

  
  async play () {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      interruptionModeIOS: 1, // InterruptionModeIOS.DoNotMix
      playsInSilentModeIOS: !this._obeyMuteSwitch,
      shouldDuckAndroid: true,
      interruptionModeAndroid: 1, // InterruptionModeAndroid.DoNotMix
      playThroughEarpieceAndroid: false
    })
    const soundStatus = await this.soundObject.getStatusAsync()
    try {
      if (soundStatus.isLoaded === false && (soundStatus as any).isPlaying === undefined) {
        // First load
        await this._firstPlay()
      } else {
        await this.soundObject.playAsync()
      }
      await this.soundObject.setVolumeAsync(this._volume)
      await this.soundObject.setIsLoopingAsync(this._loop)
      this.onPlayCallback && this.onPlayCallback()
    } catch (error) {
      this.onErrorCallback && this.onErrorCallback(error)
    }
  }

  
  async pause () {
    try {
      await this.soundObject.pauseAsync()
      this.onPauseCallback && this.onPauseCallback()
    } catch (error) {
      this.onErrorCallback && this.onErrorCallback(error)
    }
  }

  
  async stop () {
    try {
      await this.soundObject.stopAsync()
      this.onStopCallback && this.onStopCallback()
    } catch (error) {
      this.onErrorCallback && this.onErrorCallback(error)
    }
  }

  
  async seek (position: number) {
    const millis = position * 1000
    try {
      this.onSeekingCallback && this.onSeekingCallback()
      await this.soundObject.setPositionAsync(millis)
      this.onSeekedCallback && this.onSeekedCallback()
    } catch (error) {
      this.onErrorCallback && this.onErrorCallback(error)
    }
  }

  
  destroy () {
    this.stop()
    // this.soundObject = undefined
  }

  
  onCanplay (callback) {
    this.onCanplayCallback = callback
  }

  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  offCanplay (_callback) {
    this.onCanplayCallback = undefined
  }

  
  onPlay (callback) {
    this.onPlayCallback = callback
  }

  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  offPlay (_callback) {
    this.onPlayCallback = undefined
  }

  
  onPause (callback) {
    this.onPauseCallback = callback
  }

  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  offPause (_callback) {
    this.onPauseCallback = undefined
  }

  
  onStop (callback) {
    this.onStopCallback = callback
  }

  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  offStop (_callback) {
    this.onStopCallback = undefined
  }

  
  onEnded (callback) {
    this.onEndedCallback = callback
  }

  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  offEnded (_callback) {
    this.onEndedCallback = undefined
  }

  
  onTimeUpdate (callback) {
    this.onTimeUpdateCallback = callback
  }

  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  offTimeUpdate (_callback) {
    this.onTimeUpdateCallback = undefined
  }

  
  onError (callback) {
    this.onErrorCallback = callback
  }

  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  offError (_callback) {
    this.onErrorCallback = undefined
  }

  
  onWaiting (callback) {
    this.onWaitingCallback = callback
  }

  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  offWaiting (_callback) {
    this.onWaitingCallback = undefined
  }

  
  onSeeking (callback) {
    this.onSeekingCallback = callback
  }

  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  offSeeking (_callback) {
    this.onSeekingCallback = undefined
  }

  
  onSeeked (callback) {
    this.onSeekedCallback = callback
  }

  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  offSeeked (_callback) {
    this.onSeekedCallback = undefined
  }
}


export function createInnerAudioContext (): InnerAudioContext {
  return new InnerAudioContext()
}
