import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { ChatMessage } from '../types';
import { getToolLabel } from '../services/tools';
import { colors } from '../theme/colors';
import { IconCheck, IconX } from './Icons';

interface ToolingStatusPanelProps {
  messages: ChatMessage[];
}

export function ToolingStatusPanel({ messages }: ToolingStatusPanelProps) {
  const tools = Array.from(
    new Map(
      messages
        .filter(message => message.type === 'tool' && message.toolCallName)
        .map(message => [message.toolCallName!, message]),
    ).values(),
  );

  return (
    <View style={styles.container}>
      {tools.length
        ? tools.map(tool => {
            const status = tool.toolCallStatus ?? 'running';
            return (
              <View key={tool.id} style={[styles.row]}>
                <View style={styles.statusIcon}>
                  {status === 'running' ? (
                    <ActivityIndicator size="small" color={colors.accentBlue} />
                  ) : status === 'success' ? (
                    <IconCheck size={16} color={colors.success} />
                  ) : (
                    <IconX size={16} color={colors.error} />
                  )}
                </View>
                <View style={styles.toolDetails}>
                  <Text numberOfLines={1} style={styles.toolName}>
                    {getToolLabel(tool.toolCallName!)}
                  </Text>
                  <Text
                    style={[
                      styles.status,
                      status === 'success' && styles.statusSuccess,
                      status === 'error' && styles.statusError,
                    ]}
                  >
                    {status === 'running'
                      ? 'Running'
                      : status === 'success'
                        ? 'Complete'
                        : 'Failed'}
                  </Text>
                </View>
              </View>
            );
          })
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: colors.surfacePrimary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  empty: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolDetails: {
    flex: 1,
    gap: 2,
  },
  toolName: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  status: {
    color: colors.accentBlue,
    fontSize: 12,
  },
  statusSuccess: {
    color: colors.success,
  },
  statusError: {
    color: colors.error,
  },
});
