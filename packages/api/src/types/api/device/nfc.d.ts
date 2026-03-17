import Nebula from '../../index'

declare module '../../index' {
  namespace stopHCE {
    interface Option {
      
      
      
    }
  }

  namespace startHCE {
    interface Option {
      
      aid_list: string[]
      
      
      
    }
  }

  namespace sendHCEMessage {
    interface Option {
      
      data: ArrayBuffer
      
      
      
    }
  }

  namespace onHCEMessage {
    
    type Callback = (result: CallbackResult) => void

    interface CallbackResult {
      
      data: ArrayBuffer
      
      messageType: keyof MessageType
      
      reason: number
    }

    
    interface MessageType {
      
      1
      
      2
    }
  }

  namespace getHCEState {
    interface Option {
      
      
      
    }
  }

  
  interface IsoDep {
    
    close(option?: IsoDep.close.Option): Promise<NebulaGeneral.NFCError>
    
    connect(option?: IsoDep.connect.Option): Promise<NebulaGeneral.NFCError>
    
    getHistoricalBytes(option?: IsoDep.getHistoricalBytes.Option): Promise<NebulaGeneral.NFCError>
    
    getMaxTransceiveLength(option?: IsoDep.getMaxTransceiveLength.Option): Promise<NebulaGeneral.NFCError>
    
    isConnected(option?: IsoDep.isConnected.Option): Promise<NebulaGeneral.NFCError>
    
    setTimeout(option?: IsoDep.setTimeout.Option): Promise<NebulaGeneral.NFCError>
    
    transceive(option?: IsoDep.transceive.Option): Promise<NebulaGeneral.NFCError>
  }

  namespace IsoDep {
    namespace close {
      interface Option {
        
        
        
      }
    }
    namespace connect {
      interface Option {
        
        
        
      }
    }
    namespace getHistoricalBytes {
      interface Option {
        
        
        
      }
      interface SuccessCallbackResult extends NebulaGeneral.NFCError {
        
        histBytes: ArrayBuffer
      }
    }
    namespace getMaxTransceiveLength {
      interface Option {
        
        
        
      }
      interface SuccessCallbackResult extends NebulaGeneral.NFCError {
        
        length: number
      }
    }
    namespace isConnected {
      interface Option {
        
        
        
      }
    }
    namespace setTimeout {
      interface Option {
        
        timeout: number
        
        
        
      }
    }
    namespace transceive {
      interface Option {
        
        data: ArrayBuffer
        
        
        
      }
      interface SuccessCallbackResult extends NebulaGeneral.NFCError {
        data: ArrayBuffer
      }
    }
  }

  
  interface MifareClassic {
    
    close(option?: MifareClassic.close.Option): Promise<NebulaGeneral.NFCError>
    
    connect(option?: MifareClassic.connect.Option): Promise<NebulaGeneral.NFCError>
    
    getMaxTransceiveLength(option?: MifareClassic.getMaxTransceiveLength.Option): Promise<NebulaGeneral.NFCError>
    
    isConnected(option?: MifareClassic.isConnected.Option): Promise<NebulaGeneral.NFCError>
    
    setTimeout(option?: MifareClassic.setTimeout.Option): Promise<NebulaGeneral.NFCError>
    
    transceive(option?: MifareClassic.transceive.Option): Promise<NebulaGeneral.NFCError>
  }

  namespace MifareClassic {
    namespace close {
      interface Option {
        
        
        
      }
    }
    namespace connect {
      interface Option {
        
        
        
      }
    }
    namespace getMaxTransceiveLength {
      interface Option {
        
        
        
      }
      interface SuccessCallbackResult extends NebulaGeneral.NFCError {
        
        length: number
      }
    }
    namespace isConnected {
      interface Option {
        
        
        
      }
    }
    namespace setTimeout {
      interface Option {
        
        timeout: number
        
        
        
      }
    }
    namespace transceive {
      interface Option {
        
