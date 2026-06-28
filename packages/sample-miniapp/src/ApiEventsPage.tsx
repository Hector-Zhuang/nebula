import React, { useRef } from 'react';
import {
  getNetworkType,
  onAccelerometerChange,
  onBarometerChange,
  onLocationChange,
  onMagnetometerChange,
  onNetworkStatusChange,
  onGyroscopeChange,
  onUserCaptureScreen,
} from '@nebula-rn/client';
import {
  ApiButton,
  ApiCard,
  ApiTestPage,
  useApiResultState,
} from './ApiTestUtils';

type StopHandle = (() => void | Promise<void>) | null;

export default function ApiEventsPage() {
  const { result, run, setResult } = useApiResultState();
  const locationStopRef = useRef<StopHandle>(null);
  const networkStopRef = useRef<StopHandle>(null);
  const screenshotStopRef = useRef<StopHandle>(null);
  const accelStopRef = useRef<StopHandle>(null);
  const gyroStopRef = useRef<StopHandle>(null);
  const magnetStopRef = useRef<StopHandle>(null);
  const barometerStopRef = useRef<StopHandle>(null);

  const stop = async (
    label: string,
    ref: React.MutableRefObject<StopHandle>,
  ) => {
    const handle = ref.current;
    ref.current = null;
    if (handle) {
      await Promise.resolve(handle());
    }
    setResult(`${label}: stopped`);
  };

  return (
    <ApiTestPage
      title="Subscriptions & Sensors"
      subtitle="Validate host event subscriptions for location, network, screenshot, and sensor streams."
      result={result}
    >
      <ApiCard title="Network">
        <ApiButton
          title="getNetworkType()"
          color="#2563eb"
          onPress={() => run('getNetworkType', () => getNetworkType())}
        />
        <ApiButton
          title="Start onNetworkStatusChange()"
          color="#1d4ed8"
          onPress={() => {
            networkStopRef.current?.();
            networkStopRef.current = onNetworkStatusChange(payload => {
              setResult(`onNetworkStatusChange: ${JSON.stringify(payload)}`);
            });
            setResult('onNetworkStatusChange: subscribed');
          }}
        />
        <ApiButton
          title="Stop network subscription"
          color="#1e40af"
          onPress={() => stop('onNetworkStatusChange', networkStopRef)}
        />
      </ApiCard>

      <ApiCard title="Location & Screenshot">
        <ApiButton
          title="Start onLocationChange()"
          color="#0f766e"
          onPress={() => {
            locationStopRef.current?.();
            locationStopRef.current = onLocationChange(
              true,
              payload =>
                setResult(`onLocationChange: ${JSON.stringify(payload)}`),
              error =>
                setResult(
                  `onLocationChange: FAILED - ${
                    error instanceof Error
                      ? error.message
                      : JSON.stringify(error)
                  }`,
                ),
            );
            setResult('onLocationChange: subscribed');
          }}
        />
        <ApiButton
          title="Stop location subscription"
          color="#115e59"
          onPress={() => stop('onLocationChange', locationStopRef)}
        />
        <ApiButton
          title="Start onUserCaptureScreen()"
          color="#7c3aed"
          onPress={() => {
            screenshotStopRef.current?.();
            screenshotStopRef.current = onUserCaptureScreen(() => {
              setResult('onUserCaptureScreen: screenshot detected');
            });
            setResult('onUserCaptureScreen: subscribed, take a screenshot now');
          }}
        />
        <ApiButton
          title="Stop screenshot subscription"
          color="#6d28d9"
          onPress={() => stop('onUserCaptureScreen', screenshotStopRef)}
        />
      </ApiCard>

      <ApiCard title="Sensors">
        <ApiButton
          title="Start accelerometer"
          color="#ea580c"
          onPress={() => {
            accelStopRef.current?.();
            accelStopRef.current = onAccelerometerChange(payload => {
              setResult(`accelerometer: ${JSON.stringify(payload)}`);
            }, 300);
            setResult('accelerometer: subscribed');
          }}
        />
        <ApiButton
          title="Start gyroscope"
          color="#c2410c"
          onPress={() => {
            gyroStopRef.current?.();
            gyroStopRef.current = onGyroscopeChange(payload => {
              setResult(`gyroscope: ${JSON.stringify(payload)}`);
            }, 300);
            setResult('gyroscope: subscribed');
          }}
        />
        <ApiButton
          title="Start magnetometer"
          color="#9a3412"
          onPress={() => {
            magnetStopRef.current?.();
            magnetStopRef.current = onMagnetometerChange(payload => {
              setResult(`magnetometer: ${JSON.stringify(payload)}`);
            }, 300);
            setResult('magnetometer: subscribed');
          }}
        />
        <ApiButton
          title="Start barometer"
          color="#7f1d1d"
          onPress={() => {
            barometerStopRef.current?.();
            barometerStopRef.current = onBarometerChange(payload => {
              setResult(`barometer: ${JSON.stringify(payload)}`);
            });
            setResult('barometer: subscribed');
          }}
        />
        <ApiButton
          title="Stop all sensor subscriptions"
          color="#334155"
          onPress={async () => {
            await Promise.all([
              Promise.resolve(accelStopRef.current?.()),
              Promise.resolve(gyroStopRef.current?.()),
              Promise.resolve(magnetStopRef.current?.()),
              Promise.resolve(barometerStopRef.current?.()),
            ]);
            accelStopRef.current = null;
            gyroStopRef.current = null;
            magnetStopRef.current = null;
            barometerStopRef.current = null;
            setResult('sensors: stopped');
          }}
        />
      </ApiCard>
    </ApiTestPage>
  );
}
