import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Button as NebulaButton,
  Checkbox as NebulaCheckbox,
  CheckboxGroup as NebulaCheckboxGroup,
  Input as NebulaInput,
  Progress as NebulaProgress,
  Slider as NebulaSlider,
  Switch as NebulaSwitch,
  Textarea as NebulaTextarea,
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
        <Text style={styles.cardTitle}>Button</Text>
        <NebulaButton type="primary" size="default">Primary Button</NebulaButton>
        <View style={styles.spacer} />
        <NebulaButton type="default" size="default">Default Button</NebulaButton>
        <View style={styles.spacer} />
        <NebulaButton type="warn" size="mini">Warn Mini</NebulaButton>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Input</Text>
        <NebulaInput
          value={inputVal}
          onInput={(e) => setInputVal(e.detail.value)}
          placeholder="Type something..."
          style={styles.input}
        />
        <Text style={styles.meta}>Value: {inputVal || '(empty)'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Textarea</Text>
        <NebulaTextarea
          value={textareaVal}
          onInput={(e) => setTextareaVal(e.detail.value)}
          placeholder="Multi-line input..."
          style={styles.textarea}
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

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Switch</Text>
        <View style={styles.row}>
          <NebulaSwitch
            checked={switchOn}
            onChange={(e) => setSwitchOn(e.detail.value)}
          />
          <Text style={styles.meta}>{switchOn ? 'ON' : 'OFF'}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>CheckboxGroup</Text>
        <NebulaCheckboxGroup
          value={checkedItems}
          onChange={(e) => setCheckedItems(e.detail.value)}
        >
          <View style={styles.row}>
            <NebulaCheckbox value="apple" />
            <Text style={styles.meta}>Apple</Text>
          </View>
          <View style={styles.row}>
            <NebulaCheckbox value="banana" />
            <Text style={styles.meta}>Banana</Text>
          </View>
          <View style={styles.row}>
            <NebulaCheckbox value="cherry" />
            <Text style={styles.meta}>Cherry</Text>
          </View>
        </NebulaCheckboxGroup>
        <Text style={styles.meta}>Selected: {checkedItems.join(', ') || '(none)'}</Text>
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
