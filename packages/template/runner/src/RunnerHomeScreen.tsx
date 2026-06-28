import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { RunnerHistoryItem, RuntimeManifest } from './runnerTypes';

type RunnerHomeScreenProps = {
  baseUrl: string;
  setBaseUrl: (value: string) => void;
  manifest: RuntimeManifest | null;
  status: string;
  serviceOnline: boolean;
  loading: boolean;
  bundleUrl: string;
  recentHistory: RunnerHistoryItem[];
  clearRecentHistory: () => void;
  urlExpanded: boolean;
  setUrlExpanded: (value: boolean) => void;
  onConnect: () => void;
  onRefresh: () => void;
  onOpenCurrent: () => void;
  onSelectHistory: (item: RunnerHistoryItem) => void;
};

function SectionHeader({
  title,
  actionLabel,
  onActionPress,
}: {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onActionPress ? (
        <Pressable onPress={onActionPress}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function StatusDot({ online }: { online: boolean }) {
  return (
    <View
      style={[
        styles.statusDot,
        online ? styles.statusDotOnline : styles.statusDotOffline,
      ]}
    />
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text numberOfLines={3} style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}

export function RunnerHomeScreen({
  baseUrl,
  setBaseUrl,
  manifest,
  status,
  serviceOnline,
  loading,
  bundleUrl,
  recentHistory,
  clearRecentHistory,
  urlExpanded,
  setUrlExpanded,
  onConnect,
  onRefresh,
  onOpenCurrent,
  onSelectHistory,
}: RunnerHomeScreenProps) {
  const title =
    manifest?.window?.navigationBarTitleText ||
    manifest?.appId ||
    'No miniapp connected';
  const pageCount = manifest?.pages ? Object.keys(manifest.pages).length : 0;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          title="Session"
          actionLabel="Refresh"
          onActionPress={onRefresh}
        />

        <View style={styles.panel}>
          <View style={styles.serverCard}>
            <View style={styles.serverInfo}>
              <View style={styles.serverTitleRow}>
                <StatusDot online={serviceOnline} />
                <Text style={styles.serverTitle}>{title}</Text>
              </View>
              <Text style={styles.serverMeta}>{status}</Text>
            </View>
          </View>

          <View style={styles.panelDivider} />

          <Pressable
            onPress={() => setUrlExpanded(!urlExpanded)}
            style={styles.expandRow}
          >
            <Text style={styles.expandCaret}>{urlExpanded ? '⌄' : '›'}</Text>
            <Text style={styles.expandLabel}>Enter URL</Text>
          </Pressable>

          {urlExpanded ? (
            <View style={styles.urlBlock}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setBaseUrl}
                style={styles.input}
                value={baseUrl}
              />

              <Pressable
                onPress={onConnect}
                style={({ pressed }) => [
                  styles.connectButton,
                  pressed ? styles.connectButtonPressed : null,
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.connectButtonText}>Connect</Text>
                )}
              </Pressable>

              {manifest ? (
                <Pressable
                  onPress={onOpenCurrent}
                  style={styles.secondaryAction}
                >
                  <Text style={styles.secondaryActionText}>
                    Open current miniapp
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}

          <View style={styles.panelDivider} />

          <View style={styles.sessionBlock}>
            <InfoRow label="Bundle URL" value={bundleUrl} />
            <InfoRow label="App ID" value={manifest?.appId || 'Not loaded'} />
            <InfoRow
              label="Version"
              value={manifest?.version || 'Not loaded'}
            />
          </View>
        </View>

        <SectionHeader title="Manifest" />
        <View style={styles.infoCard}>
          <InfoRow
            label="Entry Page"
            value={manifest?.entryPagePath || 'Not loaded'}
          />
          <InfoRow
            label="Bundle Path"
            value={manifest?.bundlePath || 'Not loaded'}
          />
          <InfoRow
            label="Bundle Entry"
            value={manifest?.bundleEntryFile || 'Not loaded'}
          />
          <InfoRow
            label="Update Strategy"
            value={manifest?.updateStrategy || 'Not loaded'}
          />
          <InfoRow
            label="Pages"
            value={manifest ? String(pageCount) : 'Not loaded'}
          />
          <InfoRow
            label="Window Title"
            value={manifest?.window?.navigationBarTitleText || 'Not loaded'}
          />
          <InfoRow
            label="Nav Bg"
            value={
              manifest?.window?.navigationBarBackgroundColor || 'Not loaded'
            }
          />
          <InfoRow
            label="Nav Text"
            value={manifest?.window?.navigationBarTextColor || 'Not loaded'}
          />
          <InfoRow
            label="Window Bg"
            value={manifest?.window?.backgroundColor || 'Not loaded'}
          />
        </View>

        <SectionHeader
          title="Recent History"
          actionLabel={recentHistory.length > 0 ? 'Clear' : undefined}
          onActionPress={clearRecentHistory}
        />

        {recentHistory.length > 0 ? (
          <View style={styles.historyList}>
            {recentHistory.map(item => (
              <Pressable
                key={`${item.appId}:${item.baseUrl}`}
                onPress={() => onSelectHistory(item)}
                style={({ pressed }) => [
                  styles.historyCard,
                  pressed ? styles.historyCardPressed : null,
                ]}
              >
                <View style={styles.historyIcon}>
                  <Text style={styles.historyIconText}>•</Text>
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>{item.title}</Text>
                  <Text style={styles.historyMeta}>
                    {item.appId} · {item.version}
                  </Text>
                  <Text style={styles.historyMeta}>{item.baseUrl}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Recent miniapp sessions will appear here after you connect.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 28,
    gap: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
  },
  sectionAction: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: 0.2,
  },
  panel: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#d7d7d7',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  serverCard: {
    padding: 18,
  },
  serverInfo: {
    gap: 4,
  },
  serverTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  serverTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
  },
  serverMeta: {
    fontSize: 13,
    color: '#3f3f3f',
    lineHeight: 18,
  },
  serverBaseUrl: {
    fontSize: 13,
    color: '#6b6b6b',
    lineHeight: 18,
  },
  panelDivider: {
    height: 1,
    backgroundColor: '#e6e6e6',
  },
  expandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  expandCaret: {
    fontSize: 16,
    color: '#111111',
  },
  expandLabel: {
    fontSize: 16,
    color: '#111111',
    fontWeight: '500',
  },
  urlBlock: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    gap: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 14,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111111',
  },
  connectButton: {
    borderRadius: 999,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  connectButtonPressed: {
    opacity: 0.88,
  },
  connectButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryAction: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  secondaryActionText: {
    color: '#111111',
    fontWeight: '600',
  },
  sessionBlock: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 14,
  },
  infoCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#d7d7d7',
    backgroundColor: '#ffffff',
    padding: 18,
    gap: 14,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sessionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
  },
  infoRow: {
    gap: 6,
  },
  infoLabel: {
    color: '#6b6b6b',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  infoValue: {
    color: '#111111',
    fontSize: 14,
    lineHeight: 20,
  },
  jsonCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#d7d7d7',
    backgroundColor: '#ffffff',
    padding: 16,
  },
  jsonText: {
    color: '#111111',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Menlo',
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    flexDirection: 'row',
    gap: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d7d7d7',
    backgroundColor: '#ffffff',
    padding: 16,
  },
  historyCardPressed: {
    opacity: 0.92,
  },
  historyIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyIconText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 20,
  },
  historyInfo: {
    flex: 1,
    gap: 3,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
  },
  historyMeta: {
    color: '#6b6b6b',
    fontSize: 13,
    lineHeight: 18,
  },
  emptyCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d7d7d7',
    backgroundColor: '#ffffff',
    padding: 18,
  },
  emptyText: {
    color: '#6b6b6b',
    lineHeight: 20,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  statusDotOnline: {
    backgroundColor: '#22c55e',
  },
  statusDotOffline: {
    backgroundColor: '#ef4444',
  },
});
