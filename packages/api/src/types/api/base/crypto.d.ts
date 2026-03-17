import Nebula from '../../index'

declare module '../../index' {
  
  interface UserCryptoManager {
    
    getLatestUserKey(option: UserCryptoManager.getLatestUserKey.Option): Promise<UserCryptoManager.getLatestUserKey.SuccessCallbackResult>

    
    getRandomValues(option: UserCryptoManager.getRandomValues.Option): void
  }

  namespace UserCryptoManager {
    namespace getLatestUserKey {
      interface Option {
        
        
        
      }

      interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
        
        encryptKey: string
        
        iv: string
        
        version: number
        
        expireTime: number
      }
    }

    namespace getRandomValues {
      interface Option {
        
        length: number
        
        
        
      }

      interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
        
        randomValues: ArrayBuffer
      }
    }
  }

  interface NebulaStatic {
    
    getUserCryptoManager(): UserCryptoManager

    
    getRandomValues(option: UserCryptoManager.getRandomValues.Option): Promise<UserCryptoManager.getRandomValues.SuccessCallbackResult>
  }
}