        data: ArrayBuffer
        
        
        
      }
      interface SuccessCallbackResult extends NebulaGeneral.NFCError {
        data: ArrayBuffer
      }
    }
  }

  
  interface MifareUltralight {
    
    close(option?: MifareUltralight.close.Option): Promise<NebulaGeneral.NFCError>
    
    connect(option?: MifareUltralight.connect.Option): Promise<NebulaGeneral.NFCError>
    
    getMaxTransceiveLength(option?: MifareUltralight.getMaxTransceiveLength.Option): Promise<NebulaGeneral.NFCError>
    
    isConnected(option?: MifareUltralight.isConnected.Option): Promise<NebulaGeneral.NFCError>
    
    setTimeout(option?: MifareUltralight.setTimeout.Option): Promise<NebulaGeneral.NFCError>
    
    transceive(option?: MifareUltralight.transceive.Option): Promise<NebulaGeneral.NFCError>
  }

  namespace MifareUltralight {
    namespace close {
      interface Option {
        
        
        
      }
    }
    namespace connect {
      interface Option {
        
        
        
      }
    }
    namespace getMaxTransceiveLength {
      interface Option {
        
        
        
      }
      interface SuccessCallbackResult extends NebulaGeneral.NFCError {
        
        length: number
      }
    }
    namespace isConnected {
      interface Option {
        
        
        
      }
    }
    namespace setTimeout {
      interface Option {
        
        timeout: number
        
        
        
      }
    }
    namespace transceive {
      interface Option {
        
        data: ArrayBuffer
        
        
        
      }
      interface SuccessCallbackResult extends NebulaGeneral.NFCError {
        data: ArrayBuffer
      }
    }
  }

  
  interface Ndef {
    
    close(option?: Ndef.close.Option): Promise<NebulaGeneral.NFCError>
    
    connect(option?: Ndef.connect.Option): Promise<NebulaGeneral.NFCError>
    
    isConnected(option?: Ndef.isConnected.Option): Promise<NebulaGeneral.NFCError>
    
    offNdefMessage(
      
      callback: Ndef.onNdefMessage.Callback,
    ): void
    
    onNdefMessage(
      
      callback: Ndef.onNdefMessage.Callback,
    ): void
    
    setTimeout(option?: Ndef.setTimeout.Option): Promise<NebulaGeneral.NFCError>
    
    writeNdefMessage(option?: Ndef.writeNdefMessage.Option): Promise<NebulaGeneral.NFCError>
  }

  namespace Ndef {
    namespace close {
      interface Option {
        
        
        
      }
    }
    namespace connect {
      interface Option {
        
        
        
      }
    }
    namespace isConnected {
      interface Option {
        
        
        
      }
    }
    namespace onNdefMessage {
      
      type Callback = (...args: unknown[]) => void
    }
    namespace setTimeout {
      interface Option {
        
        timeout: number
        
        
        
      }
    }
    namespace writeNdefMessage {
      interface Option {
        
        uris?: string[]
        
        texts?: string[]
        
        records?: record[]
        
        
        
      }
      interface record {
        id: ArrayBuffer
        type: ArrayBuffer
        payload: ArrayBuffer
      }
    }
  }

  
  interface NfcA {
    
    close(option?: NfcA.close.Option): Promise<NebulaGeneral.NFCError>
    
    connect(option?: NfcA.connect.Option): Promise<NebulaGeneral.NFCError>
    
    getAtqa(option?: NfcA.getAtqa.Option): Promise<NebulaGeneral.NFCError>
    
    getMaxTransceiveLength(option?: NfcA.getMaxTransceiveLength.Option): Promise<NebulaGeneral.NFCError>
    
    getSak(option?: NfcA.getSak.Option): Promise<NebulaGeneral.NFCError>
    
    isConnected(option?: NfcA.isConnected.Option): Promise<NebulaGeneral.NFCError>
    
