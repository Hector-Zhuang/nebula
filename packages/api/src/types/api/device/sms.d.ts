import Nebula from '../../index'

declare module '../../index' {
  namespace sendSms {
    interface Option {
      
      phoneNumber?: string
      
      content?: string
      
      
      
    }
  }

  interface NebulaStatic {
    
    sendSms(option: sendSms.Option): Promise<NebulaGeneral.CallbackResul>
  }
}