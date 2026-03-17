import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  Progress as NebulaProgress,
  Slider as NebulaSlider,
} from '@nebula/components';

export default function NebulaComponentsPage() {
  const [inputVal, setInputVal] = React.useState('');
  const [textareaVal, setTextareaVal] = React.useState('');
  const [sliderVal, setSliderVal] = React.useState(30);
  const [switchOn, setSwitchOn] = React.useState(false);
  const [checkedItems, setCheckedItems] = React.useState([]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>@nebula/components Demo</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Input</Text>
        <Text style={styles.meta}>Value: {inputVal || '(empty)'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Textarea</Text>
        <TextInput
          value={textareaVal}
          onChangeText={setTextareaVal}
          placeholder="Multi-line input..."
          style={styles.textarea}
          multiline
        />
        <Text style={styles.meta}>Length: {textareaVal.length}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Progress + Slider ({sliderVal}%)</Text>
        <NebulaProgress percent={sliderVal} strokeWidth={8} />
        <View style={styles.spacer} />
        <NebulaSlider
          value={sliderVal}
          min={0}
          max={100}
          onChange={(e) => setSliderVal(e.detail.value)}
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
  meta: {
    marginTop: 6,
    fontSize: 13,
    color: '#475569',
  },
  spacer: {
    height: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
    color: '#0f172a',
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    color: '#0f172a',
  },
});
