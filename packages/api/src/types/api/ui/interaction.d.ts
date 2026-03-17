import Nebula from '../../index'

declare module '../../index' {
  namespace showToast {
    interface Option {
      
      title: string
      
      
      duration?: number
      
      
      icon?: 'success' | 'error' | 'loading' | 'none'
      
      image?: string
      
      mask?: boolean
      
    }
  }

  namespace showModal {
    interface Option {
      
      cancelColor?: string
      
      cancelText?: string
      
      
      confirmColor?: string
      
      confirmText?: string
      
      content?: string
      
      
      showCancel?: boolean
      
      
      title?: string
    }

    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      cancel: boolean
      
      confirm: boolean
      
      errMsg: string
    }
  }

  namespace showLoading {
    interface Option {
      
      title: string
      
      
      
      mask?: boolean
      
    }
  }

  namespace showActionSheet {
    interface Option {
      
      alertText?: string
      
      itemList: string[]
      
      
      
      itemColor?: string
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      tapIndex: number
      
      errMsg: string
    }
  }

  namespace hideToast {
    interface Option {
      
      noConflict?: boolean
      
      
      
    }
  }

  namespace hideLoading {
    interface Option {
      
      noConflict?: boolean
      
      
      
    }
  }

  namespace enableAlertBeforeUnload {
    interface Option {
      
      message: string
      
      
      
    }
  }

  namespace disableAlertBeforeUnload {
    interface Option {
      
      
      
    }
  }

  interface NebulaStatic {
    
    showToast(option?: showToast.Option): Promise<NebulaGeneral.CallbackResult>

    
    showModal(option?: showModal.Option): Promise<showModal.SuccessCallbackResult>

    
    showLoading(option?: showLoading.Option): Promise<NebulaGeneral.CallbackResult>

    
    showActionSheet(option: showActionSheet.Option): Promise<showActionSheet.SuccessCallbackResult>

    
    hideToast(option?: hideToast.Option): void

    
    hideLoading(option?: hideLoading.Option): void  
    enableAlertBeforeUnload(option: enableAlertBeforeUnload.Option): void

    
    disableAlertBeforeUnload(option?: disableAlertBeforeUnload.Option): void
  }
}
