/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const { NebulaAPI } = require('./src/nebula/NebulaAPI');
const SAMPLE_MINI_APP_ID = 'sample-miniapp';
const SAMPLE_MINI_APP_DEV_BUNDLE_URL =
  'http://127.0.0.1:8082/index.bundle?platform=ios&dev=true&minify=false&entryFile=miniapps/sample/index.js';
const SAMPLE_MINI_APP_PROD_BUNDLE_URL =
  'file:///Users/hectorzhuang/Project/superapp/miniapps/sample/build/main.jsbundle';

function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [bridgeLog, setBridgeLog] = React.useState('idle');

  React.useEffect(() => {
    const unsubscribe = NebulaAPI.addMiniAppMessageListener((event: {
      appId: string;
      message: Record<string, unknown>;
    }) => {
      setBridgeLog(`from ${event.appId}: ${JSON.stringify(event.message)}`);
    });
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
      const result = await NebulaAPI.postMessageToMiniApp(SAMPLE_MINI_APP_ID, payload);
      setBridgeLog(`to ${SAMPLE_MINI_APP_ID}: ${JSON.stringify(result)}`);
    } catch (error) {
      setBridgeLog(`send failed: ${String(error)}`);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>SupefffrApp</Text>
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
        <Text style={styles.bridgeLog}>Bridge: {bridgeLog}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  bridgeLog: {
    marginTop: 8,
    fontSize: 12,
    color: '#334155',
  },
});

export default App;
