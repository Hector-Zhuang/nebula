import { subscribeToHostEvent } from './runtime/host';

export interface SensorData {
  x: number;
  y: number;
  z: number;
  timestamp?: number;
}

export interface BarometerData {
  pressure: number;
}

function createSensorSubscription<TPayload>(
  apiName: string,
  callback: (data: TPayload) => void,
  payload: Record<string, unknown>,
) {
  let unsubscribePromise: Promise<void> | null = null;
  const handle = subscribeToHostEvent<TPayload>(apiName, payload, callback);

  return () => {
    if (!unsubscribePromise) {
      unsubscribePromise = handle.then(subscription =>
        subscription.unsubscribe(),
      );
    }
    return unsubscribePromise;
  };
}

export const onAccelerometerChange = (
  callback: (data: SensorData) => void,
  interval: number = 100,
) => createSensorSubscription('accelerometerChange', callback, { interval });

export const onGyroscopeChange = (
  callback: (data: SensorData) => void,
  interval: number = 100,
) => createSensorSubscription('gyroscopeChange', callback, { interval });

export const onMagnetometerChange = (
  callback: (data: SensorData) => void,
  interval: number = 100,
) => createSensorSubscription('magnetometerChange', callback, { interval });

export const onBarometerChange = (callback: (data: BarometerData) => void) =>
  createSensorSubscription('barometerChange', callback, {});
