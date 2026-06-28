import * as RNFS from '@dr.pogodin/react-native-fs';
import { createHostApiFeature } from '@nebula-rn/sdk';
import type { NebulaHostApiDescriptionMap } from '@nebula-rn/sdk';
import {
  createTaskStartResult,
  emitTaskHeaders,
  emitTaskProgress,
  emitTaskResult,
} from './hostApiBridge';

type DownloadFileHostOption = {
  url: string;
  header?: Record<string, string>;
  timeout?: number;
  filePath?: string;
};

type DownloadFileHostResult = {
  tempFilePath: string;
  statusCode: number;
};

type UploadFileHostOption = {
  url: string;
  filePath: string;
  name: string;
  header?: Record<string, string>;
  formData?: Record<string, string>;
  timeout?: number;
};

type UploadFileHostResult = {
  data: string;
  statusCode: number;
};

const activeDownloads = new Map<string, number>();
const activeUploads = new Map<string, number>();

const TASK_API_DESCRIPTIONS: NebulaHostApiDescriptionMap = {
  'downloadFile.start': {
    summary: 'Start a host-managed file download task with progress events.',
    tags: ['file', 'task', 'network'],
  },
  'downloadFile.abort': {
    summary: 'Abort an in-flight host download task by task id.',
    tags: ['file', 'task', 'network'],
  },
  'uploadFile.start': {
    summary: 'Start a host-managed file upload task with progress events.',
    tags: ['file', 'task', 'network'],
  },
  'uploadFile.abort': {
    summary: 'Abort an in-flight host upload task by task id.',
    tags: ['file', 'task', 'network'],
  },
};

export const downloadFileHost = async (
  options: DownloadFileHostOption,
): Promise<DownloadFileHostResult> => {
  const { url, header = {}, timeout = 60000, filePath } = options;
  const destPath =
    filePath || `${RNFS.TemporaryDirectoryPath}/${Date.now()}_download`;

  const result = await RNFS.downloadFile({
    fromUrl: url,
    toFile: destPath,
    headers: header,
    connectionTimeout: timeout,
    readTimeout: timeout,
  }).promise;

  return {
    tempFilePath: destPath,
    statusCode: result.statusCode,
  };
};

export const uploadFileHost = async (
  options: UploadFileHostOption,
): Promise<UploadFileHostResult> => {
  const nativeTask = RNFS.uploadFiles({
    toUrl: options.url,
    files: [
      {
        name: options.name,
        filename: options.filePath.split('/').pop() || 'file',
        filepath: options.filePath,
      },
    ],
    headers: options.header ?? {},
    fields: options.formData ?? {},
    method: 'POST',
  });

  const result = await nativeTask.promise;
  return {
    data: result.body,
    statusCode: result.statusCode,
  };
};

export const downloadFileHostApi = [
  createHostApiFeature({
    apiName: 'downloadFile.start',
    description: TASK_API_DESCRIPTIONS['downloadFile.start'],
    async handle(payload, context) {
      const taskId = `download-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`;
      const options = payload as DownloadFileHostOption;
      const destPath =
        options.filePath ||
        `${RNFS.TemporaryDirectoryPath}/${Date.now()}_download`;

      const nativeTask = RNFS.downloadFile({
        fromUrl: options.url,
        toFile: destPath,
        headers: options.header ?? {},
        connectionTimeout: options.timeout ?? 60000,
        readTimeout: options.timeout ?? 60000,
        begin: res => {
          emitTaskHeaders(context.appId, 'downloadFile', taskId, {
            header: res.headers as Record<string, string>,
          }).catch(() => {});
        },
        progress: res => {
          emitTaskProgress(context.appId, 'downloadFile', taskId, {
            progress: Math.floor((res.bytesWritten / res.contentLength) * 100),
            totalBytesWritten: res.bytesWritten,
            totalBytesExpectedToWrite: res.contentLength,
          }).catch(() => {});
        },
      });

      activeDownloads.set(taskId, nativeTask.jobId);
      nativeTask.promise
        .then(res =>
          emitTaskResult(context.appId, 'downloadFile', taskId, {
            ok: true,
            data: {
              tempFilePath: destPath,
              statusCode: res.statusCode,
            },
          }),
        )
        .catch(error =>
          emitTaskResult(context.appId, 'downloadFile', taskId, {
            ok: false,
            error: {
              code: 'DOWNLOAD_FAILED',
              message:
                error instanceof Error
                  ? error.message
                  : 'downloadFile:fail host download failed',
            },
          }),
        )
        .finally(() => {
          activeDownloads.delete(taskId);
        });

      return createTaskStartResult(taskId);
    },
  }),
  createHostApiFeature({
    apiName: 'downloadFile.abort',
    description: TASK_API_DESCRIPTIONS['downloadFile.abort'],
    async handle(payload) {
      const taskId = String(payload.taskId ?? '');
      const jobId = activeDownloads.get(taskId);
      if (jobId) {
        RNFS.stopDownload(jobId);
        activeDownloads.delete(taskId);
      }
      return {
        ok: true,
        data: null,
      };
    },
  }),
];

export const uploadFileHostApi = [
  createHostApiFeature({
    apiName: 'uploadFile.start',
    description: TASK_API_DESCRIPTIONS['uploadFile.start'],
    async handle(payload, context) {
      const taskId = `upload-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`;
      const options = payload as UploadFileHostOption;

      const nativeTask = RNFS.uploadFiles({
        toUrl: options.url,
        files: [
          {
            name: options.name,
            filename: options.filePath.split('/').pop() || 'file',
            filepath: options.filePath,
          },
        ],
        headers: options.header ?? {},
        fields: options.formData ?? {},
        method: 'POST',
        progress: res => {
          emitTaskProgress(context.appId, 'uploadFile', taskId, {
            progress: Math.floor(
              (res.totalBytesSent / res.totalBytesExpectedToSend) * 100,
            ),
            totalBytesSent: res.totalBytesSent,
            totalBytesExpectedToSend: res.totalBytesExpectedToSend,
          }).catch(() => {});
        },
      });

      activeUploads.set(taskId, nativeTask.jobId);
      nativeTask.promise
        .then(res =>
          Promise.all([
            emitTaskHeaders(context.appId, 'uploadFile', taskId, {
              header: res.headers as Record<string, string>,
            }),
            emitTaskResult(context.appId, 'uploadFile', taskId, {
              ok: true,
              data: {
                data: res.body,
                statusCode: res.statusCode,
              },
            }),
          ]),
        )
        .catch(error =>
          emitTaskResult(context.appId, 'uploadFile', taskId, {
            ok: false,
            error: {
              code: 'UPLOAD_FAILED',
              message:
                error instanceof Error
                  ? error.message
                  : 'uploadFile:fail host upload failed',
            },
          }),
        )
        .finally(() => {
          activeUploads.delete(taskId);
        });

      return createTaskStartResult(taskId);
    },
  }),
  createHostApiFeature({
    apiName: 'uploadFile.abort',
    description: TASK_API_DESCRIPTIONS['uploadFile.abort'],
    async handle(payload) {
      const taskId = String(payload.taskId ?? '');
      const jobId = activeUploads.get(taskId);
      if (jobId) {
        RNFS.stopUpload(jobId);
        activeUploads.delete(taskId);
      }
      return {
        ok: true,
        data: null,
      };
    },
  }),
];
