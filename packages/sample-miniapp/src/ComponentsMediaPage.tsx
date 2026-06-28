import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
} from 'react-native';
import {
  Camera as NebulaCamera,
  Video as NebulaVideo,
} from '@nebula-rn/components';

export default function ComponentsMediaPage() {
  const [cameraMode, setCameraMode] = React.useState<'normal' | 'scanCode'>(
    'normal',
  );
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
            onInitDone={e => {
              console.log('Camera initialized:', e.maxZoom);
            }}
            onScanCode={e => {
              console.log('QR Code scanned:', e.result);
              Alert.alert('QR Code', `Scanned: ${e.result}`);
            }}
            onError={e => {
              console.error('Camera error:', e.message);
              Alert.alert('Camera Error', e.message || 'Unknown error');
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
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          duration={600}
          controls={true}
          autoplay={false}
          loop={false}
          muted={false}
          initialTime={0}
          objectFit="contain"
          showCenterPlayBtn={true}
          style={styles.video}
          onPlay={() => {
            console.log('Video playing');
            setVideoPlaying(true);
          }}
          onPause={() => {
            console.log('Video paused');
            setVideoPlaying(false);
          }}
          onEnded={() => {
            console.log('Video ended');
          }}
          onTimeUpdate={e => {
            console.log(`Current time: ${e.currentTime}s / ${e.duration}s`);
          }}
          onError={e => {
            console.error('Video error:', e.errMsg);
            Alert.alert('Video Error', e.errMsg || 'Failed to load video');
          }}
          onLoadedMetaData={e => {
            console.log('Video metadata loaded:', e.duration);
          }}
        />
        <View style={styles.spacer} />
        <Text style={styles.meta}>
          Status: {videoPlaying ? '▶️ Playing' : '⏹️ Stopped'}
        </Text>
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
    fontSize: 18,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 4,
  },
  hint: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  cameraContainer: {
    height: 220,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
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
  video: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  meta: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 6,
  },
});
