import { Miniapp } from '@nebula-rn/sdk';
import type {
  NebulaHostApiDescription,
  NebulaHostApiDescriptionMap,
} from '@nebula-rn/sdk';

export type NebulaPublicApiDescription = NebulaHostApiDescription & {
  kind?: 'api' | 'manager' | 'subscription' | 'task' | 'utility';
  methods?: Record<string, NebulaHostApiDescription>;
};

export type NebulaPublicApiDescriptionMap = Record<
  string,
  NebulaPublicApiDescription
>;

export const nebulaApiDescriptions: NebulaPublicApiDescriptionMap = {
  chooseMedia: {
    summary:
      'Open the host media picker and return selected image or video assets.',
    kind: 'api',
    tags: ['media', 'picker'],
  },
  compressImage: {
    summary: 'Resize and compress an image through the host runtime.',
    kind: 'api',
    tags: ['media', 'image'],
  },
  downloadFile: {
    summary:
      'Start a host-managed download task with progress and abort support.',
    kind: 'task',
    tags: ['file', 'network'],
  },
  uploadFile: {
    summary:
      'Start a host-managed upload task with progress and abort support.',
    kind: 'task',
    tags: ['file', 'network'],
  },
  getAppBaseInfo: {
    summary:
      'Return basic host app information for the current miniapp runtime.',
    kind: 'api',
    tags: ['device', 'app'],
  },
  getClipboardData: {
    summary: 'Read plain text from the system clipboard.',
    kind: 'api',
    tags: ['clipboard'],
  },
  getFileInfo: {
    summary: 'Read size and digest information for a file path.',
    kind: 'api',
    tags: ['file'],
  },
  getFileSystemManager: {
    summary: 'Return a file system manager bound to host-backed file APIs.',
    kind: 'manager',
    tags: ['file'],
    methods: {
      access: {
        summary: 'Check whether a path exists and is accessible.',
        tags: ['file'],
      },
      appendFile: {
        summary: 'Append text data to a file path.',
        tags: ['file'],
      },
      saveFile: {
        summary: 'Persist a temp file into the miniapp sandbox.',
        tags: ['file'],
      },
      copyFile: {
        summary: 'Copy a file from one path to another.',
        tags: ['file'],
      },
      mkdir: {
        summary: 'Create a directory path recursively.',
        tags: ['file'],
      },
      readFile: {
        summary: 'Read a file as text with optional encoding.',
        tags: ['file'],
      },
      readdir: {
        summary: 'List child entries in a directory.',
        tags: ['file'],
      },
      rename: {
        summary: 'Rename or move a file or directory.',
        tags: ['file'],
      },
      rmdir: {
        summary: 'Remove a directory path recursively.',
        tags: ['file'],
      },
      unlink: {
        summary: 'Delete a file path.',
        tags: ['file'],
      },
      writeFile: {
        summary: 'Write text data to a file path.',
        tags: ['file'],
      },
      getFileInfo: {
        summary: 'Read file stat information for a sandbox path.',
        tags: ['file'],
      },
    },
  },
  getImageInfo: {
    summary:
      'Read width, height, and metadata information for an image source.',
    kind: 'api',
    tags: ['media', 'image'],
  },
  getLocation: {
    summary: 'Get the current device location once.',
    description:
      'The host may request runtime location permission before resolving.',
    kind: 'api',
    tags: ['location'],
  },
  getScreenBrightness: {
    summary: 'Read the current screen brightness reported by the device.',
    kind: 'api',
    tags: ['device'],
  },
  getStorage: {
    summary:
      'Read a JSON-serializable value from host-backed key-value storage.',
    kind: 'api',
    tags: ['storage'],
  },
  getStorageInfo: {
    summary: 'Read host-backed storage usage and key information.',
    kind: 'api',
    tags: ['storage'],
  },
  getSystemInfo: {
    summary:
      'Return device, screen, and safe-area information for layout and diagnostics.',
    kind: 'api',
    tags: ['device', 'layout'],
  },
  onLocationChange: {
    summary: 'Subscribe to host location change events.',
    kind: 'subscription',
    tags: ['location', 'subscription'],
  },
  makePhoneCall: {
    summary: 'Open the system dialer for a phone number.',
    kind: 'api',
    tags: ['device', 'communication'],
  },
  getMiniAppUpdateInfo: {
    summary:
      'Read the installed miniapp version, update strategy, and whether a newer remote version exists.',
    kind: 'api',
    tags: ['miniapp', 'update'],
  },
  applyMiniAppUpdate: {
    summary:
      'Install the newest available bundle for the current miniapp and return the updated version state.',
    kind: 'api',
    tags: ['miniapp', 'update'],
  },
  saveMedia: {
    summary: 'Save a photo or video into the system media library.',
    kind: 'api',
    tags: ['media'],
  },
  getNetworkType: {
    summary: 'Read the current network connection type and connectivity state.',
    kind: 'api',
    tags: ['network'],
  },
  onNetworkStatusChange: {
    summary: 'Subscribe to host network status change events.',
    kind: 'subscription',
    tags: ['network', 'subscription'],
  },
  onUserCaptureScreen: {
    summary: 'Subscribe to host screenshot capture events.',
    kind: 'subscription',
    tags: ['device', 'subscription'],
  },
  previewImage: {
    summary:
      'Open a host-managed fullscreen image preview modal for one or more image URLs.',
    kind: 'api',
    tags: ['media', 'image', 'modal'],
  },
  scanCode: {
    summary:
      'Open a host-managed scanner modal and return the first detected barcode or QR code.',
    kind: 'api',
    tags: ['camera', 'scanner', 'modal'],
  },
  scanCodeSafe: {
    summary:
      'Open the host scanner modal and always resolve with an ok/error result object.',
    kind: 'api',
    tags: ['camera', 'scanner', 'modal'],
  },
  onAccelerometerChange: {
    summary: 'Subscribe to host accelerometer events.',
    kind: 'subscription',
    tags: ['sensor', 'subscription'],
  },
  onGyroscopeChange: {
    summary: 'Subscribe to host gyroscope events.',
    kind: 'subscription',
    tags: ['sensor', 'subscription'],
  },
  onMagnetometerChange: {
    summary: 'Subscribe to host magnetometer events.',
    kind: 'subscription',
    tags: ['sensor', 'subscription'],
  },
  onBarometerChange: {
    summary: 'Subscribe to host barometer events.',
    kind: 'subscription',
    tags: ['sensor', 'subscription'],
  },
  setClipboardData: {
    summary: 'Write plain text to the system clipboard.',
    kind: 'api',
    tags: ['clipboard'],
  },
  setStorage: {
    summary:
      'Persist a JSON-serializable value in host-backed key-value storage.',
    kind: 'api',
    tags: ['storage'],
  },
  storage: {
    summary:
      'Low-level storage helpers for host-backed key-value access and serialization.',
    kind: 'utility',
    tags: ['storage'],
    methods: {
      serializeStorageValue: {
        summary:
          'Serialize a JSON-serializable value before writing to storage.',
        tags: ['storage'],
      },
      deserializeStorageValue: {
        summary: 'Deserialize a stored JSON string into a typed value.',
        tags: ['storage'],
      },
      setStorageItem: {
        summary: 'Persist a raw storage item by key.',
        tags: ['storage'],
      },
      getStorageItem: {
        summary: 'Read a raw storage item by key.',
        tags: ['storage'],
      },
      removeStorageItem: {
        summary: 'Remove a raw storage item by key.',
        tags: ['storage'],
      },
      clearStorageItems: {
        summary: 'Clear all host-backed storage entries.',
        tags: ['storage'],
      },
      getStorageKeys: {
        summary: 'List all keys in host-backed storage.',
        tags: ['storage'],
      },
      getStorageCurrentSize: {
        summary: 'Return the approximate storage size in KB.',
        tags: ['storage'],
      },
    },
  },
  removeFile: {
    summary: 'Remove a file from the miniapp sandbox.',
    kind: 'api',
    tags: ['file'],
  },
};

export function getNebulaApiDescriptions(): NebulaPublicApiDescriptionMap {
  return nebulaApiDescriptions;
}

export function getHostApiDescriptions(
  timeoutMs: number = 15000,
): Promise<NebulaHostApiDescriptionMap> {
  return Miniapp.getHostApiDescriptions(timeoutMs);
}
