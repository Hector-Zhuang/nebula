# @nebula-rn/sdk

The JavaScript/TypeScript client SDK for [Nebula](https://github.com/Hector-Zhuang/nebula),
an enterprise-grade SuperApp framework for React Native. It provides the
`Miniapp` runtime that hosts embed, the `NebulaAPI` surface mini-app code calls
into, the host API bridge protocol, page lifecycle hooks, and page config
utilities.

## Installation

```bash
npm install @nebula-rn/sdk
```

Peer dependencies: `react >= 19` and `react-native >= 0.83`. The package
includes Nitro codegen specs (`codegenConfig` → `NebulaSpecs`) for the native
Nebula module.

## Hosting a mini-app

Wrap your host app component with `NebulaAPI.wrap` to configure the runtime
and wire host API features:

```tsx
import { NebulaAPI } from '@nebula-rn/sdk';
import { defaultHostApis } from '@nebula-rn/host-apis';

export default NebulaAPI.wrap({
  hostApis: defaultHostApis,
  serverBaseURL: 'https://nebula.example.com',
})(HostApp);
```

## Writing mini-app pages

Create pages with lifecycle hooks and typed page configs:

```tsx
import { createMiniAppPage, usePageOnShow, definePageConfig } from '@nebula-rn/sdk';

export const pageConfig = definePageConfig({
  navigationBarTitleText: 'Home',
  navigationStyle: 'default',
});

export default createMiniAppPage(() => {
  usePageOnShow(() => console.log('page shown'));
  // ... your UI
});
```

`resolvePageConfig` merges an (untyped, bridge-delivered) page config with the
SDK defaults — `navigationStyle: 'default'`,
`visualEffectInBackground: 'none'` — and drops manifest-only keys such as
`route`.

## Calling host APIs

`NebulaAPI` exposes the mini-app side of the bridge (system info, storage,
location, media, files, subscriptions, mini-app updates, and more). Hosts
implement the matching side with feature factories from this package:

- `createHostApiFeature` — request/response API handler
- `createHostModalApiFeature` / `registerHostModalApi` — APIs backed by a host
  modal component (scanning, image preview)
- `createMockHostApiFeature` — mock handler for development
- `createHostApiSuccess` / `createHostApiFailure` — protocol result helpers

## Page lifecycle hooks

`usePageOnLoad`, `usePageOnReady`, `usePageOnShow`, `usePageOnHide`,
`usePageOnUnload` mirror the mini-app page lifecycle and can be used inside
pages created with `createMiniAppPage`.

## Documentation

Getting started and guides:
https://github.com/Hector-Zhuang/nebula/tree/main/packages/nebula-docs/content/docs

## License

Apache-2.0
