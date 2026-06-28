import { invokeHostApi, subscribeToHostEvent } from './runtime/host';

export interface GetNetworkTypeResult {
  networkType: string;
}

export interface NetworkStatusChangeResult {
  isConnected: boolean;
  networkType: string;
}

export const getNetworkType = async () => {
  const result = await invokeHostApi<GetNetworkTypeResult>('getNetworkType');
  return result.networkType;
};

export const onNetworkStatusChange = (
  callback: (res: NetworkStatusChangeResult) => void,
) => {
  let unsubscribePromise: Promise<void> | null = null;

  const handle = subscribeToHostEvent<NetworkStatusChangeResult>(
    'networkStatusChange',
    {},
    callback,
  );

  return () => {
    if (!unsubscribePromise) {
      unsubscribePromise = handle.then(subscription =>
        subscription.unsubscribe(),
      );
    }
    return unsubscribePromise;
  };
};
