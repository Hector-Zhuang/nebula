import * as FileSystem from 'expo-file-system'
import { Platform } from 'react-native'

import { shouldBeObject } from '../utils'
interface Func {
  (arg: any): void
}

interface ExtPromise<T> extends Promise<T> {
  onProgressUpdateCb?: Func
  onProgressUpdate?: Func
  abort?: Func
}

let timer: ReturnType<typeof setTimeout>

const _fetch = (requestPromise, timeout) => {
  let timeoutAction
  const timerPromise = new Promise((_resolve, reject) => {
    timeoutAction = () => {
      reject(new Error('网络请求超时'))
    }
  })
  timer = setTimeout(() => {
    timeoutAction()
    !!timer && clearTimeout(timer)
  }, timeout)

  return Promise.race([requestPromise, timerPromise])
}

const isAndroid = Platform.OS === 'android'

const createFormData = (filePath, body, name) => {
  const data = new FormData()
  const uri = isAndroid ? filePath : filePath.replace('file://', '')
  const fileObj = { uri: uri, type: 'application/octet-stream', name: 'file' }

  Object.keys(body).forEach(key => {
    data.append(key, body[key])
  })

  // @ts-ignore
  data.append(name, fileObj)

  return data
}


function uploadFile (opts: uploadFile.Option): Promise<uploadFile.SuccessCallbackResult & UploadTask> {
  const { url, timeout = 2000, filePath, name, header, formData = {} } = opts

  const execFetch = fetch(url, {
    method: 'POST',
    body: createFormData(filePath, formData, name),
    headers: header
  })

  return _fetch(execFetch, timeout).then((res: any) => {
    return Promise.resolve(res)
  }).catch(e => {
    const errMsg = `uploadFile fail: ${e}`
    return Promise.reject({ errMsg })
  })
}


function downloadFile (opts: downloadFile.Option): Promise<DownloadTask> {
  const { url, header, filePath }: any = opts
  let downloadResumable
  const p: ExtPromise<any> = new Promise((resolve, reject) => {
    let fileName = url.split('/')
    fileName = fileName[fileName.length - 1]
    const downloadFileCallback = (res) => {
      const { totalBytesWritten, totalBytesExpectedToWrite } = res
      let progress = totalBytesWritten / totalBytesExpectedToWrite * 100
      progress = Number(progress.toFixed(2))
      p.onProgressUpdateCb && p.onProgressUpdateCb({
        progress,
        totalBytesWritten,
        totalBytesExpectedToWrite
      })
    }
    downloadResumable = FileSystem.createDownloadResumable(
      url,
      filePath || `${FileSystem.documentDirectory}${fileName}`,
      {
        headers: header
      },
      downloadFileCallback
    )

    downloadResumable.downloadAsync().then((resp) => {
      const { uri, status } = resp
      const res: any = {
        tempFilePath: uri,
        statusCode: status
      }
      filePath && (res.filePath = filePath)
      resolve(res)
    }).catch((err) => {
      const res = {
        errMsg: 'download file fail',
        err
      }
      reject(res)
    })
  })

  p.onProgressUpdate = (cb) => {
    if (cb) {
      p.onProgressUpdateCb = cb
    }
  }

  p.abort = (cb) => {
    downloadResumable.pauseAsync()
    cb && cb()
  }

  return p
}


async function saveFile (opts: saveFile.Option): Promise<saveFile.SuccessCallbackResult | saveFile.FailCallbackResult> {
  const res = <any>{ errMsg: 'saveFile:ok' }
  const isObject = shouldBeObject(opts)
  if (!isObject.res) {
    res.errMsg = `saveFile${isObject.msg}`
    return Promise.reject(res)
  }

  const { tempFilePath, filePath }: any = opts || {}
  const fileName = tempFilePath.substring(tempFilePath.lastIndexOf('/') + 1)
  const destPath = filePath || FileSystem.documentDirectory
  const savedFilePath = destPath + fileName

  try {
    const props = await FileSystem.getInfoAsync(destPath)
    if (!props.exists) {
      await FileSystem.makeDirectoryAsync(destPath, { intermediates: true })
    }
    if (filePath) {
      // const toPath = !isAndroid ? destPath : savedFilePath
      await FileSystem.moveAsync({ from: tempFilePath, to: savedFilePath })
    }
    res.savedFilePath = savedFilePath
    return res
  } catch (e) {
    res.errMsg = `saveFile:fail. ${e.message}`
    throw res
  }
}


