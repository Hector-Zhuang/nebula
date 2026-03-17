import Nebula from '../../../index'

declare module '../../../index' {
  namespace getLaunchOptionsSync {
    
    interface LaunchOptions {
      
      path: string
      
      query: NebulaGeneral.IAnyObject
      
      scene: number
      
      shareTicket: string
      
      referrerInfo: LaunchOptions.ReferrerInfo
      
      forwardMaterials?: LaunchOptions.ForwardMaterial[]
      
      chatType?: keyof LaunchOptions.ChatType
      
      apiCategory?: keyof LaunchOptions.ApiCategory
    }

    namespace LaunchOptions {
      
      interface ReferrerInfo {
        
        appId?: string
        
        extraData?: NebulaGeneral.IAnyObject
      }
      
      interface ForwardMaterial {
        
        type: string
        
        name: string
        
        path: string
        
        size: number
      }
      
      interface ChatType {
        
        1
        
        2
        
        3
        
        4
      }
      
      interface ApiCategory {
        
        default
        
        nativeFunctionalized
        
        browseOnly
        
        embedded
      }
    }
  }

  namespace getEnterOptionsSync {
    
    interface EnterOptions {
      
      path: string
      
      scene: number
      
      query: NebulaGeneral.IAnyObject
      
      shareTicket: string
      
      referrerInfo: EnterOptions.ReferrerInfo
      
      forwardMaterials?: EnterOptions.ForwardMaterial[]
      
      chatType?: keyof EnterOptions.ChatType
      
      apiCategory?: keyof EnterOptions.ApiCategory
    }

    namespace EnterOptions {
      
      interface ReferrerInfo {
        
        appId?: string
        
        extraData?: NebulaGeneral.IAnyObject
      }
      
      interface ForwardMaterial {
        
        type: string
        
        name: string
        
        path: string
        
        size: number
      }
      
      interface ChatType {
        
        1
        
        2
        
        3
        
        4
      }
      
      interface ApiCategory {
        
        default
        
        nativeFunctionalized
        
        browseOnly
        
        embedded
      }
    }
  }

  interface NebulaStatic {
    
    getLaunchOptionsSync(): getLaunchOptionsSync.LaunchOptions

    
    getEnterOptionsSync(): getEnterOptionsSync.EnterOptions
  }
}
