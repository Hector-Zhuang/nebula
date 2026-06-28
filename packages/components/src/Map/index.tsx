import React, { useCallback, FC } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, {
  Callout,
  Circle,
  Marker,
  Polygon,
  Polyline,
  Region,
  MapPressEvent,
  Details,
} from 'react-native-maps';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export interface CalloutItem {
  content?: string;
  color?: string;
  fontSize?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  bgColor?: string;
  padding?: number;
  display?: 'BYCLICK' | 'ALWAYS';
  textAlign?: 'left' | 'right' | 'center';
}

export interface MarkerItem {
  id: number;
  latitude: number;
  longitude: number;
  title?: string;
  iconPath: string;
  rotate?: number;
  alpha?: number;
  callout?: CalloutItem;
  anchor?: { x: number; y: number };
}

export interface PolylineItem {
  points: Array<{ latitude: number; longitude: number }>;
  color?: string;
  width?: number;
}

export interface PolygonItem {
  points: Array<{ latitude: number; longitude: number }>;
  strokeWidth?: number;
  strokeColor?: string;
  fillColor?: string;
}

export interface CircleItem {
  latitude: number;
  longitude: number;
  color?: string;
  fillColor?: string;
  radius: number;
  strokeWidth?: number;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface MapProps {
  longitude: number;
  latitude: number;
  scale?: number;
  markers?: Array<MarkerItem>;
  polyline?: Array<PolylineItem>;
  polygons?: Array<PolygonItem>;
  circles?: Array<CircleItem>;
  includePoints?: Array<Coordinate>;
  showLocation?: boolean;
  subkey?: string;
  enable3D?: boolean;
  showCompass?: boolean;
  enableOverlooking?: boolean;
  enableZoom?: boolean;
  enableScroll?: boolean;
  enableRotate?: boolean;

  onMarkerClick?: (markerId: number) => void;
  onCalloutClick?: (markerId: number) => void;
  onControlClick?: (controlId?: number) => void;
  onRegionChange?: (event: {
    type: 'begin' | 'end';
    timeStamp: number;
    causedBy?: 'scale' | 'drag' | 'update';
  }) => void;
  onClick?: (coordinate: Coordinate) => void;
  onUpdated?: () => void;
  onPoiClick?: (event: any) => void;
}

export const Map: FC<MapProps> = props => {
  const {
    latitude = 0,
    longitude = 0,
    markers = [],
    polyline = [],
    polygons = [],
    circles = [],
    showLocation = false,
    showCompass = true,
    enableZoom = true,
    enableScroll = true,
    enableRotate = true,
    onMarkerClick,
    onCalloutClick,
    onRegionChange,
    onClick,
    onUpdated = () => {},
    onPoiClick = () => {},
  } = props;

  const onRenderCallout = useCallback(
    (marker: MarkerItem) => {
      const { id, callout } = marker;
      if (!callout) return null;

      return (
        <Callout onPress={() => onCalloutClick?.(id)}>
          <View
            style={[
              styles.calloutContainer,
              {
                borderRadius: callout.borderRadius,
                borderWidth: callout.borderWidth,
                borderColor: callout.borderColor,
                backgroundColor: callout.bgColor,
                padding: callout.padding,
              },
            ]}
          >
            <Text
              style={{
                fontSize: callout.fontSize,
                color: callout.color,
                textAlign: callout.textAlign,
              }}
            >
              {callout.content}
            </Text>
          </View>
        </Callout>
      );
    },
    [onCalloutClick],
  );

  const onHandleRegionChange = useCallback(
    (region: Region, details: Details) => {
      onRegionChange?.({
        type: 'begin',
        timeStamp: Date.now(),
        causedBy: details.isGesture ? 'drag' : 'update',
      });
    },
    [onRegionChange],
  );

  const onHandleRegionChangeComplete = useCallback(
    (region: Region, details: Details) => {
      onRegionChange?.({
        type: 'end',
        timeStamp: Date.now(),
        causedBy: details.isGesture ? 'drag' : 'update',
      });
    },
    [onRegionChange],
  );

  const onHandleMapPress = useCallback(
    (e: MapPressEvent) => {
      onClick?.(e.nativeEvent.coordinate);
    },
    [onClick],
  );

  const onHandleMarkerPress = useCallback(
    (id: number) => {
      onMarkerClick?.(id);
    },
    [onMarkerClick],
  );

  return (
    <MapView
      style={styles.map}
      region={{
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }}
      minZoomLevel={5}
      maxZoomLevel={18}
      showsUserLocation={showLocation}
      showsCompass={showCompass}
      zoomEnabled={enableZoom}
      scrollEnabled={enableScroll}
      rotateEnabled={enableRotate}
      onRegionChange={onHandleRegionChange}
      onRegionChangeComplete={onHandleRegionChangeComplete}
      onPress={onHandleMapPress}
      onMapReady={onUpdated}
      onPoiClick={onPoiClick}
    >
      {markers.map(marker => (
        <Marker
          id={`marker-${marker.id}`}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          image={marker.iconPath ? { uri: marker.iconPath } : undefined}
          rotation={marker.rotate}
          opacity={marker.alpha}
          anchor={marker.anchor}
          onPress={() => onHandleMarkerPress(marker.id)}
        >
          {onRenderCallout(marker)}
        </Marker>
      ))}

      {polyline.map((p, index) => (
        <Polyline
          id={`polyline-${index}`}
          coordinates={p.points}
          strokeColor={p.color}
          strokeWidth={p.width}
        />
      ))}

      {polygons.map((p, index) => (
        <Polygon
          id={`polygon-${index}`}
          coordinates={p.points}
          strokeColor={p.strokeColor}
          strokeWidth={p.strokeWidth}
          fillColor={p.fillColor}
        />
      ))}

      {circles.map((c, index) => (
        <Circle
          id={`circle-${index}`}
          center={{ latitude: c.latitude, longitude: c.longitude }}
          strokeColor={c.color}
          fillColor={c.fillColor}
          radius={c.radius}
          strokeWidth={c.strokeWidth}
        />
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  calloutContainer: {
    backgroundColor: 'white',
    minWidth: 100,
  },
});
