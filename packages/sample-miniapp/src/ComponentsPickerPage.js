import React from 'react';
import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { Picker as NebulaPicker } from '@nebula/components';

export default function ComponentsPickerPage() {
  const [selectedItem, setSelectedItem] = React.useState(0);
  const [selectedDate, setSelectedDate] = React.useState('2024-03-12');
  const [selectedTime, setSelectedTime] = React.useState('14:30');
  const [selectedMulti, setSelectedMulti] = React.useState([0, 0]);

  const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
  
  const sizes = [
    ['Small', 'Medium', 'Large', 'Extra Large'],
    ['Short', 'Regular', 'Long'],
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎯 Picker Components</Text>

      {/* Selector Picker */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Single Selector</Text>
        <Text style={styles.hint}>choose one item from list</Text>
        
        <View style={styles.pickerContainer}>
          <NebulaPicker
            mode="selector"
            range={fruits}
            value={selectedItem}
            onChange={(e) => {
              setSelectedItem(e.detail.value);
              Alert.alert('Selection', `You selected: ${fruits[e.detail.value]}`);
            }}
          >
            <View style={styles.pickerButton}>
              <Text style={styles.pickerButtonText}>
                {fruits[selectedItem]} ✔
              </Text>
            </View>
          </NebulaPicker>
        </View>

        <View style={styles.spacer} />
        <Text style={styles.meta}>Selected: {fruits[selectedItem]}</Text>
      </View>

      {/* Multi-Selector Picker */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Multi-Column Selector</Text>
        <Text style={styles.hint}>select from multiple columns</Text>
        
        <View style={styles.pickerContainer}>
          <NebulaPicker
            mode="multiSelector"
            range={sizes}
            value={selectedMulti}
            onChange={(e) => {
              setSelectedMulti(e.detail.value);
              const selected = `${sizes[0][e.detail.value[0]]} - ${sizes[1][e.detail.value[1]]}`;
              Alert.alert('Multi-Selection', `You selected: ${selected}`);
            }}
            onColumnChange={(e) => {
              console.log(`Column ${e.detail.column} changed to ${e.detail.value}`);
            }}
          >
            <View style={styles.pickerButton}>
              <Text style={styles.pickerButtonText}>
                {sizes[0][selectedMulti[0]]} × {sizes[1][selectedMulti[1]]} ✔
              </Text>
            </View>
          </NebulaPicker>
        </View>

        <View style={styles.spacer} />
        <Text style={styles.meta}>
          Selected: {sizes[0][selectedMulti[0]]} - {sizes[1][selectedMulti[1]]}
        </Text>
      </View>

      {/* Date Picker */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Date Picker</Text>
        <Text style={styles.hint}>select a date</Text>
        
        <View style={styles.pickerContainer}>
          <NebulaPicker
            mode="date"
            value={selectedDate}
            start="2020-01-01"
            end="2030-12-31"
            fields="day"
            onChange={(e) => {
              setSelectedDate(e.detail.value);
              Alert.alert('Date Selected', `You selected: ${e.detail.value}`);
            }}
          >
            <View style={styles.pickerButton}>
              <Text style={styles.pickerButtonText}>
                📅 {selectedDate} ✔
              </Text>
            </View>
          </NebulaPicker>
        </View>

        <View style={styles.spacer} />
        <Text style={styles.meta}>Date: {selectedDate}</Text>
      </View>

      {/* Time Picker */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Time Picker</Text>
        <Text style={styles.hint}>select a time</Text>
        
        <View style={styles.pickerContainer}>
          <NebulaPicker
            mode="time"
            value={selectedTime}
            start="06:00"
            end="22:00"
            onChange={(e) => {
              setSelectedTime(e.detail.value);
              Alert.alert('Time Selected', `You selected: ${e.detail.value}`);
            }}
          >
            <View style={styles.pickerButton}>
              <Text style={styles.pickerButtonText}>
                🕐 {selectedTime} ✔
              </Text>
            </View>
          </NebulaPicker>
        </View>

        <View style={styles.spacer} />
        <Text style={styles.meta}>Time: {selectedTime}</Text>
      </View>

      {/* Region Picker */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Region Picker</Text>
        <Text style={styles.hint}>select location/region</Text>
        
        <View style={styles.pickerContainer}>
          <NebulaPicker
            mode="region"
            onChange={(e) => {
              Alert.alert('Region Selected', `You selected: ${e.detail.value.join(',')}`);
            }}
          >
            <View style={styles.pickerButton}>
              <Text style={styles.pickerButtonText}>
                🌍 Select Region ✔
              </Text>
            </View>
          </NebulaPicker>
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
    marginBottom: 10,
  },
  pickerContainer: {
    paddingVertical: 8,
  },
  pickerButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  pickerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    textAlign: 'center',
  },
  spacer: {
    height: 8,
  },
  meta: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
  },
});
