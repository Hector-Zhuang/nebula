import { invokeHostApi } from '../runtime/host';

export interface CompressImageOption {
  src: string;
  quality?: number;
  compressedWidth?: number;
  compressedHeight?: number;
}

export const compressImage = (
  options: CompressImageOption,
): Promise<string> => {
  return invokeHostApi<string>('compressImage', options);
};
