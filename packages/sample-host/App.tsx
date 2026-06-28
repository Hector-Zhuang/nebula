/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  FadeOut,
  FadeOutDown,
} from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  Slider as NebulaSlider,
  Progress as NebulaProgress,
} from '@nebula-rn/components';
import { defaultHostApis } from '@nebula-rn/host-apis';
import type { MiniappLoadingResolveContext } from '@nebula-rn/sdk';
import { NebulaAPI } from '@nebula-rn/sdk';

const SAMPLE_MINI_APP_ID = 'sample-miniapp';
const HOST_SERVER_BASE_URL = 'http://localhost:3001/api';
const SAMPLE_MINI_APP_DEV_SERVER_URL = 'http://localhost:8082';
const SAMPLE_MINI_APP_PROD_BUNDLE_URL =
  'file:///Users/hectorchong/Project/superapp/packages/sample-miniapp/build/main.jsbundle';

function DefaultMiniappLoadingScreen({
  appId,
  title,
  status,
  iconUrl,
}: MiniappLoadingResolveContext) {
  const [closing, setClosing] = useState(false);
  const message =
    status === 'installing'
      ? 'Installing latest production bundle...'
      : status === 'error'
        ? 'Failed to load miniapp.'
        : 'Preparing miniapp...';

  const closeMiniapp = async () => {
    if (closing) {
      return;
    }

    try {
      setClosing(true);
      await NebulaAPI.closeMiniApp(appId);
    } catch (error) {
      console.error(
        '[Nebula] Failed to close miniapp from loading screen',
        error,
      );
      Alert.alert('Close Failed', 'Unable to close the miniapp right now.');
    } finally {
      setClosing(false);
    }
  };

  return (
    <Animated.View
      exiting={FadeOut.duration(160)}
      style={styles.miniappLoadingOverlay}
    >
      <Animated.View
        entering={FadeInUp.duration(520)
          .delay(40)
          .easing(Easing.out(Easing.cubic))
          .withInitialValues({
            transform: [{ translateY: 96 }, { scale: 0.96 }],
          })}
        exiting={FadeOutDown.duration(220).withInitialValues({
          opacity: 1,
          transform: [{ translateY: 0 }, { scale: 1 }],
        })}
        style={styles.miniappLoadingCard}
      >
        <Text style={styles.miniappLoadingEyebrow}>Nebula</Text>
        <ActivityIndicator
          size="large"
          color="#2563eb"
          style={styles.miniappLoadingIndicator}
        />
        {iconUrl ? (
          <Image source={{ uri: iconUrl }} style={styles.miniappLoadingIcon} />
        ) : null}
        <Text style={styles.miniappLoadingTitle}>{title || appId}</Text>
        <Text style={styles.miniappLoadingMessage}>{message}</Text>
        <Pressable
          accessibilityRole="button"
          disabled={closing}
          onPress={closeMiniapp}
          style={({ pressed }) => [
            styles.miniappLoadingCloseButton,
            pressed && !closing
              ? styles.miniappLoadingCloseButtonPressed
              : null,
            closing ? styles.miniappLoadingCloseButtonDisabled : null,
          ]}
        >
          <Text style={styles.miniappLoadingCloseButtonText}>
            {closing ? 'Closing...' : 'Close miniapp'}
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [bridgeLog, setBridgeLog] = useState('idle');
  const [sliderVal, setSliderVal] = useState(40);
  const [serverBaseURL, setServerBaseURL] = useState('');
  const [serverStatus, setServerStatus] = useState(
    'Server URL not configured yet.',
  );

  useEffect(() => {
    const unsubscribe = NebulaAPI.addMiniAppMessageListener(
      (event: { appId: string; message: Record<string, unknown> }) => {
        setBridgeLog(`from ${event.appId}: ${JSON.stringify(event.message)}`);
      },
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const loadServerBaseURL = async () => {
      try {
        const result = await NebulaAPI.getServerBaseURL();
        const nextValue = result.serverBaseURL ?? '';
        setServerBaseURL(nextValue);
        setServerStatus(
          nextValue
            ? `Current server: ${nextValue}`
            : 'Server URL not configured yet.',
        );
      } catch (error) {
        console.error('[Nebula] Failed to load server URL', error);
        setServerStatus('Failed to load server URL.');
      }
    };

    loadServerBaseURL().catch(error => {
      console.error('[Nebula] Failed to load server URL', error);
      setServerStatus('Failed to load server URL.');
    });
  }, []);

  const saveServerBaseURL = async () => {
    try {
      const result = await NebulaAPI.setServerBaseURL(serverBaseURL);
      const nextValue = result.serverBaseURL ?? '';
      setServerBaseURL(nextValue);
      setServerStatus(
        nextValue
          ? `Current server: ${nextValue}`
          : 'Server URL cleared. QR install now relies on the scanned URL as-is.',
      );
      Alert.alert(
        'Saved',
        nextValue ? `Server URL saved as ${nextValue}` : 'Server URL cleared.',
      );
    } catch (error) {
      console.error('[Nebula] Failed to save server URL', error);
      Alert.alert(
        'Invalid URL',
        'Please enter a valid http(s) server URL, for example https://api.example.com/api',
      );
    }
  };

  const openSampleMiniAppInDevMode = async () => {
    try {
      await NebulaAPI.openMiniAppWithBundleURL(
        SAMPLE_MINI_APP_ID,
        SAMPLE_MINI_APP_DEV_SERVER_URL,
        {},
        true,
      );
    } catch (error) {
      console.error('[Nebula] Failed to open sample mini-app', error);
      Alert.alert(
        'Open Failed',
        '无法打开 sample 小程序，请先执行 npm run sample:start 或在 miniapp 目录执行 npm run dev。',
      );
    }
  };

  const openSampleMiniAppInProdMode = async () => {
    try {
      await NebulaAPI.openMiniApp(SAMPLE_MINI_APP_ID);
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
      await NebulaAPI.preloadMiniAppWithBundleURL(
        SAMPLE_MINI_APP_ID,
        SAMPLE_MINI_APP_DEV_SERVER_URL,
        true,
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
      await NebulaAPI.preloadMiniAppWithBundleURL(
        SAMPLE_MINI_APP_ID,
        SAMPLE_MINI_APP_PROD_BUNDLE_URL,
        false,
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

  const uninstallSampleMiniApp = async () => {
    try {
      await NebulaAPI.uninstallMiniApp(SAMPLE_MINI_APP_ID);
      Alert.alert('Uninstalled', 'Sample miniapp has been removed.');
    } catch (error) {
      console.error('[Nebula] Failed to uninstall sample mini-app', error);
      Alert.alert('Uninstall Failed', '无法卸载 sample 小程序。');
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
        <View style={styles.serverCard}>
          <Text style={styles.sectionTitle}>Nebula Server</Text>
          <Text style={styles.helperText}>
            QR install will use this server URL to fix localhost links from the
            dashboard.
          </Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            placeholder="https://your-server.com/api"
            style={styles.input}
            value={serverBaseURL}
            onChangeText={setServerBaseURL}
          />
          <View style={styles.row}>
            <View style={styles.buttonWrap}>
              <Button title="Save Server URL" onPress={saveServerBaseURL} />
            </View>
            <View style={styles.buttonWrap}>
              <Button
                title="Clear"
                color="#64748b"
                onPress={() => {
                  setServerBaseURL('');
                  NebulaAPI.setServerBaseURL(null)
                    .then(() => {
                      setServerStatus(
                        'Server URL cleared. QR install now relies on the scanned URL as-is.',
                      );
                    })
                    .catch((error: unknown) => {
                      console.error(
                        '[Nebula] Failed to clear server URL',
                        error,
                      );
                      Alert.alert(
                        'Clear Failed',
                        'Unable to clear server URL.',
                      );
                    });
                }}
              />
            </View>
          </View>
          <Text style={styles.serverStatus}>{serverStatus}</Text>
        </View>
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
        <Button title="卸载 Sample 小程序" onPress={uninstallSampleMiniApp} />
        <Button
          title="Host -> MiniApp 发消息"
          onPress={sendHostMessageToMiniApp}
        />

        <Text style={styles.sectionTitle}>@nebula-rn/components</Text>

        <Text style={styles.label}>Progress ({sliderVal}%)</Text>
        <NebulaProgress percent={sliderVal} />

        <Text style={styles.label}>Slider</Text>
        <NebulaSlider
          value={sliderVal}
          min={0}
          max={100}
          onChange={e => setSliderVal(e.value)}
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
  helperText: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonWrap: {
    flex: 1,
  },
  serverCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
    marginBottom: 8,
  },
  serverStatus: {
    fontSize: 12,
    color: '#0f172a',
  },
  bridgeLog: {
    marginTop: 12,
    fontSize: 12,
    color: '#334155',
  },
  miniappLoadingOverlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.52)',
  },
  miniappLoadingCard: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    paddingHorizontal: 28,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  miniappLoadingIndicator: {
    marginTop: 18,
  },
  miniappLoadingEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#64748b',
  },
  miniappLoadingTitle: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  miniappLoadingIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginTop: 14,
    marginBottom: 2,
  },
  miniappLoadingMessage: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
    textAlign: 'center',
  },
  miniappLoadingMeta: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
    color: '#64748b',
    textAlign: 'center',
  },
  miniappLoadingCloseButton: {
    marginTop: 24,
    minWidth: 180,
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniappLoadingCloseButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  miniappLoadingCloseButtonDisabled: {
    opacity: 0.6,
  },
  miniappLoadingCloseButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default NebulaAPI.wrap({
  hostApis: defaultHostApis,
  miniappLoading: {
    component: DefaultMiniappLoadingScreen,
    delayMs: 5000,
    enterContentDelayMs: 240,
    resolveProps: ({ appId, installedInfo }) => ({
      title: appId === SAMPLE_MINI_APP_ID ? 'Sample Miniapp' : appId,
      extraData: {
        subtitle:
          installedInfo?.version != null
            ? `Version ${installedInfo.version}`
            : 'Preparing production runtime',
      },
    }),
  },
  serverBaseURL: HOST_SERVER_BASE_URL,
})(App);
