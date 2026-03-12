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

// 屏幕
export const onUserCaptureScreen = temporarilyNotSupport('onUserCaptureScreen', '', false)
export const offUserCaptureScreen = temporarilyNotSupport('offUserCaptureScreen', '', false)

// 文件
export const getFileSystemManager = temporarilyNotSupport('getFileSystemManager', '', false)

// WXML
export const createSelectorQuery = temporarilyNotSupport('createSelectorQuery', '', false)

// 用户信息
export const getUserProfile = temporarilyNotSupport('getUserProfile', '', false)
