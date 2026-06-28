import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ComponentsPickerPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Picker Components</Text>
      <Text style={styles.body}>
        This page is reserved for picker demos in the new page-folder layout.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    textAlign: 'center',
  },
});
