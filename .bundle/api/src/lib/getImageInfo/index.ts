import { Image } from 'react-native'
export function getImageInfo(option: getImageInfo.Option): Promise<getImageInfo.SuccessCallbackResult> {
  const { src, success, fail, complete } = option

  return new Promise((resolve, reject) => {
    Image.getSize(
      src,
      (width, height) => {
        const orientation: keyof getImageInfo.Orientation = 'up'
        const res = {
          width,
          height,
          path: src,
          orientation, // todo
          type: '', // todo
          errMsg: 'getImageInfo: ok'
        }
        success?.(res)
        complete?.(res)
        resolve(res)
      },
      (err) => {
        const res = {
          errMsg: err.message,
        }
        fail?.(res)
        complete?.(res)
        reject(res)
      }
    )
  })
}
