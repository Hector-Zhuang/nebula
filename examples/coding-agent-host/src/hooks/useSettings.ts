import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';
import type { AppSettings } from '../types';
import {
  DEFAULT_LLM_CONFIG,
  DEFAULT_SERVER_CONFIG,
  SETTINGS_STORAGE_KEY,
} from '../config/constants';
import { createAgentServerClient } from '../services/agent-server';

const defaultSettings: AppSettings = {
  llm: { ...DEFAULT_LLM_CONFIG },
  server: { ...DEFAULT_SERVER_CONFIG },
  cloud: { email: '', password: '' },
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  // Load settings on mount
  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_STORAGE_KEY)
      .then(saved => {
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setSettings({
              llm: { ...defaultSettings.llm, ...(parsed.llm || {}) },
              server: {
                ...defaultSettings.server,
                ...(parsed.server || {}),
              },
              cloud: { ...defaultSettings.cloud, ...(parsed.cloud || {}) },
            });
          } catch {
            // Ignore invalid saved data
          }
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  // Save settings
  const updateSettings = useCallback(
    (partial: {
      llm?: Partial<AppSettings['llm']>;
      server?: Partial<AppSettings['server']>;
      cloud?: Partial<AppSettings['cloud']>;
    }) => {
      setSettings(prev => {
        const next: AppSettings = {
          llm: { ...prev.llm, ...(partial.llm || {}) },
          server: { ...prev.server, ...(partial.server || {}) },
          cloud: { ...prev.cloud, ...(partial.cloud || {}) },
        };
        AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next)).catch(
          () => {},
        );
        return next;
      });
    },
    [],
  );

  // Login to Nebula Cloud via Agent Server
  const loginToCloud = useCallback(async () => {
    const client = createAgentServerClient(settings.server);
    const result = await client.login({
      email: settings.cloud.email,
      password: settings.cloud.password,
    });
    updateSettings({
      cloud: {
        accessToken: result.accessToken,
        displayName: result.user.displayName,
      },
    });
    return result;
  }, [
    settings.server,
    settings.cloud.email,
    settings.cloud.password,
    updateSettings,
  ]);

  // Register on Nebula Cloud via Agent Server
  const registerToCloud = useCallback(async () => {
    const client = createAgentServerClient(settings.server);
    const result = await client.register({
      email: settings.cloud.email,
      displayName: settings.cloud.email.split('@')[0],
      password: settings.cloud.password,
    });
    updateSettings({
      cloud: {
        accessToken: result.accessToken,
        displayName: result.user.displayName,
      },
    });
    return result;
  }, [
    settings.server,
    settings.cloud.email,
    settings.cloud.password,
    updateSettings,
  ]);

  return {
    settings,
    loaded,
    updateSettings,
    loginToCloud,
    registerToCloud,
  };
}
