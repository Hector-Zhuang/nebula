import {
  Dimensions,
  Image,
  Linking,
  PermissionsAndroid,
  PixelRatio,
  Platform,
  StatusBar,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import ScreenshotAware from 'react-native-screenshot-aware';
import {
  accelerometer,
  barometer,
  gyroscope,
  magnetometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import { createMMKV } from 'react-native-mmkv';
import DeviceInfo, { getBrightness } from 'react-native-device-info';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {
  Asset,
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import * as RNFS from '@dr.pogodin/react-native-fs';
import {
  NebulaAPI,
  createHostApiFeature,
  createHostApiFailure,
  createHostApiSuccess,
} from '@nebula-rn/sdk';
import type { NebulaHostApiDescriptionMap } from '@nebula-rn/sdk';
import {
  createHostBridgeId,
  createSubscriptionStartResult,
  emitSubscriptionEvent,
} from './hostApiBridge';
import { downloadFileHostApi, uploadFileHostApi } from './taskHosts';

const hostStorage = createMMKV({
  id: 'nebula.host.api.storage',
});

const locationSubscriptions = new Map<string, number>();
const networkSubscriptions = new Map<string, () => void>();
const screenshotSubscriptions = new Map<string, { remove: () => void }>();
const sensorSubscriptions = new Map<string, { unsubscribe: () => void }>();

const HOST_API_DESCRIPTIONS: NebulaHostApiDescriptionMap = {
  getAppBaseInfo: {
    summary:
      'Return basic host app information for the current miniapp runtime.',
    tags: ['device', 'app'],
  },
  getClipboardData: {
    summary: 'Read plain text from the system clipboard.',
    tags: ['clipboard'],
  },
  setClipboardData: {
    summary: 'Write plain text to the system clipboard.',
    tags: ['clipboard'],
  },
  getLocation: {
    summary: 'Get the current device location once.',
    description: 'Requests runtime location permission on Android when needed.',
    tags: ['location'],
  },
  getScreenBrightness: {
    summary: 'Read the current screen brightness reported by the device.',
    tags: ['device'],
  },
  getSystemInfo: {
    summary:
      'Return device, screen, and safe-area information for layout and diagnostics.',
    tags: ['device', 'layout'],
  },
  makePhoneCall: {
    summary: 'Open the system dialer for a phone number.',
    tags: ['device', 'communication'],
  },
  getImageInfo: {
    summary: 'Read width and height information for an image source.',
    tags: ['media', 'image'],
  },
  compressImage: {
    summary: 'Resize and compress an image on the host side.',
    tags: ['media', 'image'],
  },
  getFileInfo: {
    summary: 'Read size and digest information for a file path.',
    tags: ['file'],
  },
  chooseMedia: {
    summary:
      'Open the system image or video picker and return selected assets.',
    tags: ['media', 'picker'],
  },
  saveMedia: {
    summary: 'Save a photo or video into the system media library.',
    tags: ['media'],
  },
  'storage.setItem': {
    summary: 'Persist a string value in host-backed key-value storage.',
    tags: ['storage'],
  },
  'storage.getItem': {
    summary: 'Read a string value from host-backed key-value storage.',
    tags: ['storage'],
  },
  'storage.removeItem': {
    summary: 'Remove a stored key from host-backed key-value storage.',
    tags: ['storage'],
  },
  'storage.clearItems': {
    summary:
      'Clear all host-backed key-value storage entries for the current host store.',
    tags: ['storage'],
  },
  'storage.getKeys': {
    summary: 'List all keys currently stored in host-backed key-value storage.',
    tags: ['storage'],
  },
  'storage.getCurrentSize': {
    summary:
      'Return the approximate size of host-backed key-value storage in KB.',
    tags: ['storage'],
  },
  getNetworkType: {
    summary: 'Read the current network connection type and connectivity state.',
    tags: ['network'],
  },
  getMiniAppUpdateInfo: {
    summary:
      'Return the currently installed version and whether a newer remote version is available.',
    tags: ['miniapp', 'update'],
  },
  applyMiniAppUpdate: {
    summary:
      'Install the latest available remote bundle for the current miniapp when an update exists.',
    tags: ['miniapp', 'update'],
  },
  'locationChange.subscribe': {
    summary: 'Start location change subscription events from the host.',
    tags: ['location', 'subscription'],
  },
  'locationChange.unsubscribe': {
    summary: 'Stop a location change subscription by subscription id.',
    tags: ['location', 'subscription'],
  },
  'networkStatusChange.subscribe': {
    summary: 'Start network status change subscription events from the host.',
    tags: ['network', 'subscription'],
  },
  'networkStatusChange.unsubscribe': {
    summary: 'Stop a network status change subscription by subscription id.',
    tags: ['network', 'subscription'],
  },
  'userCaptureScreen.subscribe': {
    summary: 'Start user screenshot capture subscription events from the host.',
    tags: ['device', 'subscription'],
  },
  'userCaptureScreen.unsubscribe': {
    summary: 'Stop a user screenshot capture subscription by subscription id.',
    tags: ['device', 'subscription'],
  },
  'accelerometerChange.subscribe': {
    summary: 'Start accelerometer sensor subscription events from the host.',
    tags: ['sensor', 'subscription'],
  },
  'accelerometerChange.unsubscribe': {
    summary: 'Stop an accelerometer subscription by subscription id.',
    tags: ['sensor', 'subscription'],
  },
  'gyroscopeChange.subscribe': {
    summary: 'Start gyroscope sensor subscription events from the host.',
    tags: ['sensor', 'subscription'],
  },
  'gyroscopeChange.unsubscribe': {
    summary: 'Stop a gyroscope subscription by subscription id.',
    tags: ['sensor', 'subscription'],
  },
  'magnetometerChange.subscribe': {
    summary: 'Start magnetometer sensor subscription events from the host.',
    tags: ['sensor', 'subscription'],
  },
  'magnetometerChange.unsubscribe': {
    summary: 'Stop a magnetometer subscription by subscription id.',
    tags: ['sensor', 'subscription'],
  },
  'barometerChange.subscribe': {
    summary: 'Start barometer sensor subscription events from the host.',
    tags: ['sensor', 'subscription'],
  },
  'barometerChange.unsubscribe': {
    summary: 'Stop a barometer subscription by subscription id.',
    tags: ['sensor', 'subscription'],
  },
  'fileSystem.access': {
    summary: 'Check whether a file or directory path exists and is accessible.',
    tags: ['file'],
  },
  'fileSystem.appendFile': {
    summary: 'Append text data to a file path.',
    tags: ['file'],
  },
  'fileSystem.saveFile': {
    summary:
      'Copy a temp file into the miniapp sandbox and return the saved path.',
    tags: ['file'],
  },
  'fileSystem.copyFile': {
    summary: 'Copy a file from one path to another.',
    tags: ['file'],
  },
  'fileSystem.mkdir': {
    summary: 'Create a directory path recursively.',
    tags: ['file'],
  },
  'fileSystem.readFile': {
    summary: 'Read a file as text with optional encoding.',
    tags: ['file'],
  },
  'fileSystem.readdir': {
    summary: 'List child entries in a directory.',
    tags: ['file'],
  },
  'fileSystem.rename': {
    summary: 'Rename or move a file or directory.',
    tags: ['file'],
  },
  'fileSystem.rmdir': {
    summary: 'Remove a directory path recursively.',
    tags: ['file'],
  },
  'fileSystem.unlink': {
    summary: 'Delete a file path.',
    tags: ['file'],
  },
  'fileSystem.writeFile': {
    summary: 'Write text data to a file path.',
    tags: ['file'],
  },
  'fileSystem.getFileInfo': {
    summary: 'Read file stat information for a sandbox path.',
    tags: ['file'],
  },
  removeFile: {
    summary:
      'Remove a file from the miniapp sandbox and return whether it was deleted.',
    tags: ['file'],
  },
};

async function ensureLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  const finePermission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
  const coarsePermission =
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION;

  const fineGranted = await PermissionsAndroid.check(finePermission);
  const coarseGranted = await PermissionsAndroid.check(coarsePermission);
  if (fineGranted || coarseGranted) {
    return true;
  }

  const granted = await PermissionsAndroid.request(finePermission);
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  const coarseGrantedAfterRequest =
    await PermissionsAndroid.request(coarsePermission);
  return coarseGrantedAfterRequest === PermissionsAndroid.RESULTS.GRANTED;
}

type ChooseMediaOption = {
  count?: number;
  mediaType?: ('image' | 'video' | 'mix')[];
  sourceType?: ('album' | 'camera')[];
  maxDuration?: number;
  sizeType?: ('original' | 'compressed')[];
  camera?: 'back' | 'front';
};

type SaveMediaPayload = {
  url: string;
  type: 'photo' | 'video';
  album?: string;
};

function resolveMiniAppPath(path: unknown, appId?: string): string {
  const rawPath = String(path ?? '');

  if (!rawPath) {
    return '';
  }

  const normalizedPath = rawPath.startsWith('file://')
    ? rawPath.slice('file://'.length)
    : rawPath;
  const miniAppPrefix = `/Documents/MiniApps/${appId ?? ''}`;

  if (appId && normalizedPath.startsWith(miniAppPrefix)) {
    return `${RNFS.DocumentDirectoryPath}/MiniApps/${appId}${normalizedPath.slice(
      miniAppPrefix.length,
    )}`;
  }

  if (normalizedPath.startsWith('/Documents/')) {
    return `${RNFS.DocumentDirectoryPath}${normalizedPath.slice(
      '/Documents'.length,
    )}`;
  }

  return normalizedPath;
}

export const saveMediaHost = async (payload: SaveMediaPayload) => {
  return CameraRoll.saveAsset(payload.url, {
    type: payload.type,
    album: payload.album,
  });
};

function getSafeArea() {
  const screen = Dimensions.get('screen');
  const screenWidth = screen.width;
  const screenHeight = screen.height;
  const insets = initialWindowMetrics?.insets;
  let top = insets?.top ?? 0;
  const bottom = insets?.bottom ?? 0;

  if (Platform.OS === 'android') {
    top = StatusBar.currentHeight ?? top;
  }

  const w = Math.min(screenWidth, screenHeight);
  const h = Math.max(screenWidth, screenHeight);

  return {
    left: 0,
    right: w,
    top,
    bottom: h - bottom,
    height: Math.max(0, h - bottom - top),
    width: w,
  };
}

function getStorageKeys(): string[] {
  return hostStorage.getAllKeys();
}

function getStorageCurrentSize(): number {
  const keys = getStorageKeys();
  const size = keys.reduce((total, key) => {
    const value = hostStorage.getString(key);
    return total + (value?.length ?? 0);
  }, 0);

  return Number((size / 1024).toFixed(2));
}

function chooseMediaHost(options: ChooseMediaOption = {}) {
  return new Promise<{
    tempFiles: Array<{
      tempFilePath: string;
      size: number;
      duration?: number;
      height?: number;
      width?: number;
      thumbTempFilePath?: string;
      fileType: 'image' | 'video';
    }>;
    type: 'image' | 'video' | 'mix';
  }>((resolve, reject) => {
    const {
      count = 9,
      mediaType = ['image', 'video'],
      sourceType = ['album', 'camera'],
      maxDuration = 10,
      sizeType = ['original', 'compressed'],
      camera = 'back',
    } = options;

    const isCompressed = sizeType.includes('compressed');
    let pickerMediaType: 'photo' | 'video' | 'mixed' = 'mixed';

    if (mediaType.length === 1) {
      if (mediaType[0] === 'image') {
        pickerMediaType = 'photo';
      } else if (mediaType[0] === 'video') {
        pickerMediaType = 'video';
      }
    }

    const pickerOptions: CameraOptions & ImageLibraryOptions = {
      selectionLimit: count,
      durationLimit: maxDuration,
      cameraType: camera,
      quality: isCompressed ? 0.8 : 1,
      mediaType: pickerMediaType,
      includeExtra: true,
      assetRepresentationMode: 'auto',
    };

    const onPickerResponse = (response: ImagePickerResponse) => {
      if (response.didCancel) {
        reject(new Error('chooseMedia:fail cancel'));
        return;
      }

      if (response.errorCode) {
        reject(
          new Error(
            response.errorMessage || `chooseMedia:fail ${response.errorCode}`,
          ),
        );
        return;
      }

      const tempFiles: Array<{
        tempFilePath: string;
        size: number;
        duration?: number;
        height?: number;
        width?: number;
        thumbTempFilePath?: string;
        fileType: 'image' | 'video';
      }> = (response.assets || []).map((asset: Asset) => ({
        tempFilePath: asset.uri || '',
        size: asset.fileSize || 0,
        duration: asset.duration,
        height: asset.height,
        width: asset.width,
        thumbTempFilePath: undefined,
        fileType: asset.type?.includes('video') ? 'video' : 'image',
      }));

      resolve({
        tempFiles,
        type: mediaType.includes('mix')
          ? 'mix'
          : (mediaType[0] as 'image' | 'video') || 'image',
      });
    };

    const isOnlyCamera = sourceType.length === 1 && sourceType[0] === 'camera';
    if (isOnlyCamera) {
      launchCamera(pickerOptions, onPickerResponse);
      return;
    }

    launchImageLibrary(pickerOptions, onPickerResponse);
  });
}

function buildSystemInfo() {
  const brand = DeviceInfo.getBrand();
  const model = DeviceInfo.getModel();
  const pixelRatio = PixelRatio.get();
  const fontScale = PixelRatio.getFontScale();
  const os = Platform.OS;
  const version = DeviceInfo.getVersion();
  const system = `${os} ${Platform.Version}`;
  const screen = Dimensions.get('screen');
  const window = Dimensions.get('window');

  return {
    brand,
    model,
    pixelRatio,
    safeArea: getSafeArea(),
    screenWidth: screen.width,
    screenHeight: screen.height,
    windowWidth: window.width,
    windowHeight: window.height,
    statusBarHeight: getSafeArea().top,
    language: null,
    version,
    system,
    platform: os,
    fontSizeSetting: fontScale,
    SDKVersion: null,
    deviceOrientation: screen.height > screen.width ? 'portrait' : 'landscape',
  };
}

function createSensorSubscriptionFeature(
  apiName: string,
  start: (interval?: number) => {
    subscribe: (cb: (data: unknown) => void) => {
      unsubscribe: () => void;
    };
  },
) {
  return [
    createHostApiFeature({
      apiName: `${apiName}.subscribe`,
      description: HOST_API_DESCRIPTIONS[`${apiName}.subscribe`],
      async handle(payload, context) {
        const subscriptionId = createHostBridgeId(apiName);
        const interval =
          typeof payload.interval === 'number' ? payload.interval : 100;
        const stream = start(interval);
        const subscription = stream.subscribe(data => {
          emitSubscriptionEvent(
            context.appId,
            apiName,
            subscriptionId,
            data,
          ).catch(() => {});
        });
        sensorSubscriptions.set(subscriptionId, subscription);
        return createSubscriptionStartResult(subscriptionId);
      },
    }),
    createHostApiFeature({
      apiName: `${apiName}.unsubscribe`,
      description: HOST_API_DESCRIPTIONS[`${apiName}.unsubscribe`],
      async handle(payload) {
        const subscriptionId = String(payload.subscriptionId ?? '');
        const subscription = sensorSubscriptions.get(subscriptionId);
        subscription?.unsubscribe();
        sensorSubscriptions.delete(subscriptionId);
        return createHostApiSuccess(null);
      },
    }),
  ];
}

export const coreHostApis = [
  createHostApiFeature({
    apiName: 'getAppBaseInfo',
    description: HOST_API_DESCRIPTIONS.getAppBaseInfo,
    handle: async () =>
      createHostApiSuccess({
        version: DeviceInfo.getVersion(),
        language: '',
        enableDebug: !!__DEV__,
        theme: 'light',
      }),
  }),
  createHostApiFeature({
    apiName: 'getClipboardData',
    description: HOST_API_DESCRIPTIONS.getClipboardData,
    handle: async () => createHostApiSuccess(await Clipboard.getString()),
  }),
  createHostApiFeature({
    apiName: 'setClipboardData',
    description: HOST_API_DESCRIPTIONS.setClipboardData,
    handle: async payload => {
      Clipboard.setString(String(payload.data ?? ''));
      return createHostApiSuccess(null);
    },
  }),
  createHostApiFeature({
    apiName: 'getLocation',
    description: HOST_API_DESCRIPTIONS.getLocation,
    handle: async payload => {
      const hasPermission = await ensureLocationPermission();
      if (!hasPermission) {
        return createHostApiFailure(
          'PERMISSION_DENIED',
          'getLocation:fail permission denied',
        );
      }

      return new Promise(resolve => {
        Geolocation.getCurrentPosition(
          position => {
            resolve(
              createHostApiSuccess({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                speed: position.coords.speed ?? 0,
                accuracy: position.coords.accuracy ?? 0,
                altitude: position.coords.altitude ?? 0,
                verticalAccuracy: position.coords.altitudeAccuracy ?? 0,
                horizontalAccuracy: position.coords.accuracy ?? 0,
              }),
            );
          },
          error => {
            resolve(
              createHostApiFailure(
                'LOCATION_FAILED',
                error.message || 'getLocation:fail',
              ),
            );
          },
          {
            enableHighAccuracy: !!payload.isHighAccuracy,
            timeout:
              typeof payload.highAccuracyExpireTime === 'number'
                ? payload.highAccuracyExpireTime
                : 10000,
            maximumAge: 0,
          },
        );
      });
    },
  }),
  createHostApiFeature({
    apiName: 'getScreenBrightness',
    description: HOST_API_DESCRIPTIONS.getScreenBrightness,
    handle: async () => createHostApiSuccess(await getBrightness()),
  }),
  createHostApiFeature({
    apiName: 'getSystemInfo',
    description: HOST_API_DESCRIPTIONS.getSystemInfo,
    handle: async () => createHostApiSuccess(buildSystemInfo()),
  }),
  createHostApiFeature({
    apiName: 'makePhoneCall',
    description: HOST_API_DESCRIPTIONS.makePhoneCall,
    handle: async payload => {
      const phoneNumber = String(payload.phoneNumber ?? '');
      if (!phoneNumber) {
        return createHostApiSuccess(false);
      }
      const telUrl = `tel:${phoneNumber}`;
      try {
        await Linking.openURL(telUrl);
        return createHostApiSuccess(true);
      } catch {
        return createHostApiSuccess(false);
      }
    },
  }),
  createHostApiFeature({
    apiName: 'getImageInfo',
    description: HOST_API_DESCRIPTIONS.getImageInfo,
    handle: async payload =>
      new Promise(resolve => {
        Image.getSize(
          String(payload.src ?? ''),
          (width, height) => {
            resolve(
              createHostApiSuccess({
                width,
                height,
                path: String(payload.src ?? ''),
                orientation: 'up',
                type: '',
                errMsg: 'getImageInfo:ok',
              }),
            );
          },
          err => {
            resolve(
              createHostApiFailure(
                'GET_IMAGE_INFO_FAILED',
                err.message || 'getImageInfo:fail',
              ),
            );
          },
        );
      }),
  }),
  createHostApiFeature({
    apiName: 'compressImage',
    description: HOST_API_DESCRIPTIONS.compressImage,
    handle: async payload => {
      const result = await ImageResizer.createResizedImage(
        String(payload.src ?? ''),
        Number(payload.compressedWidth ?? 0),
        Number(payload.compressedHeight ?? 0),
        'JPEG',
        Number(payload.quality ?? 80),
        0,
        null,
      );
      return createHostApiSuccess(result.uri);
    },
  }),
  createHostApiFeature({
    apiName: 'getFileInfo',
    description: HOST_API_DESCRIPTIONS.getFileInfo,
    handle: async payload => {
      const filePath = String(payload.filePath ?? '');
      const digestAlgorithm = (payload.digestAlgorithm ?? 'md5') as
        'md5' | 'sha1' | 'sha256';
      const stat = await RNFS.stat(filePath);
      const digest = await RNFS.hash(filePath, digestAlgorithm);
      return createHostApiSuccess({
        size: stat.size,
        digest,
      });
    },
  }),
  createHostApiFeature({
    apiName: 'chooseMedia',
    description: HOST_API_DESCRIPTIONS.chooseMedia,
    handle: async payload =>
      createHostApiSuccess(await chooseMediaHost(payload as ChooseMediaOption)),
  }),
  createHostApiFeature({
    apiName: 'saveMedia',
    description: HOST_API_DESCRIPTIONS.saveMedia,
    handle: async payload =>
      createHostApiSuccess(
        await saveMediaHost({
          url: String(payload.url ?? ''),
          type: (payload.type as 'photo' | 'video') ?? 'photo',
          album: typeof payload.album === 'string' ? payload.album : undefined,
        }),
      ),
  }),
  createHostApiFeature({
    apiName: 'storage.setItem',
    description: HOST_API_DESCRIPTIONS['storage.setItem'],
    handle: async payload => {
      hostStorage.set(String(payload.key ?? ''), String(payload.data ?? ''));
      return createHostApiSuccess(null);
    },
  }),
  createHostApiFeature({
    apiName: 'storage.getItem',
    description: HOST_API_DESCRIPTIONS['storage.getItem'],
    handle: async payload =>
      createHostApiSuccess({
        value: hostStorage.getString(String(payload.key ?? '')),
      }),
  }),
  createHostApiFeature({
    apiName: 'storage.removeItem',
    description: HOST_API_DESCRIPTIONS['storage.removeItem'],
    handle: async payload => {
      hostStorage.remove(String(payload.key ?? ''));
      return createHostApiSuccess(null);
    },
  }),
  createHostApiFeature({
    apiName: 'storage.clearItems',
    description: HOST_API_DESCRIPTIONS['storage.clearItems'],
    handle: async () => {
      hostStorage.clearAll();
      hostStorage.trim();
      return createHostApiSuccess(null);
    },
  }),
  createHostApiFeature({
    apiName: 'storage.getKeys',
    description: HOST_API_DESCRIPTIONS['storage.getKeys'],
    handle: async () => createHostApiSuccess({ keys: getStorageKeys() }),
  }),
  createHostApiFeature({
    apiName: 'storage.getCurrentSize',
    description: HOST_API_DESCRIPTIONS['storage.getCurrentSize'],
    handle: async () =>
      createHostApiSuccess({
        size: getStorageCurrentSize(),
      }),
  }),
  createHostApiFeature({
    apiName: 'getNetworkType',
    description: HOST_API_DESCRIPTIONS.getNetworkType,
    handle: async () => {
      const state = await NetInfo.fetch();
      return createHostApiSuccess({
        networkType: state.type,
      });
    },
  }),
  createHostApiFeature({
    apiName: 'getMiniAppUpdateInfo',
    description: HOST_API_DESCRIPTIONS.getMiniAppUpdateInfo,
    handle: async (_payload, context) => {
      return createHostApiSuccess(
        await NebulaAPI.checkMiniAppUpdate(context.appId),
      );
    },
  }),
  createHostApiFeature({
    apiName: 'applyMiniAppUpdate',
    description: HOST_API_DESCRIPTIONS.applyMiniAppUpdate,
    handle: async (_payload, context) => {
      return createHostApiSuccess(
        await NebulaAPI.applyMiniAppUpdate(context.appId),
      );
    },
  }),
  createHostApiFeature({
    apiName: 'locationChange.subscribe',
    description: HOST_API_DESCRIPTIONS['locationChange.subscribe'],
    handle: async (payload, context) => {
      const subscriptionId = createHostBridgeId('locationChange');
      const watchId = Geolocation.watchPosition(
        ({ coords, timestamp }) => {
          emitSubscriptionEvent(
            context.appId,
            'locationChange',
            subscriptionId,
            {
              accuracy: coords.accuracy,
              altitude: coords.altitude,
              latitude: coords.latitude,
              longitude: coords.longitude,
              speed: coords.speed,
              timestamp,
            },
          ).catch(() => {});
        },
        () => {},
        {
          timeout: 10000,
          maximumAge: 0,
          enableHighAccuracy:
            typeof payload.enableHighAccuracy === 'boolean'
              ? payload.enableHighAccuracy
              : true,
          distanceFilter: 0,
        },
      );
      locationSubscriptions.set(subscriptionId, watchId);
      return createSubscriptionStartResult(subscriptionId);
    },
  }),
  createHostApiFeature({
    apiName: 'locationChange.unsubscribe',
    description: HOST_API_DESCRIPTIONS['locationChange.unsubscribe'],
    handle: async payload => {
      const subscriptionId = String(payload.subscriptionId ?? '');
      const watchId = locationSubscriptions.get(subscriptionId);
      if (typeof watchId === 'number') {
        Geolocation.clearWatch(watchId);
      }
      locationSubscriptions.delete(subscriptionId);
      return createHostApiSuccess(null);
    },
  }),
  createHostApiFeature({
    apiName: 'networkStatusChange.subscribe',
    description: HOST_API_DESCRIPTIONS['networkStatusChange.subscribe'],
    handle: async (_payload, context) => {
      const subscriptionId = createHostBridgeId('networkStatusChange');
      const unsubscribe = NetInfo.addEventListener(state => {
        emitSubscriptionEvent(
          context.appId,
          'networkStatusChange',
          subscriptionId,
          {
            isConnected: state.isConnected ?? false,
            networkType: state.type,
          },
        ).catch(() => {});
      });
      networkSubscriptions.set(subscriptionId, unsubscribe);
      return createSubscriptionStartResult(subscriptionId);
    },
  }),
  createHostApiFeature({
    apiName: 'networkStatusChange.unsubscribe',
    description: HOST_API_DESCRIPTIONS['networkStatusChange.unsubscribe'],
    handle: async payload => {
      const subscriptionId = String(payload.subscriptionId ?? '');
      networkSubscriptions.get(subscriptionId)?.();
      networkSubscriptions.delete(subscriptionId);
      return createHostApiSuccess(null);
    },
  }),
  createHostApiFeature({
    apiName: 'userCaptureScreen.subscribe',
    description: HOST_API_DESCRIPTIONS['userCaptureScreen.subscribe'],
    handle: async (_payload, context) => {
      const subscriptionId = createHostBridgeId('userCaptureScreen');
      const subscription = ScreenshotAware.addListener(() => {
        emitSubscriptionEvent(
          context.appId,
          'userCaptureScreen',
          subscriptionId,
          null,
        ).catch(() => {});
      });
      screenshotSubscriptions.set(subscriptionId, subscription);
      return createSubscriptionStartResult(subscriptionId);
    },
  }),
  createHostApiFeature({
    apiName: 'userCaptureScreen.unsubscribe',
    description: HOST_API_DESCRIPTIONS['userCaptureScreen.unsubscribe'],
    handle: async payload => {
      const subscriptionId = String(payload.subscriptionId ?? '');
      screenshotSubscriptions.get(subscriptionId)?.remove();
      screenshotSubscriptions.delete(subscriptionId);
      return createHostApiSuccess(null);
    },
  }),
  ...createSensorSubscriptionFeature('accelerometerChange', interval => {
    setUpdateIntervalForType(SensorTypes.accelerometer, interval ?? 100);
    return accelerometer;
  }),
  ...createSensorSubscriptionFeature('gyroscopeChange', interval => {
    setUpdateIntervalForType(SensorTypes.gyroscope, interval ?? 100);
    return gyroscope;
  }),
  ...createSensorSubscriptionFeature('magnetometerChange', interval => {
    setUpdateIntervalForType(SensorTypes.magnetometer, interval ?? 100);
    return magnetometer;
  }),
  ...createSensorSubscriptionFeature('barometerChange', () => barometer),
  createHostApiFeature({
    apiName: 'fileSystem.access',
    description: HOST_API_DESCRIPTIONS['fileSystem.access'],
    handle: async (payload, context) => {
      const exists = await RNFS.exists(
        resolveMiniAppPath(payload.path, context.appId),
      );
      if (!exists) {
        return createHostApiFailure(
          'FILE_NOT_FOUND',
          'access:fail no such file or directory',
        );
      }
      return createHostApiSuccess(null);
    },
  }),
  createHostApiFeature({
    apiName: 'fileSystem.appendFile',
    description: HOST_API_DESCRIPTIONS['fileSystem.appendFile'],
    handle: async (payload, context) => {
      await RNFS.appendFile(
        resolveMiniAppPath(payload.filePath, context.appId),
        String(payload.data ?? ''),
        (payload.encoding as RNFS.EncodingT | undefined) ?? 'utf8',
      );
      return createHostApiSuccess(null);
    },
  }),
  createHostApiFeature({
    apiName: 'fileSystem.saveFile',
    description: HOST_API_DESCRIPTIONS['fileSystem.saveFile'],
    handle: async (payload, context) => {
      const tempFilePath = resolveMiniAppPath(
        payload.tempFilePath,
        context.appId,
      );
      const filePath =
        typeof payload.filePath === 'string' && payload.filePath.length > 0
          ? resolveMiniAppPath(payload.filePath, context.appId)
          : `${RNFS.DocumentDirectoryPath}/${Date.now()}`;
      await RNFS.moveFile(tempFilePath, filePath);
      return createHostApiSuccess({ savedFilePath: filePath });
    },
  }),
  createHostApiFeature({
    apiName: 'fileSystem.copyFile',
    description: HOST_API_DESCRIPTIONS['fileSystem.copyFile'],
    handle: async (payload, context) => {
      await RNFS.copyFile(
        resolveMiniAppPath(payload.srcPath, context.appId),
        resolveMiniAppPath(payload.destPath, context.appId),
      );
      return createHostApiSuccess(null);
    },
  }),
  createHostApiFeature({
    apiName: 'fileSystem.mkdir',
    description: HOST_API_DESCRIPTIONS['fileSystem.mkdir'],
    handle: async (payload, context) => {
      await RNFS.mkdir(resolveMiniAppPath(payload.dirPath, context.appId));
      return createHostApiSuccess(null);
    },
  }),
  createHostApiFeature({
    apiName: 'fileSystem.readFile',
    description: HOST_API_DESCRIPTIONS['fileSystem.readFile'],
    handle: async (payload, context) => {
      const data = await RNFS.readFile(
        resolveMiniAppPath(payload.filePath, context.appId),
        (payload.encoding as RNFS.EncodingT | undefined) ?? 'utf8',
      );
      return createHostApiSuccess({ data });
    },
  }),
  createHostApiFeature({
    apiName: 'fileSystem.readdir',
    description: HOST_API_DESCRIPTIONS['fileSystem.readdir'],
    handle: async (payload, context) => {
      const files = await RNFS.readdir(
        resolveMiniAppPath(payload.dirPath, context.appId),
      );
      return createHostApiSuccess({ files });
    },
  }),
  createHostApiFeature({
    apiName: 'fileSystem.rename',
    description: HOST_API_DESCRIPTIONS['fileSystem.rename'],
    handle: async (payload, context) => {
      await RNFS.moveFile(
        resolveMiniAppPath(payload.oldPath, context.appId),
        resolveMiniAppPath(payload.newPath, context.appId),
      );
      return createHostApiSuccess(null);
    },
  }),
  createHostApiFeature({
    apiName: 'fileSystem.rmdir',
    description: HOST_API_DESCRIPTIONS['fileSystem.rmdir'],
    handle: async (payload, context) => {
      await RNFS.unlink(resolveMiniAppPath(payload.dirPath, context.appId));
      return createHostApiSuccess(null);
    },
  }),
  createHostApiFeature({
    apiName: 'fileSystem.unlink',
    description: HOST_API_DESCRIPTIONS['fileSystem.unlink'],
    handle: async (payload, context) => {
      await RNFS.unlink(resolveMiniAppPath(payload.filePath, context.appId));
      return createHostApiSuccess(null);
    },
  }),
  createHostApiFeature({
    apiName: 'fileSystem.writeFile',
    description: HOST_API_DESCRIPTIONS['fileSystem.writeFile'],
    handle: async (payload, context) => {
      await RNFS.writeFile(
        resolveMiniAppPath(payload.filePath, context.appId),
        String(payload.data ?? ''),
        (payload.encoding as RNFS.EncodingT | undefined) ?? 'utf8',
      );
      return createHostApiSuccess(null);
    },
  }),
  createHostApiFeature({
    apiName: 'fileSystem.getFileInfo',
    description: HOST_API_DESCRIPTIONS['fileSystem.getFileInfo'],
    handle: async (payload, context) => {
      const filePath = resolveMiniAppPath(payload.filePath, context.appId);
      const digestAlgorithm = (payload.digestAlgorithm ?? 'md5') as
        'md5' | 'sha1' | 'sha256';
      const stat = await RNFS.stat(filePath);
      const digest = await RNFS.hash(filePath, digestAlgorithm);
      return createHostApiSuccess({
        size: stat.size,
        digest,
      });
    },
  }),
  createHostApiFeature({
    apiName: 'removeFile',
    description: HOST_API_DESCRIPTIONS.removeFile,
    handle: async (payload, context) => {
      const filePath = resolveMiniAppPath(payload.filePath, context.appId);
      const exists = await RNFS.exists(filePath);
      if (!exists) {
        return createHostApiFailure(
          'FILE_NOT_FOUND',
          'removeFile:fail no such file or directory',
        );
      }
      await RNFS.unlink(filePath);
      return createHostApiSuccess(null);
    },
  }),
  ...downloadFileHostApi,
  ...uploadFileHostApi,
];
