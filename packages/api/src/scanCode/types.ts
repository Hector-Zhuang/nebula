export type ScanCodeCapabilityName = 'scanCode';
export type ScanCodeCapabilityVersion = '1.0';

export type ScanCodeErrorCode =
  'PERMISSION_DENIED' | 'USER_CANCELLED' | 'UNSUPPORTED_SOURCE' | 'SCAN_FAILED';

export interface ScanCodeOptions {
  scanType?: string[];
  onlyFromCamera?: boolean;
}

export interface ScanCodeData {
  result: string | undefined;
  scanType: string | 'unknown';
  rawData?: unknown;
}

export interface ScanCodeSuccessResult {
  ok: true;
  data: ScanCodeData;
}

export interface ScanCodeFailureResult {
  ok: false;
  error: ScanCodeError;
}

export type ScanCodeResult = ScanCodeSuccessResult | ScanCodeFailureResult;

export class ScanCodeError extends Error {
  readonly code: ScanCodeErrorCode;

  constructor(code: ScanCodeErrorCode, message: string) {
    super(message);
    this.name = 'ScanCodeError';
    this.code = code;
  }
}
