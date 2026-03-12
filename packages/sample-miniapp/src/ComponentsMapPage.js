import React from 'react';
import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { Map as NebulaMap } from '@nebula/components';

export default function ComponentsMapPage() {
  const [mapRegion, setMapRegion] = React.useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const markers = [
    {
      id: 1,
      latitude: 37.78825,
      longitude: -122.4324,
      title: 'San Francisco',
      description: 'Main marker',
    },
    {
      id: 2,
      latitude: 37.79,
      longitude: -122.42,
      title: 'Ferry Building',
      description: 'Landmark',
    },
  ];

  const polylines = [
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

  const circles = [
    {
      center: {
        latitude: 37.78825,
        longitude: -122.4324,
      },
      radius: 100,
      fillColor: 'rgba(59, 130, 246, 0.2)',
      strokeColor: '#3b82f6',
      strokeWidth: 2,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🗺️ Map Component</Text>

      {/* Basic Map */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Interactive Map</Text>
        <Text style={styles.hint}>view map with markers and shapes</Text>
        
        <View style={styles.mapContainer}>
          <NebulaMap
            longitude={mapRegion.longitude}
            latitude={mapRegion.latitude}
            style={styles.map}
            showLocation={true}
            showCompass={true}
            enableZoom={true}
            enableScroll={true}
            enableRotate={true}
            markers={markers}
            polyline={polylines}
            circles={circles}
            onMarkerClick={(e) => {
              console.log('Marker tapped:', e.markerId);
              Alert.alert('Marker', `Marker ${e.markerId} tapped`);
            }}
            onCalloutClick={(e) => {
              console.log('Callout tapped:', e.markerId);
              Alert.alert('Callout', `Callout for marker ${e.markerId} tapped`);
            }}
            onRegionChange={(e) => {
              console.log('Region changed:', e);
              setMapRegion(e.region);
            }}
            onClick={(e) => {
              console.log('Map clicked at:', e);
              Alert.alert('Map Clicked', `Latitude: ${e.latitude.toFixed(4)}, Longitude: ${e.longitude.toFixed(4)}`);
            }}
            onUpdated={() => {
              console.log('Map updated');
            }}
          />
        </View>

        <View style={styles.spacer} />
        <Text style={styles.meta}>📍 Latitude: {mapRegion.latitude.toFixed(4)}</Text>
        <Text style={styles.meta}>📍 Longitude: {mapRegion.longitude.toFixed(4)}</Text>
      </View>

      {/* Map Features */}
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

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔲</Text>
            <Text style={styles.featureText}>Polygons</Text>
            <Text style={styles.featureDesc}>Closed shapes</Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🧭</Text>
            <Text style={styles.featureText}>Compass</Text>
            <Text style={styles.featureDesc}>Navigation indicator</Text>
          </View>
        </View>
      </View>

      {/* Interaction Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>User Interactions</Text>
        <Text style={styles.hint}>supported interactions on the map</Text>

        <View style={styles.interactionList}>
          <View style={styles.interactionItem}>
            <Text style={styles.interactionIcon}>👆</Text>
            <View style={styles.interactionContent}>
              <Text style={styles.interactionTitle}>Tap Marker</Text>
              <Text style={styles.interactionDesc}>Displays marker information</Text>
            </View>
          </View>

          <View style={styles.interactionItem}>
            <Text style={styles.interactionIcon}>🔄</Text>
            <View style={styles.interactionContent}>
              <Text style={styles.interactionTitle}>Rotate Map</Text>
              <Text style={styles.interactionDesc}>Two-finger rotation</Text>
            </View>
          </View>

          <View style={styles.interactionItem}>
            <Text style={styles.interactionIcon}>🔍</Text>
            <View style={styles.interactionContent}>
              <Text style={styles.interactionTitle}>Pinch Zoom</Text>
              <Text style={styles.interactionDesc}>Zoom in and out</Text>
            </View>
          </View>

          <View style={styles.interactionItem}>
            <Text style={styles.interactionIcon}>👇</Text>
            <View style={styles.interactionContent}>
              <Text style={styles.interactionTitle}>Pan Map</Text>
              <Text style={styles.interactionDesc}>Drag to navigate</Text>
            </View>
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
    height: 300,
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
  interactionList: {
    gap: 12,
  },
  interactionItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    gap: 12,
  },
  interactionIcon: {
    fontSize: 24,
  },
  interactionContent: {
    flex: 1,
  },
  interactionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  interactionDesc: {
    fontSize: 11,
    color: '#64748b',
  },
});
