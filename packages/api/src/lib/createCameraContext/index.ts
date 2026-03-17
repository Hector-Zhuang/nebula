import { Camera } from 'expo-camera'

const globalAny: any = global

class CameraContext {
  private cameraRef: any
  private recordPromise: Promise<{ tempVideoPath: string; tempThumbPath: string; errMsg: string }> | null = null

  constructor(cameraRef: any) {
    this.cameraRef = cameraRef
  }

  /**
   * Start video recording.
   */
  startRecord = async (_option: CameraContext.StartRecordOption) => {
    const [cameraPermission, microphonePermission] = await Promise.all([
      Camera.requestCameraPermissionsAsync(),
      Camera.requestMicrophonePermissionsAsync(),
    ])

    if (!cameraPermission.granted || !microphonePermission.granted) {
      return Promise.reject({
        errMsg: 'startRecord: fail',
        err: Error('You have not enabled camera or microphone permissions')
      })
    }

    if (!this.cameraRef?.recordAsync) {
      return Promise.reject({
        errMsg: 'startRecord: fail',
        err: Error('camera not ready')
      })
    }

    this.recordPromise = this.cameraRef.recordAsync().then((res: { uri: string }) => {
      const { uri } = res
      return {
        tempVideoPath: uri,
        tempThumbPath: '',
        errMsg: 'stopRecord: ok'
      }
    })

    return Promise.resolve({ errMsg: 'startRecord: ok' })
  }

  /**
    * Stop video recording.
   */
  stopRecord = async (_option: CameraContext.StopRecordOption) => {
    if (!this.recordPromise || !this.cameraRef?.stopRecording) {
      return Promise.reject({
        errMsg: 'stopRecord: fail',
        err: Error('no active recording')
      })
    }

    this.cameraRef.stopRecording()
    try {
      const result = await this.recordPromise
      this.recordPromise = null
      return Promise.resolve(result)
    } catch (error) {
      this.recordPromise = null
      return Promise.reject({ errMsg: 'stopRecord: fail', err: error })
    }
  }

  /**
    * Take a photo.
   */
  takePhoto = async (option: CameraContext.TakePhotoOption) => {
    const { quality = 'normal' } = option
    let _quality = 0
    switch (quality) {
      case 'high':
        _quality = 1
        break
      case 'normal':
        _quality = 0.6
        break
      case 'low':
        _quality = 0.3
        break
    }
    try {
      const { granted } = await Camera.requestCameraPermissionsAsync()
      if (granted) {
        if (this.cameraRef?.takePictureAsync) {
          const { uri } = await this.cameraRef.takePictureAsync({ quality: _quality })
          const res = {
            tempImagePath: uri,
            errMsg: 'takePhoto: ok'
          }
          return Promise.resolve(res)
        } else {
          const err = {
            errMsg: 'takePhoto: fail',
            err: Error('unknown')
          }
          return Promise.reject(err)
        }
      } else {
        const err = {
          errMsg: 'takePhoto: fail',
          err: Error('You have not enabled camera permissions')
        }
        return Promise.reject(err)
      }
    } catch (error) {
      const err = {
        errMsg: 'takePhoto: fail',
        err: error
      }
      return Promise.reject(err)
    }
  }

  /**
    * Get camera frame stream data.
   * not support
   */
  onCameraFrame = () => {
    return {
      start(): void {
        console.log('not support')
      },
      stop(): void {
        console.log('not support')
      }
    }
  }

  setZoom = () => {
    console.log('not support')
  }
}
/**
 * Create a camera context object.
 */

export function createCameraContext(): CameraContext | undefined {
  const ref = globalAny._nebulaCamera
  if (ref) {
    return new CameraContext(ref)
  } else {
    return undefined
  }
}
