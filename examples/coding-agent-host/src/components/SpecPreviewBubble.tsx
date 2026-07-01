import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import type { MiniappSpec } from '../types';
import { colors } from '../theme/colors';
import { IconCheck, IconCode } from './Icons';

interface SpecPreviewBubbleProps {
  spec: MiniappSpec;
}

const monoFont = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

export function SpecPreviewBubble({ spec }: SpecPreviewBubbleProps) {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <IconCode size={16} color={colors.accentBlue} />
        <Text style={styles.headerTitle}>MiniApp Spec</Text>
      </View>

      {/* App info */}
      <View style={styles.infoRow}>
        <Text style={styles.label}>App ID</Text>
        <Text style={styles.monoValue}>{spec.appId}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{spec.name}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{spec.description}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Pages */}
      <Text style={styles.sectionTitle}>Pages ({spec.pages.length})</Text>
      {spec.pages.map((page, idx) => (
        <View key={page.name} style={styles.listItem}>
          <View style={styles.bullet} />
          <View style={styles.listContent}>
            <Text style={styles.pageName}>
              {page.name}
              {idx === 0 && <Text style={styles.entryBadge}> (entry)</Text>}
            </Text>
            <Text style={styles.pageDesc}>{page.description}</Text>
          </View>
        </View>
      ))}

      {/* Divider */}
      <View style={styles.divider} />

      {/* Features */}
      <Text style={styles.sectionTitle}>Features ({spec.features.length})</Text>
      {spec.features.map(feature => (
        <View key={feature} style={styles.listItem}>
          <IconCheck size={14} />
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}

      {/* APIs */}
      {spec.apis && spec.apis.length > 0 && (
        <>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Host APIs</Text>
          <Text style={styles.apisText}>{spec.apis.join(', ')}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    minWidth: 260,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  headerTitle: {
    color: colors.accentBlue,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
    gap: 8,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    width: 80,
    flexShrink: 0,
  },
  value: {
    color: colors.textPrimary,
    fontSize: 13,
    flex: 1,
  },
  monoValue: {
    color: colors.accentBlue,
    fontSize: 13,
    fontFamily: monoFont,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 10,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginTop: 6,
  },
  listContent: {
    flex: 1,
  },
  pageName: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: monoFont,
  },
  entryBadge: {
    color: colors.accent,
    fontWeight: '400',
    fontSize: 11,
  },
  pageDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  featureText: {
    color: colors.textPrimary,
    fontSize: 13,
    flex: 1,
  },
  apisText: {
    color: colors.accentBlue,
    fontSize: 13,
    fontFamily: monoFont,
  },
});
