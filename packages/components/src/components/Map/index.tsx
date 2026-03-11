/**
 * Map component [EXPERIMENTAL]
 *
 * Uses Google Maps for both Android and iOS.
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/map.html
 * @see https://docs.expo.io/versions/v27.0.0/sdk/map-view
 * @see https://github.com/react-community/react-native-maps
 *
 * Colors do not support 8-digit hex values.
 *
 * ✔ longitude
 * ✔ latitude
 * ✘ scale
 * ✔ markers (partial support)
 * ✔ polyline (partial property support)
 * ✔ polygons (zIndex is not supported)
 * ✔ circles
 * ✘ includePoints
 * ✔ showLocation
 * ✘ subkey
 * ✘ enable3D
 * ✔ showCompass
 * ✘ enableOverlooking
 * ✔ enableZoom
 * ✔ enableScroll
 * ✔ enableRotate
 * ✔ onMarkerClick (onMarkerTap)
 * ✔ onCalloutClick (onCalloutTap)
 * ✘ onControlClick (onControlTap)
 * ✔ onRegionChange (causedBy is not supported)
 * ✔ onClick (onTap)
 * ✔ onUpdated
 * ✔ onPoiClick (onPoiTap)
 */

import * as React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
// @ts-ignore // The type definitions for MapView have not been created.
import MapView, { Callout, Circle, MapEvent, Marker, Polygon, Polyline } from 'react-native-maps'

import { noop } from '../../utils'

const { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

const styles = StyleSheet.create({
  map: {
    flex: 1
  }
})

/**
 * Marker callout.
 */
type Callouts = {
  content?: string
  color?: string
  fontSize?: number
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  bgColor?: string
  padding?: number
  display?: 'BYCLICK' | 'ALWAYS'
  textAlign?: 'left' | 'right' | 'center'
}

/**
 * Marker.
 */
type MarkerItem = {
  id?: number
  latitude: number
  longitude: number
  title?: string
  iconPath: string
  rotate?: number
  alpha?: number
  callout?: Callouts
  anchor?: { x: number, y: number }
}

/**
 * Polyline.
 */
type PolylineItem = {
  points: Array<{ latitude: number, longitude: number }>
  color?: string
  width?: number
}

/**
 * Polygon.
 */
type PolygonItem = {
  points: Array<{ latitude: number, longitude: number }>
  strokeWidth?: number
  strokeColor?: string
  fillColor?: string
}

/**
 * Circle.
 */
type CircleItem = {
  latitude: number
  longitude: number
  color?: string
  fillColor?: string
  radius: number
  strokeWidth?: number
}

/**
 * Coordinate.
 */
type Coordinate = {
  latitude: number
  longitude: number
}

export interface Props {
  longitude: number
  latitude: number
  scale?: number
  markers?: Array<MarkerItem>
  polyline?: Array<PolylineItem>
  polygons?: Array<PolygonItem>
  circles?: Array<CircleItem>
  includePoints?: Array<Coordinate>
  showLocation?: boolean
  subkey?: string
  enable3D?: boolean
  showCompass?: boolean
  enableOverlooking?: boolean
  enableZoom?: boolean
  enableScroll?: boolean
  enableRotate?: boolean

  onMarkerClick?(markerId?: number): void
  onCalloutClick?(markerId?: number): void
  onControlClick?(controlId?: number): void
  onRegionChange?(event: { type: 'begin' | 'end', timeStamp: number, causedBy?: 'scale' | 'drag' | 'update' }): void
  onClick?(coordinate: Coordinate): void
  onUpdated?(): void
  onPoiClick?(): void
}

const MapComp = (props: Props): JSX.Element => {
  const {
    latitude = 0,
    longitude = 0,
    markers = [],
    polyline = [],
    polygons = [],
    circles = [],
    showLocation,
    showCompass,
    enableZoom = true,
    enableScroll = true,
    enableRotate,
    onMarkerClick = noop,
    onCalloutClick = noop,
    onRegionChange = noop,
    onClick = noop,
    onUpdated = noop,
    onPoiClick = noop,
  } = props

  const getCallout = React.useCallback((marker: MarkerItem): JSX.Element | null => {
    const { id, callout } = marker
    if (!callout) return null

    return (
      <Callout onPress={() => onCalloutClick(id)}>
        <View
          style={{
            borderRadius: callout.borderRadius,
            borderWidth: callout.borderWidth,
            borderColor: callout.borderColor,
            backgroundColor: callout.bgColor,
            padding: callout.padding
          }}
        >
          <Text
            style={{
              fontSize: callout.fontSize,
              color: callout.color,
              textAlign: callout.textAlign
            }}
          >
            {callout.content}
          </Text>
        </View>
      </Callout>
    )
  }, [onCalloutClick])

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }}
      region={{
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }}
      minZoomLevel={5}
      maxZoomLevel={18}
      showsUserLocation={showLocation}
      showsCompass={showCompass}
      zoomEnabled={enableZoom}
      scrollEnabled={enableScroll}
      rotateEnabled={enableRotate}
      onRegionChange={() => onRegionChange({ type: 'begin', timeStamp: Date.now() })}
      onRegionChangeComplete={() => onRegionChange({ type: 'end', timeStamp: Date.now() })}
      onPress={(e: MapEvent) => onClick(e.nativeEvent.coordinate)}
      onMapReady={onUpdated}
      onPoiClick={onPoiClick}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude
          }}
          title={marker.title}
          image={{ uri: marker.iconPath }}
          rotation={marker.rotate}
          opacity={marker.alpha}
          anchor={marker.anchor}
          onPress={() => onMarkerClick(marker.id)}
        >
          {getCallout(marker)}
        </Marker>
      ))}
      {polyline.map((p, index) => (
        <Polyline
          key={`polyline_${index}`}
          coordinates={p.points}
          strokeColor={p.color}
          strokeWidth={p.width}
        />
      ))}
      {polygons.map((p, index) => (
        <Polygon
          key={`polygon_${index}`}
          coordinates={p.points}
          strokeColor={p.strokeColor}
          strokeWidth={p.strokeWidth}
          fillColor={p.fillColor}
        />
      ))}
      {circles.map((c, index) => (
        <Circle
          key={`circle_${index}`}
          center={{ latitude: c.latitude, longitude: c.longitude }}
          strokeColor={c.color}
          fillColor={c.fillColor}
          radius={c.radius}
          strokeWidth={c.strokeWidth}
        />
      ))}
    </MapView>
  )
}

export default MapComp
