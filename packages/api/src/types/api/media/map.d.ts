import { MapProps } from '@tarojs/components';
import Nebula from '../../index'

declare module '../../index' {
  
  interface MapContext {
    
    getCenterLocation(option?: MapContext.GetCenterLocationOption): Promise<MapContext.GetCenterLocationSuccessCallbackResult>

    
    setLocMarkerIcon(option?: MapContext.SetLocMarkerIconOption): Promise<NebulaGeneral.CallbackResult>

    
    moveToLocation(option: MapContext.MoveToLocationOption): Promise<NebulaGeneral.CallbackResult>

    
    translateMarker(option: MapContext.TranslateMarkerOption): Promise<NebulaGeneral.CallbackResult>

    
    moveAlong(object)

    
    includePoints(option: MapContext.IncludePointsOption): Promise<NebulaGeneral.CallbackResult>

    
    getRegion(option?: MapContext.GetRegionOption): Promise<MapContext.GetRegionSuccessCallbackResult>

    
    getRotate(option?: MapContext.GetRotateOption): Promise<MapContext.GetRotateSuccessCallbackResult>

    
    getSkew(option?: MapContext.GetSkewOption): Promise<MapContext.GetSkewSuccessCallbackResult>

    
    getScale(option?: MapContext.GetScaleOption): Promise<MapContext.GetScaleSuccessCallbackResult>

    
    setCenterOffset(option: MapContext.SetCenterOffsetOption): Promise<NebulaGeneral.CallbackResult>

    
    removeCustomLayer(option: MapContext.RemoveCustomLayerOption): Promise<NebulaGeneral.CallbackResult>

    
    addCustomLayer(option: MapContext.AddCustomLayerOption): Promise<NebulaGeneral.CallbackResult>

    
    addGroundOverlay(option: MapContext.AddGroundLayerOption): Promise<NebulaGeneral.CallbackResult>

    
    addVisualLayer(option: MapContext.AddVisualLayerOption): Promise<NebulaGeneral.CallbackResult>

    
    removeVisualLayer(option: MapContext.RemoveVisualLayerOption): Promise<NebulaGeneral.CallbackResult>

    
    addArc(option: MapContext.AddArcOption): Promise<NebulaGeneral.CallbackResult>

    
    removeArc(option: MapContext.RemoveArcOption): Promise<NebulaGeneral.CallbackResult>

    
    setBoundary(option: MapContext.SetBoundaryOption): Promise<NebulaGeneral.CallbackResult>

    
    updateGroundOverlay(option: MapContext.UpdateGroundOverlayOption): Promise<NebulaGeneral.CallbackResult>

    
    removeGroundOverlay(option: MapContext.RemoveGroundOverlayOption): Promise<NebulaGeneral.CallbackResult>

    
    toScreenLocation(option: MapContext.ToScreenLocationOption): Promise<NebulaGeneral.CallbackResult>

    
    fromScreenLocation(option: MapContext.FromScreenLocationOption): Promise<NebulaGeneral.CallbackResult>

    
    openMapApp(option: MapContext.OpenMapAppOption): Promise<NebulaGeneral.CallbackResult>

    
    addMarkers(option: MapContext.AddMarkersOption): Promise<NebulaGeneral.CallbackResult>

    
    removeMarkers(option: MapContext.RemoveMarkersOption): Promise<NebulaGeneral.CallbackResult>

    
    initMarkerCluster(option?: MapContext.InitMarkerClusterOption): Promise<NebulaGeneral.CallbackResult>

    
    on(
      
      event: keyof MapContext.MapEvent,
      
      callback: (res: MapContext.MapEvent[keyof MapContext.MapEvent]) => void
    ): void
  }
  namespace MapContext {
    interface GetCenterLocationOption {
      
      
      
        result: GetCenterLocationSuccessCallbackResult,
      ) => void
    }
    interface GetCenterLocationSuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      latitude: number
      
      longitude: number
      
