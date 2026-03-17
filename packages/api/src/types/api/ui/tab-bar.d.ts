import Nebula from '../../index'

declare module '../../index' {
  namespace showTabBarRedDot {
    interface Option {
      
      index: number
      
      
      
    }
  }

  namespace showTabBar {
    interface Option {
      
      animation?: boolean
      
      
      
    }
  }

  namespace setTabBarStyle {
    interface Option {
      
      backgroundColor?: string
      
      borderStyle?: string
      
      color?: string
      
      
      
      selectedColor?: string
      
    }
  }

  namespace setTabBarItem {
    interface Option {
      
      index: number
      
      
      
      iconPath?: string
      
      selectedIconPath?: string
      
      
      text?: string
    }
  }

  namespace setTabBarBadge {
    interface Option {
      
      index: number
      
      text: string
      
      
      
    }
  }

  namespace removeTabBarBadge {
    interface Option {
      
      index: number
      
      
      
    }
  }

  namespace hideTabBarRedDot {
    interface Option {
      
      index: number
      
      
      
    }
  }

  namespace hideTabBar {
    interface Option {
      
      animation?: boolean
      
      
      
    }
  }

  interface NebulaStatic {
    
    showTabBarRedDot(option: showTabBarRedDot.Option): Promise<NebulaGeneral.CallbackResult>

    
    showTabBar(option?: showTabBar.Option): Promise<NebulaGeneral.CallbackResult>

    
    setTabBarStyle(option?: setTabBarStyle.Option): Promise<NebulaGeneral.CallbackResult>

    
    setTabBarItem(option: setTabBarItem.Option): Promise<NebulaGeneral.CallbackResult>

    
    setTabBarBadge(option: setTabBarBadge.Option): Promise<NebulaGeneral.CallbackResult>

    
    removeTabBarBadge(option: removeTabBarBadge.Option): Promise<NebulaGeneral.CallbackResult>

    
    hideTabBarRedDot(option: hideTabBarRedDot.Option): Promise<NebulaGeneral.CallbackResult>

    
    hideTabBar(option?: hideTabBar.Option): Promise<NebulaGeneral.CallbackResult>
  }
}
