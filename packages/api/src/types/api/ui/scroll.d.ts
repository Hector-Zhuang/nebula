import Nebula from '../../index'

declare module '../../index' {
  namespace pageScrollTo {
    interface Option {
      
      
      duration?: number
      
      
      scrollTop?: number
      
      selector?: string
      
      offsetTop?: number
      
    }
  }

  
  interface ScrollViewContext {
    
    scrollEnabled: boolean

    
    bounces: boolean

    
    showScrollbar: boolean

    
    pagingEnabled: boolean

    
    fastDeceleration: boolean

    
    decelerationDisabled: boolean

    
    scrollTo(object: ScrollViewContext.scrollTo.Option): void

    
    scrollIntoView(
      
      selector: string
    ): void
  }

  namespace ScrollViewContext {
    namespace scrollTo {
      interface Option {
        
        top?: number
        
        left?: number
        
        velocity?: number
        
        duration?: number
        
        animated?: boolean
      }
    }
  }

  interface NebulaStatic {
    
    pageScrollTo(option: pageScrollTo.Option): Promise<NebulaGeneral.CallbackResult>
  }
}
