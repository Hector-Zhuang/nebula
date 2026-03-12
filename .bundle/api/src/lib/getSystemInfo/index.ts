import { errorHandler, successHandler } from '../../utils'
import { collectSystemInfo } from '../systemInfo'
export function getSystemInfo(opts: getSystemInfo.Option = {}): Promise<getSystemInfo.Result> {
  const { success, fail, complete }: any = opts
  try {
    const res = {
      ...collectSystemInfo(),
      errMsg: 'getSystemInfo: ok'
    }
    return successHandler(success, complete)(res)
  } catch (err) {
    const res = { errMsg: err.message }
    return errorHandler(fail, complete)(res)
  }
}
