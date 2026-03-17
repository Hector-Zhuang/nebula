import Nebula from '../../index'

declare module '../../index' {
  namespace updateVoIPChatMuteConfig {
    interface Option {
      
      muteConfig: MuteConfig
      
      
      
    }
    
    interface MuteConfig {
      
      muteMicrophone?: boolean
      
      muteEarphone?: boolean
    }
  }

  namespace subscribeVoIPVideoMembers {
    interface Option {
      
      openIdList: string[]
      
      
      
    }
  }

  namespace setEnable1v1Chat {
    interface Option {
      
      enable: boolean
      
      backgroundType?: keyof ColorType
      
      minWindowType?: keyof ColorType
      
      
      
    }
    
    interface ColorType {
      /** #262930 */
      0
      /** #FA5151 */
      1
      /** #FA9D3B */
      2
      /** #3D7257 */
      3
      /** #1485EE */
      4
      /** #6467F0 */
      5
    }
  }

  namespace onVoIPVideoMembersChanged {
    interface Result extends NebulaGeneral.CallbackResult {
      
      openIdList: string[]
      
      errCode: number
      
      errMsg: string
    }
    
    type Callback = (res: Result) => void
  }

  namespace onVoIPChatStateChanged {
    interface Result extends NebulaGeneral.CallbackResult {
      
      code: number
      
      data: Record<any, any>
      
      errCode: number
      
      errMsg: string
    }
    
    type Callback = (res: Result) => void
  }

  namespace onVoIPChatSpeakersChanged {
    interface Result extends NebulaGeneral.CallbackResult {
      
      openIdList: string[]
      
      errCode: number
      
      errMsg: string
    }
    
    type Callback = (res: Result) => void
  }

  namespace onVoIPChatMembersChanged {
    interface Result extends NebulaGeneral.CallbackResult {
      
      openIdList: string[]
      
      errCode: number
      
      errMsg: string
    }
    
    type Callback = (res: Result) => void
  }

  namespace onVoIPChatInterrupted {
    interface Result extends NebulaGeneral.CallbackResult {
      
      openIdList: string[]
      
      errCode: number
      
      errMsg: string
    }
    
    type Callback = (res: Result) => void
  }

  namespace joinVoIPChat {
    type Promised = FailCallbackResult | SuccessCallbackResult
    interface Option {
      
      roomType?: RoomType
      
      signature: string
      
      nonceStr: string
      
      timeStamp: number
      
      groupId: string
      
      muteConfig?: MuteConfig
      
      
      
    }
    
    interface RoomType {
      
      voice
      
      video
    }
    
    interface MuteConfig {
      
      muteMicrophone?: boolean
      
      muteEarphone?: boolean
    }
    interface FailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
      
      errCode: keyof VoipErrCode
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      openIdList: string[]
      
      errCode: number
      
      errMsg: string
    }
    
    interface VoipErrCode {
      
      [-1]
      
      [-2]
      
      [-3]
      
      [-1000]
    }
  }

  namespace join1v1Chat {
    interface Caller {
      
      nickname: string
      
      headImage?: string
      
      openid: string
    }
    interface Listener {
      
      nickname: string
      
      headImage?: string
      
      openid: string
    }
    interface RoomType {
      
      voice
      
      video
    }
    interface Option {
      
      caller: Caller
      
      listener: Listener
      
      backgroundType?: keyof setEnable1v1Chat.ColorType
      
      roomType?: keyof RoomType
      
      minWindowType?: keyof setEnable1v1Chat.ColorType
      
      disableSwitchVoice?: boolean
      
      
      
    }
    interface ChatErrCode {
      
      [-20000]
      
      [-20001]
      
      [-20002]
      
      [-20003]
      
      [-30000]
      
      [-30001]
      
      [-30002]
      
      [-30003]
      
      [-30004]
      
      [-1]
      
      [-2]
      
      [-3]
      
      [-1000]
    }
    interface FailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
      
      errCode: keyof ChatErrCode
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      errCode: number
      
      errMsg: string
    }
    type Promised = FailCallbackResult | SuccessCallbackResult
  }

  namespace exitVoIPChat {
    interface Option {
      
      
      
    }
  }

  interface NebulaStatic {
    
    updateVoIPChatMuteConfig(option: updateVoIPChatMuteConfig.Option): Promise<NebulaGeneral.CallbackResult>
    
    subscribeVoIPVideoMembers(option: subscribeVoIPVideoMembers.Option): Promise<NebulaGeneral.CallbackResult>
    
    setEnable1v1Chat(option: setEnable1v1Chat.Option): Promise<NebulaGeneral.CallbackResult>
    
    onVoIPVideoMembersChanged(callback: onVoIPVideoMembersChanged.Callback): void
    
    onVoIPChatStateChanged(callback: onVoIPChatStateChanged.Callback): void
    
    onVoIPChatSpeakersChanged(callback: onVoIPChatSpeakersChanged.Callback): void
    
    onVoIPChatMembersChanged(callback: onVoIPChatMembersChanged.Callback): void
    
    onVoIPChatInterrupted(callback: onVoIPChatInterrupted.Callback): void
    
    offVoIPVideoMembersChanged(callback: onVoIPVideoMembersChanged.Callback): void
    
    offVoIPChatStateChanged(callback: onVoIPChatStateChanged.Callback): void
    
    offVoIPChatSpeakersChanged(callback: onVoIPChatSpeakersChanged.Callback): void
    
    offVoIPChatMembersChanged(callback: onVoIPChatMembersChanged.Callback): void
    
    offVoIPChatInterrupted(callback: onVoIPChatInterrupted.Callback): void
    
    joinVoIPChat(option: joinVoIPChat.Option): Promise<joinVoIPChat.Promised>
    
    join1v1Chat(option: join1v1Chat.Option): Promise<join1v1Chat.Promised>
    
    exitVoIPChat(option: exitVoIPChat.Option): Promise<NebulaGeneral.CallbackResult>
  }
}
