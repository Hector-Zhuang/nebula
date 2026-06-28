import { invokeHostApi } from '../runtime/host';
import { GetFileInfoOption, GetFileInfoResult } from '../getFileInfo';

export interface FileAccessOption {
  path: string;
}

export interface FileAppendOption {
  filePath: string;
  data: string;
  encoding?: 'ascii' | 'base64' | 'utf8';
}

export interface FileSaveOption {
  tempFilePath: string;
  filePath?: string;
}

export interface FileSaveResult {
  savedFilePath: string;
}

export interface FileCopyOption {
  srcPath: string;
  destPath: string;
}

export interface FileMkdirOption {
  dirPath: string;
  recursive?: boolean;
}

export interface FileReadOption {
  filePath: string;
  encoding?: 'ascii' | 'base64' | 'utf8';
  position?: number;
  length?: number;
}

export interface FileReadResult {
  data: string;
}

export interface FileReaddirOption {
  dirPath: string;
}

export interface FileReaddirResult {
  files: string[];
}

export interface FileRenameOption {
  oldPath: string;
  newPath: string;
}

export interface FileRmdirOption {
  dirPath: string;
  recursive?: boolean;
}

export interface FileUnlinkOption {
  filePath: string;
}

export interface FileWriteOption {
  filePath: string;
  data: string;
  encoding?: 'ascii' | 'base64' | 'utf8';
}

export interface FileSystemManager {
  access(options: FileAccessOption): Promise<void>;
  appendFile(options: FileAppendOption): Promise<void>;
  saveFile(options: FileSaveOption): Promise<FileSaveResult>;
  copyFile(options: FileCopyOption): Promise<void>;
  mkdir(options: FileMkdirOption): Promise<void>;
  readFile(options: FileReadOption): Promise<FileReadResult>;
  readdir(options: FileReaddirOption): Promise<FileReaddirResult>;
  rename(options: FileRenameOption): Promise<void>;
  rmdir(options: FileRmdirOption): Promise<void>;
  unlink(options: FileUnlinkOption): Promise<void>;
  writeFile(options: FileWriteOption): Promise<void>;
  getFileInfo(options: GetFileInfoOption): Promise<GetFileInfoResult>;
}

class FileSystemManagerImpl implements FileSystemManager {
  public access(options: FileAccessOption): Promise<void> {
    return invokeHostApi<void>('fileSystem.access', options);
  }

  public appendFile(options: FileAppendOption): Promise<void> {
    return invokeHostApi<void>('fileSystem.appendFile', options);
  }

  public saveFile(options: FileSaveOption): Promise<FileSaveResult> {
    return invokeHostApi<FileSaveResult>('fileSystem.saveFile', options);
  }

  public copyFile(options: FileCopyOption): Promise<void> {
    return invokeHostApi<void>('fileSystem.copyFile', options);
  }

  public mkdir(options: FileMkdirOption): Promise<void> {
    return invokeHostApi<void>('fileSystem.mkdir', options);
  }

  public readFile(options: FileReadOption): Promise<FileReadResult> {
    return invokeHostApi<FileReadResult>('fileSystem.readFile', options);
  }

  public readdir(options: FileReaddirOption): Promise<FileReaddirResult> {
    return invokeHostApi<FileReaddirResult>('fileSystem.readdir', options);
  }

  public rename(options: FileRenameOption): Promise<void> {
    return invokeHostApi<void>('fileSystem.rename', options);
  }

  public rmdir(options: FileRmdirOption): Promise<void> {
    return invokeHostApi<void>('fileSystem.rmdir', options);
  }

  public unlink(options: FileUnlinkOption): Promise<void> {
    return invokeHostApi<void>('fileSystem.unlink', options);
  }

  public writeFile(options: FileWriteOption): Promise<void> {
    return invokeHostApi<void>('fileSystem.writeFile', options);
  }

  public getFileInfo(options: GetFileInfoOption): Promise<GetFileInfoResult> {
    return invokeHostApi<GetFileInfoResult>('fileSystem.getFileInfo', options);
  }
}

const fileSystemManager = new FileSystemManagerImpl();

export const getFileSystemManager = (): FileSystemManager => {
  return fileSystemManager;
};
