import Nebula from '../../index'

declare module '../../index' {
  namespace switchTab {
    interface Option {
      
      url: string
      
      
      
    }
  }

  namespace reLaunch {
    interface Option {
      
      url: string
      
      
      
    }
  }

  namespace redirectTo {
    interface Option {
      
      url: string
      
      
      
    }
  }

  namespace navigateTo {
    interface Option {
      
      url: string
      
      events?: NebulaGeneral.IAnyObject
      
      routeType?: string
      
      routeConfig?: NebulaGeneral.IAnyObject
      
      routeOptions?: NebulaGeneral.IAnyObject
      
      
      
    }
  }

  namespace navigateBack {
    interface Option {
      
      
      delta?: number
      
      
    }
  }

  
  interface EventChannel {
    
    emit(
      
      eventName: string,
      
      ...args: any
    ): void
    
    on(
      
      eventName: string,
      
      fn: NebulaGeneral.EventCallback,
    ): void
    
    once(
      
      eventName: string,
      
      fn: NebulaGeneral.EventCallback,
    ): void
    
    off(
      
      eventName: string,
      
      fn: NebulaGeneral.EventCallback,
    ): void
  }

  namespace router {
    type CustomRouteBuilder = (routeContext: CustomRouteContext, routeOptions: Record<string, any>) => CustomRouteConfig

    interface SharedValue<T> {
      value: T
    }

    interface CustomRouteContext {
      // Documentation in English.
      primaryAnimation: SharedValue<number>
      // Documentation in English.
      primaryAnimationStatus: SharedValue<number>
      // Documentation in English.
      secondaryAnimation: SharedValue<number>
      // Documentation in English.
      secondaryAnimationStatus: SharedValue<number>
      // Documentation in English.
      userGestureInProgress: SharedValue<number>
      // Documentation in English.
      startUserGesture: () => void
      // Documentation in English.
      stopUserGesture: () => void
      // Documentation in English.
      didPop: () => void
    }

    interface CustomRouteConfig {
      // Documentation in English.
      opaque?: boolean
      // Documentation in English.
      maintainState?: boolean
      // Documentation in English.
      transitionDuration?: number
      // Documentation in English.
      reverseTransitionDuration?: number
      // Documentation in English.
      barrierColor?: string
      // Documentation in English.
      barrierDismissible?: boolean
      // Documentation in English.
      barrierLabel?: string
      // Documentation in English.
      canTransitionTo?: boolean
      // Documentation in English.
      canTransitionFrom?: boolean
      // Documentation in English.
      handlePrimaryAnimation?: RouteAnimationHandler
      // Documentation in English.
      handleSecondaryAnimation?: RouteAnimationHandler
      // Documentation in English.
      handlePreviousPageAnimation?: RouteAnimationHandler
      // Documentation in English.
      allowEnterRouteSnapshotting?: boolean
      // Documentation in English.
      allowExitRouteSnapshotting?: boolean
      // Documentation in English.
      fullscreenDrag?: boolean
      // Documentation in English.
      popGestureDirection?: 'horizontal' | 'vertical' | 'multi'
    }

    type RouteAnimationHandler = () => { [key: string] : any}

    
    interface router {
      
      addRouteBuilder(
        
        routeType: string,
        
        routeBuilder: CustomRouteBuilder
      ): void
      
      getRouteContext(
        
        instance: NebulaGeneral.IAnyObject
      ): CustomRouteContext
      
      removeRouteBuilder(
        
        routeType: string,
      ): void
    }
  }

  interface NebulaStatic {
    
    switchTab(option: switchTab.Option): Promise<NebulaGeneral.CallbackResult>

    
    reLaunch(option: reLaunch.Option): Promise<NebulaGeneral.CallbackResult>

    
    redirectTo(option: redirectTo.Option): Promise<NebulaGeneral.CallbackResult>

    
    navigateTo(option: navigateTo.Option): Promise<NebulaGeneral.CallbackResult>

    
    navigateBack(option?: navigateBack.Option): Promise<NebulaGeneral.CallbackResult>
    router: router.router
  }
}
