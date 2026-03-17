import Nebula from '../../index'

declare module '../../index' {
  namespace vibrateShort {
    interface Option {
      
      type?: 'heavy' | 'medium' | 'light'
      
      
      
    }
  }

  namespace vibrateLong {
    interface Option {
      
      
      
    }
  }

  interface NebulaStatic {
    
    vibrateShort(option?: vibrateShort.Option): Promise<NebulaGeneral.CallbackResult>

    
    vibrateLong(option?: vibrateLong.Option): Promise<NebulaGeneral.CallbackResult>
  }
}
