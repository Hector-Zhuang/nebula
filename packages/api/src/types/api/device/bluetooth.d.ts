import Nebula from '../../index'

declare module '../../index' {
  namespace stopBluetoothDevicesDiscovery {
    interface Promised extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
    interface Option {
      
      
      
    }
  }

  namespace startBluetoothDevicesDiscovery {
    interface Promised extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
    interface Option {
      
      allowDuplicatesKey?: boolean
      
      
      
      interval?: number
      
      services?: string[]
      
      powerLevel?: keyof PowerLevel
      
    }

    interface PowerLevel {
      
      low,
      
      medium,
      
      high
    }
  }

  namespace openBluetoothAdapter {
    interface Option {
      
      mode?: keyof Mode;
      
      
      
    }

    interface Mode {
      
      central
      
      peripheral
    }

    
    interface state {
      
      0
      
      1
      
      2
      
      3
      
      4
    }
  }

  namespace onBluetoothDeviceFound {
    
    type Callback = (
      result: CallbackResult,
    ) => void
    interface CallbackResult {
      
      devices: CallbackResultBlueToothDevice[]
    }
    
    interface CallbackResultBlueToothDevice {
      
      RSSI: number
      
      advertisData: ArrayBuffer
      
      advertisServiceUUIDs: string[]
      
      deviceId: string
      
      localName: string
      
      name: string
      
      serviceData: NebulaGeneral.IAnyObject
      
      connectable?: boolean
    }
  }

  namespace onBluetoothAdapterStateChange {
    
    type Callback = (
      result: CallbackResult,
    ) => void
    interface CallbackResult {
      
      available: boolean
      
      discovering: boolean
    }
  }

  namespace makeBluetoothPair {
    interface Option {
      
      deviceId: string
      
      pin: string
      
      timeout?: string
      
      
      
    }
  }

  namespace isBluetoothDevicePaired {
    interface Option {
      
      deviceId: string
      
      
      

    }
  }

  namespace getConnectedBluetoothDevices {
    interface Option {
      
      services: string[]
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      devices: BluetoothDeviceInfo[]
      
      errMsg: string
    }
    
    interface BluetoothDeviceInfo {
      
      deviceId: string
      
      name: string
    }
  }

  namespace getBluetoothDevices {
    interface Option {
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      devices: SuccessCallbackResultBlueToothDevice[]
      
      errMsg: string
    }
    
    interface SuccessCallbackResultBlueToothDevice extends NebulaGeneral.CallbackResult {
        
        RSSI: number
        
        advertisData: ArrayBuffer
        
        advertisServiceUUIDs: string[]
        
        deviceId: string
        
        localName: string
        
        name: string
        
        serviceData: NebulaGeneral.IAnyObject
        
        connectable?: boolean
    }
  }

  namespace getBluetoothAdapterState {
    interface Option {
      
      
      
    }

    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      available: boolean
      
      discovering: boolean
      
      errMsg: string
    }
  }

  namespace closeBluetoothAdapter {
    interface Option {
      
      
      
    }
  }

  interface NebulaStatic {
    
    stopBluetoothDevicesDiscovery(
      option?: stopBluetoothDevicesDiscovery.Option,
    ): Promise<stopBluetoothDevicesDiscovery.Promised>

    
    startBluetoothDevicesDiscovery(
      option: startBluetoothDevicesDiscovery.Option,
    ): Promise<startBluetoothDevicesDiscovery.Promised>

    
    openBluetoothAdapter(option?: openBluetoothAdapter.Option): Promise<NebulaGeneral.CallbackResult>

    
    onBluetoothDeviceFound(
      
      callback: onBluetoothDeviceFound.Callback,
    ): void

    
    onBluetoothAdapterStateChange(
      
      callback: onBluetoothAdapterStateChange.Callback,
    ): void

    
    offBluetoothDeviceFound(
      
      callback: onBluetoothDeviceFound.Callback,
    ): void
  
    
    offBluetoothAdapterStateChange(
      
      callback: onBluetoothAdapterStateChange.Callback,
    ): void
  
    
    makeBluetoothPair(option: makeBluetoothPair.Option): Promise<NebulaGeneral.CallbackResult>
  
    
    isBluetoothDevicePaired(option: isBluetoothDevicePaired.Option): Promise<NebulaGeneral.CallbackResult>

    
    getConnectedBluetoothDevices(
      option: getConnectedBluetoothDevices.Option,
    ): Promise<getConnectedBluetoothDevices.SuccessCallbackResult>

    
    getBluetoothDevices(option?: getBluetoothDevices.Option): Promise<getBluetoothDevices.SuccessCallbackResult>

    
    getBluetoothAdapterState(
      option?: getBluetoothAdapterState.Option,
    ): Promise<getBluetoothAdapterState.SuccessCallbackResult>

    
    closeBluetoothAdapter(option?: closeBluetoothAdapter.Option): Promise<NebulaGeneral.CallbackResult>
  }
}
