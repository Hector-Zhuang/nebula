import Clipboard from '@react-native-clipboard/clipboard'

import { showToast } from '../showModal/toast'
export function setClipboardData(opts: setClipboardData.Option): Promise<setClipboardData.Promised> {
  const { data } = opts

  if (typeof data !== 'string') {
    const res = {
      errMsg: 'setClipboardData:fail parameter error: parameter.data should be String'
    }
    return Promise.reject(res)
  }

  Clipboard.setString(data)
  const res = {
    errMsg: 'setClipboardData:ok',
    data,
  }
  showToast({
    icon: 'none',
    title: '内容已复制'
  })
  return Promise.resolve(res)
}
