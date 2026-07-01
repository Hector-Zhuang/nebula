import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { AppSettings } from '../types';
import { DEFAULT_LLM_CONFIG, DEFAULT_SERVER_CONFIG } from '../config/constants';
import { IconCheck } from './Icons';

interface SettingsScreenProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string) => Promise<void>;
}

export function SettingsScreen({
  settings,
  onSave,
  onClose,
  onLogin,
  onRegister,
}: SettingsScreenProps) {
  const insets = useSafeAreaInsets();

  // LLM Config
  const [llmBaseUrl, setLlmBaseUrl] = useState(settings.llm.baseURL);
  const [llmApiKey, setLlmApiKey] = useState(settings.llm.apiKey);
  const [llmModel, setLlmModel] = useState(settings.llm.model);
  const [llmTemperature, setLlmTemperature] = useState(
    String(settings.llm.temperature ?? 0.7),
  );

  // Server Config
  const [serverUrl, setServerUrl] = useState(settings.server.baseURL);

  // Cloud Config
  const [cloudEmail, setCloudEmail] = useState(settings.cloud.email);
  const [cloudPassword, setCloudPassword] = useState(settings.cloud.password);
  const [cloudToken, setCloudToken] = useState(settings.cloud.accessToken);

  // UI State
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authMessage, setAuthMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    setLlmBaseUrl(settings.llm.baseURL);
    setLlmApiKey(settings.llm.apiKey);
    setLlmModel(settings.llm.model);
    setLlmTemperature(String(settings.llm.temperature ?? 0.7));
    setServerUrl(settings.server.baseURL);
    setCloudEmail(settings.cloud.email);
    setCloudPassword(settings.cloud.password);
    setCloudToken(settings.cloud.accessToken);
  }, [settings]);

  const handleSave = () => {
    onSave({
      llm: {
        baseURL: llmBaseUrl || DEFAULT_LLM_CONFIG.baseURL,
        apiKey: llmApiKey,
        model: llmModel || DEFAULT_LLM_CONFIG.model,
        temperature: parseFloat(llmTemperature) || DEFAULT_LLM_CONFIG.temperature,
      },
      server: {
        baseURL: serverUrl || DEFAULT_SERVER_CONFIG.baseURL,
      },
      cloud: {
        email: cloudEmail,
        password: cloudPassword,
        accessToken: cloudToken,
      },
    });
    onClose();
  };

  const handleLogin = async () => {
    if (!cloudEmail || !cloudPassword) {
      setAuthMessage({
        type: 'error',
        text: 'Please enter email and password',
      });
      return;
    }
    setIsAuthenticating(true);
    setAuthMessage(null);
    try {
      await onLogin(cloudEmail, cloudPassword);
      setAuthMessage({ type: 'success', text: 'Login successful!' });
    } catch (err: any) {
      setAuthMessage({ type: 'error', text: err.message || 'Login failed' });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleRegister = async () => {
    if (!cloudEmail || !cloudPassword) {
      setAuthMessage({
        type: 'error',
        text: 'Please enter email and password',
      });
      return;
    }
    setIsAuthenticating(true);
    setAuthMessage(null);
    try {
      await onRegister(cloudEmail, cloudPassword);
      setAuthMessage({
        type: 'success',
        text: 'Registration successful! You are now logged in.',
      });
    } catch (err: any) {
      setAuthMessage({
        type: 'error',
        text: err.message || 'Registration failed',
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.headerButton} onPress={onClose}>
          <Text style={styles.headerButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleSave}>
          <Text style={[styles.headerButtonText, { color: colors.accent }]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* LLM Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LLM Configuration</Text>
          <Text style={styles.sectionDesc}>
            Configure your OpenAI-compatible LLM endpoint
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Base URL</Text>
            <TextInput
              style={styles.input}
              value={llmBaseUrl}
              onChangeText={setLlmBaseUrl}
              placeholder="http://localhost:11434/v1"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>API Key (optional)</Text>
            <TextInput
              style={styles.input}
              value={llmApiKey}
              onChangeText={setLlmApiKey}
              placeholder="sk-..."
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Model</Text>
            <TextInput
              style={styles.input}
              value={llmModel}
              onChangeText={setLlmModel}
              placeholder="qwen2.5-coder:7b"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.field}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Temperature</Text>
              <Text style={styles.labelValue}>{llmTemperature}</Text>
            </View>
            <TextInput
              style={styles.input}
              value={llmTemperature}
              onChangeText={setLlmTemperature}
              placeholder="0.7"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Agent Server Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Agent Server</Text>
          <Text style={styles.sectionDesc}>
            Coding Agent Server URL for build & deploy
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Server URL</Text>
            <TextInput
              style={styles.input}
              value={serverUrl}
              onChangeText={setServerUrl}
              placeholder="http://localhost:3100"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          </View>
        </View>

        {/* Nebula Cloud Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nebula Cloud</Text>
          <Text style={styles.sectionDesc}>
            Login or register to deploy miniapps
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={cloudEmail}
              onChangeText={setCloudEmail}
              placeholder="your@email.com"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={cloudPassword}
              onChangeText={setCloudPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            />
          </View>

          {cloudToken ? (
            <View style={styles.tokenBadge}>
              <IconCheck size={14} color={colors.success} />
              <Text style={styles.tokenText}>Authenticated</Text>
            </View>
          ) : null}

          {authMessage && (
            <View
              style={[
                styles.authMessage,
                authMessage.type === 'error'
                  ? styles.authError
                  : styles.authSuccess,
              ]}
            >
              <Text
                style={[
                  styles.authMessageText,
                  authMessage.type === 'error'
                    ? styles.errorText
                    : styles.successText,
                ]}
              >
                {authMessage.text}
              </Text>
            </View>
          )}

          <View style={styles.authButtons}>
            <TouchableOpacity
              style={[styles.authButton, styles.loginButton]}
              onPress={handleLogin}
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.authButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.authButton, styles.registerButton]}
              onPress={handleRegister}
              disabled={isAuthenticating}
            >
              <Text style={[styles.authButtonText, { color: colors.accent }]}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    padding: 4,
    minWidth: 60,
  },
  headerButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 28,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionDesc: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 16,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '500',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelValue: {
    color: colors.accentBlue,
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 14,
  },
  tokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(63, 185, 80, 0.1)',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  tokenText: {
    color: colors.success,
    fontSize: 13,
    fontWeight: '500',
  },
  authMessage: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  authError: {
    backgroundColor: 'rgba(248, 81, 73, 0.1)',
  },
  authSuccess: {
    backgroundColor: 'rgba(63, 185, 80, 0.1)',
  },
  authMessageText: {
    fontSize: 13,
  },
  errorText: {
    color: colors.error,
  },
  successText: {
    color: colors.success,
  },
  authButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  authButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    backgroundColor: colors.accent,
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
