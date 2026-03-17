import type { IOption } from './util'

type FeatureItem = {
  name: string
}

declare enum LogLevel {
  OFF = 'off',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  LOG = 'log',
  DEBUG = 'debug'
}

export type SystemConfig = {
  
  logLevel?: LogLevel
  
  designWidth?: number
  
  data?: IOption
}

type RouterConfig = {
  
  entry: string
  
  pages: RouterPage[]
}
type RouterPage = {
  
  component: string
  
  path?: string
  
  filter: {
    [key: string]: {
      uri: string
    }
  }
}

interface IDefaultDisplayConfig {
  
  backgroundColor?: string
  
  fullScreen?: boolean
  
  titleBar?: boolean
  
  titleBarBackgroundColor?: string
  
  titleBarTextColor?: string
  
  titleBarText?: string
  
  menu?: boolean
  
  windowSoftInputMode?: 'adjustPan' | 'adjustResize'
}

interface IDisplayConfig extends IDefaultDisplayConfig {
  
  pages?: {
    [key: string]: IDefaultDisplayConfig
  }
}

export interface ITaroManifestConfig {
  
  package: string
  
  name: string
  
  icon: string
  
  versionName?: string
  
  versionCode: number
  
  minPlatformVersion?: string
  
  features?: FeatureItem[]
  /**
   *
   */
  logLevel?: LogLevel
}

export interface IManifestConfig extends ITaroManifestConfig {
  
  config: SystemConfig
  
  router: RouterConfig
  
  display?: IDisplayConfig
}