async function removeSavedFile (opts: removeSavedFile.Option): Promise<CallbackResult> {
  let res = <any>{ errMsg: 'removeSavedFile:ok' }
  const isObject = shouldBeObject(opts)
  if (!isObject.res) {
    res.errMsg = `removeSavedFile${isObject.msg}`
    console.error(res)
    return Promise.reject(res)
  }

  const { filePath }: any = opts || {}

  try {
    const obj: any = await FileSystem.deleteAsync(filePath)
    res = {
      ...res,
      ...obj
    }
    return Promise.resolve(res)
  } catch (e) {
    res.errMsg = `removeSavedFile:fail. ${e.message}`
    return Promise.reject(res)
  }
}


async function getSavedFileList (opts: getSavedFileList.Option = {}): Promise<getSavedFileList.SuccessCallbackResult> {
  const res = <any>{ errMsg: 'getSavedFileList:ok' }
  const isObject = shouldBeObject(opts)
  if (!isObject.res) {
    res.errMsg = `getSavedFileList${isObject.msg}`
    console.error(res)
    return Promise.reject(res)
  }

  const fileList = <any>[]
  try {
    const fileNameList = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory as string)
    fileNameList.forEach(async (fileName) => {
      const fileInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + fileName)
      if (fileInfo.isDirectory) {
        fileList.push({
          filePath: fileInfo.uri,
          size: fileInfo.size,
          createTime: fileInfo.modificationTime
        })
      }
    })
    res.fileList = fileList
    return res
  } catch (e) {
    res.errMsg = `getSavedFileList:fail. ${e.message}`
    throw res
  }
}


async function getSavedFileInfo (opts: getSavedFileInfo.Option): Promise<getSavedFileInfo.SuccessCallbackResult> {
  const res = <any>{ errMsg: 'getSavedFileInfo:ok' }
  const isObject = shouldBeObject(opts)
  if (!isObject.res) {
    res.errMsg = `getSavedFileInfo${isObject.msg}`
    console.error(res)
    return Promise.reject(res)
  }

  const { filePath }: any = opts || {}

  try {
    const obj = await FileSystem.getInfoAsync(filePath, { md5: true })
    if (!obj.exists) {
      throw new Error('filePath not exists')
    }
    res.size = obj.size
    res.createTime = obj.modificationTime
    return res
  } catch (e) {
    res.errMsg = `getSavedFileInfo:fail. ${e.message}`
    throw res
  }
}


async function getFileInfo (opts: getFileInfo.Option): Promise<getFileInfo.SuccessCallbackResult | getFileInfo.FailCallbackResult> {
  const res = <any>{ errMsg: 'getFileInfo:ok' }
  const isObject = shouldBeObject(opts)
  if (!isObject.res) {
    res.errMsg = `getFileInfo${isObject.msg}`
    console.error(res)
    return Promise.reject(res)
  }

  const { filePath }: any = opts || {}

  try {
    const obj = await FileSystem.getInfoAsync(filePath, { md5: true })
    if (!obj.exists) {
      throw new Error('filePath not exists')
    }
    res.size = obj.size
    res.md5 = obj.md5
    return res
  } catch (e) {
    res.errMsg = `getFileInfo:fail. ${e.message}`
    throw res
  }
}


// function getFileSystemManager () {
//   console.log('not finished')
// }


// function openDocument (opts = {}) {
//   console.log('not finished')
// }

export {
  downloadFile,
  getFileInfo,
  getSavedFileInfo,
  getSavedFileList,
  removeSavedFile,
  saveFile,
  uploadFile
}
