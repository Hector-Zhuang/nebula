import type { Input } from 'postcss'
import type { Options as PostcssUrlOption } from 'postcss-url'

export type Func = (...args: any[]) => any

export type IOption = Record<string, any>

export type TogglableOptions<T = IOption> = {
  enable?: boolean
  config?: T
}

export interface IUrlLoaderOption extends IOption {
  limit?: number | boolean
  name?: ((moduleId: string) => string) | string
}

export namespace PostcssOption {
  export type cssModules = TogglableOptions<{
    
    namingPattern: 'global' | string
    
    generateScopedName: string | ((localName: string, absoluteFilePath: string) => string)
  }>
  export type url = TogglableOptions<PostcssUrlOption>
}

export interface IHtmlTransformOption {
  
  enable?: boolean
  config?: {
    
    readonly platform?: string
    
    removeCursorStyle: boolean
  }
}

export interface IPxTransformOption {
  
  onePxTransform?: boolean
  
  unitPrecision?: number
  
  propList?: string[]
  
  selectorBlackList?: Array<string | RegExp>
  
  replace?: boolean
  
  mediaQuery?: boolean
  
  minPixelValue?: number
  
  targetUnit?: 'rpx' | 'vw' | 'rem'
  
  baseFontSize?: number
  
  maxRootSize?: number
  
  minRootSize?: number
  
  designWidth?: number | ((size?: string | number | Input) => number)
  
  deviceRatio?: NebulaGeneral.TDeviceRatio
  
  platform?: 'weapp' | 'h5' | string
  
  methods?: string[]
  
  exclude?: (fileName: string) => boolean
}

interface IBasePostcssOption {
  autoprefixer?: TogglableOptions
  pxtransform?: TogglableOptions<IPxTransformOption>
  cssModules?: PostcssOption.cssModules
  
  htmltransform?: IHtmlTransformOption
  [key: string]: any
}

export type IPostcssOption<T = 'h5' | 'harmony' | 'mini'> = T extends 'h5'
  ? IBasePostcssOption & { url?: PostcssOption.url }
  : IBasePostcssOption

export type Config = ViteConfig | WebpackConfig

export interface ICopyOptions {
  patterns: {
    from: string
    to: string
    ignore?: string[]
    transform?: Func
    watch?: boolean
  }[]
  options: {
    ignore?: string[]
  }
}

export interface ISassOptions {
  
  resource?: string | string[]
  
  projectDirectory?: string
  
  data?: string
}

export interface ICompileOption {
  exclude?: string[]
  include?: string[]
}

export const enum TEMPLATE_TYPES {
  WEAPP = '.wxml',
  SWAN = '.swan',
  ALIPAY = '.axml',
  TT = '.ttml',
  QUICKAPP = '.ux',
  QQ = '.qml'
}

export const enum STYLE_TYPES {
  WEAPP = '.wxss',
  SWAN = '.css',
  ALIPAY = '.acss',
  TT = '.ttss',
  QUICKAPP = '.css',
  QQ = '.qss'
}

export const enum SCRIPT_TYPES {
  WEAPP = '.js',
  SWAN = '.js',
  ALIPAY = '.js',
  TT = '.js',
  QUICKAPP = '.js',
  QQ = '.js'
}

export const enum CONFIG_TYPES {
  WEAPP = '.json',
  SWAN = '.json',
  ALIPAY = '.json',
  TT = '.json',
  QUICKAPP = '.json',
  QQ = '.json'
}

export type IMINI_APP_FILE_TYPE = {
  TEMPL: TEMPLATE_TYPES
  STYLE: STYLE_TYPES
  SCRIPT: SCRIPT_TYPES
  CONFIG: CONFIG_TYPES
}

export type IMINI_APP_FILES = {
  [key: string]: IMINI_APP_FILE_TYPE
}
