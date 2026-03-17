import type Webpack from 'webpack'
import type Chain from 'webpack-chain'
import type { IOption, IPostcssOption, IUrlLoaderOption } from './util'
import type { OutputOptions as RollupOutputOptions } from 'rollup'
import type { Compiler, CompilerTypes, CompilerWebpackTypes } from '../compiler'
import type { OutputExt } from './project'

interface Runtime {
  enableInnerHTML?: boolean
  enableSizeAPIs?: boolean
  enableAdjacentHTML?: boolean
  enableTemplateContent?: boolean
  enableCloneNode?: boolean
  enableContains?: boolean
  enableMutationObserver?: boolean
}

export interface IMiniAppConfig<T extends CompilerTypes = CompilerWebpackTypes> {
  
  enableSourceMap?: boolean

  
  sourceMapType?: string

  
  debugReact?: boolean

  
  skipProcessUsingComponents?: boolean

  
  minifyXML?: {
    
    collapseWhitespace?: boolean
  }

  
  webpackChain?: (chain: Chain, webpack: typeof Webpack, PARSE_AST_TYPE: any) => void

  
  output?: T extends 'vite'
    ? Pick<RollupOutputOptions, 'chunkFileNames'>  & OutputExt
    : Webpack.Configuration['output'] & OutputExt

  
  postcss?: IPostcssOption<'mini'>

  
  cssLoaderOption?: IOption

  
  sassLoaderOption?: IOption

  
  lessLoaderOption?: IOption

  
  stylusLoaderOption?: IOption

  
  mediaUrlLoaderOption?: IUrlLoaderOption

  
  fontUrlLoaderOption?: IUrlLoaderOption

  
  imageUrlLoaderOption?: IUrlLoaderOption

  
  miniCssExtractPluginOption?: IOption

  
  commonChunks?: string[] | ((commonChunks: string[]) => string[])

  
  addChunkPages?: (pages: Map<string, string[]>, pagesNames?: string[]) => void

  
  optimizeMainPackage?: {
    enable?: boolean
    exclude?: any[]
  }

  
  compile?: {
    exclude?: any[]
    include?: any[]
    
    filter?: (filename: string) => boolean
  }

  
  runtime?: Runtime

  
  compiler?: Compiler<T>

  
  experimental?: {
    
    compileMode?: boolean | string
    
    useXsForTemplate?: boolean
  }
}

export interface IMiniFilesConfig {
  [configName: string]: {
    content: any
    path: string
  }
}
