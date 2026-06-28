import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { defaultHostApis } from '@nebula-rn/host-apis';
import type { MiniappLoadingResolveContext } from '@nebula-rn/sdk';
import { NebulaAPI } from '@nebula-rn/sdk';

function DefaultMiniappLoadingScreen({
  title,
  appId,
  status,
}: MiniappLoadingResolveContext) {
  return (
    <View style={styles.loadingOverlay}>
      <View style={styles.loadingCard}>
        <Text style={styles.loadingEyebrow}>Nebula</Text>
        <Text style={styles.loadingTitle}>{title || appId}</Text>
        <Text style={styles.loadingMessage}>
          {status === 'installing'
            ? 'Installing miniapp...'
            : status === 'error'
              ? 'Something went wrong while opening the miniapp.'
              : 'Opening miniapp...'}
        </Text>
      </View>
    </View>
  );
}

function HostAppContent() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Nebula Host Starter</Text>
          <Text style={styles.subtitle}>
            This starter is a clean Nebula host shell. Register your own host
            APIs, connect Nebula Cloud, and decide how your host opens miniapps.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What is included</Text>
            <Text style={styles.sectionBody}>• Nebula runtime wrapper</Text>
            <Text style={styles.sectionBody}>
              • Default host API set from @nebula-rn/host-apis
            </Text>
            <Text style={styles.sectionBody}>
              • A minimal loading screen for miniapp startup
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Next steps</Text>
            <Text style={styles.sectionBody}>
              1. Configure serverBaseURL for Nebula Cloud
            </Text>
            <Text style={styles.sectionBody}>
              2. Register your own host APIs where needed
            </Text>
            <Text style={styles.sectionBody}>
              3. Open installed miniapps by appId or dev bundle URL
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default NebulaAPI.wrap({
  hostApis: [...defaultHostApis],
  miniappLoading: {
    component: DefaultMiniappLoadingScreen,
    delayMs: 300,
    enterContentDelayMs: 120,
  },
})(HostAppContent);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20, gap: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { fontSize: 16, lineHeight: 24, color: '#475569' },
  section: {
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dbe4f0',
    padding: 18,
    gap: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  sectionBody: { fontSize: 14, lineHeight: 22, color: '#475569' },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    padding: 24,
    gap: 10,
  },
  loadingEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#2563eb',
    textTransform: 'uppercase',
  },
  loadingTitle: { fontSize: 24, fontWeight: '700', color: '#0f172a' },
  loadingMessage: { fontSize: 15, lineHeight: 22, color: '#475569' },
});
