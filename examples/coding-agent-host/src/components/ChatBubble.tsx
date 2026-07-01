import React from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator, Pressable } from 'react-native';
import type { ChatMessage } from '../types';
import { colors } from '../theme/colors';
import { IconBot, IconUser } from './Icons';

interface ChatBubbleProps {
  message: ChatMessage;
  onOpenMiniApp?: (appId: string) => void;
}

export function ChatBubble({ message, onOpenMiniApp }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.aiContainer,
      ]}
    >
      {/* Avatar */}
      {!isUser && (
        <View style={styles.avatar}>
          <IconBot size={18} color={colors.accent} />
        </View>
      )}

      <View
        style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}
      >
        {message.type === 'text' && message.content.length > 0 && (
          <Text
            style={[
              styles.messageText,
              message.isStreaming && styles.streamingText,
            ]}
            selectable
          >
            {message.content}
            {message.isStreaming && (
              <Text style={styles.cursor}>▍</Text>
            )}
          </Text>
        )}

        {message.type === 'tool' && (
          <View style={styles.toolCard}>
            <View style={styles.toolHeader}>
              <ActivityIndicator
                size="small"
                animating={message.toolCallStatus === 'running'}
                color={
                  message.toolCallStatus === 'error'
                    ? colors.error
                    : message.toolCallStatus === 'success'
                      ? colors.success
                      : colors.accent
                }
              />
              <Text style={styles.toolName}>
                {message.toolCallName || 'Tool'}
              </Text>
              <Text
                style={[
                  styles.toolStatus,
                  message.toolCallStatus === 'error' && { color: colors.error },
                  message.toolCallStatus === 'success' && { color: colors.success },
                ]}
              >
                {message.toolCallStatus === 'running'
                  ? 'Running'
                  : message.toolCallStatus === 'success'
                    ? 'Done'
                    : 'Failed'}
              </Text>
            </View>
            {message.content && (
              <Text style={styles.toolDetails}>{message.content}</Text>
            )}
          </View>
        )}

        {message.type === 'error' && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{message.content}</Text>
          </View>
        )}

        {message.type === 'action' && (
          <View style={styles.actionCard}>
            <Text style={styles.actionText}>{message.content}</Text>
            {message.appId && (
              <Pressable
                style={styles.actionButton}
                onPress={() => onOpenMiniApp?.(message.appId!)}
              >
                <Text style={styles.actionButtonText}>Open MiniApp</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>

      {/* Avatar for user */}
      {isUser && (
        <View style={styles.avatar}>
          <IconUser size={18} color={colors.textSecondary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 6,
    marginHorizontal: 12,
    alignItems: 'flex-start',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  aiContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    marginTop: 4,
  },
  bubble: {
    maxWidth: '85%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  userBubble: {
    backgroundColor: colors.surfaceSecondary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: colors.surfacePrimary,
    borderBottomLeftRadius: 4,
  },
  // Tool status card
  toolCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    minWidth: 200,
  },
  toolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toolName: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  toolStatus: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  toolDetails: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 6,
    lineHeight: 17,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  // Message text
  messageText: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },
  streamingText: {
    opacity: 0.95,
  },
  cursor: {
    color: colors.accent,
    fontWeight: '400',
  },
  // Error card
  errorCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
    paddingLeft: 10,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    lineHeight: 20,
  },
  // Action card with button
  actionCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.accent + '40',
    padding: 12,
    gap: 10,
  },
  actionText: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
