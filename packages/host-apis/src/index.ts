import { previewImageHostApi } from './PreviewImageHostBridge';
import { scanCodeHostApi } from './ScanCodeHostBridge';
import { coreHostApis, saveMediaHost } from './coreHostApis';
import {
  downloadFileHostApi,
  downloadFileHost,
  uploadFileHostApi,
  uploadFileHost,
} from './taskHosts';

export { previewImageHostApi, scanCodeHostApi, coreHostApis, saveMediaHost };
export {
  downloadFileHostApi,
  downloadFileHost,
  uploadFileHostApi,
  uploadFileHost,
};

export const defaultHostApis = [
  scanCodeHostApi,
  previewImageHostApi,
  ...coreHostApis,
];