      errMsg: string
    }
    interface SetLocMarkerIconOption {
      
      iconPath: string
      
      
      
    }
    interface GetRegionOption {
      
      
      
        result: GetRegionSuccessCallbackResult,
      ) => void
    }
    interface GetRegionSuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      northeast: MapPosition
      
      southwest: MapPosition
    }
    interface GetRotateOption {
      
      
      
        result: GetRotateSuccessCallbackResult,
      ) => void
    }
    interface GetRotateSuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      rotate: number
      
      errMsg: string
    }
    interface GetScaleOption {
      
      
      
        result: GetScaleSuccessCallbackResult,
      ) => void
    }
    interface GetScaleSuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      scale: number
      
      errMsg: string
    }
    interface GetSkewOption {
      
      
      
    }
    interface GetSkewSuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      skew: number
      
      errMsg: string
    }
    interface IncludePointsOption {
      
      points: MapPosition[]
      
      
      
      padding?: number[]
      
    }
    
    interface MapPosition {
      
      latitude: number
      
      longitude: number
    }
    
    interface MapBoundary {
      
      southwest: MapPosition
      
      northeast: MapPosition
    }
    interface MoveToLocationOption {
      
      
      
      latitude?: number
      
      longitude?: number
      
    }
    interface TranslateMarkerOption {
      
      autoRotate: boolean
      
      destination: MapPosition
      
      markerId: number
      
      rotate: number
      
      animationEnd?: (...args: any[]) => any
      
      
      duration?: number
      
      
    }
    interface SetCenterOffsetOption {
      
      offset: number[]
      
      
      
    }
    interface RemoveCustomLayerOption {
      
      layerId: number
      
      
      
    }
    interface AddCustomLayerOption {
      
      layerId: number
      
      
      
    }
    interface AddGroundLayerOption {
      
      id: number
      
      src: string
      
      bounds: MapBoundary
      
      visible?: boolean
      
      zIndex?: number
      
      opacity?: number
      
      
      
    }
    interface AddVisualLayerOption {
      
      layerId: number
      
      interval?: number
      
      zIndex?: number
      
      opacity?: number
      
      
      
    }
    interface RemoveVisualLayerOption {
      
      layerId: number
      
      
      
    }
    interface AddArcOption {
      
      id: number
      
      start: MapPosition
      
      end: MapPosition
      
      pass?: MapPosition
      
      angle?: number
      
      width?: number
      
      color?: string
      
      
      
    }
    interface RemoveArcOption {
      
      id: number
      
      
      
    }
    interface SetBoundaryOption {
      
      southwest: MapPosition
      
      northeast: MapPosition
      
      
      
    }
    interface UpdateGroundOverlayOption {
      
      id: number
      
      src: string
      
      bounds: MapBoundary
      
      visible?: boolean
      
      zIndex?: number
      
      opacity?: number
      
      
      
    }
    interface RemoveGroundOverlayOption {
      
      id: number
      
      
      
    }
    interface ToScreenLocationOption {
      
      latitude: number
      
      longitude: number
      
      
      
    }
    interface FromScreenLocationOption {
      
      x: number
      
      y: number
      
      
      
    }
    interface OpenMapAppOption {
      
      longitude: number
      
      latitude: number
      
      destination: string
      
      
      
    }
    interface AddMarkersOption {
      
      markers: MapProps.marker[]
      
      clear?: boolean
      
      
      
    }
    interface RemoveMarkersOption {
      
      markerIds: number[]
      
      
      
    }
    interface InitMarkerClusterOption {
      
      enableDefaultStyle?: boolean
      
      zoomOnClick?: boolean
      
      gridSize?: number
      
      
      
    }
    
    interface MapEvent {
      
      markerClusterCreate: MapEventMarkerClusterCreate
      
      markerClusterClick: MapEventMarkerClusterClick
    }
    interface MapEventMarkerClusterCreate {
      
      clusters: ClusterInfo[]
    }
    interface MapEventMarkerClusterClick {
      
      cluster: ClusterInfo
    }
    interface ClusterInfo {
      
      clusterId: number
      
      center: LatLng
      
      markerIds: number[]
    }
    interface LatLng {
      
      lat: number
      
      lng: number
    }
  }

  interface NebulaStatic {
    
    createMapContext(
      
      mapId: string,
      
      component?: NebulaGeneral.IAnyObject,
    ): MapContext
  }
}