    setTimeout(option?: NfcA.setTimeout.Option): Promise<NebulaGeneral.NFCError>
    
    transceive(option?: NfcA.transceive.Option): Promise<NebulaGeneral.NFCError>
  }

  namespace NfcA {
    namespace close {
      interface Option {
        
        
        
      }
    }
    namespace connect {
      interface Option {
        
        
        
      }
    }
    namespace getAtqa {
      interface Option {
        
        
        
      }
      interface SuccessCallbackResult extends NebulaGeneral.NFCError {
        
        atqa: ArrayBuffer
      }
    }
    namespace getMaxTransceiveLength {
      interface Option {
        
        
        
      }
      interface SuccessCallbackResult extends NebulaGeneral.NFCError {
        
        length: number
      }
    }
    namespace getSak {
      interface Option {
        
        
        
      }
      interface SuccessCallbackResult extends NebulaGeneral.NFCError {
        
        sak: number
      }
    }
    namespace isConnected {
      interface Option {
        
        
        
      }
    }
    namespace setTimeout {
      interface Option {
        
        timeout: number
        
        
        
      }
    }
    namespace transceive {
      interface Option {
        
        data: ArrayBuffer
        
        
        
      }
      interface SuccessCallbackResult extends NebulaGeneral.NFCError {
        data: ArrayBuffer
      }
    }
  }

  
  interface NFCAdapter {
    
    getIsoDep(): IsoDep
    
    getMifareClassic(): MifareClassic
    
    getMifareUltralight(): MifareUltralight
    
    getNdef(): Ndef
    
    getNfcA(): NfcA
    
    getNfcB(): NfcB
    
    getNfcF(): NfcB
    
    getNfcV(): NfcV
    
    offDiscovered(
      
      callback?: NFCAdapter.onDiscovered.Callback,
    ): void
    
    onDiscovered(
      
      callback: NFCAdapter.onDiscovered.Callback,
    ): void
    
    startDiscovery(option?: NFCAdapter.startDiscovery.Option): Promise<NebulaGeneral.NFCError>
    
    stopDiscovery(option?: NFCAdapter.stopDiscovery.Option): Promise<NebulaGeneral.NFCError>
  }

  namespace NFCAdapter {
    namespace onDiscovered {
      
      type Callback = (
        result: CallbackResult,
      ) => void

      interface CallbackResult {
        
        techs: string[]
        
        messages: NdefMessage[]
        
        id?: ArrayBuffer
      }

      interface NdefMessage {
        id: ArrayBuffer
        type: ArrayBuffer
        payload: ArrayBuffer
      }
    }
    namespace startDiscovery {
      interface Option {
        
        
        
      }
    }
    namespace stopDiscovery {
      interface Option {
        
        
        
      }
    }
  }

  
  interface NfcB {
    
    close(option?: NfcB.close.Option): Promise<NebulaGeneral.NFCError>
    
    connect(option?: NfcB.connect.Option): Promise<NebulaGeneral.NFCError>
    
    getMaxTransceiveLength(option?: NfcB.getMaxTransceiveLength.Option): Promise<NebulaGeneral.NFCError>
    
    isConnected(option?: NfcB.isConnected.Option): Promise<NebulaGeneral.NFCError>
    
    setTimeout(option?: NfcB.setTimeout.Option): Promise<NebulaGeneral.NFCError>
    
    transceive(option?: NfcB.transceive.Option): Promise<NebulaGeneral.NFCError>
  }

  namespace NfcB {
    namespace close {
      interface Option {
        
        
        
      }
    }
    namespace connect {
      interface Option {
        
        
        
      }
    }
    namespace getMaxTransceiveLength {
      interface Option {
        
        
        
      }
      interface SuccessCallbackResult extends NebulaGeneral.NFCError {
        
        length: number
      }
    }
    namespace isConnected {
      interface Option {
        
        
        
      }
    }
    namespace setTimeout {
      interface Option {
        
