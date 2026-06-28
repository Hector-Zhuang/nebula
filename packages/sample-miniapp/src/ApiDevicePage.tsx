import React, { useState } from 'react';
import {
  getAppBaseInfo,
  getClipboardData,
  getLocation,
  getScreenBrightness,
  getSystemInfo,
  makePhoneCall,
  setClipboardData,
} from '@nebula-rn/client';
import {
  ApiButton,
  ApiCard,
  ApiInput,
  ApiTestPage,
  useApiResultState,
} from './ApiTestUtils';

export default function ApiDevicePage() {
  const { result, run } = useApiResultState();
  const [clipboardText, setClipboardText] = useState('Hello from miniapp');
  const [phoneNumber, setPhoneNumber] = useState('10086');

  return (
    <ApiTestPage
      title="Device & Clipboard APIs"
      subtitle="Validate app info, system info, clipboard, location, brightness, and phone calls."
      result={result}
    >
      <ApiCard title="Information APIs">
        <ApiButton
          title="getAppBaseInfo()"
          color="#2563eb"
          onPress={() => run('getAppBaseInfo', () => getAppBaseInfo())}
        />
        <ApiButton
          title="getSystemInfo()"
          color="#1d4ed8"
          onPress={() => run('getSystemInfo', () => getSystemInfo())}
        />
        <ApiButton
          title="getScreenBrightness()"
          color="#1e40af"
          onPress={() =>
            run('getScreenBrightness', () => getScreenBrightness())
          }
        />
      </ApiCard>

      <ApiCard title="Clipboard">
        <ApiInput
          label="Clipboard Text"
          value={clipboardText}
          onChangeText={setClipboardText}
        />
        <ApiButton
          title="setClipboardData()"
          color="#7c3aed"
          onPress={() =>
            run('setClipboardData', () => setClipboardData(clipboardText))
          }
        />
        <ApiButton
          title="getClipboardData()"
          color="#6d28d9"
          onPress={() => run('getClipboardData', () => getClipboardData())}
        />
      </ApiCard>

      <ApiCard title="Location & Calling">
        <ApiButton
          title="getLocation()"
          color="#0f766e"
          onPress={() =>
            run('getLocation', () =>
              getLocation({
                isHighAccuracy: true,
                highAccuracyExpireTime: 15000,
              }),
            )
          }
        />
        <ApiInput
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <ApiButton
          title="makePhoneCall()"
          color="#dc2626"
          onPress={() => run('makePhoneCall', () => makePhoneCall(phoneNumber))}
        />
      </ApiCard>
    </ApiTestPage>
  );
}
