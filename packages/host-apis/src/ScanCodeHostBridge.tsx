import { Camera } from 'react-native-vision-camera';
import {
  createHostApiFailure,
  createHostModalApiFeature,
} from '@nebula-rn/sdk';
import NebulaHostScanModal from './NebulaHostScanModal';
import { scanCodeChannel } from './scanCodeRuntime';
import { Platform } from 'react-native';

type ScanCodePayload = {
  onlyFromCamera?: boolean;
  scanType?: string[];
};

function normalizeScanTypes(scanTypes?: string[]): string[] {
  const defaultTypes = ['qr', 'ean-13', 'code-128'];
  if (!scanTypes || scanTypes.length === 0) {
    return defaultTypes;
  }

  const normalized = scanTypes.filter(Boolean);
  return normalized.length > 0 ? normalized : defaultTypes;
}

export const scanCodeHostApi = createHostModalApiFeature<
  ScanCodePayload,
  { onlyFromCamera?: boolean; scanTypes: string[] }
>({
  apiName: 'scanCode',
  description: {
    summary:
      'Open a host-managed scanner modal and return the first detected barcode or QR code.',
    description:
      'Supports camera-based scanning and returns structured scan metadata when successful.',
    tags: ['camera', 'scanner', 'modal'],
  },
  component: NebulaHostScanModal,
  channel: scanCodeChannel,
  createRequest: payload => ({
    onlyFromCamera: payload.onlyFromCamera,
    scanTypes: normalizeScanTypes(payload.scanType),
  }),
  onBeforeOpen: async () => {
    if (Platform.OS === 'android') {
      return null;
    }
    const permission = await Camera.requestCameraPermission();
    if (permission !== 'granted') {
      return createHostApiFailure(
        'PERMISSION_DENIED',
        'scanCode:fail permission denied',
      );
    }
    return null;
  },
  onUnmountErrorMessage:
    'scanCode:fail host scanner was unmounted before completion',
});
