import Nebula from '../../index'

declare module '../../index' {
  namespace updateShareMenu {
    interface Option {
      
      withShareTicket?: boolean
      
      isUpdatableMessage?: boolean
      
      activityId?: string
      
      toDoActivityId?: string
      
      templateInfo?: UpdatableMessageFrontEndTemplateInfo
      
      isPrivateMessage?: boolean
      
      participant?: string[]
      
      useForChatTool?: boolean
      
      chooseType?: number
      
      
      
    }

    
    interface UpdatableMessageFrontEndTemplateInfo {
      
      parameterList: UpdatableMessageFrontEndParameter[]
      
      templateId: string
    }
    
    interface UpdatableMessageFrontEndParameter {
      
      name: string
      
      value: string
    }
  }

  namespace showShareMenu {
    interface Option {
      
      
      
      
      withShareTicket?: boolean
      
      showShareItems?: string[]
    }
  }

  namespace showShareImageMenu {
    interface Option {
      
      path: string
      
      
      
    }
  }

  namespace shareVideoMessage {
    interface Option {
      
      videoPath: string
      
      thumbPath?: string
      
      
      
    }
  }

  namespace shareFileMessage {
    interface Option {
      
      filePath: string
      
      fileName?: string
      
      
      
    }
  }
  namespace onCopyUrl {
    
    type Callback = (result: CallbackResult) => void

    interface CallbackResult {
      
      query: string
    }
  }

  namespace hideShareMenu {
    interface Option {
      
      menus?: string[]
      
      
      
    }
  }

  namespace getShareInfo {
    interface Option {
      /** shareTicket */
      shareTicket: string
      
      timeout?: number
      
      
      
    }

    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      cloudID?: string
      
      encryptedData: string
      
      errMsg: string
      
      iv: string
    }
  }

  namespace authPrivateMessage {
    interface Option {
      /** shareTicket */
      shareTicket: string
      
      
      
    }

    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      cloudID?: string
      
      encryptedData: string
      
      errMsg: string
      
      iv: string
    }
  }

  interface NebulaStatic {
    
    updateShareMenu (option: updateShareMenu.Option): Promise<NebulaGeneral.CallbackResult>

    
    showShareMenu (option: showShareMenu.Option): Promise<NebulaGeneral.CallbackResult>

    
    showShareImageMenu (option: showShareImageMenu.Option): Promise<NebulaGeneral.CallbackResult>

    
    shareVideoMessage (option: shareVideoMessage.Option): Promise<NebulaGeneral.CallbackResult>

    
    shareFileMessage (option: shareFileMessage.Option): Promise<NebulaGeneral.CallbackResult>

    
    onCopyUrl (
      
      callback: onCopyUrl.Callback,
    ): void

    
    offCopyUrl (
      
      callback: onCopyUrl.Callback,
    ): void

    
    hideShareMenu (option?: hideShareMenu.Option): Promise<NebulaGeneral.CallbackResult>

    
    getShareInfo (option: getShareInfo.Option): Promise<getShareInfo.SuccessCallbackResult>

    
    authPrivateMessage (option: authPrivateMessage.Option): Promise<authPrivateMessage.SuccessCallbackResult>
  }
}
