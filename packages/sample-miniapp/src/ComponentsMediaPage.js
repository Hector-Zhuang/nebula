import React from 'react';
import { ScrollView, StyleSheet, Text, View, Button, Alert } from 'react-native';
import { Camera as NebulaCamera, Video as NebulaVideo } from '@nebula/components';

export default function ComponentsMediaPage() {
  const [cameraMode, setCameraMode] = React.useState('normal');
  const [videoPlaying, setVideoPlaying] = React.useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📸 Media Components</Text>

      {/* Camera Component */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Camera</Text>
        <Text style={styles.hint}>Real-time camera capture</Text>
        <View style={styles.cameraContainer}>
          <NebulaCamera
            id="test-camera"
            mode={cameraMode}
            resolution="high"
            devicePosition="back"
            flash="auto"
            onInitDone={(e) => {
              console.log('Camera initialized:', e.detail);
            }}
            onScanCode={(e) => {
              console.log('QR Code scanned:', e.detail);
              Alert.alert('QR Code', `Scanned: ${e.detail.result}`);
            }}
            onError={(e) => {
              console.error('Camera error:', e.detail);
              Alert.alert('Camera Error', e.detail?.message || 'Unknown error');
            }}
          />
        </View>
        <View style={styles.spacer} />
        <View style={styles.buttonRow}>
          <View style={styles.buttonHalf}>
            <Button 
              title={cameraMode === 'normal' ? '📷 Normal' : '📷 Normal'}
              onPress={() => setCameraMode('normal')}
              color={cameraMode === 'normal' ? '#3b82f6' : '#cbd5e1'}
            />
          </View>
          <View style={styles.buttonHalf}>
            <Button 
              title={cameraMode === 'scanCode' ? '📱 Scan QR' : '📱 Scan QR'}
              onPress={() => setCameraMode('scanCode')}
              color={cameraMode === 'scanCode' ? '#3b82f6' : '#cbd5e1'}
            />
          </View>
        </View>
      </View>

      {/* Video Component */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Video</Text>
        <Text style={styles.hint}>video player with controls</Text>
        <NebulaVideo
          id="test-video"
          src="https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4"
          duration={600}
          controls={true}
          autoplay={false}
          loop={false}
          muted={false}
          initialTime={0}
          objectFit="contain"
          showCenterPlayBtn={true}
          style={styles.video}
          onPlay={(e) => {
            console.log('Video playing');
            setVideoPlaying(true);
          }}
          onPause={(e) => {
            console.log('Video paused');
            setVideoPlaying(false);
          }}
          onEnded={(e) => {
            console.log('Video ended');
          }}
          onTimeUpdate={(e) => {
            console.log(`Current time: ${e.detail.currentTime}s / ${e.detail.duration}s`);
          }}
          onError={(e) => {
            console.error('Video error:', e.detail);
            Alert.alert('Video Error', e.detail?.errMsg || 'Failed to load video');
          }}
          onLoadedMetaData={(e) => {
            console.log('Video metadata loaded:', e.detail);
          }}
        />
        <View style={styles.spacer} />
        <Text style={styles.meta}>Status: {videoPlaying ? '▶️ Playing' : '⏹️ Stopped'}</Text>
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
  cameraContainer: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
  },
  spacer: {
    height: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonHalf: {
    flex: 1,
  },
  meta: {
    fontSize: 13,
    color: '#475569',
    marginTop: 6,
  },
});
