import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MiniAppAPI, wx } from '../../../src/nebula/NebulaAPI';

export default function Page2(props) {
  const [result, setResult] = React.useState('idle');

  React.useEffect(() => {
    const appId = typeof props?.appId === 'string' ? props.appId : null;
    MiniAppAPI.bootstrap(appId);
  }, [props?.appId]);

  const routePath = String(props?.__routePath ?? '/page2');
  const routeParams = Object.entries(props ?? {}).filter(([key]) =>
    !['appId', 'sandboxPath', '__routePath', '__routeUrl', 'title'].includes(key),
  );

  const run = async (label, task) => {
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
      <Text style={styles.title}>📄 Page 2</Text>
      <Text style={styles.subtitle}>Second Test Page</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📍 Current Location</Text>
        <Text style={styles.meta}>Page: Page 2</Text>
        <Text style={styles.meta}>Route: {routePath}</Text>
        <Text style={styles.meta}>appId: {String(props?.appId ?? 'unknown')}</Text>
      </View>

      {routeParams.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📦 Route Params</Text>
          {routeParams.map(([key, value]) => (
            <Text key={key} style={styles.meta}>{`${key}: ${String(value)}`}</Text>
          ))}
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🧭 Navigation</Text>
        <View style={styles.buttonWrap}>
          <Button 
            title="➡️ navigateTo Page 1" 
            onPress={() => run('navigateTo', () => 
              MiniAppAPI.navigateTo(`nebula://sample-miniapp/page1?from=page2&ts=${Date.now()}`)
            )}
            color="#3b82f6"
          />
        </View>
        <View style={styles.buttonWrap}>
          <Button 
            title="➡️ navigateTo Page 3" 
            onPress={() => run('navigateTo', () => 
              MiniAppAPI.navigateTo(`nebula://sample-miniapp/page3?from=page2&ts=${Date.now()}`)
            )}
            color="#ec4899"
          />
        </View>
        <View style={styles.buttonWrap}>
          <Button 
            title="🔄 redirectTo Page 3 (replace)" 
            onPress={() => run('redirectTo', () => 
              MiniAppAPI.redirectTo(`nebula://sample-miniapp/page3?replaced=true`)
            )}
            color="#f59e0b"
          />
        </View>
        <View style={styles.buttonWrap}>
          <Button 
            title="⬅️ navigateBack" 
            onPress={() => run('navigateBack', () => MiniAppAPI.navigateBack(1))}
            color="#10b981"
          />
        </View>
        <View style={styles.buttonWrap}>
          <Button 
            title="⬅️⬅️ navigateBack delta=2" 
            onPress={() => run('navigateBack(2)', () => MiniAppAPI.navigateBack(2))}
            color="#059669"
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🧪 API Tests</Text>
        <View style={styles.buttonWrap}>
          <Button 
            title="wx.showToast" 
            onPress={() => run('showToast', () => wx.showToast({ title: 'Page 2 reporting!' }))}
            color="#06b6d4"
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Last Result</Text>
        <Text style={styles.result}>{result}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f3ff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#5b21b6',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 16,
    fontSize: 16,
    textAlign: 'center',
    color: '#475569',
  },
  card: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e9d5ff',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  meta: {
    marginTop: 4,
    fontSize: 14,
    color: '#475569',
  },
  buttonWrap: {
    marginTop: 8,
  },
  result: {
    fontSize: 13,
    color: '#334155',
    fontFamily: 'Courier',
  },
});
