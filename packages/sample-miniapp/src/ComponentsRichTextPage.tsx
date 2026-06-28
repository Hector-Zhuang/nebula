import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RichText as NebulaRichText } from '@nebula-rn/components';
import { WebView } from 'react-native-webview';

export default function ComponentsRichTextPage() {
  const htmlBasic = `
    <div>👋 Welcome to Rich Text Component!</div>
    <p>This component supports HTML content rendering with styled text and elements.</p>
  `;

  const htmlFormatted = `
    <div style="color: #3b82f6; font-size: 16px; font-weight: bold;">
      📱 Formatted Content
    </div>
    <p style="color: #64748b; margin-top: 8px;">
      RichText now renders pure HTML strings with full CSS support.
    </p>
  `;

  const htmlList = `
    <ul style="color: #1e293b; padding-left: 20px;">
      <li>List item 1</li>
      <li>List item 2</li>
      <li>List item 3</li>
    </ul>
  `;

  const htmlStyled = `
    <div style="color: #dc2626; font-size: 18px; font-weight: bold; margin-bottom: 10px;">
      🔴 Important Notice
    </div>
    <p style="color: #475569; line-height: 1.6;">
      This is a rich text component that supports complex HTML rendering with custom styling, colors, and formatting.
    </p>
    <p style="color: #64748b; margin-top: 12px;">
      ✨ Features: Easy integration, auto-height calculation, and full web-standard CSS.
    </p>
  `;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <WebView
        source={{ uri: 'https://infinite.red' }}
        style={{ marginTop: 100, height: 200, width: '100%' }}
      />

      <Text style={styles.title}>📝 Rich Text Component</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Basic Content</Text>
        <NebulaRichText html={htmlBasic} style={styles.richText} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>HTML Content</Text>
        <NebulaRichText html={htmlFormatted} style={styles.richText} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>List Content</Text>
        <NebulaRichText html={htmlList} style={styles.richText} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Styled Content</Text>
        <NebulaRichText html={htmlStyled} style={styles.richText} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5fbff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8e0',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 10,
  },
  richText: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
});
