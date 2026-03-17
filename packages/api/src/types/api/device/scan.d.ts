import Nebula from '../../index'

declare module '../../index' {
  namespace scanCode {
    interface Option {
      
      
      
      onlyFromCamera?: boolean
      
      scanType?: (keyof ScanType)[]
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
        
        charSet: string
        
        path: string
        
        rawData: string
        
        result: string
        
        scanType: keyof QRType
        
        errMsg: string
    }
    
    interface ScanType {
      
      barCode
      
      qrCode
      
      datamatrix
      
      pdf417
    }
    
    interface QRType {
      
      QR_CODE
      
      AZTEC
      
      CODABAR
      
      CODE_39
      
      CODE_93
      
      CODE_128
      
      DATA_MATRIX
      
      EAN_8
      
      EAN_13
      
      ITF
      
      MAXICODE
      
      PDF_417
      
      RSS_14
      
      RSS_EXPANDED
      
      UPC_A
      
      UPC_E
      
      UPC_EAN_EXTENSION
      
      WX_CODE
      
      CODE_25
    }
  }

  interface NebulaStatic {
    
    scanCode(option: scanCode.Option): Promise<scanCode.SuccessCallbackResult>
  }
}
