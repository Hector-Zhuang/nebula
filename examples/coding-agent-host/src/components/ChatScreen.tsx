import React, { useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ChatMessage, ConversationPhase } from '../types';
import { colors } from '../theme/colors';
import { APP_NAME } from '../config/constants';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { IconSettings, IconSparkle, IconRefresh } from './Icons';
import { ToolingStatusPanel } from './ToolingStatusPanel';

interface ChatScreenProps {
  messages: ChatMessage[];
  phase: ConversationPhase;
  statusText: string;
  onSendMessage: (text: string) => void;
  onReset: () => void;
  onOpenSettings: () => void;
  onOpenMiniApp?: (appId: string) => void;
}

export function ChatScreen({
  messages,
  phase,
  statusText,
  onSendMessage,
  onReset,
  onOpenSettings,
  onOpenMiniApp,
}: ChatScreenProps) {
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, phase]);

  const isStreaming = phase === 'streaming';
  // Show typing indicator when streaming and no streaming message yet, or when statusText is set
  const hasStreamingMessage = messages.some(m => m.isStreaming);
  const showTypingIndicator =
    isStreaming && (!hasStreamingMessage || statusText);
  const visibleMessages = messages
    .filter(
      message =>
        message.type !== 'tool' &&
        (message.type !== 'text' || message.content.trim().length > 0),
    )
    .sort((left, right) => {
      if (left.type === 'action') return 1;
      if (right.type === 'action') return -1;
      return left.timestamp - right.timestamp;
    });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerLeft}>
          <View>
            <Text style={styles.headerTitle}>{APP_NAME}</Text>
            <Text style={styles.headerStatus}>Ready to build</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {messages.length > 0 && (
            <Pressable style={styles.headerButton} onPress={onReset}>
              <IconRefresh size={18} color={colors.accentBlue} />
            </Pressable>
          )}
          <Pressable style={styles.headerButton} onPress={onOpenSettings}>
            <IconSettings size={20} />
          </Pressable>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={visibleMessages}
        renderItem={({ item }) => (
          <ChatBubble message={item} onOpenMiniApp={onOpenMiniApp} />
        )}
        keyExtractor={item => item.id}
        style={styles.messageList}
        contentContainerStyle={styles.messageContent}
        ListFooterComponent={
          <View>
            {showTypingIndicator ? (
              <TypingIndicator statusText={statusText} />
            ) : null}
            {messages.some(message => message.type === 'tool') ? (
              <ToolingStatusPanel messages={messages} />
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyMark}>
              <IconSparkle size={34} color={colors.accentBlue} />
            </View>
            <Text style={styles.emptyTitle}>What can I help you build?</Text>
            <Text style={styles.emptySubtitle}>
              Describe a miniapp, feature, or deployment task. The agent will
              plan, build, and run it.
            </Text>
          </View>
        }
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      />

      <ChatInput
        onSend={onSendMessage}
        disabled={isStreaming}
        placeholder={
          isStreaming ? 'Generating...' : 'Describe your miniapp idea...'
        }
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  headerStatus: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    flex: 1,
  },
  messageContent: {
    paddingTop: 12,
    paddingBottom: 124,
    paddingHorizontal: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingTop: 120,
    gap: 14,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 34,
    fontWeight: '400',
    marginTop: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 23,
  },
  emptyMark: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
