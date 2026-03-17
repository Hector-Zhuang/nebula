/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  Slider as NebulaSlider,
  Progress as NebulaProgress,
} from '@nebula/components';

const { NebulaAPI } = require('@nebula/sdk');
const SAMPLE_MINI_APP_ID = 'sample-miniapp';
const SAMPLE_MINI_APP_DEV_BUNDLE_URL =
  'http://192.168.0.111:8082/index.bundle?platform=ios&dev=true&minify=false&entryFile=packages/sample-miniapp/index.js';
const SAMPLE_MINI_APP_PROD_BUNDLE_URL =
  'file:///Users/hectorchong/Project/superapp/packages/sample-miniapp/build/main.jsbundle';

function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [bridgeLog, setBridgeLog] = React.useState('idle');
  const [hostMemo, setHostMemo] = React.useState('');
  const [sliderVal, setSliderVal] = React.useState(40);
  const [switchOn, setSwitchOn] = React.useState(false);
  const [checkboxVal, setCheckboxVal] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = NebulaAPI.addMiniAppMessageListener(
      (event: { appId: string; message: Record<string, unknown> }) => {
        setBridgeLog(`from ${event.appId}: ${JSON.stringify(event.message)}`);
      },
    );
    return unsubscribe;
  }, []);

  const openSampleMiniAppInDevMode = async () => {
    try {
      await NebulaAPI.openMiniAppWithMode(
        SAMPLE_MINI_APP_ID,
        SAMPLE_MINI_APP_DEV_BUNDLE_URL,
        'development',
        {
          title: 'Sample MiniApp (Hot Update)',
          moduleName: 'NebulaApp',
        },
      );
    } catch (error) {
      console.error('[Nebula] Failed to open sample mini-app', error);
      Alert.alert(
        'Open Failed',
        '无法打开 sample 小程序，请先执行 npm run sample:start。',
      );
    }
  };

  const openSampleMiniAppInProdMode = async () => {
    try {
      await NebulaAPI.openMiniAppWithMode(
        SAMPLE_MINI_APP_ID,
        SAMPLE_MINI_APP_PROD_BUNDLE_URL,
        'production',
        {
          title: 'Sample MiniApp (Production)',
          moduleName: 'NebulaApp',
        },
      );
    } catch (error) {
      console.error(
        '[Nebula] Failed to open sample mini-app in production',
        error,
      );
      Alert.alert(
        'Open Failed',
        '无法打开生产模式 sample 小程序，请确认产物 URL 可访问。',
      );
    }
  };

  const preloadSampleMiniAppInDevMode = async () => {
    try {
      await NebulaAPI.preloadMiniAppWithMode(
        SAMPLE_MINI_APP_ID,
        SAMPLE_MINI_APP_DEV_BUNDLE_URL,
        'development',
      );
      console.log('[Nebula] Preloaded sample mini-app in development mode');
    } catch (error) {
      console.error(
        '[Nebula] Failed to preload sample mini-app in development mode',
        error,
      );
      Alert.alert(
        'Preload Failed',
        '预加载热更新模式失败，请确认 sample Metro 已启动。',
      );
    }
  };

  const preloadSampleMiniAppInProdMode = async () => {
    try {
      await NebulaAPI.preloadMiniAppWithMode(
        SAMPLE_MINI_APP_ID,
        SAMPLE_MINI_APP_PROD_BUNDLE_URL,
        'production',
      );
      console.log('[Nebula] Preloaded sample mini-app in production mode');
    } catch (error) {
      console.error(
        '[Nebula] Failed to preload sample mini-app in production mode',
        error,
      );
      Alert.alert(
        'Preload Failed',
        '预加载生产模式失败，请确认生产 bundle URL 可访问。',
      );
    }
  };

  const sendHostMessageToMiniApp = async () => {
    try {
      const payload = {
        type: 'host.ping',
        text: 'Hello from host',
        ts: Date.now(),
      };
      const result = await NebulaAPI.postMessageToMiniApp(
        SAMPLE_MINI_APP_ID,
        payload,
      );
      setBridgeLog(`to ${SAMPLE_MINI_APP_ID}: ${JSON.stringify(result)}`);
    } catch (error) {
      setBridgeLog(`send failed: ${String(error)}`);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>SuperApp Host</Text>
        <Button
          title="打开 Sample 小程序(热更新)"
          onPress={openSampleMiniAppInDevMode}
        />
        <Button
          title="打开 Sample 小程序(生产模式)"
          onPress={openSampleMiniAppInProdMode}
        />
        <Button
          title="预加载 Sample 小程序(热更新)"
          onPress={preloadSampleMiniAppInDevMode}
        />
        <Button
          title="预加载 Sample 小程序(生产模式)"
          onPress={preloadSampleMiniAppInProdMode}
        />
        <Button
          title="Host -> MiniApp 发消息"
          onPress={sendHostMessageToMiniApp}
        />

        {/* ── @nebula/components showcase ── */}
        <Text style={styles.sectionTitle}>@nebula/components</Text>

        <Text style={styles.label}>Progress ({sliderVal}%)</Text>
        <NebulaProgress percent={sliderVal} />

        <Text style={styles.label}>Slider</Text>
        <NebulaSlider
          value={sliderVal}
          min={0}
          max={100}
          onChange={e => setSliderVal(e.detail.value)}
        />


        <Text style={styles.bridgeLog}>Bridge: {bridgeLog}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 4,
  },
  label: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bridgeLog: {
    marginTop: 12,
    fontSize: 12,
    color: '#334155',
  },
  hostTextarea: {
    minHeight: 72,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    color: '#0f172a',
  },
});

export default App;
