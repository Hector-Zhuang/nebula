import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon as NebulaIcon } from '@nebula/components';

export default function ComponentsIconPage() {
  const iconTypes = [
    { name: 'Check', symbol: '✓' },
    { name: 'Close', symbol: '✕' },
    { name: 'Info', symbol: 'ℹ' },
    { name: 'Warning', symbol: '⚠' },
    { name: 'Success', symbol: '✔' },
    { name: 'Error', symbol: '✗' },
    { name: 'Question', symbol: '❓' },
    { name: 'Star', symbol: '★' },
    { name: 'Heart', symbol: '❤' },
    { name: 'Search', symbol: '🔍' },
    { name: 'Settings', symbol: '⚙' },
    { name: 'Home', symbol: '🏠' },
  ];

  const sizes = [12, 16, 20, 24, 32, 40];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎨 Icon Component</Text>

      {/* Icon sizes */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Icon Sizes</Text>
        <Text style={styles.hint}>various sizes from small to large</Text>
        
        <View style={styles.iconGrid}>
          {sizes.map((size) => (
            <View key={size} style={styles.iconCell}>
              <NebulaIcon size={size} color="#3b82f6" style={styles.icon} />
              <Text style={styles.sizeLabel}>{size}px</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Icon colors */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Icon Colors</Text>
        <Text style={styles.hint}>different color variations</Text>
        
        <View style={styles.colorGrid}>
          {colors.map((color, idx) => (
            <View key={idx} style={styles.colorCell}>
              <NebulaIcon size={32} color={color} />
              <Text style={[styles.colorLabel, { color }]}>{color}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Icon collection */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Icon Gallery</Text>
        <Text style={styles.hint}>collection of available icons</Text>
        
        <View style={styles.galleryGrid}>
          {iconTypes.map((icon, idx) => (
            <View key={idx} style={styles.galleryCell}>
              <Text style={styles.galleryIcon}>{icon.symbol}</Text>
              <Text style={styles.iconName}>{icon.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Icon with text */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Icons with Text</Text>
        <Text style={styles.hint}>icons used alongside text</Text>
        
        <View style={styles.textIconRow}>
          <NebulaIcon size={16} color="#10b981" />
          <Text style={styles.textIconLabel}>Success Status</Text>
        </View>
        
        <View style={[styles.textIconRow, { marginTop: 12 }]}>
          <NebulaIcon size={16} color="#ef4444" />
          <Text style={styles.textIconLabel}>Error Status</Text>
        </View>
        
        <View style={[styles.textIconRow, { marginTop: 12 }]}>
          <NebulaIcon size={16} color="#f59e0b" />
          <Text style={styles.textIconLabel}>Warning Status</Text>
        </View>
        
        <View style={[styles.textIconRow, { marginTop: 12 }]}>
          <NebulaIcon size={16} color="#3b82f6" />
          <Text style={styles.textIconLabel}>Info Status</Text>
        </View>
      </View>

      {/* Composite icon usage */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Icon Combinations</Text>
        <Text style={styles.hint}>icons used in UI patterns</Text>
        
        <View style={styles.combinationRow}>
          <View style={styles.combinationItem}>
            <View style={styles.badge}>
              <NebulaIcon size={24} color="#fff" />
            </View>
            <Text style={styles.combinationLabel}>Badge</Text>
          </View>
          
          <View style={styles.combinationItem}>
            <View style={styles.circle}>
              <NebulaIcon size={20} color="#3b82f6" />
            </View>
            <Text style={styles.combinationLabel}>Circle</Text>
          </View>
          
          <View style={styles.combinationItem}>
            <View style={styles.tag}>
              <NebulaIcon size={12} color="#3b82f6" />
              <Text style={styles.tagText}>Tag</Text>
            </View>
            <Text style={styles.combinationLabel}>Tag</Text>
          </View>
        </View>
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
  hint: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  iconCell: {
    width: '23%',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  icon: {
    marginBottom: 6,
  },
  sizeLabel: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorCell: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  colorLabel: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  galleryCell: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  galleryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  iconName: {
    fontSize: 10,
    color: '#475569',
    textAlign: 'center',
  },
  textIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  textIconLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  combinationRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  combinationItem: {
    alignItems: 'center',
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#3b82f6',
    gap: 4,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 11,
    color: '#1e40af',
    fontWeight: '500',
  },
  combinationLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
});
