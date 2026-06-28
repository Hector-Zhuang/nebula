import { subscribeToHostEvent } from './runtime/host';

export interface LocationData {
  accuracy: number;
  altitude: number | null;
  latitude: number;
  longitude: number;
  speed: number | null;
  timestamp: number;
}

export type UnsubscribeFn = () => void | Promise<void>;

export const onLocationChange = (
  enableHighAccuracy: boolean = true,
  onSuccess: (data: LocationData) => void,
  onError?: (error: unknown) => void,
): UnsubscribeFn => {
  let unsubscribePromise: Promise<void> | null = null;

  const handle = subscribeToHostEvent<LocationData>(
    'locationChange',
    {
      enableHighAccuracy,
    },
    onSuccess,
  ).catch(error => {
    onError?.(error);
    throw error;
  });

  return () => {
    if (!unsubscribePromise) {
      unsubscribePromise = handle
        .then(subscription => subscription.unsubscribe())
        .catch(() => {});
    }
    return unsubscribePromise;
  };
};
