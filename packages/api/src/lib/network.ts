import NetInfo, { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo'
let _unsubscribe: any = null

const _callbacks: Set<Function> = new Set()

function getTypeFromState(connectionInfo:NetInfoState): keyof getNetworkType.NetworkType {
  let type: keyof getNetworkType.NetworkType
  if (connectionInfo.type === NetInfoStateType.wifi) {
    type = NetInfoStateType.wifi
  } else if (connectionInfo.type === NetInfoStateType.cellular && connectionInfo.details.cellularGeneration) {
    type = connectionInfo.details.cellularGeneration
  } else if (connectionInfo.type === NetInfoStateType.none) {
    type = 'none'
  } else {
    type = 'unknown'
  }
  return type
}

export function getNetworkType(opts: getNetworkType.Option = {}): Promise<getNetworkType.SuccessCallbackResult> {

  return new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then((connectionInfo) => {
        const res: getNetworkType.SuccessCallbackResult = {
          errMsg: 'getNetworkType:ok',
          networkType: getTypeFromState(connectionInfo),
        }

        resolve(res)
      }).catch((err) => {
        const res: CallbackResult = {
          errMsg: err.message
        }

        reject(err)
      })
  })
}

export function onNetworkStatusChange(fnc: onNetworkStatusChange.Callback): void {
  _callbacks.add(fnc)
  if (!_unsubscribe) {
    _unsubscribe = NetInfo.addEventListener((connectionInfo) => {
      _callbacks.forEach(cb => {
        const { isConnected } = connectionInfo
        cb?.({ isConnected, networkType: getTypeFromState(connectionInfo) })
      })
    })
  }
}

export function offNetworkStatusChange(fnc?: onNetworkStatusChange.Callback): void {
  if (fnc && typeof fnc === 'function') {
    _callbacks.delete(fnc)
  } else if (fnc === undefined) {
    _callbacks.clear()
    _unsubscribe?.()
    _unsubscribe = null
  } else {
    console.warn('offNetworkStatusChange failed')
  }
}
