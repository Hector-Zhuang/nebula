import React from 'react'
import Vue from 'vue'

import Nebula from './index'

declare module './index' {
  // ref: packages/nebula-runtime/src/current.ts
  interface RouterInfo<TParams extends Partial<Record<string, string>> = Partial<Record<string, string>>> {
    
    params: TParams

    
    path: string

    onReady: string
    onHide: string
    onShow: string

    shareTicket: string | undefined
    scene: number | undefined
    exitState?: any
    $nebulaPath?: string
  }

  interface Show {
    componentDidShow?(): void
    componentDidHide?(): void
    onShow?(): void
    onHide?(): void
  }
  interface AppInstance extends Show {
    mount(component: React.Component | Vue.ComponentOptions<typeof Vue>, id: string, cb: (...args: any[]) => void): void
    componentDidShow?(options?: Record<string, unknown>): void
    onShow?(options?: Record<string, unknown>): void
    unmount(id: string, cb?: () => void): void
  }
  type Target = Record<string, unknown> & { dataset: Record<string, unknown>; id: string }
  interface MpEvent {
    type: string
    detail: Record<string, unknown>
    target: Target
    currentTarget: Target
  }
  interface PageLifeCycle extends Show {
    eh?(event: MpEvent): void
    onLoad(options: Record<string, unknown>): void
    onOptionMenuClick?(): void
    
    onKeyboardHeight?(opt: { height: number; }): void
    onPageScroll?(opt: PageScrollObject): void
    onPopMenuClick?(): void
    onPullDownRefresh?(): void
    onPullIntercept?(): void
    onReachBottom?(): void
    onResize?(opt: PageResizeObject): void
    onShareAppMessage?(opt: ShareAppMessageObject): ShareAppMessageReturn
    onShareTimeline?(): ShareTimelineReturnObject
    onTabItemTap?(opt: TabItemTapObject): void
    onTitleClick?(): void
    onUnload(): void
  }
  interface ComponentInstance<
    TData extends Record<string, unknown> = Record<string, unknown>,
    TParams extends Record<string, string> = Record<string, string>
  > {
    
    is?: string
    
    id?: string
    
    dataset?: string
    
    data?: TData
    
    properties?: TData
    
    router?: RouterInfo<TParams>
    
    pageRouter?: RouterInfo<TParams>
    
    setData?(newData: Partial<TData>): void
    
    hasBehavior?(behavior: unknown): boolean
    
    triggerEvent?(name: string, detail: Record<string, unknown>, options: {
      
      bubbles?: boolean
      
      composed?: boolean
      
      capturePhase?: boolean
    }): void
    
    createSelectorQuery?(): SelectorQuery
    
    createIntersectionObserver?(options?: createIntersectionObserver.Option): IntersectionObserver
    
    createMediaQueryObserver?(): MediaQueryObserver
    
    selectComponent?<
      TD extends Record<string, unknown> = Record<string, unknown>,
      TP extends Record<string, string> = Record<string, string>
    >(selector: string): ComponentInstance<TD, TP>
    
    selectAllComponents?<
      TD extends Record<string, unknown> = Record<string, unknown>,
      TP extends Record<string, string> = Record<string, string>
    >(selector: string): ComponentInstance<TD, TP>
    
    selectOwnerComponent?<
      TD extends Record<string, unknown> = Record<string, unknown>,
      TP extends Record<string, string> = Record<string, string>
    >(): ComponentInstance<TD, TP>
    
    getRelationNodes?(relationKey: string): NodesRef[]
    
    groupSetData?(callback: () => void): void
    
    getTabBar?(): ComponentInstance
    
    getPageId?(): string
    
    animate?(selector: string, keyFrames: KeyFrame[], duration: number, callback: () => void): void
    
    animate?(selector: string, keyFrames: KeyFrame[], duration: number, scrollTimeline: ScrollTimelineOption): void
    
    clearAnimation?(selector: string, callback: () => void): void
    
    clearAnimation?(selector: string, options: ClearAnimationOptions, callback: () => void): void
    
    setUpdatePerformanceListener?(options: {
      
      withDataPaths?: boolean
    }, listener: () => void): void
    
    applyAnimatedStyle?(selector: string, updater: NebulaGeneral.TFunc, config?: {
      
      immediate?: boolean
      
      flush?: string
    }, callback?: NebulaGeneral.TFunc): void
    
    clearAnimatedStyle?(selector: string, styleIds: Array<Number>, callback?: NebulaGeneral.TFunc): void
  }
  interface PageInstance extends PageLifeCycle, ComponentInstance {
    
    config?: PageConfig
    
    data?: Record<string, unknown>
    
    path?: string
    
    options?: Record<string, unknown>
    
    getOpenerEventChannel?(): Record<string, any>
  }
}
