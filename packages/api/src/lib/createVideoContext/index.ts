
const globalAny:any = global

globalAny._nebulaVideoMap = globalAny._nebulaVideoMap || {}
class VideoContext {
  private videoRef: any

  constructor (videoRef) {
    this.videoRef = videoRef
  }

  
  async exitFullScreen () {
    try {
      await this.videoRef?.dismissFullscreenPlayer()
    } catch (e) {
      console.log(e)
    }
  }

  
  hideStatusBar () {
    console.log('not support')
  }

  
  async pause () {
    try {
      await this.videoRef?.pauseAsync()
    } catch (e) {
      console.log(e)
    }
  }

  
  async play () {
    try {
      await this.videoRef?.playAsync?.()
    } catch (e) {
      console.log(e)
    }
  }

  
  async playbackRate (rate: number) {
    try {
      await this.videoRef?.setRateAsync(rate)
    } catch (e) {
      console.log(e)
    }
  }

  
  async requestFullScreen () {
    try {
      await this.videoRef?.presentFullscreenPlayer()
    } catch (e) {
      console.log(e)
    }
  }

  
  async seek (position: number) {
    const millis = position * 1000
    try {
      await this.videoRef?.setPositionAsync(millis)
    } catch (e) {
      console.log(e)
    }
  }

  
  sendDanmu () {
    console.log('not support')
  }

  
  showStatusBar () {
    console.log('not support')
  }

  exitBackgroundPlayback () {
    console.log('not support')
  }

  exitPictureInPicture () {
    console.log('not support')
  }

  requestBackgroundPlayback () {
    console.log('not support')
  }

  
  async stop () {
    try {
      await this.videoRef?.stopAsync()
    } catch (e) {
      console.log(e)
    }
  }
}


export function createVideoContext (id: string, t?: IAnyObject): VideoContext|undefined {
  let ref = globalAny._nebulaVideoMap[id]
  if (t) ref = t
  if (ref) {
    return new VideoContext(ref)
  } else {
    return undefined
  }
}
