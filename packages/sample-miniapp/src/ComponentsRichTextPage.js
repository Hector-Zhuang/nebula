import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RichText as NebulaRichText } from '@nebula/components';

export default function ComponentsRichTextPage() {
  const nodes1 = [
    {
      type: 'node',
      name: 'div',
      children: [
        {
          type: 'text',
          text: '👋 Welcome to Rich Text Component!',
        },
      ],
    },
    {
      type: 'node',
      name: 'p',
      children: [
        {
          type: 'text',
          text: 'This component supports HTML-like content rendering with styled text and elements.',
        },
      ],
    },
  ];

  const nodes2 = `
    <div style="color: #3b82f6; font-size: 16px; font-weight: bold;">
      📱 Formatted Content
    </div>
    <p style="color: #64748b; margin-top: 8px;">
      RichText can render both node arrays and HTML strings with proper styling.
    </p>
  `;

  const nodes3 = [
    {
      type: 'node',
      name: 'ul',
      children: [
        {
          type: 'node',
          name: 'li',
          children: [{ type: 'text', text: 'List item 1' }],
        },
        {
          type: 'node',
          name: 'li',
          children: [{ type: 'text', text: 'List item 2' }],
        },
        {
          type: 'node',
          name: 'li',
          children: [{ type: 'text', text: 'List item 3' }],
        },
      ],
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📝 Rich Text Component</Text>

      {/* Simple RichText */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Basic Content</Text>
        <NebulaRichText
          nodes={nodes1}
          style={styles.richText}
        />
      </View>

      {/* HTML String RichText */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>HTML Content</Text>
        <NebulaRichText
          nodes={nodes2}
          style={styles.richText}
        />
      </View>

      {/* List RichText */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>List Content</Text>
        <NebulaRichText
          nodes={nodes3}
          style={styles.richText}
        />
      </View>

      {/* Complex Styled Content */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Styled Content</Text>
        <NebulaRichText
          nodes={[
            {
              type: 'node',
              name: 'div',
              attrs: { style: 'color: #dc2626; font-size: 18px; font-weight: bold; margin-bottom: 10px;' },
              children: [{ type: 'text', text: '🔴 Important Notice' }],
            },
            {
              type: 'node',
              name: 'p',
              attrs: { style: 'color: #475569; line-height: 1.6;' },
              children: [
                { type: 'text', text: 'This is a rich text component that supports complex HTML rendering with custom styling, colors, and formatting.' },
              ],
            },
            {
              type: 'node',
              name: 'p',
              attrs: { style: 'color: #64748b; margin-top: 12px;' },
              children: [
                { type: 'text', text: '✨ Features: Multiple text nodes, nested elements, and full HTML support.' },
              ],
            },
          ]}
          style={styles.richText}
        />
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
    borderColor: '#e2e8f0',
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