        timeout: number
        
        
        
      }
    }
    namespace transceive {
      interface Option {
        
        data: ArrayBuffer
        
        
        
      }
      interface SuccessCallbackResult extends NebulaGeneral.NFCError {
        data: ArrayBuffer
      }
    }
  }

  
  interface NfcF {
    
    close(option?: NfcF.close.Option): Promise<NebulaGeneral.NFCError>
    
    connect(option?: NfcF.connect.Option): Promise<NebulaGeneral.NFCError>
    
    getMaxTransceiveLength(option?: NfcF.getMaxTransceiveLength.Option): Promise<NebulaGeneral.NFCError>
    
    isConnected(option?: NfcF.isConnected.Option): Promise<NebulaGeneral.NFCError>
    
    setTimeout(option?: NfcF.setTimeout.Option): Promise<NebulaGeneral.NFCError>
    
    transceive(option?: NfcF.transceive.Option): Promise<NebulaGeneral.NFCError>
  }

  namespace NfcF {
    namespace close {
      interface Option {
        
        
        
      }
    }
    namespace connect {
      interface Option {
        
        
        
      }
    }
    namespace getMaxTransceiveLength {
      interface Option {
        
        
        
      }
      interface SuccessCallbackResult extends NebulaGeneral.NFCError {
        
        length: number
      }
    }
    namespace isConnected {
      interface Option {
        
        
        
      }
    }
    namespace setTimeout {
      interface Option {
        
        timeout: number
        
        
        
      }
    }
    namespace transceive {
      interface Option {
        
        data: ArrayBuffer
        
        
        
      }
      interface SuccessCallbackResult extends NebulaGeneral.NFCError {
        data: ArrayBuffer
      }
    }
  }

  
  interface NfcV {
    
    close(option?: NfcV.close.Option): Promise<NebulaGeneral.NFCError>
    
    connect(option?: NfcV.connect.Option): Promise<NebulaGeneral.NFCError>
    
    getMaxTransceiveLength(option?: NfcV.getMaxTransceiveLength.Option): Promise<NebulaGeneral.NFCError>
    
    isConnected(option?: NfcV.isConnected.Option): Promise<NebulaGeneral.NFCError>
    
    setTimeout(option?: NfcV.setTimeout.Option): Promise<NebulaGeneral.NFCError>
    
    transceive(option?: NfcV.transceive.Option): Promise<NebulaGeneral.NFCError>
  }

  namespace NfcV {
    namespace close {
      interface Option {
        
        
        
      }
    }
    namespace connect {
      interface Option {
        
        
        
      }
    }
    namespace getMaxTransceiveLength {
      interface Option {
        
        
        
      }
      interface SuccessCallbackResult extends NebulaGeneral.NFCError {
        
        length: number
      }
    }
    namespace isConnected {
      interface Option {
        
        
        
      }
    }
    namespace setTimeout {
      interface Option {
        
        timeout: number
        
        
        
      }
    }
    namespace transceive {
      interface Option {
        
        data: ArrayBuffer
        
        
        
      }
      interface SuccessCallbackResult extends NebulaGeneral.NFCError {
        data: ArrayBuffer
      }
    }
  }

  interface NebulaStatic {
    
    stopHCE(option?: stopHCE.Option): Promise<NebulaGeneral.NFCError>

    
    startHCE(option: startHCE.Option): Promise<NebulaGeneral.NFCError>

    
    sendHCEMessage(option: sendHCEMessage.Option): Promise<NebulaGeneral.NFCError>

    
    onHCEMessage(
      
      callback: onHCEMessage.Callback,
    ): void

    
    offHCEMessage(
      
      callback: onHCEMessage.Callback,
    ): void

    
    getNFCAdapter(): NFCAdapter

    
    getHCEState(option?: getHCEState.Option): Promise<NebulaGeneral.NFCError>
  }
}
