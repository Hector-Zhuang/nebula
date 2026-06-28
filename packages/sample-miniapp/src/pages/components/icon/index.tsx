import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ComponentsIconPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Icon Components</Text>
      <Text style={styles.body}>
        This page is reserved for icon demos in the new WeChat-like page layout.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff7ed',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#9a3412',
    marginBottom: 12,
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    color: '#7c2d12',
    lineHeight: 24,
    textAlign: 'center',
  },
});
