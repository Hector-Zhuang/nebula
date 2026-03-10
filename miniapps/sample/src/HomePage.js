import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MiniAppAPI, wx } from '../../../src/nebula/NebulaAPI';

export default function HomePage(props) {
  const [now, setNow] = React.useState(new Date());
  const [result, setResult] = React.useState('idle');
  const [hostMessage, setHostMessage] = React.useState('none');

  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const appId = typeof props?.appId === 'string' ? props.appId : null;
    MiniAppAPI.bootstrap(appId);
  }, [props?.appId]);

  React.useEffect(() => {
    const unsubscribe = MiniAppAPI.onHostMessage((event) => {
      setHostMessage(JSON.stringify(event.message));
    });
    return unsubscribe;
  }, []);

  const routePath = String(props?.__routePath ?? '/');
  const routeUrl = String(props?.__routeUrl ?? '');

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

  const navigateToPage = (pageNum) => {
    const url = `nebula://sample-miniapp/page${pageNum}?from=home&ts=${Date.now()}`;
    run(`Navigate to Page ${pageNum}`, () => MiniAppAPI.navigateTo(url));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🏠 Sample Mini App</Text>
      <Text style={styles.subtitle}>Multi-Page Navigation Test</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📍 Current Location</Text>
        <Text style={styles.meta}>Page: Home (index)</Text>
        <Text style={styles.meta}>appId: {String(props?.appId ?? 'unknown')}</Text>
        <Text style={styles.meta}>Time: {now.toLocaleTimeString()}</Text>
        <Text style={styles.meta}>Route Path: {routePath}</Text>
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
        <Text style={styles.cardTitle}>🧭 Navigate to Pages</Text>
        <Text style={styles.hint}>Test the navigation system with multiple pages</Text>
        <View style={styles.buttonWrap}>
          <Button title="📄 Go to Page 1" onPress={() => navigateToPage(1)} color="#3b82f6" />
        </View>
        <View style={styles.buttonWrap}>
          <Button title="📄 Go to Page 2" onPress={() => navigateToPage(2)} color="#8b5cf6" />
        </View>
        <View style={styles.buttonWrap}>
          <Button title="📄 Go to Page 3" onPress={() => navigateToPage(3)} color="#ec4899" />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🧪 API Tests</Text>
        <View style={styles.buttonWrap}>
          <Button 
            title="wx.showToast - Hello" 
            onPress={() => run('showToast', () => wx.showToast({ title: 'Hello from Home!' }))}
            color="#10b981"
          />
        </View>
        <View style={styles.buttonWrap}>
          <Button 
            title="reLaunch to Page 1" 
            onPress={() => run('reLaunch', () => MiniAppAPI.reLaunch('nebula://sample-miniapp/page1?relaunch=true'))}
            color="#f59e0b"
          />
        </View>
        <View style={styles.buttonWrap}>
          <Button
            title="MiniApp -> Host 发消息"
            onPress={() =>
              run('postMessageToHost', () =>
                MiniAppAPI.postMessageToHost({
                  type: 'miniapp.ping',
                  from: routePath,
                  ts: Date.now(),
                }),
              )
            }
            color="#0ea5e9"
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📨 Host Message</Text>
        <Text style={styles.meta}>{hostMessage}</Text>
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
    backgroundColor: '#f0f9ff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
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
    borderColor: '#e0e7ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
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
