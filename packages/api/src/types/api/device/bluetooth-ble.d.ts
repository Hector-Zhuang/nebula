import Nebula from '../../index'

declare module '../../index' {
  namespace writeBLECharacteristicValue {
    interface Promised extends NebulaGeneral.BluetoothError {
      
      errMsg: string
    }
    interface Option {
      
      characteristicId: string
      
      deviceId: string
      
      serviceId: string
      
      value: ArrayBuffer
      
      writeType?: keyof WriteType
      
      
      
    }
    interface WriteType {
      
      write
      
      writeNoResponse
    }
  }

  namespace setBLEMTU {
    type Promised = FailCallbackResult | SuccessCallbackResult
    interface Option {
      
      deviceId: string
      
      mtu: number
      
      
      
    }
    interface FailCallbackResult extends NebulaGeneral.BluetoothError {
      
      mtu: string
    }
    interface SuccessCallbackResult extends NebulaGeneral.BluetoothError {
      
      mtu: string
    }
  }

  namespace readBLECharacteristicValue {
    interface Option {
      
      characteristicId: string
      
      deviceId: string
      
      serviceId: string
      
      
      
    }
  }

  namespace onBLEMTUChange {
    interface CallbackResult {
      
      deviceId: string
      
      mtu: string
    }
    
    type Callback = (
      result: CallbackResult,
    ) => void
  }

  namespace onBLEConnectionStateChange {
    interface CallbackResult {
      
      connected: boolean
      
      deviceId: string
    }
    
    type Callback = (
      result: CallbackResult,
    ) => void
  }

  namespace onBLECharacteristicValueChange {
    
    type Callback = (
      result: CallbackResult,
    ) => void
    interface CallbackResult {
      
      characteristicId: string
      
      deviceId: string
      
      serviceId: string
      
      value: ArrayBuffer
    }
  }

  namespace notifyBLECharacteristicValueChange {
    interface Promised extends NebulaGeneral.BluetoothError {
      
      errMsg: string
    }
    interface Option {
      
      characteristicId: string
      
      deviceId: string
      
      serviceId: string
      
      state: boolean
      
      type?: keyof Type
      
      
      
    }
    interface Type {
      notification
      indication
    }
  }

  namespace getBLEMTU {
    interface Option {
      
      deviceId: string
      
      writeType?: keyof WriteType
      
      
      
        result: SuccessCallbackResult,
      ) => void
    }
    interface SuccessCallbackResult extends NebulaGeneral.BluetoothError {
      
      mtu: number
    }
    
    interface WriteType {
      
      write
      
      writeNoResponse
    }
  }

  namespace getBLEDeviceServices {
    interface Option {
      
      deviceId: string
      
      
      
        result: SuccessCallbackResult,
      ) => void
    }
    interface SuccessCallbackResult extends NebulaGeneral.BluetoothError {
      
      services: BLEService[]
      
      errMsg: string
    }
    
    interface BLEService {
      
      isPrimary: boolean
      
      uuid: string
    }
  }

  namespace getBLEDeviceRSSI {
    interface Option {
      
      deviceId: string
      
      
      
        result: SuccessCallbackResult,
      ) => void
    }
    interface SuccessCallbackResult extends NebulaGeneral.BluetoothError {
      
      RSSI: number
    }
  }

  namespace getBLEDeviceCharacteristics {
    interface Option {
      
      deviceId: string
      
      serviceId: string
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.BluetoothError {
      
      characteristics: BLECharacteristic[]
      
      errMsg: string
    }
    
    interface BLECharacteristic {
      
      properties: Properties
      
      uuid: string
    }
    
    interface Properties {
      
      indicate: boolean
      
      notify: boolean
      
      read: boolean
      
      write: boolean
      
      writeNoResponse: boolean
      
      writeDefault: boolean
    }
  }

  namespace createBLEConnection {
    interface Promised extends NebulaGeneral.BluetoothError {
      
      errMsg: string
    }
    interface Option {
      
      deviceId: string
      
      
      
      
      timeout?: number
    }
  }

  namespace closeBLEConnection {
    interface Promised extends NebulaGeneral.BluetoothError {
      
      errMsg: string
    }
    interface Option {
      
      deviceId: string
      
      
      
    }
  }

  interface NebulaStatic {
    
    writeBLECharacteristicValue(
      option: writeBLECharacteristicValue.Option,
    ): Promise<writeBLECharacteristicValue.Promised>

    
    setBLEMTU(
      option: setBLEMTU.Option,
    ): Promise<setBLEMTU.Promised>

    
    readBLECharacteristicValue(
      option: readBLECharacteristicValue.Option,
    ): Promise<NebulaGeneral.BluetoothError>

    
    onBLEMTUChange(
      
      callback: onBLEMTUChange.Callback,
    ): void

    
    onBLEConnectionStateChange(
      
      callback: onBLEConnectionStateChange.Callback,
    ): void

    
    onBLECharacteristicValueChange(
      
      callback: onBLECharacteristicValueChange.Callback,
    ): void

    
    offBLEMTUChange(
      
      callback?: onBLEMTUChange.Callback,
    ): void

    
    offBLEConnectionStateChange(
      
      callback?: onBLEConnectionStateChange.Callback,
    ): void

    
    offBLECharacteristicValueChange(
      
      callback: onBLECharacteristicValueChange.Callback,
    ): void

    
    notifyBLECharacteristicValueChange(
      option: notifyBLECharacteristicValueChange.Option,
    ): Promise<notifyBLECharacteristicValueChange.Promised>

    
     getBLEMTU(
      option: getBLEMTU.Option,
    ): Promise<getBLEMTU.SuccessCallbackResult>

    
    getBLEDeviceServices(
      option: getBLEDeviceServices.Option,
    ): Promise<getBLEDeviceServices.SuccessCallbackResult>

    
    getBLEDeviceRSSI(
      option: getBLEDeviceRSSI.Option,
    ): Promise<getBLEDeviceRSSI.SuccessCallbackResult>

    
    getBLEDeviceCharacteristics(
      option: getBLEDeviceCharacteristics.Option,
    ): Promise<getBLEDeviceCharacteristics.SuccessCallbackResult>

    
    createBLEConnection(option: createBLEConnection.Option): Promise<createBLEConnection.Promised>

    
    closeBLEConnection(option: closeBLEConnection.Option): Promise<closeBLEConnection.Promised>
  }
}
