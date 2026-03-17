import Nebula from './index'

declare module './index' {
  
  interface CommonConfig {
    
    navigationBarBackgroundColor?: string
    
    navigationBarTextStyle?: 'white' | 'black' | string
    
    navigationBarTitleText?: string
    
    navigationStyle?: 'default' | 'custom'
    
    homeButton?: boolean
    
    backgroundColor?: string
    
    backgroundColorContent?: string
    
    backgroundTextStyle?: 'dark' | 'light' | string
    
    backgroundColorTop?: string
    
    backgroundColorBottom?: string
    
    enablePullDownRefresh?: boolean
    
    onReachBottomDistance?: number
    
    pageOrientation?: 'auto' | 'portrait' | 'landscape'
    
    initialRenderingCache?: 'static' | 'dynamic'
    
    restartStrategy?: 'homePage' | 'homePageAndLatestPage'
    
    visualEffectInBackground?: 'hidden' | 'none'
    
    handleWebviewPreload?: string
    
    allowsBounceVertical?: 'YES' | 'NO'
    
    backgroundImageColor?: string
    
    backgroundImageUrl?: string
    
    defaultTitle?: string
    
    enableScrollBar?: string
    
    gestureBack?: string
    
    pullRefresh?: boolean
    
    responsive?: boolean
    
    showTitleLoading?: string
    
    transparentTitle?: string
    
    titlePenetrate?: string
    
    titleImage?: string
    
    titleBarColor?: string
  }

  interface PageConfig extends CommonConfig {
    
    disableScroll?: boolean
    
    usingWindowScroll?: boolean
    
    disableSwipeBack?: boolean
    
    enableShareAppMessage?: boolean
    
    enableShareTimeline?: boolean
    
    enablePageMeta?: boolean
    
    usingComponents?: Record<string, string | [string, string]>
    
    style?: string
    
    singlePage?: SinglePage
    
    enablePassiveEvent?:
      | boolean
      | {
          
          touchstart?: boolean
          
          touchmove?: boolean
          
          wheel?: boolean
        }
    
    renderer?: 'webview' | 'skyline'
    
    componentFramework?: 'exparser' | 'glass-easel'
    
    styleIsolation?: 'isolated' | 'apply-shared' | 'shared'
    
    optionMenu?: Record<string, string>
    
    barButtonTheme?: string
  }

  interface WindowConfig extends CommonConfig {}

  interface TabBarItem {
    
    pagePath: string
    
    text: string
    
    iconPath?: string
    
    selectedIconPath?: string
  }

  interface TabBar {
    
    color?: string
    
    selectedColor?: string
    
    backgroundColor?: string
    
    borderStyle?: 'black' | 'white'
    
    list: TabBarItem[]
    
    position?: 'bottom' | 'top'
    
    custom?: boolean
  }

  interface NetworkTimeout {
    
    request?: number
    
    connectSocket?: number
    
    uploadFile?: number
    
    downloadFile?: number
  }

  interface SubPackage {
    
    root: string
    
    pages: string[]
    
    name?: string
    
    independent?: boolean
    
    plugins?: Plugins
  }

  interface Plugins {
    [key: string]: {
      version: string
      provider: string
    }
  }

  interface PreloadRule {
    [key: string]: {
      
      packages: string[]
      
      network?: 'all' | 'wifi'
    }
  }

  interface Permission {
    [key: string]: {
      
      desc: string
    }
  }

  interface SinglePage {
    
    navigationBarFit?: string
  }

  interface RouterAnimate {
    
    duration?: number
    
    delay?: number
  }

  interface RenderOptions {
    skyline: {
      
      defaultDisplayBlock?: boolean
      
      disableABTest?: boolean
      
      sdkVersionBegin?: string
      
      sdkVersionEnd?: string
      
      iosVersionBegin?: string
      
      iosVersionEnd?: string
      
      androidVersionBegin?: string
      
      androidVersionEnd?: string
      [key: string]: unknown
    }
  }

  interface Behavior {
    
    shareAppMessage?: 'appendQuery'
    
    decodeQuery?: 'disable'
  }

  export interface AppConfig {
    
    entryPagePath?: string
    
    pages?: string[]
    
    window?: WindowConfig
    
    tabBar?: TabBar
    
    networkTimeout?: NetworkTimeout
    
    debug?: boolean
    
    functionalPages?:
      | boolean
      | {
          independent?: boolean
        }
    
    subPackages?: SubPackage[]
    subpackages?: SubPackage[]
    
    workers?: string | string[]
    
    requiredBackgroundModes?: ('audio' | 'location')[]
    
    requiredPrivateInfos?: (
      | 'getFuzzyLocation'
      | 'getLocation'
      | 'onLocationChange'
      | 'startLocationUpdate'
      | 'startLocationUpdateBackground'
      | 'chooseLocation'
      | 'choosePoi'
      | 'chooseAddress'
    )[]
    
    plugins?: Plugins
    
    preloadRule?: PreloadRule
    
    resizable?: boolean
    
    navigateToMiniProgramAppIdList?: string[]
    
    usingComponents?: Record<string, string>
    
    permission?: Permission
    
    sitemapLocation?: string
    
    style?: string
    
    useExtendedLib?: Record<string, boolean>
    
    entranceDeclare?: {
      
      locationMessage?: {
        
        path?: string
        
        query?: string
      }
    }
    
    darkmode?: boolean
    
    themeLocation?: string
    
    lazyCodeLoading?: 'requiredComponents' | string
    
    singlePage?: SinglePage
    
    supportedMaterials?: {
      
      materialType: string
      
      name: string
      
      desc: string
      
      path: string
    }[]
    
    serviceProviderTicket?: string
    
    embeddedAppIdList?: string[]
    
    halfPage?: {
      
      firstPageNavigationStyle?: 'default' | 'custom'
    }
    
    debugOptions?: {
      
      enableFPSPanel?: boolean
    }
    
    enablePassiveEvent?:
      | boolean
      | {
          
          touchstart?: boolean
          
          touchmove?: boolean
          
          wheel?: boolean
        }
    
    resolveAlias?: Record<string, string>
    
    components?: string[]
    
    appId?: string
    
    animation?: RouterAnimate | boolean
    
    renderer?: 'webview' | 'skyline'
    
    rendererOptions?: RenderOptions
    
    componentFramework?: 'exparser' | 'glass-easel'
    
    miniApp?: {
      
      useAuthorizePage: boolean
    }
    
    __usePrivacyCheck__?: boolean
    
    static?: { pattern: string; platforms: string[] }[]
    
    useDynamicPlugins?: boolean
    
    behavior?: Behavior
  }

  interface Config extends PageConfig, AppConfig {
    cloud?: boolean
  }

  interface NebulaStatic {
    CommonConfig: CommonConfig
    PageConfig: PageConfig
    WindowConfig: WindowConfig
    TarBarList: TabBarItem
    TabBar: TabBar
    NetworkTimeout: NetworkTimeout
    SubPackage: SubPackage
    Plugins: Plugins
    PreloadRule: PreloadRule
    Permission: Permission
    AppConfig: AppConfig
    RouterAnimate: RouterAnimate
    Config: Config
  }
}
