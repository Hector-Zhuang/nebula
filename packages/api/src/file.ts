import { createHostTask, invokeHostApi } from './runtime/host';

export interface HeadersRes {
  header: Record<string, string>;
}

export interface Task<T, P> {
  abort(): Promise<void>;
  onProgressUpdate(listener: (res: P) => void): void;
  offProgressUpdate(listener: (res: P) => void): void;
  onHeadersReceived(listener: (res: HeadersRes) => void): void;
  offHeadersReceived(listener: (res: HeadersRes) => void): void;
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2>;
  catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null,
  ): Promise<T | TResult>;
}

export interface DownloadProgressRes {
  progress: number;
  totalBytesWritten: number;
  totalBytesExpectedToWrite: number;
}

export interface DownloadFileResult {
  tempFilePath: string;
  statusCode: number;
}

export interface DownloadFileOption {
  url: string;
  header?: Record<string, string>;
  timeout?: number;
  filePath?: string;
}

export type DownloadTask = Task<DownloadFileResult, DownloadProgressRes>;

export const downloadFile = (options: DownloadFileOption): DownloadTask => {
  return createHostTask<DownloadFileResult, DownloadProgressRes, HeadersRes>(
    'downloadFile',
    options,
    {
      timeoutMs: 60000,
    },
  );
};

export interface UploadProgressRes {
  progress: number;
  totalBytesSent: number;
  totalBytesExpectedToSend: number;
}

export interface UploadFileResult {
  data: string;
  statusCode: number;
}

export interface UploadFileOption {
  url: string;
  filePath: string;
  name: string;
  header?: Record<string, string>;
  formData?: Record<string, string>;
}

export type UploadTask = Task<UploadFileResult, UploadProgressRes>;

export const uploadFile = (options: UploadFileOption): UploadTask => {
  return createHostTask<UploadFileResult, UploadProgressRes, HeadersRes>(
    'uploadFile',
    options,
    {
      timeoutMs: 60000,
    },
  );
};

export interface RemoveFileOption {
  filePath: string;
}

export const removeFile = (options: RemoveFileOption): Promise<void> => {
  return invokeHostApi<void>('removeFile', options);
};
