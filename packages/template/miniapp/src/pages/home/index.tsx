import React, { useState } from 'react';
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Miniapp, usePageOnLoad } from '@nebula-rn/sdk';

export default function HomePage() {
  const [result, setResult] = useState('Ready');

  usePageOnLoad(params => {
    setResult(`Loaded __APP_ID__ with params: ${JSON.stringify(params)}`);
  });

  const showToast = async () => {
    await Miniapp.showToast('Nebula miniapp starter is running');
    Alert.alert(
      'Toast Triggered',
      'Check the connected runner or host output.',
    );
  };

  const showHostInfo = async () => {
    setResult(
      [
        'This starter is intentionally minimal.',
        'Use built-in miniapp APIs immediately in Dev Runner or a connected host.',
        'Add custom Host APIs only when your host actually provides them.',
      ].join('\n'),
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Nebula Miniapp</Text>
      <Text style={styles.title}>Nebula Miniapp Starter</Text>
      <Text style={styles.subtitle}>
        This starter only contains miniapp code. Keep the miniapp pure, and let
        the host or runner provide native capabilities.
      </Text>

      <View style={styles.actions}>
        <Button
          title="Trigger toast helper"
          onPress={() => showToast().catch(handleError)}
        />
        <View style={styles.spacer} />
        <Button
          title="Explain starter"
          onPress={() => showHostInfo().catch(handleError)}
        />
      </View>

      <Text style={styles.resultLabel}>Last Result</Text>
      <View style={styles.resultCard}>
        <Text style={styles.resultText}>{result}</Text>
      </View>
    </ScrollView>
  );
}

function handleError(error: unknown) {
  console.error('[Nebula] Miniapp action failed', error);
  Alert.alert(
    'Action Failed',
    error instanceof Error
      ? error.message
      : 'Unexpected miniapp development error.',
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    gap: 14,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: '#2563eb',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
  },
  actions: {
    marginTop: 8,
  },
  spacer: {
    height: 12,
  },
  resultLabel: {
    marginTop: 18,
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  resultCard: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dbe4f0',
    padding: 16,
  },
  resultText: {
    color: '#0f172a',
    lineHeight: 22,
    fontFamily: 'Courier',
  },
});
