import { Linking } from 'react-native'

export async function makePhoneCall(opts: makePhoneCall.Option): Promise<CallbackResult> {
  const { phoneNumber } = opts
  const res = { errMsg: 'makePhoneCall:ok' }
  const telUrl = `tel:${phoneNumber}`

  const isSupport = await Linking.canOpenURL(telUrl)
  if (isSupport) {
    await Linking.openURL(telUrl)
    return Promise.resolve(res)
  } else {
    res.errMsg = 'makePhoneCall:fail. Do not support the makePhoneCall Api'
    return Promise.reject(res)
  }
}
