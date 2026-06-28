import React from 'react';
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Miniapp } from '@nebula-rn/sdk';

export default function SampleMiniApp(props) {
  const [now, setNow] = React.useState(new Date());
  const [result, setResult] = React.useState('idle');

  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const appId = typeof props?.appId === 'string' ? props.appId : null;
    Miniapp.bootstrap(appId);
  }, [props?.appId]);

  const routePath = String(props?.__routePath ?? '/');
  const routeUrl = String(props?.__routeUrl ?? '');
  const stack = Number(props?.stack ?? 0);

  const routeParams = Object.entries(props ?? {}).filter(
    ([key]) =>
      !['appId', 'sandboxPath', '__routePath', '__routeUrl', 'title'].includes(
        key,
      ),
  );

  const run = async (label, task) => {
    try {
      const res = await task();
      setResult(`${label}: ${JSON.stringify(res)}`);
    } catch (error) {
      const message = error?.message ?? String(error);
      setResult(`${label}: fail ${message}`);
      Alert.alert(label, message);
    }
  };

  const nextStack = stack + 1;
  const buildRouteUrl = action =>
    `/demo?action=${action}&from=${encodeURIComponent(routePath)}&stack=${nextStack}&ts=${Date.now()}`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sample Mini App Route Lab</Text>
      <Text style={styles.subtitle}>WeChat-like routes without switchTab</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Runtime</Text>
        <Text style={styles.meta}>
          appId: {String(props?.appId ?? 'unknown')}
        </Text>
        <Text style={styles.meta}>time: {now.toLocaleTimeString()}</Text>
        <Text style={styles.meta}>routePath: {routePath}</Text>
        <Text style={styles.meta}>routeUrl: {routeUrl || '(none)'}</Text>
        <Text style={styles.meta}>stack(depth hint): {stack}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Route Params (query)</Text>
        {routeParams.length === 0 ? (
          <Text style={styles.meta}>(no route params)</Text>
        ) : (
          routeParams.map(([key, value]) => (
            <Text
              key={key}
              style={styles.meta}
            >{`${key}: ${String(value)}`}</Text>
          ))
        )}
      </View>

      <View style={styles.buttonWrap}>
        <Button
          title="navigateTo (push + params)"
          onPress={() =>
            run('navigateTo', () =>
              Miniapp.navigateTo(buildRouteUrl('navigateTo')),
            )
          }
        />
      </View>
      <View style={styles.buttonWrap}>
        <Button
          title="redirectTo (replace current)"
          onPress={() =>
            run('redirectTo', () =>
              Miniapp.redirectTo(buildRouteUrl('redirectTo')),
            )
          }
        />
      </View>
      <View style={styles.buttonWrap}>
        <Button
          title="reLaunch (reset stack)"
          onPress={() =>
            run('reLaunch', () => Miniapp.reLaunch(buildRouteUrl('reLaunch')))
          }
        />
      </View>
      <View style={styles.buttonWrap}>
        <Button
          title="navigateBack delta=1"
          onPress={() => run('navigateBack(1)', () => Miniapp.navigateBack(1))}
        />
      </View>
      <View style={styles.buttonWrap}>
        <Button
          title="navigateBack delta=2"
          onPress={() => run('navigateBack(2)', () => Miniapp.navigateBack(2))}
        />
      </View>
      <View style={styles.buttonWrap}>
        <Button
          title="navigateTo wrapper"
          onPress={() =>
            run('navigateTo', () =>
              Miniapp.navigateTo(buildRouteUrl('navigateTo-wrapper')),
            )
          }
        />
      </View>
      <View style={styles.buttonWrap}>
        <Button
          title="showToast + param echo"
          onPress={() =>
            run('showToast', () => Miniapp.showToast(`from ${routePath}`))
          }
        />
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
    backgroundColor: '#f5fbff',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 16,
    fontSize: 14,
    textAlign: 'center',
    color: '#334155',
  },
  card: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
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
    fontSize: 12,
    color: '#334155',
  },
});
