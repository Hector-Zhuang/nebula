import { collectSystemInfo } from '../systemInfo'
export function getSystemInfo(opts: getSystemInfo.Option = {}): Promise<getSystemInfo.Result> {
  try {
    const res = {
      ...collectSystemInfo(),
      errMsg: 'getSystemInfo: ok'
    }
    return Promise.resolve(res)
  } catch (err) {
    const res = { errMsg: err.message }
    return Promise.reject(res)
  }
}
