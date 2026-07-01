import React, { useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Button,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ChatMessage, ConversationPhase } from '../types';
import { colors } from '../theme/colors';
import { APP_NAME } from '../config/constants';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { IconSettings, IconSparkle, IconRefresh } from './Icons';

interface ChatScreenProps {
  messages: ChatMessage[];
  phase: ConversationPhase;
  onSendMessage: (text: string) => void;
  onReset: () => void;
  onOpenSettings: () => void;
  onOpenMiniApp?: (appId: string) => void;
}

export function ChatScreen({
  messages,
  phase,
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
  // Show typing indicator only when streaming and no streaming message yet
  const hasStreamingMessage = messages.some(m => m.isStreaming);
  const showTypingIndicator = isStreaming && !hasStreamingMessage;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerLeft}>
          <IconSparkle size={18} color={colors.accent} />
          <Text style={styles.headerTitle}>{APP_NAME}</Text>
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

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <ChatBubble message={item} onOpenMiniApp={onOpenMiniApp} />
        )}
        keyExtractor={item => item.id}
        style={styles.messageList}
        contentContainerStyle={styles.messageContent}
        ListFooterComponent={showTypingIndicator ? <TypingIndicator /> : null}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSparkle size={40} color={colors.accent} />
            <Text style={styles.emptyTitle}>Nebula Coding Agent</Text>
            <Text style={styles.emptySubtitle}>
              Describe a miniapp you want to build. I'll help you create the
              spec, generate code, and deploy it to Nebula Cloud — all
              autonomously.
            </Text>

            <Button
              title="open miniapp"
              onPress={() => {
                Linking.openURL('nebula://miniapp/install/calculator-miniapp');
              }}
            />
          </View>
        }
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      />

      {/* Input */}
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
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    flex: 1,
  },
  messageContent: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
    gap: 12,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
