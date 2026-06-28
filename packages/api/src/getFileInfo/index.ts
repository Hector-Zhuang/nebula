import { invokeHostApi } from '../runtime/host';

export interface GetFileInfoOption {
  filePath: string;
  digestAlgorithm?: 'md5' | 'sha1' | 'sha256';
}

export interface GetFileInfoResult {
  size: number;
  digest: string;
}

export const getFileInfo = (
  options: GetFileInfoOption,
): Promise<GetFileInfoResult> => {
  return invokeHostApi<GetFileInfoResult>('getFileInfo', options);
};
