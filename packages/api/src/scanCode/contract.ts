import { ScanCodeError } from './types';
import type {
  ScanCodeCapabilityName,
  ScanCodeCapabilityVersion,
  ScanCodeErrorCode,
} from './types';

export const SCAN_CODE_CAPABILITY_NAME: ScanCodeCapabilityName = 'scanCode';
export const SCAN_CODE_CAPABILITY_VERSION: ScanCodeCapabilityVersion = '1.0';

export const SCAN_CODE_DEFAULT_TYPES = ['qr', 'ean-13', 'code-128'] as const;

export const SCAN_CODE_MINIMUM_HOST_BRIDGE_VERSION = '1.0';

export function createScanCodeError(
  code: ScanCodeErrorCode,
  message: string,
): ScanCodeError {
  return new ScanCodeError(code, message);
}
