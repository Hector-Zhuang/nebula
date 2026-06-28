import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import type { CodeFile } from '../types';
import { colors } from '../theme/colors';
import { IconCode, IconCopy } from './Icons';

interface CodeBlockBubbleProps {
  files: CodeFile[];
}

const monoFont = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

function getShortName(filePath: string): string {
  const parts = filePath.split('/');
  if (parts.length >= 2) {
    return parts.slice(-2).join('/');
  }
  return filePath;
}

export function CodeBlockBubble({ files }: CodeBlockBubbleProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeFile = files[activeIndex];

  const handleCopy = async () => {
    if (!activeFile) return;
    try {
      const Clipboard = await import('@react-native-clipboard/clipboard').catch(
        () => null,
      );
      if (Clipboard) {
        Clipboard.default?.setString(activeFile.content);
      }
      // Fallback: just show the visual feedback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (files.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No code files generated</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconCode size={14} color={colors.accentBlue} />
        <Text style={styles.headerTitle}>
          {files.length} file{files.length > 1 ? 's' : ''} generated
        </Text>
      </View>

      {/* Tab bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabBar}
        contentContainerStyle={styles.tabContent}
      >
        {files.map((file, idx) => (
          <Pressable
            key={file.path}
            style={[styles.tab, idx === activeIndex && styles.activeTab]}
            onPress={() => setActiveIndex(idx)}
          >
            <Text
              style={[
                styles.tabText,
                idx === activeIndex && styles.activeTabText,
              ]}
              numberOfLines={1}
            >
              {getShortName(file.path)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* File path + copy */}
      <View style={styles.fileHeader}>
        <Text style={styles.filePath} numberOfLines={1}>
          {activeFile.path}
        </Text>
        <Pressable style={styles.copyButton} onPress={handleCopy}>
          <IconCopy
            size={14}
            color={copied ? colors.success : colors.textMuted}
          />
          <Text style={[styles.copyText, copied && styles.copyTextDone]}>
            {copied ? 'Copied' : 'Copy'}
          </Text>
        </Pressable>
      </View>

      {/* Code content */}
      <ScrollView
        style={styles.codeScroll}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <ScrollView
          style={styles.codeVerticalScroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.code}>{activeFile.content}</Text>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    minWidth: 280,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 6,
  },
  headerTitle: {
    color: colors.accentBlue,
    fontSize: 12,
    fontWeight: '600',
  },
  tabBar: {
    maxHeight: 36,
  },
  tabContent: {
    paddingHorizontal: 10,
    gap: 4,
  },
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.surfacePrimary,
  },
  activeTab: {
    backgroundColor: colors.accent,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: monoFont,
  },
  activeTabText: {
    color: '#ffffff',
  },
  fileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  filePath: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: monoFont,
    flex: 1,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  copyText: {
    color: colors.textMuted,
    fontSize: 11,
  },
  copyTextDone: {
    color: colors.success,
  },
  codeScroll: {
    maxHeight: 300,
  },
  codeVerticalScroll: {
    maxHeight: 300,
  },
  code: {
    color: colors.textPrimary,
    fontSize: 12,
    fontFamily: monoFont,
    lineHeight: 18,
    padding: 14,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
