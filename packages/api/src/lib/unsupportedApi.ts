function temporarilyNotSupport(apiName: string, recommended?: string, isImmediate = true) {
  return () => {
    let errMsg = `RN 端暂不支持 API ${apiName}`
    if (recommended) {
      errMsg += `, 请使用 ${recommended}`
    }
    console.error(errMsg)
    if (!isImmediate) {
      return Promise.reject(new Error(errMsg))
    } else {
      return new Error(errMsg)
    }
  }
}

// Documentation in English.
export const onUserCaptureScreen = temporarilyNotSupport('onUserCaptureScreen', '', false)
export const offUserCaptureScreen = temporarilyNotSupport('offUserCaptureScreen', '', false)

// Documentation in English.
export const getFileSystemManager = temporarilyNotSupport('getFileSystemManager', '', false)

// WXML
export const createSelectorQuery = temporarilyNotSupport('createSelectorQuery', '', false)

// Documentation in English.
export const getUserProfile = temporarilyNotSupport('getUserProfile', '', false)
