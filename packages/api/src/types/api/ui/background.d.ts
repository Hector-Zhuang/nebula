import Nebula from '../../index'

declare module '../../index' {
  namespace setBackgroundTextStyle {
    interface Option {
      
      textStyle: 'dark' | 'light'
      
      
      
    }
  }

  namespace setBackgroundColor {
    interface Option {
      
      backgroundColor?: string
      
      backgroundColorBottom?: string
      
      backgroundColorTop?: string
      
      
      
    }
  }

  interface NebulaStatic {
    
    setBackgroundTextStyle(option: setBackgroundTextStyle.Option): Promise<NebulaGeneral.CallbackResult>

    
    setBackgroundColor(option: setBackgroundColor.Option): Promise<NebulaGeneral.CallbackResult>
  }
}
