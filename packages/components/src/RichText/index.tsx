import React, { useState, useRef, useCallback, FC } from 'react';
import { View, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

export interface RichTextProps {
  style?: StyleProp<ViewStyle>;
  html?: string;
}

export const RichText: FC<RichTextProps> = props => {
  const { style, html = '' } = props;
  const [webViewHeight, setWebViewHeight] = useState<number>(0);
  const webviewRef = useRef<WebView>(null);

  const onMessage = useCallback((event: WebViewMessageEvent): void => {
    const height = Number(event.nativeEvent.data);
    if (height > 0) {
      setWebViewHeight(height);
    }
  }, []);

  const onLoadEnd = useCallback(() => {
    webviewRef.current?.injectJavaScript(
      'window.ReactNativeWebView.postMessage(document.body.scrollHeight);',
    );
  }, []);

  const injectedJavaScript = `
    (function() {
      document.documentElement.style.padding = '0';
      document.documentElement.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.margin = '0';
      window.ReactNativeWebView.postMessage(document.body.scrollHeight);
    })();
    true;
  `;

  return (
    <View
      style={[
        {
          height: webViewHeight,
          width: '100%',
        },
        style,
      ]}
    >
      <WebView
        ref={webviewRef}
        source={{
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
                <style>
                  body { font-family: -apple-system, system-ui; overflow: hidden; }
                </style>
              </head>
              <body>
                ${html}
              </body>
            </html>
          `,
        }}
        scrollEnabled={false}
        scalesPageToFit={false}
        onMessage={onMessage}
        injectedJavaScript={injectedJavaScript}
        onLoadEnd={onLoadEnd}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  webview: {
    backgroundColor: 'transparent',
  },
});
