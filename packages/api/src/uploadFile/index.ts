import { createHostTask } from '../runtime/host';

export interface UploadFileOption {
  url: string;
  filePath: string;
  name: string;
  header?: Record<string, string>;
  formData?: Record<string, string>;
  timeout?: number;
}

export interface UploadFileResult {
  data: string;
  statusCode: number;
}

export interface UploadProgressUpdateRes {
  progress: number;
  totalBytesSent: number;
  totalBytesExpectedToSend: number;
}

export interface UploadHeadersReceivedRes {
  header: Record<string, string>;
}

export interface UploadTask {
  abort(): Promise<void>;
  onProgressUpdate(listener: (res: UploadProgressUpdateRes) => void): void;
  offProgressUpdate(listener: (res: UploadProgressUpdateRes) => void): void;
  onHeadersReceived(listener: (res: UploadHeadersReceivedRes) => void): void;
  offHeadersReceived(listener: (res: UploadHeadersReceivedRes) => void): void;
  then<TResult1 = UploadFileResult, TResult2 = never>(
    onfulfilled?:
      | ((value: UploadFileResult) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
  ): Promise<TResult1 | TResult2>;
  catch<TResult = never>(
    onrejected?:
      ((reason: unknown) => TResult | PromiseLike<TResult>) | undefined | null,
  ): Promise<UploadFileResult | TResult>;
}

export const uploadFile = (options: UploadFileOption): UploadTask => {
  return createHostTask<
    UploadFileResult,
    UploadProgressUpdateRes,
    UploadHeadersReceivedRes
  >('uploadFile', options, {
    timeoutMs: options.timeout ?? 60000,
  });
};
