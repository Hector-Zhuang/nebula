import React from 'react';
import { Miniapp } from '@nebula-rn/sdk';
import {
  ApiButton,
  ApiCard,
  ApiTestPage,
  useApiResultState,
} from './ApiTestUtils';

const routes = [
  {
    title: 'Device & Clipboard',
    url: '/api-tests-device',
    color: '#2563eb',
  },
  {
    title: 'Storage & Files',
    url: '/api-tests-storage-file',
    color: '#7c3aed',
  },
  {
    title: 'Media & Modal APIs',
    url: '/api-tests-media',
    color: '#ea580c',
  },
  {
    title: 'Subscriptions & Sensors',
    url: '/api-tests-events',
    color: '#0f766e',
  },
  {
    title: 'ScanCode Lab',
    url: '/scan-code',
    color: '#16a34a',
  },
];

export default function ApiTestsHubPage() {
  const { result, run } = useApiResultState();

  return (
    <ApiTestPage
      title="API Test Center"
      subtitle="Open grouped playground pages to validate every Nebula base library API."
      result={result}
    >
      <ApiCard
        title="Open Test Pages"
        description="Each page focuses on one API family so that failures are easier to isolate."
      >
        {routes.map(item => (
          <ApiButton
            key={item.url}
            title={item.title}
            color={item.color}
            onPress={() =>
              run(item.title, () =>
                Miniapp.navigateTo(`${item.url}?from=api-hub&ts=${Date.now()}`),
              )
            }
          />
        ))}
      </ApiCard>
    </ApiTestPage>
  );
}
