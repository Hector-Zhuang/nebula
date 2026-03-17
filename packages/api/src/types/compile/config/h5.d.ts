import type Webpack from 'webpack'
import type Chain from 'webpack-chain'
import type webpackDevServer from 'webpack-dev-server'
import type HtmlWebpackPlugin from 'html-webpack-plugin'
import type { IOption, IPostcssOption, IUrlLoaderOption } from './util'
import type { OutputOptions as RollupOutputOptions } from 'rollup'
import type { Compiler, CompilerTypes, CompilerWebpackTypes } from '../compiler'
import type { OutputExt } from './project'
import type { ServerOptions as ViteServerOptions } from 'vite'

export interface IH5RouterConfig {
  
  mode?: 'hash' | 'browser' | 'multi'
  
  customRoutes?: IOption
  
  basename?: string
  lazyload?: boolean | ((pagename: string) => boolean)
  renamePagename?: (pagename: string) => string
  forcePath?: string
  
  enhanceAnimation?: boolean
}

export interface IH5Config <T extends CompilerTypes = CompilerWebpackTypes> {
  
  publicPath?: string

  
  staticDirectory?: string

  
  chunkDirectory?: string

  webpack?: ((webpackConfig: Webpack.Configuration, webpack) => Webpack.Configuration) | Webpack.Configuration

  
  webpackChain?: (chain: Chain, webpack: typeof Webpack) => void

  
  output?: T extends 'vite'
    ? Pick<RollupOutputOptions, 'chunkFileNames' | 'assetFileNames'>  & OutputExt
    : Webpack.Configuration['output']

  
  router?: IH5RouterConfig

  
  // Documentation in English.
  devServer?: T extends 'vite' ? ViteServerOptions : webpackDevServer.Configuration

  
  enableSourceMap?: boolean

  
  sourceMapType?:
    | 'none'
    | 'eval'
    | 'cheap-eval-source-map'
    | 'cheap-module-eval-source-map'
    | 'eval-source-map'
    | 'cheap-source-map'
    | 'cheap-module-source-map'
    | 'inline-cheap-source-map'
    | 'inline-cheap-module-source-map'
    | 'source-map'
    | 'inline-source-map'
    | 'hidden-source-map'
    | 'nosources-source-map'

  
  enableExtract?: boolean

  
  cssLoaderOption?: IOption

  
  styleLoaderOption?: IOption

  
  sassLoaderOption?: IOption

  
  lessLoaderOption?: IOption

  
  stylusLoaderOption?: IOption

  
  mediaUrlLoaderOption?: IUrlLoaderOption

  
  fontUrlLoaderOption?: IUrlLoaderOption

  
  imageUrlLoaderOption?: IUrlLoaderOption

  
  miniCssExtractPluginOption?: IOption

  
  esnextModules?: string[]

  
  useHtmlComponents?: boolean

  
  useDeprecatedAdapterComponent?: boolean

  
  postcss?: IPostcssOption<'h5'>

  
  htmlPluginOption?: HtmlWebpackPlugin.Options

  
  compile?: {
    exclude?: any[]
    include?: any[]
    
    filter?: (filename: string) => boolean
  }
  
  legacy?: T extends 'vite' ? boolean : undefined

  
  compiler?: Compiler<T>
}
