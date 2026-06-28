import { invokeHostApi } from '../runtime/host';

export interface ChooseMediaFile {
  tempFilePath: string;
  size: number;
  duration?: number;
  height?: number;
  width?: number;
  thumbTempFilePath?: string;
  fileType: 'image' | 'video';
}

export interface ChooseMediaResult {
  tempFiles: ChooseMediaFile[];
  type: 'image' | 'video' | 'mix';
}

export interface ChooseMediaOption {
  count?: number;
  mediaType?: ('image' | 'video' | 'mix')[];
  sourceType?: ('album' | 'camera')[];
  maxDuration?: number;
  sizeType?: ('original' | 'compressed')[];
  camera?: 'back' | 'front';
}

export const chooseMedia = (
  options: ChooseMediaOption = {},
): Promise<ChooseMediaResult> => {
  return invokeHostApi<ChooseMediaResult>(
    'chooseMedia',
    options,
    '1.0',
    120000,
  );
};
