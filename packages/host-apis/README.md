# @nebula-rn/host-apis

Official host API feature bundle for [Nebula](https://github.com/Hector-Zhuang/nebula),
an enterprise-grade SuperApp framework for React Native. It implements the
Taro/WeChat-style mini-app host APIs (`getSystemInfo`, `getLocation`,
`storage.*`, `fileSystem.*`, subscriptions, ...) as host-side features built on
the `@nebula-rn/sdk` host API bridge, and ships them ready to wire into a host
or dev runner app.

## Installation

```bash
npm install @nebula-rn/host-apis
```

The package depends on `@nebula-rn/sdk` plus the native libraries that power
the individual APIs (clipboard, geolocation, netinfo, camera-roll, mmkv,
device-info, image-picker, sensors, react-native-fs, and more).

## Usage

Register the bundle by wrapping your host app with `NebulaAPI.wrap`:

```tsx
import { NebulaAPI } from '@nebula-rn/sdk';
import { defaultHostApis } from '@nebula-rn/host-apis';

export default NebulaAPI.wrap({
  hostApis: defaultHostApis,
})(HostApp);
```

## Exports

| Export | Description |
|---|---|
| `defaultHostApis` | The recommended full bundle: scan, preview image, and all core APIs |
| `coreHostApis` | Every core feature listed below (device, storage, files, media, subscriptions) |
| `scanCodeHostApi` | QR/barcode scanning via a host modal bridge |
| `previewImageHostApi` | Full-screen image preview via a host modal bridge |
| `saveMediaHost` | Standalone save-to-camera-roll handler |
| `downloadFileHostApi` / `downloadFileHost` | Background download task API and handler |
| `uploadFileHostApi` / `uploadFileHost` | Upload task API and handler |

## Covered API surface

`coreHostApis` registers these mini-app API groups:

- **App / device** — `getAppBaseInfo`, `getSystemInfo`, `getScreenBrightness`,
  `makePhoneCall`, `vibrateShort`, `vibrateLong`
- **Clipboard** — `getClipboardData`, `setClipboardData`
- **Location** — `getLocation` plus `locationChange.subscribe/unsubscribe`
- **Network** — `getNetworkType` plus `networkStatusChange.subscribe/unsubscribe`
- **Storage** — `storage.setItem/getItem/removeItem/clearItems/getKeys/getCurrentSize`
  backed by MMKV
- **File system** — `fileSystem.access/appendFile/saveFile/copyFile/mkdir/
  readFile/readdir/rename/rmdir/unlink/writeFile/getFileInfo` plus `removeFile`,
  sandboxed to the current mini-app
- **Media** — `getImageInfo`, `compressImage`, `chooseMedia`, `saveMedia`
- **Files metadata** — `getFileInfo`
- **Sensors** — `accelerometerChange`, `gyroscopeChange`, `magnetometerChange`,
  `barometerChange` (`subscribe/unsubscribe`)
- **Screenshot awareness** — `userCaptureScreen.subscribe/unsubscribe`
- **Mini-app updates** — `getMiniAppUpdateInfo`, `applyMiniAppUpdate`

Each feature carries a `NebulaHostApiDescription` (summary and tags) so hosts
can enumerate and document their exposed capabilities.

## Documentation

Getting started and guides:
https://github.com/Hector-Zhuang/nebula/tree/main/packages/nebula-docs/content/docs

## License

Apache-2.0
