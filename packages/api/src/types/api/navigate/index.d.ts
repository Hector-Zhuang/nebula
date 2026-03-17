import Nebula from '../../index'

declare module '../../index' {
  namespace openEmbeddedMiniProgram {
    interface Option {
      
      appId?: string
      
      path?: string
      
      extraData?: NebulaGeneral.IAnyObject
      
      envVersion?: keyof EnvVersion
      
      shortLink?: string
      
      verify?: keyof Verify
      
      noRelaunchIfPathUnchanged?: boolean
      
      allowFullScreen?: boolean
      
      
      
    }

    interface Verify {
      
      binding
      
      unionProduct
    }

    interface EnvVersion {
      
      develop
      
      trial
      
      release
    }
  }

  namespace navigateToMiniProgram {
    interface Option {
      
      appId?: string
      
      path?: string
      
      extraData?: NebulaGeneral.IAnyObject
      
      envVersion?: keyof EnvVersion
      
      shortLink?: string
      
      
      
    }

    interface EnvVersion {
      
      develop
      
      trial
      
      release
    }
  }

  namespace navigateBackMiniProgram {
    interface Option {
      
      extraData?: NebulaGeneral.IAnyObject
      
      
      
    }
  }

  namespace exitMiniProgram {
    interface Option {
      
      
      
    }
  }

  namespace openBusinessView {
    
    interface ScoreEnableExtraData {
      
      apply_permissions_token: string
    }
    
    interface ScoreUsedExtraData {
      
      mch_id: string
      
      package: string
      
      timestamp: string
      
      nonce_str: string
      
      sign_type: string
      
      sign: string
    }
    
    interface ScoreDetailExtraData {
      
      mch_id: string
      
      service_id: string
      
      out_order_no: string
      
      timestamp: string
      
      nonce_str: string
      
      sign_type: string
      
      sign: string
    }

    interface Option {
      
      businessType: 'wxpayScoreEnable' | 'wxpayScoreUse' | 'wxpayScoreDetail' | string
      
      extraData: ScoreEnableExtraData | ScoreUsedExtraData | ScoreDetailExtraData
      
      
      
    }
  }

  interface NebulaStatic {
    
    openEmbeddedMiniProgram(option?: openEmbeddedMiniProgram.Option): Promise<NebulaGeneral.CallbackResult>

    
    navigateToMiniProgram(option: navigateToMiniProgram.Option): Promise<NebulaGeneral.CallbackResult>

    
    navigateBackMiniProgram(option: navigateBackMiniProgram.Option): Promise<NebulaGeneral.CallbackResult>

    
    exitMiniProgram(option?: exitMiniProgram.Option): Promise<NebulaGeneral.CallbackResult>

    
    openBusinessView(option: openBusinessView.Option): Promise<NebulaGeneral.CallbackResult>
  }
}
