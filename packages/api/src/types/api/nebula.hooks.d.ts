import Nebula from '../index'

declare module '../index' {
  interface NebulaStatic {
    
    useDidShow(callback: (options?: getLaunchOptionsSync.LaunchOptions) => void): void

    
    useDidHide(callback: () => void): void

    
    usePullDownRefresh(callback: () => void): void

    
    useReachBottom(callback: () => void): void

    
    usePageScroll(callback: (payload: PageScrollObject) => void): void

    
    useResize(callback: (payload: PageResizeObject) => void): void

    
    useShareAppMessage(callback: (payload: ShareAppMessageObject) => ShareAppMessageReturn): void

    
    useTabItemTap(callback: (payload: TabItemTapObject) => void): void

    
    useAddToFavorites(callback: (payload: AddToFavoritesObject) => AddToFavoritesReturnObject): void

    
    useShareTimeline(callback: () => ShareTimelineReturnObject): void

    
    useSaveExitState(callback: () => {
      data: Record<any, any>
      expireTimeStamp?: number
    }): void

    
    useLaunch(callback: (options: getLaunchOptionsSync.LaunchOptions) => void): void

    
    useError(callback: (error: string) => void): void

    
    useUnhandledRejection(callback: (error: { reason: Error, promise: Promise<Error> }) => void): void

    
    usePageNotFound(callback: (res: { path: string, query: Record<any, any>, isEntryPage: boolean, [key: string]: any }) => void): void

    
    useLoad<T extends {} = Record<string, any>>(callback: (param: T) => void): void

    
    useUnload(callback: () => void): void

    
    useReady(callback: () => void): void

    
    useRouter<TParams extends Partial<Record<string, string>> = Partial<Record<string, string>>>(dynamic?: boolean): RouterInfo<TParams>

    
    useTitleClick(callback: () => void): void

    
    useOptionMenuClick(callback: () => void): void

    
    useKeyboardHeight(callback: (payload: { height: number }) => void): void

    
    usePullIntercept(callback: () => void): void
  }
}
