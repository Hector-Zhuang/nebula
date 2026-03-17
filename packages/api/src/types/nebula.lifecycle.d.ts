import Nebula from './index'

type TaroGetDerivedStateFromProps<P, S> =
  /**
   * Returns an update to a component's state based on its new props and old state.
   *
   * Note: its presence prevents any of the deprecated lifecycle methods from being invoked
   */
  (nextProps: Readonly<P>, prevState: S) => Partial<S> | null

interface TaroStaticLifecycle<P, S> {
  getDerivedStateFromProps?: TaroGetDerivedStateFromProps<P, S>
}

interface TaroNewLifecycle<P, S, SS> {
  /**
   * Runs before React applies the result of `render` to the document, and
   * returns an object to be given to componentDidUpdate. Useful for saving
   * things such as scroll position before `render` causes changes to it.
   *
   * Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated
   * lifecycle events from running.
   */
  getSnapshotBeforeUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>): SS | null
  /**
   * Called immediately after updating occurs. Not called for the initial render.
   *
   * The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.
   */
  componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void
}

declare module './index' {
  interface PageNotFoundObject {
    
    path: string

    
    query: Record<string, unknown>

    
    isEntryPage: boolean
  }

  interface PageScrollObject {
    
    scrollTop: number
  }

  interface PageResizeObject {
    deviceOrientation?: 'portrait' | 'landscape'
    size: {
      windowWidth: number
      windowHeight: number
      screenWidth?: number
      screenHeight?: number
    }
  }

  interface ShareAppMessageObject {
    
    from?: 'button' | 'menu' | string
    
    target?: object
    
    webViewUrl?: string
  }

  interface ShareAppMessageReturnObject {
    
    title?: string

    
    path?: string

    
    imageUrl?: string
  }

  interface WeappShareAppMessageReturnObject extends ShareAppMessageReturnObject {
    
    promise: Promise<ShareAppMessageReturnObject>
  }

  type ShareAppMessageReturn = ShareAppMessageReturnObject | Promise<ShareAppMessageReturnObject> | WeappShareAppMessageReturnObject

  interface TabItemTapObject {
    
    index: string

    
    pagePath: string

    
    text: string
  }

  interface AddToFavoritesObject {
    
    webviewUrl: string
  }

  interface AddToFavoritesReturnObject {
    
    title?: string

    
    imageUrl?: string

    
    query?: string
  }

  interface ShareTimelineReturnObject {
    
    title?: string

    
    query?: string

    
    imageUrl?: string
  }

  interface ComponentLifecycle<P, S, SS = any> extends TaroNewLifecycle<P, S, SS> {
    componentWillMount?(): void
    componentDidMount?(): void
    componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void
    shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean
    componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void
    componentWillUnmount?(): void
    componentDidCatch?(err: string): void
    componentDidShow?(): void
    componentDidHide?(): void
    componentDidNotFound?(opt: PageNotFoundObject): void
  }

  interface NebulaStatic {
    PageNotFoundObject: PageNotFoundObject
    PageScrollObject: PageScrollObject
    ShareAppMessageObject: ShareAppMessageObject
    ShareAppMessageReturn: ShareAppMessageReturn
    TabItemTapObject: TabItemTapObject
    AddToFavoritesObject: AddToFavoritesObject
    AddToFavoritesReturnObject: AddToFavoritesReturnObject
    ShareTimelineReturnObject: ShareTimelineReturnObject
  }
}
