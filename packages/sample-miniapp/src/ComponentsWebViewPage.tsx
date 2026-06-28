import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { WebView as NebulaWebView } from '@nebula-rn/components';

export default function ComponentsWebViewPage() {
  const [webViewLoading, setWebViewLoading] = useState(true);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, system-ui;
          margin: 0;
          padding: 20px;
          background: #f8fafc;
        }
        .container {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 { color: #4f46e5; font-size: 20px; }
        p { color: #475569; line-height: 1.5; }
        button {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 6px;
          width: 100%;
          font-weight: bold;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Hello from HTML</h1>
        <p>This is rendered from a local string using the WebView component.</p>
        <button onclick="window.ReactNativeWebView.postMessage('Action Triggered!')">
          Send Message to App
        </button>
      </div>
    </body>
    </html>
  `;

  const onWebViewLoadEnd = () => {
    setWebViewLoading(false);
  };

  const onWebViewMessageHandler = (event: any) => {
    Alert.alert('WebView Message', event.nativeEvent.data);
  };

  const onWebViewErrorHandler = (error: any) => {
    Alert.alert('Error', error.nativeEvent.description);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌐 WebView Demo</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Remote Website</Text>
        <View style={styles.webViewWrapper}>
          <NebulaWebView
            src="https://reactnative.dev"
            style={styles.webView}
            onLoadEnd={onWebViewLoadEnd}
            onError={onWebViewErrorHandler}
          />
          {webViewLoading && (
            <ActivityIndicator
              style={styles.loader}
              size="small"
              color="#4f46e5"
            />
          )}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Local HTML String</Text>
        <View style={styles.webViewWrapper}>
          <NebulaWebView
            html={htmlContent}
            style={styles.webView}
            onMessage={onWebViewMessageHandler}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f1f5f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  webViewWrapper: {
    width: '100%',
    height: 350,
    borderRadius: 8,
    backgroundColor: 'red',
  },
  webView: {
    flex: 1,
    width: 500,
    backgroundColor: 'red',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
  },
});
