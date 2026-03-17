import Nebula from '../../index'

declare module '../../index' {
  namespace onBLEPeripheralConnectionStateChanged {
    
    type Callback = (
      result: CallbackResult,
    ) => void

    interface CallbackResult {
      
      deviceId: string
      
      serverId: string
      
      connected: boolean
    }
  }

  namespace createBLEPeripheralServer {
    interface Option {
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.BluetoothError {
      
      server: BLEPeripheralServer
    }
  }

  
  interface BLEPeripheralServer {
    
    addService(option: BLEPeripheralServer.addService.Option): Promise<NebulaGeneral.BluetoothError>
    
    close(option: BLEPeripheralServer.close.Option): Promise<NebulaGeneral.BluetoothError>
    
    offCharacteristicReadRequest(
      
      callback?: BLEPeripheralServer.onCharacteristicReadRequest.Callback,
    ): void
    
    offCharacteristicSubscribed(
      
      callback?: BLEPeripheralServer.onCharacteristicSubscribed.Callback,
    ): void
    
    offCharacteristicUnsubscribed(
      
      callback?: BLEPeripheralServer.onCharacteristicUnsubscribed.Callback,
    ): void
    
    offCharacteristicWriteRequest(
      
      callback?: BLEPeripheralServer.onCharacteristicWriteRequest.Callback,
    ): void
    
    onCharacteristicReadRequest(
      
      callback: BLEPeripheralServer.onCharacteristicReadRequest.Callback,
    ): void
    
    onCharacteristicSubscribed(
      
      callback: BLEPeripheralServer.onCharacteristicSubscribed.Callback,
    ): void
    
    onCharacteristicUnsubscribed(
      
      callback: BLEPeripheralServer.onCharacteristicUnsubscribed.Callback,
    ): void
    
    onCharacteristicWriteRequest(
      
      callback: BLEPeripheralServer.onCharacteristicWriteRequest.Callback,
    ): void
    
    removeService(option: BLEPeripheralServer.removeService.Option): Promise<NebulaGeneral.BluetoothError>
    
    startAdvertising(option: BLEPeripheralServer.startAdvertising.Option): Promise<NebulaGeneral.BluetoothError>
    
    stopAdvertising(option: BLEPeripheralServer.stopAdvertising.Option): Promise<NebulaGeneral.BluetoothError>
    
    writeCharacteristicValue(option: BLEPeripheralServer.writeCharacteristicValue.Option): Promise<NebulaGeneral.BluetoothError>
  }

  namespace BLEPeripheralServer {
    namespace addService {
      interface Option {
        
        service: service
        
        
        
      }
      interface service {
        
        uuid: string
        
        characteristics: characteristic[]
      }
      interface characteristic {
        
        uuid: string
        
        properties?: properties
        
        permission?: characteristicPermission
        
        value?: ArrayBuffer
        
        descriptors?: descriptor[]
      }
      
      interface properties {
        
        write?: boolean
        
        writeNoResponse?: boolean
        
        read?: boolean
        
        notify?: boolean
        
        indicate?: boolean
      }
      
      interface characteristicPermission {
        
        readable?: boolean
        
        writeable?: boolean
        
        readEncryptionRequired?: boolean
        
        writeEncryptionRequired?: boolean
      }
      
      interface descriptor {
        
        uuid: string
        
        permission?: descriptorPermission
        
        value: ArrayBuffer
      }
      
      interface descriptorPermission {
        
        write?: boolean
        
        read?: boolean
      }
    }
    namespace close {
      interface Option {
        
        
        
      }
    }
    namespace onCharacteristicReadRequest {
      
      type Callback = (
        result: CallbackResult,
      ) => void

      interface CallbackResult {
        
        serviceId: string
        
        characteristicId: string
        
        callbackId: number
      }
    }
    namespace onCharacteristicSubscribed {
      
      type Callback = (
        result: CallbackResult,
      ) => void

      interface CallbackResult {
        
        serviceId: string
        
        characteristicId: string
      }
    }
    namespace onCharacteristicUnsubscribed {
      
      type Callback = (
        result: CallbackResult,
      ) => void

      interface CallbackResult {
        
        serviceId: string
        
        characteristicId: string
      }
    }
    namespace onCharacteristicWriteRequest {
      
      type Callback = (
        result: CallbackResult,
      ) => void

      interface CallbackResult {
        
        serviceId: string
        
        characteristicId: string
        
        callbackId: number
        
        value: ArrayBuffer
      }
    }
    namespace removeService {
      interface Option {
        
        serviceId: string
        
        
        
      }
    }
    namespace startAdvertising {
      interface Option {
        
        advertiseRequest: advertiseRequest
        
        powerLevel?: keyof PowerLevel
        
        
        
      }
      
      interface advertiseRequest {
        
        connectable?: boolean
        
        deviceName?: string
        
        serviceUuids?: string[]
        
        manufacturerData?: manufacturerData[]
        
        beacon?: beacon
      }
      
      interface manufacturerData {
        
        manufacturerId: string
        
        manufacturerSpecificData?: ArrayBuffer
      }
      
      interface beacon {
        
        uuid: string
        
        major: number
        
        minor: number
        
        measuredPower?: number
      }
      
      interface PowerLevel {
        
        low
        
        medium
        
        high
      }
    }
    namespace stopAdvertising {
      interface Option {
        
        
        
      }
    }
    namespace writeCharacteristicValue {
      interface Option {
        
        serviceId: string
        
        characteristicId: string
        
        value: ArrayBuffer
        
        needNotify: boolean
        
        callbackId?: number
        
        
        
      }
    }
  }

  interface NebulaStatic {
    
    onBLEPeripheralConnectionStateChanged(
      
      callback: onBLEPeripheralConnectionStateChanged.Callback,
    ): void

    
     offBLEPeripheralConnectionStateChanged(
      
      callback?: onBLEPeripheralConnectionStateChanged.Callback,
    ): void

    
     createBLEPeripheralServer(
      option: createBLEPeripheralServer.Option,
    ): Promise<createBLEPeripheralServer.SuccessCallbackResult>
  }
}
