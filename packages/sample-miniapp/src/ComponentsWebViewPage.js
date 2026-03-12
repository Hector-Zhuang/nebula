import React from 'react';
import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { WebView as NebulaWebView } from '@nebula/components';

export default function ComponentsWebViewPage() {
  const [webViewLoading, setWebViewLoading] = React.useState(true);
  const [webViewTitle, setWebViewTitle] = React.useState('Loading...');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          margin: 0;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h1 {
          color: #667eea;
          text-align: center;
          margin-top: 0;
        }
        .feature {
          margin: 16px 0;
          padding: 12px;
          background: #f8f9ff;
          border-left: 4px solid #667eea;
          border-radius: 4px;
        }
        .feature-title {
          font-weight: 600;
          color: #667eea;
          margin-bottom: 4px;
        }
        button {
          background: #667eea;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          margin-top: 16px;
          width: 100%;
        }
        button:hover {
          background: #764ba2;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🌐 WebView Demo</h1>
        <div class="feature">
          <div class="feature-title">HTML Rendering</div>
          <p>WebView can render complete HTML content with CSS styling</p>
        </div>
        <div class="feature">
          <div class="feature-title">Interactive Content</div>
          <p>Support for JavaScript interactions and user engagement</p>
        </div>
        <div class="feature">
          <div class="feature-title">Responsive Design</div>
          <p>Mobile-optimized layouts that adapt to screen size</p>
        </div>
        <button onclick="alert('Button clicked!')">Click Me!</button>
      </div>
    </body>
    </html>
  `;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌐 WebView Component</Text>

      {/* HTML Content WebView */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Embedded HTML</Text>
        <Text style={styles.hint}>render HTML content directly</Text>
        
        <View style={styles.webViewContainer}>
          <NebulaWebView
            source={{ html: htmlContent }}
            style={styles.webView}
            onLoad={() => {
              setWebViewLoading(false);
              setWebViewTitle('Loaded');
            }}
            onLoadStart={() => {
              setWebViewLoading(true);
              setWebViewTitle('Loading...');
            }}
            onError={(error) => {
              console.error('WebView error:', error);
              Alert.alert('WebView Error', error?.nativeEvent?.description || 'Failed to load');
            }}
            onMessage={(event) => {
              console.log('WebView message:', event.nativeEvent.data);
            }}
          />
        </View>
        
        <View style={styles.spacer} />
        <Text style={styles.meta}>Status: {webViewTitle}</Text>
        <Text style={styles.meta}>Loading: {webViewLoading ? '⏳ Loading' : '✅ Complete'}</Text>
      </View>

      {/* Remote URL WebView */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Remote URL</Text>
        <Text style={styles.hint}>load content from external URL</Text>
        
        <View style={styles.webViewContainer}>
          <NebulaWebView
            source={{ uri: 'https://www.example.com' }}
            style={styles.webView}
            onLoad={() => console.log('Remote page loaded')}
            onError={(error) => {
              console.error('Remote load error:', error);
            }}
          />
        </View>
      </View>

      {/* WebView Features */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>WebView Features</Text>
        <Text style={styles.hint}>capabilities and use cases</Text>

        <View style={styles.featuresList}>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>📱</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Responsive</Text>
              <Text style={styles.featureDesc}>Adapts to any screen size</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>✨</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>JavaScript Support</Text>
              <Text style={styles.featureDesc}>Execute scripts and DOM interactions</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>🎨</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Styled Content</Text>
              <Text style={styles.featureDesc}>Full CSS support for rich formatting</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>🔗</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>URL Loading</Text>
              <Text style={styles.featureDesc}>Load remote web pages</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>⚡</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Fast Performance</Text>
              <Text style={styles.featureDesc}>Optimized rendering engine</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>🔒</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Security</Text>
              <Text style={styles.featureDesc}>Sandboxed content execution</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Use Cases */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Common Use Cases</Text>
        <Text style={styles.hint}>typical WebView implementations</Text>

        <View style={styles.useCasesList}>
          <View style={styles.useCase}>
            <Text style={styles.useCaseIcon}>📰</Text>
            <Text style={styles.useCaseText}>Display rich formatted content like articles or newsletters</Text>
          </View>

          <View style={styles.useCase}>
            <Text style={styles.useCaseIcon}>💳</Text>
            <Text style={styles.useCaseText}>Embed payment pages or checkout flows</Text>
          </View>

          <View style={styles.useCase}>
            <Text style={styles.useCaseIcon}>🎓</Text>
            <Text style={styles.useCaseText}>Display educational content or documentation</Text>
          </View>

          <View style={styles.useCase}>
            <Text style={styles.useCaseIcon}>📊</Text>
            <Text style={styles.useCaseText}>Embed interactive charts and dashboards</Text>
          </View>

          <View style={styles.useCase}>
            <Text style={styles.useCaseIcon}>🌐</Text>
            <Text style={styles.useCaseText}>Load and display web pages or web apps</Text>
          </View>
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
  webViewContainer: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f4f8',
  },
  webView: {
    width: '100%',
    height: '100%',
  },
  spacer: {
    height: 8,
  },
  meta: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
  },
  featuresList: {
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 11,
    color: '#64748b',
  },
  useCasesList: {
    gap: 8,
  },
  useCase: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    gap: 10,
  },
  useCaseIcon: {
    fontSize: 18,
  },
  useCaseText: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
    lineHeight: 18,
  },
});
