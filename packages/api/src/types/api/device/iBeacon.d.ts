import Nebula from '../../index'

declare module '../../index' {
  namespace stopBeaconDiscovery {
    interface Option {
      
      
      
    }
  }

  namespace startBeaconDiscovery {
    interface Option {
      
      uuids: string[]
      
      
      
      ignoreBluetoothAvailable?: boolean
      
    }
  }

  namespace onBeaconUpdate {
    
    type Callback = (result: CallbackResult) => void

    interface CallbackResult {
      
      beacons: IBeaconInfo[]
    }
  }

  namespace onBeaconServiceChange {
    
    type Callback = (
      result: CallbackResult,
    ) => void

    interface CallbackResult {
      
      available: boolean
      
      discovering: boolean
    }
  }

  namespace getBeacons {
    interface Option {
      
      
      
    }

    interface CallbackResult extends NebulaGeneral.IBeaconError {
      
      beacons: IBeaconInfo[]
      
      errMsg: string
    }
  }

  interface IBeaconInfo {
    
    uuid: string
    
    major: string
    
    minor: string
    
    proximity: keyof IBeaconInfo.Proximity
    
    accuracy: number
    
    rssi: number
  }

  namespace IBeaconInfo {
    
    interface Proximity {
      
      0
      
      1
      
      2
      
      3
    }
  }

  interface NebulaStatic {
    
    stopBeaconDiscovery(option?: stopBeaconDiscovery.Option): Promise<NebulaGeneral.IBeaconError>

    
    startBeaconDiscovery(option: startBeaconDiscovery.Option): Promise<NebulaGeneral.IBeaconError>

    
    onBeaconUpdate(
      
      callback: onBeaconUpdate.Callback,
    ): void

    
    onBeaconServiceChange(
      
      callback: onBeaconServiceChange.Callback,
    ): void

    
    offBeaconUpdate(
      
      callback: (res: NebulaGeneral.IBeaconError) => void,
    ): void

    
    offBeaconServiceChange(
      
      callback: (res: NebulaGeneral.IBeaconError) => void,
    ): void

    
    getBeacons(option?: getBeacons.Option): Promise<getBeacons.CallbackResult>
  }
}
