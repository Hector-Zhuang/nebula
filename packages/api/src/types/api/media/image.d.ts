import Nebula from '../../index'

declare module '../../index' {
  namespace saveImageToPhotosAlbum {
    interface Option {
      
      filePath: string
      
      
      
    }
  }

  namespace previewImage {
    interface Option {
      
      urls: string[]
      
      current?: string | number
      
      enablesavephoto?: boolean
      
      enableShowPhotoDownload?: boolean
      
      showmenu?: boolean
      
      referrerPolicy?: string
      
      
      
    }
  }

  namespace previewMedia {
    interface Sources {
      
      url: string
      
      type?: 'image' | 'video'
      
      poster?: string
    }
    interface Option {
      
      sources: Sources[]
      
      current?: number
      
      showmenu?: boolean
      
      referrerPolicy?: string
      
      
      
    }
  }

  namespace getImageInfo {
    interface Option {
      
      src: string
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      height: number
      
      orientation: keyof Orientation
      
      path: string
      
      type: string
      
      width: number
      
      errMsg: string
    }

    interface Orientation {
      
      'up'
      
      'up-mirrored'
      
      'down'
      
      'down-mirrored'
      
      'left-mirrored'
      
      'right'
      
      'right-mirrored'
      
      'left'
    }
  }

  namespace editImage {
    interface Option {
      
      src: string
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      tempFilePath: string
    }
  }

  namespace chooseImage {
    interface Option {
      
      count?: number
      
      sizeType?: Array<keyof sizeType>
      
      sourceType?: Array<keyof sourceType>
      
      
      
      
      imageId?: string
    }
    
    interface sizeType {
      
      original
      /** compressed */
      compressed
    }
    
    interface sourceType {
      
      album
      
      camera
      
      user
      
      environment
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      tempFilePaths: string[]
      
      tempFiles: ImageFile[]
      
      errMsg: string
    }
    
    interface ImageFile {
      
      path: string
      
      size: number
      
      type?: string
      
      originalFileObj?: File
    }
  }

  namespace compressImage {
    interface Option {
      
      src: string
      
      
      
      quality?: number
      
      compressedWidth?: number
      
      compressedHeight?: number
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      tempFilePath: string
      
      errMsg: string
    }
  }

  namespace chooseMessageFile {
    interface Option {
      
      count: number
      
      
      extension?: string[]
      
      
      
      type?: keyof SelectType
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      tempFiles: ChooseFile[]
      
      errMsg: string
    }
    
    interface ChooseFile {
      
      name: string
      
      path: string
      
      size: number
      
      time: number
      
      type: keyof SelectedType
    }
    interface SelectType {
      
      all
      
      video
      
      image
      
      file
    }
    interface SelectedType {
      
      video
      
      image
      
      file
    }
  }

  namespace cropImage {
    interface Option {
      
      src: string
      
      cropScale: keyof CropScale
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      tempFilePath: string
    }
    interface CropScale {
      
      '1:1'
      
      '3:4'
      
      '4:3'
      
      '4:5'
      
      '5:4'
      
      '9:16'
      
      '16:9'
    }
  }

  interface NebulaStatic {
    
    saveImageToPhotosAlbum(option: saveImageToPhotosAlbum.Option): Promise<NebulaGeneral.CallbackResult>

    
    previewMedia(option: previewMedia.Option): Promise<NebulaGeneral.CallbackResult>

    
    previewImage(option: previewImage.Option): Promise<NebulaGeneral.CallbackResult>

    
    getImageInfo(option: getImageInfo.Option): Promise<getImageInfo.SuccessCallbackResult>

    
    editImage(option: editImage.Option): Promise<editImage.SuccessCallbackResult>

    
    compressImage(option: compressImage.Option): Promise<compressImage.SuccessCallbackResult>

    
    chooseMessageFile(option: chooseMessageFile.Option): Promise<chooseMessageFile.SuccessCallbackResult>

    
    chooseImage(option: chooseImage.Option): Promise<chooseImage.SuccessCallbackResult>

    
    cropImage(option: cropImage.Option): Promise<cropImage.SuccessCallbackResult>
  }
}
