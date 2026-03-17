import { Image } from 'react-native'
export function getImageInfo(option: getImageInfo.Option): Promise<getImageInfo.SuccessCallbackResult> {
  const { src } = option

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
        resolve(res)
      },
      (err) => {
        const res = {
          errMsg: err.message,
        }
        reject(res)
      }
    )
  })
}
