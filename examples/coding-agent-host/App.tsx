import React, { useState, useCallback } from 'react';
import { Alert, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { defaultHostApis } from '@nebula-rn/host-apis';
import { NebulaAPI } from '@nebula-rn/sdk';
import { ChatScreen } from './src/components/ChatScreen';
import { SettingsScreen } from './src/components/SettingsScreen';
import { useChatSession } from './src/hooks/useChatSession';
import { useSettings } from './src/hooks/useSettings';
import { colors } from './src/theme/colors';
import type { AppSettings } from './src/types';

const HOST_SERVER_BASE_URL = 'http://localhost:3001/api';

type Screen = 'chat' | 'settings';

function HostAppContent() {
  const [screen, setScreen] = useState<Screen>('chat');
  const { settings, loaded, updateSettings, loginToCloud, registerToCloud } =
    useSettings();
  const { state: chatState, sendMessage, resetSession } =
    useChatSession(settings);

  const handleSaveSettings = useCallback(
    (newSettings: AppSettings) => {
      updateSettings({
        llm: newSettings.llm,
        server: newSettings.server,
        cloud: {
          email: newSettings.cloud.email,
          password: newSettings.cloud.password,
        },
      });
    },
    [updateSettings],
  );

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      updateSettings({ cloud: { email, password } });
      await new Promise<void>(r => setTimeout(r, 50));
      await loginToCloud();
    },
    [updateSettings, loginToCloud],
  );

  const handleRegister = useCallback(
    async (email: string, password: string) => {
      updateSettings({ cloud: { email, password } });
      await new Promise<void>(r => setTimeout(r, 50));
      await registerToCloud();
    },
    [updateSettings, registerToCloud],
  );

  const handleOpenMiniApp = useCallback(async (appId: string) => {
    try {
      await NebulaAPI.uninstallMiniApp(appId).catch(() => {});
      await NebulaAPI.openMiniApp(appId, {}, 'release');
    } catch (error) {
      Alert.alert(
        'Open Failed',
        `Could not open "${appId}". ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }, []);

  if (!loaded) {
    return <View style={styles.loading} />;
  }

  if (screen === 'settings') {
    return (
      <SettingsScreen
        settings={settings}
        onSave={handleSaveSettings}
        onClose={() => setScreen('chat')}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  return (
    <ChatScreen
      messages={chatState.messages}
      phase={chatState.phase}
      onSendMessage={sendMessage}
      onReset={resetSession}
      onOpenSettings={() => setScreen('settings')}
      onOpenMiniApp={handleOpenMiniApp}
    />
  );
}

const WrappedApp = NebulaAPI.wrap({
  hostApis: [...defaultHostApis],
  serverBaseURL: HOST_SERVER_BASE_URL,
})(HostAppContent);

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <WrappedApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
