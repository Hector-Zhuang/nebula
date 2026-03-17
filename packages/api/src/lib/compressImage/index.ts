import ImageResizer, { ResizeFormat } from '@bam.tech/react-native-image-resizer'
import { Image } from 'react-native'


export async function compressImage(opt: compressImage.Option): Promise<compressImage.SuccessCallbackResult> {
  const {
    src,
    quality = 80,
  } = opt

  const res = { errMsg: 'compressImage:ok', tempFilePath: '' }

  const _createResizedImage = async (width = 800, height = 800) => {
    try {
      const compressFormat: ResizeFormat = src.toLocaleLowerCase().endsWith('.png') ? 'PNG' : 'JPEG'
      const { uri } = await ImageResizer.createResizedImage(src, width, height, compressFormat, quality)
      res.tempFilePath = uri
      return Promise.resolve(res)
    } catch (err: any) {
      res.errMsg = err?.message || 'compressImage:fail'
      return Promise.reject(res)
    }
  }

  return new Promise((resolve, reject) => {
    Image.getSize(src, async (width, height) => {
      try {
        const result = await _createResizedImage(width, height)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    }, async () => {
      try {
        const result = await _createResizedImage()
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  })
}
