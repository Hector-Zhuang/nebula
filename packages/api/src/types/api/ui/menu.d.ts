import Nebula from '../../index'

declare module '../../index' {
  namespace getMenuButtonBoundingClientRect {
    
    interface Rect {
      
      bottom: number
      
      height: number
      
      left: number
      
      right: number
      
      top: number
      
      width: number
    }
  }

  interface NebulaStatic {
    
    getMenuButtonBoundingClientRect(): getMenuButtonBoundingClientRect.Rect
  }
}
