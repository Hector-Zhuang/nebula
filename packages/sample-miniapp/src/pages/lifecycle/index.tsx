import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Miniapp,
  usePageOnHide,
  usePageOnLoad,
  usePageOnReady,
  usePageOnShow,
  usePageOnUnload,
} from '@nebula-rn/sdk';

type EventLog = {
  label: string;
  payload?: string;
  timestamp: string;
};

export default function LifecyclePage(props) {
  const [logs, setLogs] = React.useState<EventLog[]>([]);
  const routePath = String(props?.__routePath ?? '/lifecycle');

  const appendLog = React.useCallback((label: string, payload?: unknown) => {
    const nextLog: EventLog = {
      label,
      payload:
        payload === undefined ? undefined : JSON.stringify(payload, null, 2),
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs(current => [nextLog, ...current].slice(0, 12));
  }, []);

  usePageOnLoad(params => {
    appendLog('onLoad', params);
  });

  usePageOnShow(() => {
    appendLog('onShow');
  });

  usePageOnReady(() => {
    appendLog('onReady');
  });

  usePageOnHide(() => {
    appendLog('onHide');
  });

  usePageOnUnload(() => {
    console.log(
      '[LifecyclePage] onUnload',
      JSON.stringify({
        routePath,
        instanceId: props?.instanceId ?? 'unknown',
      }),
    );
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Page Lifecycle</Text>
      <Text style={styles.subtitle}>
        Observe onLoad / onShow / onReady / onHide / onUnload in action
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Route</Text>
        <Text style={styles.meta}>route: {routePath}</Text>
        <Text style={styles.meta}>
          appId: {String(props?.appId ?? 'unknown')}
        </Text>
        <Text style={styles.meta}>
          instanceId: {String(props?.instanceId ?? 'unknown')}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Try These</Text>
        <View style={styles.buttonWrap}>
          <Button
            title="navigateTo Page 1"
            onPress={() =>
              Miniapp.navigateTo(`/page1?from=lifecycle&ts=${Date.now()}`)
            }
            color="#2563eb"
          />
        </View>
        <View style={styles.buttonWrap}>
          <Button
            title="navigateBack"
            onPress={() => Miniapp.navigateBack(1)}
            color="#0f766e"
          />
        </View>
        <View style={styles.buttonWrap}>
          <Button
            title="Open another lifecycle page"
            onPress={() => Miniapp.navigateTo(`/lifecycle?clone=${Date.now()}`)}
            color="#7c3aed"
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Event Logs</Text>
        {logs.map((log, index) => (
          <View
            key={`${log.label}-${log.timestamp}-${index}`}
            style={styles.logRow}
          >
            <Text style={styles.logTitle}>
              {log.label} · {log.timestamp}
            </Text>
            {log.payload ? (
              <Text style={styles.logBody}>{log.payload}</Text>
            ) : null}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8fafc',
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
    borderColor: '#dbeafe',
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
  logRow: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
  },
  logTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  logBody: {
    marginTop: 6,
    fontSize: 12,
    color: '#334155',
    fontFamily: 'Courier',
  },
});
