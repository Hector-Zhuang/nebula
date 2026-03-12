type AnyObject = Record<string, any>
type AnyCallback = (...args: any[]) => any

interface CallbackResult extends AnyObject {
  errMsg?: string
}

interface IAnyObject extends AnyObject {}

interface RequestTask<T = any> extends AnyObject {
  abort?: () => void
  __dataType?: T
}

interface UploadTask extends AnyObject {
  abort?: () => void
  onProgressUpdate?: (callback: AnyCallback) => void
  offProgressUpdate?: (callback?: AnyCallback) => void
}

interface DownloadTask extends AnyObject {
  abort?: () => void
  onProgressUpdate?: (callback: AnyCallback) => void
  offProgressUpdate?: (callback?: AnyCallback) => void
}

interface SocketTask extends AnyObject {
  send?: (opts: AnyObject) => void
  close?: (opts?: AnyObject) => void
  onOpen?: (callback?: AnyCallback) => void
  onMessage?: (callback?: AnyCallback) => void
  onClose?: (callback?: AnyCallback) => void
  onError?: (callback?: AnyCallback) => void
}

interface CameraContext extends AnyObject {}
interface VideoContext extends AnyObject {}

declare namespace authorize { type Option = AnyObject }

declare namespace CameraContext {
  type StartRecordOption = AnyObject
  type StopRecordOption = AnyObject
  type TakePhotoOption = AnyObject
}

declare namespace chooseImage { type Option = AnyObject }
declare namespace chooseMedia { type Option = AnyObject }
declare namespace chooseVideo { type Option = AnyObject }

declare namespace compressImage {
  type Option = AnyObject
  type SuccessCallbackResult = AnyObject
}

declare namespace connectSocket { type Option = AnyObject }
declare namespace downloadFile { type Option = AnyObject }

declare namespace getAppBaseInfo { type Result = AnyObject }

declare namespace getClipboardData {
  type Option = AnyObject
  type Promised = AnyObject
}

declare namespace getFileInfo {
  type Option = AnyObject
  type SuccessCallbackResult = AnyObject
  type FailCallbackResult = AnyObject
}

declare namespace getImageInfo {
  type Option = AnyObject
  type SuccessCallbackResult = AnyObject
  interface Orientation extends AnyObject {}
}

declare namespace getLocation {
  type Option = AnyObject
  type SuccessCallbackResult = AnyObject
}

declare namespace getNetworkType {
  type Option = AnyObject
  type SuccessCallbackResult = AnyObject
  interface NetworkType extends AnyObject {}
}

declare namespace getSavedFileInfo {
  type Option = AnyObject
  type SuccessCallbackResult = AnyObject
}

declare namespace getSavedFileList {
  type Option = AnyObject
  type SuccessCallbackResult = AnyObject
}

declare namespace getScreenBrightness { type Option = AnyObject }

declare namespace getSetting {
  type Option = AnyObject
  type SuccessCallbackResult = AnyObject
}

declare namespace getStorage {
  type Option<T = any> = AnyObject & { key?: string; data?: T }
  type SuccessCallbackResult<T = any> = AnyObject & { data?: T }
}

declare namespace getStorageInfo { type Option = AnyObject }

declare namespace getSystemInfo {
  type Option = AnyObject
  type Result = AnyObject
}

declare namespace hideKeyboard { type Option = AnyObject }
declare namespace hideLoading { type Option = AnyObject }
declare namespace hideToast { type Option = AnyObject }
declare namespace makePhoneCall { type Option = AnyObject }

declare namespace offWindowResize { type Callback = AnyCallback }

declare namespace onAccelerometerChange {
  type Callback = AnyCallback
  type Result = AnyObject
}

declare namespace onDeviceMotionChange { type Callback = AnyCallback }
declare namespace onGyroscopeChange { type Callback = AnyCallback }
declare namespace onKeyboardHeightChange { type Callback = AnyCallback }
declare namespace onLocationChange { type Callback = AnyCallback }
declare namespace onNetworkStatusChange { type Callback = AnyCallback }
declare namespace onWindowResize { type Callback = AnyCallback }

declare namespace openSetting {
  type Option = AnyObject
  type SuccessCallbackResult = AnyObject
}

declare namespace previewImage { type Option = AnyObject }
declare namespace removeSavedFile { type Option = AnyObject }
declare namespace removeStorage { type Option = AnyObject }
declare namespace request { type Option = AnyObject }

declare namespace saveFile {
  type Option = AnyObject
  type SuccessCallbackResult = AnyObject
  type FailCallbackResult = AnyObject
}

declare namespace saveImageToPhotosAlbum { type Option = AnyObject }
declare namespace saveVideoToPhotosAlbum { type Option = AnyObject }

declare namespace scanCode {
  type Option = AnyObject
  type SuccessCallbackResult = AnyObject
  interface QRType extends AnyObject {}
}

declare namespace setClipboardData {
  type Option = AnyObject
  type Promised = AnyObject
}

declare namespace setKeepScreenOn {
  type Option = AnyObject
  type Promised = AnyObject
}

declare namespace setScreenBrightness { type Option = AnyObject }
declare namespace setStorage { type Option = AnyObject }

declare namespace showActionSheet {
  type Option = AnyObject
  type SuccessCallbackResult = AnyObject
}

declare namespace showLoading { type Option = AnyObject }

declare namespace showModal {
  type Option = AnyObject
  type SuccessCallbackResult = AnyObject
}

declare namespace showToast { type Option = AnyObject }

declare namespace SocketTask {
  type SendOption = AnyObject
  type CloseOption = AnyObject
  type OnOpenCallback = AnyCallback
  type OnMessageCallback = AnyCallback
  type OnCloseCallback = AnyCallback
  type OnErrorCallback = AnyCallback
}

declare namespace startAccelerometer { type Option = AnyObject }
declare namespace startDeviceMotionListening { type Option = AnyObject }
declare namespace startGyroscope { type Option = AnyObject }
declare namespace startLocationUpdate { type Option = AnyObject }
declare namespace stopAccelerometer { type Option = AnyObject }
declare namespace stopDeviceMotionListening { type Option = AnyObject }
declare namespace stopGyroscope { type Option = AnyObject }
declare namespace stopLocationUpdate { type Option = AnyObject }

declare namespace uploadFile {
  type Option = AnyObject
  type SuccessCallbackResult = AnyObject
}

declare namespace vibrateLong { type Option = AnyObject }
declare namespace vibrateShort { type Option = AnyObject }
