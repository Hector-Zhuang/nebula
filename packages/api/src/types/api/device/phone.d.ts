import Nebula from '../../index'

declare module '../../index' {
  namespace makePhoneCall {
    interface Option {
      
      phoneNumber: string
      
      
      
    }
  }

  interface NebulaStatic {
    
    makePhoneCall(option: makePhoneCall.Option): Promise<NebulaGeneral.CallbackResult>
  }
}
