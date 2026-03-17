import Nebula from '../../index'

declare module '../../index' {
  namespace loadFontFace {
    interface Option {
      
      global?: boolean,
      
      family: string
      
      source: string
      
      desc?: DescOption
      
      
      
    }

    interface CallbackResult extends NebulaGeneral.CallbackResult {
      
      status: string
    }
    
    interface DescOption {
      /** @supported h5 */
      ascentOverride?: string
      /** @supported h5 */
      descentOverride?: string
      /** @supported h5 */
      featureSettings?: string
      /** @supported h5 */
      lineGapOverride?: string
      /** @supported h5 */
      stretch?: string
      
      style?: string
      /** @supported h5 */
      unicodeRange?: string
      
      variant?: string
      /** @supported h5 */
      variationSettings?: string
      
      weight?: string
    }
  }

  interface NebulaStatic {
    
    loadFontFace(option: loadFontFace.Option): Promise<loadFontFace.CallbackResult>
  }
}
