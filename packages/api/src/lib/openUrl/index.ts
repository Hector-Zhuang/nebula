import { Linking } from 'react-native'

interface Option {
  
  url: string
}

export async function openUrl<T>(opts: Option): Promise<T> {
  const { url } = opts || {}
  const res: any = { errMsg: 'openUrl:ok' }

  const isSupport = await Linking.canOpenURL(url)
  if (isSupport) {
    await Linking.openURL(url)
    return Promise.resolve(res)
  } else {
    res.errMsg = 'openUrl:fail. Do not support the openUrl Api'
    return Promise.reject(res)
  }
}

export default {
  openUrl,
}
