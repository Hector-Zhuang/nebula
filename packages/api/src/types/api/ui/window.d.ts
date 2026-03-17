import Nebula from '../../index'

declare module '../../index' {
  namespace setWindowSize {
    interface Option {
      
      width: string
      
      height: string
      
      
      
    }
  }
  namespace onWindowResize {
    
    type Callback = (result: CallbackResult) => void

    interface CallbackResult {
      size: Size
    }

    interface Size {
      
      windowHeight: number
      
      windowWidth: number
    }
  }

  namespace offWindowResize {
    
    type Callback = (res: NebulaGeneral.CallbackResult) => void
  }

  interface NebulaStatic {
    
    setWindowSize(option: setWindowSize.Option): Promise<NebulaGeneral.CallbackResult>

    
    onWindowResize(
      
      callback: onWindowResize.Callback,
    ): void

    
    offWindowResize(
      
      callback: offWindowResize.Callback,
    ): void

    
    checkIsPictureInPictureActive(): boolean
  }
}
