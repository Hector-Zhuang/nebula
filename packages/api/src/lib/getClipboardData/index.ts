import Clipboard from '@react-native-clipboard/clipboard'


export function getClipboardData (opts: getClipboardData.Option = {}): Promise<getClipboardData.Promised> {

  return Clipboard.getString()
    .then((content) => {
      const res = {
        errMsg: 'getClipboardData:ok',
        data: content
      }

      return Promise.resolve(res)
    }).catch((err) => {
      const res = {
        errMsg: err.message
      }
      return Promise.reject(res)
    })
}
