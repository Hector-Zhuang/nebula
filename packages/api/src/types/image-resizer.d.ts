declare module '@bam.tech/react-native-image-resizer' {
  export type ResizeFormat = 'JPEG' | 'PNG' | 'WEBP'

  export interface ResizeImageResult {
    uri: string
    path?: string
    name?: string
    size?: number
    width?: number
    height?: number
  }

  interface ImageResizerStatic {
    createResizedImage: (
      uri: string,
      width: number,
      height: number,
      format: ResizeFormat,
      quality: number,
    ) => Promise<ResizeImageResult>
  }

  const ImageResizer: ImageResizerStatic
  export default ImageResizer
}
