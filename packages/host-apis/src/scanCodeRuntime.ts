import { createHostModalChannel } from '@nebula-rn/sdk';

export type ScanCodeRequest = {
  onlyFromCamera?: boolean;
  scanTypes: string[];
};

export const scanCodeChannel = createHostModalChannel<ScanCodeRequest>();
