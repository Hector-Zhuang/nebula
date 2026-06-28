import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import type { ChatMessage } from '../types';
import { colors } from '../theme/colors';
import { StreamdownText } from 'react-native-streamdown';

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
      <View
        style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}
      >
        {message.type === 'text' && message.content.length > 0 && (
          <StreamdownText
            selectable
            markdownStyle={{
              paragraph: styles.messageText,
              h1: styles.messageText,
              h2: styles.messageText,
              h3: styles.messageText,
              h4: styles.messageText,
              h5: styles.messageText,
              h6: styles.messageText,
              blockquote: styles.messageText,
              list: styles.messageText,
              link: styles.messageText,
              strong: styles.messageText,
              em: styles.messageText,
              strikethrough: styles.messageText,
              underline: styles.messageText,
              thematicBreak: styles.messageText,
              table: styles.messageText,
              math: styles.messageText,
              inlineMath: styles.messageText,
            }}
            markdown={message.content}
          />
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
  messageText: {
    color: colors.textPrimary,
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
