import { subscribeToHostEvent } from '../runtime/host';

export const onUserCaptureScreen = (callback: () => void) => {
  let unsubscribePromise: Promise<void> | null = null;
  const handle = subscribeToHostEvent<null>('userCaptureScreen', {}, () =>
    callback(),
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
