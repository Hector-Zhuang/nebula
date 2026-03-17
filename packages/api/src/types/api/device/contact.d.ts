import Nebula from '../../index'

declare module '../../index' {
  namespace chooseContact {
    interface Option {
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      phoneNumber: string
      
      displayName: string
      
      phoneNumberList: string
    }
  }

  namespace addPhoneContact {
    interface Option {
      
      firstName: string
      
      photoFilePath?: string
      
      nickName?: string
      
      middleName?: string
      
      lastName?: string
      
      remark?: string
      
      mobilePhoneNumber?: string
      
      weChatNumber?: string
      
      addressCountry?: string
      
      addressState?: string
      
      addressCity?: string
      
      addressStreet?: string
      
      addressPostalCode?: string
      
      organization?: string
      
      title?: string
      
      workFaxNumber?: string
      
      workPhoneNumber?: string
      
      hostNumber?: string
      
      email?: string
      
      url?: string
      
      workAddressCountry?: string
      
      workAddressState?: string
      
      workAddressCity?: string
      
      workAddressStreet?: string
      
      workAddressPostalCode?: string
      
      homeFaxNumber?: string
      
      homePhoneNumber?: string
      
      homeAddressCountry?: string
      
      homeAddressState?: string
      
      homeAddressCity?: string
      
      homeAddressStreet?: string
      
      homeAddressPostalCode?: string
      
      
      
    }
  }

  interface NebulaStatic {
    
    chooseContact(option: chooseContact.Option): Promise<chooseContact.SuccessCallbackResult>
    
    addPhoneContact(option: addPhoneContact.Option): Promise<NebulaGeneral.CallbackResult>
  }
}
