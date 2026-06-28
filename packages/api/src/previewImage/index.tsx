import { invokeHostApi } from '../runtime/host';

export interface PreviewImageOptions {
  urls: string[];
  current?: string;
  showMenu?: boolean;
  saveMediaText?: string;
  cancelText?: string;
}

export function previewImages(options: PreviewImageOptions): Promise<void> {
  return invokeHostApi<void>('previewImage', options, '1.0', 120000);
}
