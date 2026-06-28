import { Miniapp } from '@nebula-rn/sdk';
import {
  createScanCodeError,
  SCAN_CODE_CAPABILITY_NAME,
  SCAN_CODE_CAPABILITY_VERSION,
} from './contract';
import type {
  ScanCodeData,
  ScanCodeErrorCode,
  ScanCodeOptions,
  ScanCodeResult,
} from './types';

export type {
  ScanCodeCapabilityName,
  ScanCodeCapabilityVersion,
  ScanCodeData,
  ScanCodeErrorCode,
  ScanCodeFailureResult,
  ScanCodeOptions,
  ScanCodeResult,
  ScanCodeSuccessResult,
} from './types';
export { ScanCodeError } from './types';
export {
  SCAN_CODE_CAPABILITY_NAME,
  SCAN_CODE_CAPABILITY_VERSION,
  SCAN_CODE_DEFAULT_TYPES,
  SCAN_CODE_MINIMUM_HOST_BRIDGE_VERSION,
} from './contract';

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function toScanCodeErrorCode(code: unknown): ScanCodeErrorCode {
  switch (code) {
    case 'PERMISSION_DENIED':
    case 'USER_CANCELLED':
    case 'UNSUPPORTED_SOURCE':
    case 'SCAN_FAILED':
      return code;
    default:
      return 'SCAN_FAILED';
  }
}

function toScanCodeFailureResult(
  error: unknown,
): Extract<ScanCodeResult, { ok: false }> {
  if (isRecord(error)) {
    return {
      ok: false,
      error: createScanCodeError(
        toScanCodeErrorCode(error.code),
        typeof error.message === 'string'
          ? error.message
          : 'scanCode:fail host request failed',
      ),
    };
  }

  if (error instanceof Error) {
    return {
      ok: false,
      error: createScanCodeError('SCAN_FAILED', error.message),
    };
  }

  return {
    ok: false,
    error: createScanCodeError(
      'SCAN_FAILED',
      'scanCode:fail unknown host error',
    ),
  };
}

function toScanCodeSuccessResult(data: unknown): ScanCodeResult {
  if (!isRecord(data)) {
    return {
      ok: false,
      error: createScanCodeError(
        'SCAN_FAILED',
        'scanCode:fail invalid host response',
      ),
    };
  }

  return {
    ok: true,
    data: {
      result: typeof data.result === 'string' ? data.result : undefined,
      scanType: typeof data.scanType === 'string' ? data.scanType : 'unknown',
      rawData: data.rawData,
    },
  };
}

export async function scanCode(
  options: ScanCodeOptions = {},
): Promise<ScanCodeData> {
  const result = await scanCodeSafe(options);
  if (!result.ok) {
    throw result.error;
  }
  return result.data;
}

export async function scanCodeSafe(
  options: ScanCodeOptions = {},
): Promise<ScanCodeResult> {
  try {
    const result = await Miniapp.invokeHostApi<ScanCodeData>(
      SCAN_CODE_CAPABILITY_NAME,
      options as Record<string, unknown>,
      SCAN_CODE_CAPABILITY_VERSION,
      120000,
    );

    return result.ok
      ? toScanCodeSuccessResult(result.data)
      : toScanCodeFailureResult(result.error);
  } catch (error) {
    return toScanCodeFailureResult(error);
  }
}
