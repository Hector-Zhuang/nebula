import Nebula from '../../index'

declare module '../../index' {
  namespace saveFileToDisk {
    interface Option {
      
      filePath: string
      
      
      
    }
  }

  namespace saveFile {
    interface Option {
      
      tempFilePath: string
      
      
      
      filePath?: string
      
      apFilePath?: string
      
    }
    interface FailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      savedFilePath: string
      
      errMsg: string
    }
  }

  namespace removeSavedFile {
    interface Option {
      
      filePath: string
      
      
      
    }
    interface RemoveSavedFileFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
  }

  namespace openDocument {
    interface Option {
      
      filePath: string
      
      showMenu?: boolean
      
      
      
      fileType?: keyof FileType
      
    }
    
    interface FileType {
      
      doc
      
      docx
      
      xls
      
      xlsx
      
      ppt
      
      pptx
      
      pdf
    }
  }

  namespace getSavedFileList {
    interface Option {
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      fileList: FileItem[]
      
      errMsg: string
    }
    
    interface FileItem {
      
      createTime: number
      
      filePath: string
      
      apFilePath?: string
      
      size: number
    }
  }

  namespace getSavedFileInfo {
    interface Option {
      
      filePath: string
      
      apFilePath?: string
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      createTime: number
      
      size: number
      
      errMsg: string
    }
  }

  namespace getFileInfo {
    interface Option {
      
      filePath: string
      
      apFilePath?: string
      
      digestAlgorithm?: 'md5' | 'sha1'
      
      
      
    }
    interface FailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      size: number
      
      digest: string
      
      errMsg: string
    }
  }

  
  interface FileSystemManager {
    
    access(option: FileSystemManager.AccessOption): void
    
    accessSync(
      
      path: string,
    ): void
    
    appendFile(option: FileSystemManager.AppendFileOption): void
    
    appendFileSync(
      
      filePath: string,
      
      data: string | ArrayBuffer,
      
      encoding?: keyof FileSystemManager.Encoding,
    ): void
    
    close(option: FileSystemManager.CloseOption): void
    
    closeSync(option: FileSystemManager.CloseSyncOption): void
    
    copyFile(option: FileSystemManager.CopyFileOption): void
    
    copyFileSync(
      
      srcPath: string,
      
      destPath: string,
    ): void
    
    fstat(option: FileSystemManager.FstatOption): void
    
    fstatSync(option: FileSystemManager.FstatSyncOption): Stats
    
    ftruncate(option: FileSystemManager.FtruncateOption): void
    
    ftruncateSync(option: FileSystemManager.FtruncateSyncOption): void
    
    getFileInfo(option: FileSystemManager.getFileInfoOption): void
    
    getSavedFileList(option?: FileSystemManager.getSavedFileListOption): void
    
    mkdir(option: FileSystemManager.MkdirOption): void
    
    mkdirSync(
      
      dirPath: string,
      
      recursive?: boolean,
    ): void
    
    open(option: FileSystemManager.OpenOption): void
    
    openSync(option: FileSystemManager.OpenSyncOption): string 
    
    read(option: FileSystemManager.ReadOption): void
    
    readCompressedFile(option: FileSystemManager.readCompressedFile.Option): Promise<FileSystemManager.readCompressedFile.Promised>
    
    readCompressedFileSync(option: FileSystemManager.readCompressedFileSync.Option): ArrayBuffer 
    
    readdir(option: FileSystemManager.ReaddirOption): void
    
    readdirSync(
      
      dirPath: string,
    ): string[]
    
    readFile(option: FileSystemManager.ReadFileOption): void
    
    readFileSync(
      
      filePath: string,
      
      encoding?: keyof FileSystemManager.Encoding,
      
      position?: number,
      
      length?: number,
    ): string | ArrayBuffer
    
    readSync(
      option: FileSystemManager.ReadSyncOption
    ): {
      
      bytesRead: number
      
      arrayBuffer: ArrayBuffer
    }
    
    readZipEntry(option: FileSystemManager.readZipEntry.Option): Promise<FileSystemManager.readZipEntry.Promised>
    
    removeSavedFile(option: FileSystemManager.RemoveSavedFileOption): void
    
    rename(option: FileSystemManager.RenameOption): void
    
    renameSync(
      
      oldPath: string,
      
      newPath: string,
    ): void
    
    rmdir(option: FileSystemManager.RmdirOption): void
    
    rmdirSync(
      
      dirPath: string,
      
      recursive?: boolean,
    ): void
    
    saveFile(option: FileSystemManager.SaveFileOption): void
    
    saveFileSync(
      
      tempFilePath: string,
      
      filePath?: string,
    ): string
    
    stat(option: FileSystemManager.StatOption): void
    
    statSync(
      
      path: string,
      
      recursive?: boolean,
    ): Stats | NebulaGeneral.IAnyObject
    
    truncate(option: FileSystemManager.TruncateOption): void
    
    truncateSync(option: FileSystemManager.TruncateSyncOption): void
    
    unlink(option: FileSystemManager.UnlinkOption): void
    
    unlinkSync(
      
      filePath: string,
    ): void
    
    unzip(option: FileSystemManager.UnzipOption): void
    
    write(option: FileSystemManager.WriteOption): void
    
    writeFile(option: FileSystemManager.WriteFileOption): void
    
    writeFileSync(
      
      filePath: string,
      
      data: string | ArrayBuffer,
      
      encoding?: keyof FileSystemManager.Encoding,
    ): void
    
    writeSync(
      option: FileSystemManager.WriteSyncOption
    ): {
      
      bytesWritten: number
    }
  }

  namespace FileSystemManager {
    
    interface Encoding {
      ascii
      base64
      binary
      hex
      
      ucs2
      
      'ucs-2'
      
      utf16le
      
      'utf-16le'
      'utf-8'
      utf8
      latin1
    }
    
    interface flag {
      a 
      ax 
      'a+' 
      'ax+' 
      as 
      'as+' 
      r 
      'r+' 
      w 
      wx 
      'w+' 
      'wx+' 
    }
    interface AccessOption {
      
      path: string
      
      
      
    }

    interface AccessFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }

    interface AppendFileOption {
      
      data: string | ArrayBuffer
      
      filePath: string
      
      encoding?: keyof FileSystemManager.Encoding
      
      
      
    }

    interface AppendFileFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }

    interface CopyFileOption {
      
      destPath: string
      
      srcPath: string
      
      
      
    }

    interface CopyFileFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }

    interface getFileInfoOption {
      
      filePath: string
      
      digestAlgorithm?: 'md5' | 'sha1'
      
      
      
    }

    interface GetFileInfoFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
    interface GetFileInfoSuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      size: number
      
      digest?: string
      
      errMsg: string
    }

    interface getSavedFileListOption {
      
      
      
    }

    interface GetSavedFileListSuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      fileList: GetSavedFileListSuccessCallbackResultFileItem[]
      
      errMsg: string
    }
    
    interface GetSavedFileListSuccessCallbackResultFileItem {
      
      createTime: number
      
      filePath: string
      
      size: number
    }

    interface MkdirOption {
      
      dirPath: string
      
      recursive?: boolean
      
      
      
    }

    interface MkdirFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }

    interface ReadFileOption {
      
      filePath: string
      
      position?: number
      
      length?: number
      
      
      encoding?: keyof FileSystemManager.Encoding
      
      
    }
    interface ReadFileSuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      data: string | ArrayBuffer
      
      errMsg: string
    }
    interface ReadFileFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }

    interface ReaddirOption {
      
      dirPath: string
      
      
      
    }

    interface ReaddirFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
    interface ReaddirSuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      files: string[]
      
      errMsg: string
    }

    namespace readZipEntry {
      type Promised = FailCallbackResult | SuccessCallbackResult
      interface Option {
        
        filePath: string
        
        encoding?: keyof Encoding | string
        
        entries: File[] | 'all'
        
        
        
      }
      interface File {
        
        path: string
        
        encoding?: keyof Encoding | string
        
        position?: number
        
        length?: number
      }
      
      interface Encoding {
        ascii
        base64
        binary
        hex
        
        ucs2
        
        'ucs-2'
        
        utf16le
        
        'utf-16le'
        'utf-8'
        utf8
        latin1
      }
      interface FailCallbackResult extends NebulaGeneral.CallbackResult {
        
        errMsg: string
      }
      interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
        
        entries: {
          [path: string]: FileItem
        }
      }
      interface FileItem extends NebulaGeneral.CallbackResult {
        
        data: string | ArrayBuffer
        
        errMsg: string
      }
    }

    interface RemoveSavedFileOption {
      
      filePath: string
      
      apFilePath?: string
      
      
      
    }
    interface RemoveSavedFileFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }

    interface RenameOption {
      
      newPath: string
      
      oldPath: string
      
      
      
    }
    interface RenameFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }

    interface RmdirOption {
      
      dirPath: string
      
      
      
      recursive?: boolean
      
    }
    interface RmdirFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }

    interface SaveFileOption {
      
      tempFilePath: string
      
      
      
      filePath?: string
      
    }

    interface SaveFileFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
    interface SaveFileSuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      savedFilePath: string
      
      errMsg: string
    }

    interface StatOption {
      
      path: string
      
      
      
      recursive?: boolean
      
    }
    interface StatFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
    interface StatSuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      stats: Stats | NebulaGeneral.IAnyObject
      
      errMsg: string
    }

    interface UnlinkOption {
      
      filePath: string
      
      
      
    }
    interface UnlinkFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }

    interface UnzipOption {
      
      targetPath: string
      
      zipFilePath: string
      
      
      
    }

    interface UnzipFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }

    interface WriteFileOption {
      
      data: string | ArrayBuffer
      
      filePath: string
      
      
      encoding?: keyof FileSystemManager.Encoding
      
      
    }
    interface WriteFileFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
    interface FstatOption {
      
      fd: string
      
      
      
    }

    interface FstatFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
    interface FstatSuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      stats: Stats
      
      errMsg: string
    }
    interface FstatSyncOption {
      
      fd: string
    }
    interface CloseOption {
      
      fd: string
      
      
      
    }
    interface CloseFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
    interface CloseSyncOption {
      
      fd: string
    }
    interface FtruncateOption {
      
      fd: string
      
      length: number
      
      
      
    }
    interface FtruncateFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
    interface FtruncateSyncOption {
      
      fd: string
      
      length: number
    }

    interface OpenOption {
      
      filePath: string
      
      flag?: keyof FileSystemManager.flag
      
      
      
    }
    interface OpenFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
    interface OpenSuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      fd: string
      
      errMsg: string
    }
    interface OpenSyncOption {
      
      filePath: string
      
      flag?: keyof FileSystemManager.flag
    }
    interface ReadOption {
      
      fd: string
      
      arrayBuffer: ArrayBuffer
      
      offset?: number
      
      length?: number
      
      position?: number
      
      
      
    }
    interface ReadFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
    interface ReadSuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      bytesRead: string
      
      arrayBuffer: ArrayBuffer
      
      errMsg: string
    }
    namespace readCompressedFile {
      type Promised = FailCallbackResult | SuccessCallbackResult
      interface Option {
        
        filePath: string
        
        compressionAlgorithm: keyof CompressionAlgorithm | string
        
        
        
      }
      
      interface CompressionAlgorithm {
        
        br
      }
      interface FailCallbackResult extends NebulaGeneral.CallbackResult {
        
        errMsg: string
      }
      interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
        
        data: ArrayBuffer
      }
    }
    namespace readCompressedFileSync {
      interface Option {
        
        filePath: string
        
        compressionAlgorithm: keyof CompressionAlgorithm | string
      }
      
      interface CompressionAlgorithm {
        
        br
      }
    }
    interface ReadSyncOption {
      
      fd: string
      
      arrayBuffer: ArrayBuffer
      
      offset?: number
      
      length?: number
      
      position?: number
    }
    interface TruncateOption {
      
      filePath: string
      
      length?: number
      
      
      
    }
    interface TruncateFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
    interface TruncateSyncOption {
      
      filePath: string
      
      length?: number
    }
    interface WriteOption {
      
      fd: string
      
      data: string | ArrayBuffer
      
      offset?: number
      
      length?: number
      
      encoding?: keyof FileSystemManager.Encoding
      
      position?: number
      
      
      
    }
    interface WriteFailCallbackResult extends NebulaGeneral.CallbackResult {
      
      errMsg: string
    }
    interface WriteSuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      bytesWritten: number
      
      errMsg: string
    }
    interface WriteSyncOption {
      
      fd: string
      
      data: string | ArrayBuffer
      
      offset?: number
      
      length?: number
      
      encoding?: keyof FileSystemManager.Encoding
      
      position?: number
    }
  }

  
  interface ReadResult {
    
    bytesRead: number
    
    arrayBuffer: ArrayBuffer
  }

  
  interface Stats {
    
    mode: string
    
    size: number
    
    lastAccessedTime: number
    
    lastModifiedTime: number
    
    isDirectory(): boolean
    
    isFile(): boolean
  }

  
  interface WriteResult {
    
    bytesWritten: number
  }

  interface NebulaStatic {
    
    saveFileToDisk(option: saveFileToDisk.Option): Promise<NebulaGeneral.CallbackResult>

    
    saveFile(option: saveFile.Option): Promise<saveFile.SuccessCallbackResult | saveFile.FailCallbackResult>

    
    removeSavedFile(option: removeSavedFile.Option): Promise<NebulaGeneral.CallbackResult>

    
    openDocument(option: openDocument.Option): Promise<NebulaGeneral.CallbackResult>

    
    getSavedFileList(option?: getSavedFileList.Option): Promise<getSavedFileList.SuccessCallbackResult>

    
    getSavedFileInfo(option: getSavedFileInfo.Option): Promise<getSavedFileInfo.SuccessCallbackResult>

    
    getFileInfo(option: getFileInfo.Option): Promise<getFileInfo.SuccessCallbackResult | getFileInfo.FailCallbackResult>

    
    getFileSystemManager(): FileSystemManager
  }
}
