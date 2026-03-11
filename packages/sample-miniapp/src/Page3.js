import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MiniAppAPI, wx } from '@nebula/sdk';

export default function Page3(props) {
  const [result, setResult] = React.useState('idle');
  const [stackTestCount, setStackTestCount] = React.useState(0);

  React.useEffect(() => {
    const appId = typeof props?.appId === 'string' ? props.appId : null;
    MiniAppAPI.bootstrap(appId);
  }, [props?.appId]);

  const routePath = String(props?.__routePath ?? '/page3');
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

  const testStackLimit = async () => {
    try {
      const url = `nebula://sample-miniapp/page3?depth=${stackTestCount + 1}`;
      await MiniAppAPI.navigateTo(url);
      setStackTestCount(stackTestCount + 1);
      setResult(`Stack push #${stackTestCount + 1} succeeded`);
    } catch (error) {
      const message = error?.message ?? String(error);
      setResult(`Stack limit test: FAILED after ${stackTestCount} pushes - ${message}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📄 Page 3</Text>
      <Text style={styles.subtitle}>Third Test Page</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📍 Current Location</Text>
        <Text style={styles.meta}>Page: Page 3</Text>
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
              MiniAppAPI.navigateTo(`nebula://sample-miniapp/page1?from=page3&ts=${Date.now()}`)
            )}
            color="#3b82f6"
          />
        </View>
        <View style={styles.buttonWrap}>
          <Button 
            title="➡️ navigateTo Page 2" 
            onPress={() => run('navigateTo', () => 
              MiniAppAPI.navigateTo(`nebula://sample-miniapp/page2?from=page3&ts=${Date.now()}`)
            )}
            color="#8b5cf6"
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
            title="⬅️⬅️ navigateBack delta=3" 
            onPress={() => run('navigateBack(3)', () => MiniAppAPI.navigateBack(3))}
            color="#059669"
          />
        </View>
        <View style={styles.buttonWrap}>
          <Button 
            title="🏠 reLaunch to Home" 
            onPress={() => run('reLaunch', () => 
              MiniAppAPI.reLaunch('nebula://sample-miniapp/?relaunch=true')
            )}
            color="#ef4444"
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🧪 Stack Limit Test</Text>
        <Text style={styles.hint}>
          Test the max navigation stack depth (default: 10 pages per mini-app)
        </Text>
        <Text style={styles.meta}>Stack pushes: {stackTestCount}</Text>
        <View style={styles.buttonWrap}>
          <Button 
            title="📚 Push to Page 3 (stack test)" 
            onPress={testStackLimit}
            color="#dc2626"
          />
        </View>
        <View style={styles.buttonWrap}>
          <Button 
            title="🔄 Reset counter" 
            onPress={() => {
              setStackTestCount(0);
              setResult('Counter reset');
            }}
            color="#64748b"
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🧪 API Tests</Text>
        <View style={styles.buttonWrap}>
          <Button 
            title="wx.showToast" 
            onPress={() => run('showToast', () => wx.showToast({ title: 'Page 3 here!' }))}
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
    backgroundColor: '#fdf2f8',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#be185d',
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
    borderColor: '#fce7f3',
    shadowColor: '#ec4899',
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
  hint: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
    fontStyle: 'italic',
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
