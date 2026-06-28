import React, { ReactNode, useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export function useApiResultState() {
  const [result, setResult] = useState('idle');

  const run = async (label: string, task: () => Promise<unknown>) => {
    setResult(`${label}: pending...`);
    try {
      const value = await task();
      setResult(`${label}: ${JSON.stringify(value, null, 2)}`);
      return value;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : JSON.stringify(error);
      setResult(`${label}: FAILED - ${message}`);
      throw error;
    }
  };

  return {
    result,
    setResult,
    run,
  };
}

export function ApiTestPage({
  title,
  subtitle,
  children,
  result,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  result: string;
}) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {children}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Last Result</Text>
        <Text style={styles.result}>{result}</Text>
      </View>
    </ScrollView>
  );
}

export function ApiCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {description ? <Text style={styles.meta}>{description}</Text> : null}
      {children}
    </View>
  );
}

export function ApiButton({
  title,
  onPress,
  color,
}: {
  title: string;
  onPress: () => void;
  color?: string;
}) {
  return (
    <View style={styles.buttonWrap}>
      <Button title={title} onPress={onPress} color={color} />
    </View>
  );
}

export function ApiInput({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8fafc',
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  meta: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 21,
  },
  result: {
    fontSize: 13,
    color: '#0f172a',
    lineHeight: 20,
  },
  buttonWrap: {
    marginTop: 8,
  },
  inputGroup: {
    gap: 6,
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
});
