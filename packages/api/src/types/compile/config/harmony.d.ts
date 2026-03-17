import type { OutputOptions as RollupOutputOptions } from 'rollup'
import type Webpack from 'webpack'
import type Chain from 'webpack-chain'

import type { IOption, IPostcssOption, IUrlLoaderOption } from './util'
import type { CompilerTypes, CompilerWebpackTypes } from '../compiler'
import type { OutputExt } from './project'

export interface IHarmonyRouterConfig {
  
  customRoutes?: IOption
}

export interface IHarmonyConfig<T extends CompilerTypes = 'vite'> {
  
  projectPath: string

  
  hapName?: string

  
  name?: string

  
  ohPackage?: {
    dependencies?: { [name: string]: string }
    devDependencies?: { [name: string]: string }
    main?: string
    [k: string]: any
  }

  /** ohpm-cli
   * @default "~/Library/Huawei/ohpm/bin/ohpm"
   */
  ohpm?: string

  
  chorePackagePrefix?: string

  
  commonChunks?: string[] | ((commonChunks: string[]) => string[])

  
  compile?: {
    exclude?: any[]
    include?: any[]
    filter?: (filename: string) => boolean
  }

  
  compileModeSetting?: {
    componentReplace?: {
      [key: string]: {
        current_init: string
        dependency_define: string
      }
    }
  }

  
  enableSourceMap?: boolean

  
  sourceMapType?: string

  
  debugReact?: boolean

  
  webpackChain?: (chain: Chain, webpack: typeof Webpack) => void

  
  output?: T extends 'vite'
    ? Pick<RollupOutputOptions, 'chunkFileNames'> & OutputExt
    : Webpack.Configuration['output'] & OutputExt

  
  router?: IHarmonyRouterConfig

  
  postcss?: IPostcssOption<'harmony'>

  
  cssLoaderOption?: IOption

  
  sassLoaderOption?: IOption

  
  lessLoaderOption?: IOption

  
  stylusLoaderOption?: IOption

  
  mediaUrlLoaderOption?: IUrlLoaderOption

  
  fontUrlLoaderOption?: IUrlLoaderOption

  
  imageUrlLoaderOption?: IUrlLoaderOption

  
  miniCssExtractPluginOption?: IOption
}
