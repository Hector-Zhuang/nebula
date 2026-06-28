import React from 'react';
import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import {
  Map as NebulaMap,
  MarkerItem,
  CircleItem,
  PolylineItem,
} from '@nebula-rn/components';

export default function ComponentsMapPage() {
  const [mapRegion, setMapRegion] = React.useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });

  const markers: MarkerItem[] = [
    {
      id: 1,
      latitude: 37.78825,
      longitude: -122.4324,
      title: 'San Francisco',
      iconPath: '', // Required by MarkerItem interface
      callout: {
        content: 'Main marker',
        padding: 10,
        bgColor: '#ffffff',
      },
    },
    {
      id: 2,
      latitude: 37.79,
      longitude: -122.42,
      title: 'Ferry Building',
      iconPath: '',
    },
  ];

  const polylines: PolylineItem[] = [
    {
      points: [
        { latitude: 37.78825, longitude: -122.4324 },
        { latitude: 37.79, longitude: -122.42 },
        { latitude: 37.785, longitude: -122.42 },
      ],
      color: '#3b82f6',
      width: 2,
    },
  ];

  const circles: CircleItem[] = [
    {
      latitude: 37.78825, // Interface expects flat lat/lng, not a center object
      longitude: -122.4324,
      radius: 100,
      fillColor: 'rgba(59, 130, 246, 0.2)',
      color: '#3b82f6', // interface uses 'color' for stroke
      strokeWidth: 2,
    },
  ];

  const onHandleMarkerClick = (markerId: number) => {
    console.log('Marker tapped:', markerId);
    Alert.alert('Marker', `Marker ${markerId} tapped`);
  };

  const onHandleCalloutClick = (markerId: number) => {
    console.log('Callout tapped:', markerId);
    Alert.alert('Callout', `Callout for marker ${markerId} tapped`);
  };

  const onHandleMapClick = (coordinate: {
    latitude: number;
    longitude: number;
  }) => {
    console.log('Map clicked at:', coordinate);
    setMapRegion(coordinate);
    Alert.alert(
      'Map Clicked',
      `Latitude: ${coordinate.latitude.toFixed(4)}, Longitude: ${coordinate.longitude.toFixed(4)}`,
    );
  };

  const onHandleRegionChange = (event: { type: string; causedBy?: string }) => {
    console.log('Region event:', event.type, 'caused by:', event.causedBy);
  };

  const onHandleMapUpdated = () => {
    console.log('Map updated');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🗺️ Map Component</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Interactive Map</Text>
        <Text style={styles.hint}>view map with markers and shapes</Text>

        <View style={styles.mapContainer}>
          <NebulaMap
            longitude={mapRegion.longitude}
            latitude={mapRegion.latitude}
            showLocation={true}
            showCompass={true}
            enableZoom={true}
            enableScroll={true}
            enableRotate={true}
            markers={markers}
            polyline={polylines}
            circles={circles}
            onMarkerClick={onHandleMarkerClick}
            onCalloutClick={onHandleCalloutClick}
            onRegionChange={onHandleRegionChange}
            onClick={onHandleMapClick}
            onUpdated={onHandleMapUpdated}
          />
        </View>

        <View style={styles.spacer} />
        <Text style={styles.meta}>
          📍 Latitude: {mapRegion.latitude.toFixed(4)}
        </Text>
        <Text style={styles.meta}>
          📍 Longitude: {mapRegion.longitude.toFixed(4)}
        </Text>
      </View>

      {/* Map Features Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Map Features</Text>
        <Text style={styles.hint}>supported features and elements</Text>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📌</Text>
            <Text style={styles.featureText}>Markers</Text>
            <Text style={styles.featureDesc}>Point locations with popups</Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📍</Text>
            <Text style={styles.featureText}>Current Location</Text>
            <Text style={styles.featureDesc}>Show user position</Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⭕</Text>
            <Text style={styles.featureText}>Circles</Text>
            <Text style={styles.featureDesc}>Circular regions</Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>〰️</Text>
            <Text style={styles.featureText}>Polylines</Text>
            <Text style={styles.featureDesc}>Connected lines</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5fbff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 10,
  },
  hint: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 10,
  },
  mapContainer: {
    width: '100%',
    height: 400,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f4f8',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  spacer: {
    height: 8,
  },
  meta: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureItem: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
});
