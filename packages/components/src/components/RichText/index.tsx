/**
 * ✔ nodes
 */

import * as React from 'react'
import { View } from 'react-native'
import {
  WebView,
  WebViewMessageEvent
} from 'react-native-webview'

import { omit } from '../../utils'
import { Node, RichTextProps } from './PropsType'

const renderChildrens = (arr: Node[]): string => {
  if (arr.length === 0) return ''
  return arr.map((list) => {
    if (list.type === 'text') {
      return list.text
    }
    return renderNodes(list)
  }).join('')
}

const renderNodes = (item: Node): string => {
  const child = item.children ? renderChildrens(item.children) : ''
  return `<${item.name} ${item.attrs && Object.keys(item.attrs).map(key => `${key}="${item.attrs[key]}"`).join(' ')}>${child}</${item.name}>`
}

const RichText = (props: RichTextProps): JSX.Element => {
  const { style, nodes = '' } = props
  const [webViewHeight, setWebViewHeight] = React.useState<number>(0)
  const webview = React.useRef<WebView>(null)

  const otherProps = omit(props, ['style', 'nodes'])

  const html: string = React.useMemo(() => {
    return typeof nodes === 'string'
      ? nodes
      : nodes.map((item: Node): string => renderNodes(item)).join('')
  }, [nodes])

  const onWebViewMessage = React.useCallback((event: WebViewMessageEvent): void => {
    setWebViewHeight(Number(event.nativeEvent.data))
  }, [])

  return (
    <View style={Object.assign({
      height: webViewHeight,
      width: '100%',
    }, style)}>
      <WebView
        ref={webview}
        source={{ html: '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>' + html }}
        scalesPageToFit={false}
        onMessage={onWebViewMessage}
        injectedJavaScript={`
            document.documentElement.style.padding = 0;
            document.documentElement.style.margin = 0;
            document.body.style.padding = 0;
            document.body.style.margin = 0;
            window.ReactNativeWebView.postMessage(document.body.scrollHeight);
            true;
          `}
        onLoadEnd={() => webview.current?.injectJavaScript('window.ReactNativeWebView.postMessage(document.body.scrollHeight);')} // android
        style={{
          backgroundColor: 'transparent'
        }}
        {...otherProps}
      />
    </View>
  )
}

RichText.defaultProps = {
  nodes: ''
}

export default RichText
