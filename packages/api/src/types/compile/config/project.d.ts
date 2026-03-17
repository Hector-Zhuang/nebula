import type Webpack from 'webpack'
import type Chain from 'webpack-chain'
import type { Input } from 'postcss'
import type { AppConfig } from '../../index'
import type { Compiler, CompilerTypes, CompilerWebpackTypes } from '../compiler'
import type { IModifyChainData } from '../hooks'
import type { ICopyOptions, IOption, ISassOptions, TogglableOptions } from './util'
import type { IH5Config } from './h5'
import type { IHarmonyConfig } from './harmony'
import type { IMiniAppConfig, IMiniFilesConfig } from './mini'
import type { IRNConfig } from './rn'

export type PluginItem<T = object> = string | [string, T] | [string, () => T | Promise<T>]

interface ICache {
  
  enable?: boolean

  
  buildDependencies?: Record<string, any>

  
  name?: string
}

interface ILogger {
  
  quiet: boolean
  
  stats: boolean
}

export interface IProjectBaseConfig {
  isWatch?: boolean
  port?: number
  
  projectName?: string

  
  date?: string

  
  designWidth?: number | ((size?: string | number | Input) => number)

  
  deviceRatio?: NebulaGeneral.TDeviceRatio

  watcher?: any[]

  
  sourceRoot?: string

  
  outputRoot?: string

  
  env?: IOption

  
  alias?: IOption

  
  defineConstants?: IOption

  
  copy?: ICopyOptions

  
  jsMinimizer?: 'terser' | 'esbuild'

  
  cssMinimizer?: 'csso' | 'esbuild' | 'lightningcss'

  
  csso?: TogglableOptions

  
  terser?: TogglableOptions

  esbuild?: Record<'minify', TogglableOptions>

  uglify?: TogglableOptions

  
  sass?: ISassOptions

  
  plugins?: PluginItem[]

  
  presets?: PluginItem[]

  
  baseLevel?: number

  
  framework?: 'react' | 'preact' | 'solid' | 'vue3'
  frameworkExts?: string[]

  
  compiler?: Compiler

  
  cache?: ICache

  
  logger?: ILogger

  
  enableSourceMap?: boolean

  
  onBuildStart?: (...args: any[]) => Promise<any>

  
  onBuildComplete?: (...args: any[]) => Promise<any>

  
  onBuildFinish?: (res: { error; stats; isWatch }) => Promise<any>

  
  onCompilerMake?: (compilation: Webpack.Compilation, compiler: Webpack.Compiler, plugin: any) => Promise<any>

  onWebpackChainReady?: (webpackChain: Chain) => Promise<any>

  modifyAppConfig?: (appConfig: AppConfig) => Promise<any>

  
  modifyWebpackChain?: (chain: Chain, webpack: typeof Webpack, data: IModifyChainData) => Promise<any>

  
  modifyViteConfig?: (viteConfig: any, data: IModifyChainData) => void

  
  modifyBuildAssets?: (assets: any, miniPlugin?: any) => Promise<any>

  
  modifyMiniConfigs?: (configMap: IMiniFilesConfig) => Promise<any>

  
  modifyRunnerOpts?: (opts: any) => Promise<any>
}


export interface IProjectConfig<T extends CompilerTypes = CompilerWebpackTypes> {
  
  projectName?: string

  
  date?: string

  
  designWidth?: number | ((size?: string | number | Input) => number)

  
  deviceRatio?: NebulaGeneral.TDeviceRatio

  
  sourceRoot?: string

  
  outputRoot?: string

  
  env?: IOption

  
  alias?: IOption

  
  defineConstants?: IOption

  
  copy?: ICopyOptions

  
  jsMinimizer?: 'terser' | 'esbuild'

  
  cssMinimizer?: 'csso' | 'esbuild' | 'lightningcss'

  
  csso?: TogglableOptions

  
  terser?: TogglableOptions

  esbuild?: Record<'minify', TogglableOptions>

  
  sass?: ISassOptions

  
  plugins?: PluginItem[]

  
  presets?: PluginItem[]

  
  framework?: 'react' | 'preact' | 'solid' | 'vue3' | 'none'

  
  cache?: ICache

  
  logger?: ILogger

  
  compiler?: Compiler<T>

  
  h5?: IH5Config<T>

  
  mini?: IMiniAppConfig<T>

  
  rn?: IRNConfig

  harmony?: IHarmonyConfig<T>

  [key: string]: any
}

export interface OutputExt {
  
  clean?: boolean | {
    
    keep?: Array<string | RegExp> | string | RegExp
  }
}
