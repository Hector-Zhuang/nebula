import type Webpack from 'webpack'
import type Chain from 'webpack-chain'
import type webpackDevServer from 'webpack-dev-server'
import type HtmlWebpackPlugin from 'html-webpack-plugin'
import type { RollupOptions } from 'rollup'
import type { IOption, IPostcssOption } from './util'

export interface IRNConfig {
  
  appName?: string

  
  entry?: string

  
  output?: any

  
  sass?: IOption

  
  less?: IOption

  
  stylus?: IOption

  
  postcss?: {
    
    options?: any
    
    scalable?: boolean
    pxtransform?: {
      enable?: boolean
      
      config?: {
        additionalProperties?: boolean
        [key: string]: any
      }
    },
    cssModules?: {
      enable: boolean
    },
    [key: string]: any
  }

  resolve?: any

  
  enableMultipleClassName?: boolean

  
  enableMergeStyle?: boolean

  
  enableSvgTransform?: boolean

  alias?: IOption

  
  designWidth?: number | ((size?: string | number | Input) => number)

  
  deviceRatio?: NebulaGeneral.TDeviceRatio

  
  nativeComponents?: {
    
    external?: Array<string | RegExp> | ((arr: Array<string | RegExp>) => Array<string | RegExp>)
    
    exteranlResolve?: (importee: string, importer: string) => string
    
    output?: string
    
    modifyRollupConfig?: (config: RollupOptions, innerPlugins: { nebulaResolver: typeof nebulaResolver, styleTransformer: typeof styleTransformer }) => RollupOptions
  }
}
