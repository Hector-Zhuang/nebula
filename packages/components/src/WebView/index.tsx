import React, { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import {
  WebView as RNWebView,
  WebViewProps as RNWebViewProps,
} from 'react-native-webview';

export interface WebViewProps extends Partial<RNWebViewProps> {
  style?: StyleProp<ViewStyle>;
  src?: string;
  html?: string;
}

export const WebView: FC<WebViewProps> = ({ style, src, html, ...rest }) => {
  const source = html ? { html } : { uri: src || '' };

  return (
    <RNWebView
      {...rest}
      source={source}
      style={style}
      originWhitelist={['*']}
    />
  );
};
