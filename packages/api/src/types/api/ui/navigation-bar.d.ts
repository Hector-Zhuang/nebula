import Nebula from '../../index'

declare module '../../index' {
  namespace showNavigationBarLoading {
    interface Option {
      
      
      
    }
  }

  namespace setNavigationBarTitle {
    interface Option {
      
      title: string
      
      
      
    }
  }

  namespace setNavigationBarColor {
    interface Option {
      
      backgroundColor: string
      
      frontColor: string
      
      animation?: AnimationOption
      
      
      
    }
    
    interface AnimationOption {
      
      duration?: number
      
      timingFunc?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'
    }
  }

  namespace hideNavigationBarLoading {
    interface Option {
      
      
      
    }
  }

  namespace hideHomeButton {
    interface Option {
      
      
      
    }
  }

  interface NebulaStatic {
    
    showNavigationBarLoading(option?: showNavigationBarLoading.Option): void

    
    setNavigationBarTitle(option: setNavigationBarTitle.Option): Promise<NebulaGeneral.CallbackResult>

    
    setNavigationBarColor(option: setNavigationBarColor.Option): Promise<NebulaGeneral.CallbackResult>

    
    hideNavigationBarLoading(option?: hideNavigationBarLoading.Option): void

    
    hideHomeButton(option?: hideHomeButton.Option): Promise<NebulaGeneral.CallbackResult>
  }
}
