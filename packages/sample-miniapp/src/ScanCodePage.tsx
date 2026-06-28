import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { scanCode, scanCodeSafe } from '@nebula-rn/client';
import { Miniapp } from '@nebula-rn/sdk';

export default function ScanCodePage(props) {
  const [result, setResult] = React.useState('idle');

  React.useEffect(() => {
    const appId = typeof props?.appId === 'string' ? props.appId : null;
    Miniapp.bootstrap(appId);
  }, [props?.appId]);

  const run = async (label, task) => {
    setResult(`${label}: pending...`);
    try {
      const res = await task();
      setResult(`${label}: ${JSON.stringify(res)}`);
    } catch (error) {
      const message = error?.message ?? String(error);
      setResult(`${label}: FAILED - ${message}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>ScanCode Lab</Text>
      <Text style={styles.subtitle}>
        Use this page to validate the `scanCode` base library API.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Base Library API</Text>
        <Text style={styles.meta}>
          `scanCode()` throws on failure. `scanCodeSafe()` always resolves with
          an `ok` result object.
        </Text>
        <View style={styles.buttonWrap}>
          <Button
            title="scanCode()"
            onPress={() =>
              run('scanCode', async () => {
                const res = await scanCode({
                  scanType: ['qr', 'ean-13', 'code-128'],
                });
                return {
                  result: res.result,
                  scanType: res.scanType,
                };
              })
            }
            color="#16a34a"
          />
        </View>
        <View style={styles.buttonWrap}>
          <Button
            title="scanCodeSafe()"
            onPress={() =>
              run('scanCodeSafe', async () => {
                const res = await scanCodeSafe({
                  scanType: ['qr', 'ean-13', 'code-128'],
                });
                return res.ok
                  ? {
                      ok: true,
                      result: res.data.result,
                      scanType: res.data.scanType,
                    }
                  : {
                      ok: false,
                      code: res.error.code,
                      message: res.error.message,
                    };
              })
            }
            color="#0f766e"
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Last Result</Text>
        <Text style={styles.result}>{result}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff7ed',
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#7c2d12',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9a3412',
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fdba74',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7c2d12',
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: '#9a3412',
    lineHeight: 22,
  },
  buttonWrap: {
    marginTop: 12,
  },
  result: {
    fontSize: 13,
    color: '#7c2d12',
    lineHeight: 20,
  },
});
