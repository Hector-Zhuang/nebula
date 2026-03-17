import Nebula from '../../index'

declare module '../../index' {
  namespace openLocation {
    interface Option {
      
      latitude: number
      
      longitude: number
      
      scale?: number
      
      name?: string
      
      address?: string
      
      ignoredApps?: Array<any>
      
      
      
    }
  }

  namespace getLocation {
    interface Option {
      
      altitude?: boolean
      
      
      
      highAccuracyExpireTime?: number
      
      isHighAccuracy?: boolean
      
      
      type?: string
      
      needFullAccuracy?: boolean
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      accuracy: number
      
      altitude: number
      
      horizontalAccuracy: number
      
      latitude: number
      
      longitude: number
      
      speed: number
      
      verticalAccuracy: number
      
      street?: string
      
      cityCode?: string
      
      city?: string
      
      country?: string
      
      countryCode?: string
      
      province?: string
      
      streetNumber?: string
      
      district?: string
      
      isFullAccuracy?: boolean
      
      errMsg: string
    }
  }

  namespace choosePoi {
    interface Option {
      
      
      
    }

    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      type: number
      
      city: number
      
      name: string
      
      address: string
      
      latitude: number
      
      longitude: number
    }
  }

  namespace chooseLocation {
    interface Option {
      
      latitude?: number
      
      longitude?: number
      
      mapOpts?: Record<string, unknown>
      
      title?: string
      
      
      
    }

    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      address: string
      
      latitude: number
      
      longitude: number
      
      name: string
      
      adCode?: number
      
      adName?: string
      
      cityCode?: string
      
      cityName?: string
      
      provinceCode?: number
      
      provinceName?: string
      
      errMsg: string
    }
  }

  namespace stopLocationUpdate {
    interface Option {
      
      
      
    }
  }

  namespace startLocationUpdateBackground {
    interface Option {
      
      type?: string
      
      
      
    }
  }

  namespace startLocationUpdate {
    interface Option {
      
      type?: string
      
      needFullAccuracy?: boolean
      
      
      
    }
  }

  namespace onLocationChangeError {
    
    type Callback = (
      result: CallbackResult,
    ) => void

    interface CallbackResult {
      
      errCode: number
      
      errMsg?: string
    }
  }

  namespace onLocationChange {
    
    type Callback = (
      result: CallbackResult,
    ) => void

    interface CallbackResult {
      
      accuracy: number
      
      altitude: number
      
      horizontalAccuracy: number
      
      latitude: number
      
      longitude: number
      
      speed: number
      
      verticalAccuracy: number
      
      street?: string
      
      cityCode?: string
      
      city?: string
      
      country?: string
      
      countryCode?: string
      
      province?: string
      
      streetNumber?: string
      
      district?: string
      
      isFullAccuracy?: boolean
    }
  }

  namespace getFuzzyLocation {
    interface Option {
      
      type?: keyof Type
      
      
      
    }

    interface Type {
      
      wgs84
      
      gcj02
    }

    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      latitude: number
      
      longitude: number
    }
  }

  interface NebulaStatic {
    
    stopLocationUpdate(option?: stopLocationUpdate.Option): void

    
    startLocationUpdateBackground(
      option?: startLocationUpdateBackground.Option,
    ): void

    
    startLocationUpdate(option?: startLocationUpdate.Option): void

    
    openLocation(option: openLocation.Option): Promise<NebulaGeneral.CallbackResult>

    
    onLocationChangeError(
      
      callback: onLocationChangeError.Callback,
    ): void

    
    onLocationChange(
      
      callback: onLocationChange.Callback,
    ): void

    
    offLocationChangeError(
      
      callback?: onLocationChangeError.Callback,
    ): void

    
    offLocationChange(
      
      callback?: onLocationChange.Callback,
    ): void

    
    getLocation(option: getLocation.Option): Promise<getLocation.SuccessCallbackResult>

    
    choosePoi(option: choosePoi.Option): Promise<choosePoi.SuccessCallbackResult>

    
    chooseLocation(option: chooseLocation.Option): Promise<chooseLocation.SuccessCallbackResult>

    
    getFuzzyLocation(option: getFuzzyLocation.Option): Promise<getFuzzyLocation.SuccessCallbackResult>
  }
}
