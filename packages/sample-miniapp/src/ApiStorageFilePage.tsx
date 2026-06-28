import React, { useMemo, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  clearStorageItems,
  downloadFile,
  getFileInfo,
  getFileSystemManager,
  getStorage,
  getStorageCurrentSize,
  getStorageItem,
  getStorageKeys,
  getStorageInfo,
  removeStorageItem,
  removeFile,
  serializeStorageValue,
  setStorage,
  setStorageItem,
  uploadFile,
  deserializeStorageValue,
} from '@nebula-rn/client';
import { Miniapp } from '@nebula-rn/sdk';
import {
  ApiButton,
  ApiCard,
  ApiInput,
  ApiTestPage,
  useApiResultState,
} from './ApiTestUtils';

export default function ApiStorageFilePage() {
  const { result, run, setResult } = useApiResultState();
  const [storageKey, setStorageKey] = useState('nebula-demo-key');
  const [storageValue, setStorageValue] = useState('nebula-demo-value');
  const [downloadUrl, setDownloadUrl] = useState(
    'https://picsum.photos/seed/nebula-file/480/480',
  );
  const [uploadUrl, setUploadUrl] = useState('https://httpbin.org/post');
  const [localFilePath, setLocalFilePath] = useState('');
  const sandboxRoot = useMemo(() => Miniapp.getSandboxPath(), []);
  const testDirPath = `${sandboxRoot}/api-dir`;
  const testFilePath = `${sandboxRoot}/api-test.txt`;
  const testRenamePath = `${sandboxRoot}/api-test-renamed.txt`;
  const testCopyPath = `${sandboxRoot}/api-test-copy.txt`;

  const runDownload = async () => {
    const task = downloadFile({
      url: downloadUrl,
    });
    task.onProgressUpdate(progress => {
      setResult(`downloadFile: progress ${progress.progress}%`);
    });
    const res = await task;
    setLocalFilePath(res.tempFilePath);
    return res;
  };

  const runUpload = async () => {
    const filePath = localFilePath || testFilePath;
    const task = uploadFile({
      url: uploadUrl,
      filePath,
      name: 'file',
    });
    task.onProgressUpdate(progress => {
      setResult(`uploadFile: progress ${progress.progress}%`);
    });
    return task.then(value => value);
  };

  return (
    <ApiTestPage
      title="Storage & File APIs"
      subtitle="Validate host-backed storage, file system, file info, download, upload, and cleanup."
      result={result}
    >
      <ApiCard title="Storage">
        <ApiInput
          label="Storage Key"
          value={storageKey}
          onChangeText={setStorageKey}
        />
        <ApiInput
          label="Storage Value"
          value={storageValue}
          onChangeText={setStorageValue}
        />
        <ApiButton
          title="setStorageItem()"
          color="#3b82f6"
          onPress={() =>
            run('setStorageItem', () =>
              setStorageItem(storageKey, storageValue),
            )
          }
        />
        <ApiButton
          title="setStorage()"
          color="#2563eb"
          onPress={() =>
            run('setStorage', () =>
              setStorage({
                key: storageKey,
                data: storageValue,
              }),
            )
          }
        />
        <ApiButton
          title="getStorage()"
          color="#1d4ed8"
          onPress={() => run('getStorage', () => getStorage(storageKey))}
        />
        <ApiButton
          title="getStorageItem()"
          color="#1e3a8a"
          onPress={() =>
            run('getStorageItem', () => getStorageItem(storageKey))
          }
        />
        <ApiButton
          title="getStorageInfo()"
          color="#1e40af"
          onPress={() => run('getStorageInfo', () => getStorageInfo())}
        />
        <ApiButton
          title="getStorageKeys()"
          color="#1d4ed8"
          onPress={() => run('getStorageKeys', () => getStorageKeys())}
        />
        <ApiButton
          title="getStorageCurrentSize()"
          color="#172554"
          onPress={() =>
            run('getStorageCurrentSize', () => getStorageCurrentSize())
          }
        />
        <ApiButton
          title="removeStorageItem()"
          color="#7f1d1d"
          onPress={() =>
            run('removeStorageItem', () => removeStorageItem(storageKey))
          }
        />
        <ApiButton
          title="clearStorageItems()"
          color="#991b1b"
          onPress={() => run('clearStorageItems', () => clearStorageItems())}
        />
        <ApiButton
          title="serialize / deserialize"
          color="#475569"
          onPress={() =>
            run('serialize/deserialize', async () => {
              const serialized = serializeStorageValue({
                key: storageKey,
                value: storageValue,
              });
              return {
                serialized,
                deserialized: deserializeStorageValue(serialized),
              };
            })
          }
        />
      </ApiCard>

      <ApiCard title="File System" description={`Sandbox root: ${sandboxRoot}`}>
        <ApiButton
          title="mkdir()"
          color="#8b5cf6"
          onPress={() =>
            run('mkdir', () =>
              getFileSystemManager().mkdir({
                dirPath: testDirPath,
                recursive: true,
              }),
            )
          }
        />
        <ApiButton
          title="writeFile()"
          color="#7c3aed"
          onPress={() =>
            run('writeFile', () =>
              getFileSystemManager().writeFile({
                filePath: testFilePath,
                data: `Nebula test file @ ${new Date().toISOString()}`,
              }),
            )
          }
        />
        <ApiButton
          title="appendFile()"
          color="#6d28d9"
          onPress={() =>
            run('appendFile', () =>
              getFileSystemManager().appendFile({
                filePath: testFilePath,
                data: '\nappended by Nebula API test',
              }),
            )
          }
        />
        <ApiButton
          title="access()"
          color="#5b21b6"
          onPress={() =>
            run('access', () =>
              getFileSystemManager().access({
                path: localFilePath || testFilePath,
              }),
            )
          }
        />
        <ApiButton
          title="readFile()"
          color="#4c1d95"
          onPress={() =>
            run('readFile', () =>
              getFileSystemManager().readFile({
                filePath: testFilePath,
              }),
            )
          }
        />
        <ApiButton
          title="copyFile()"
          color="#4338ca"
          onPress={() =>
            run('copyFile', () =>
              getFileSystemManager().copyFile({
                srcPath: testFilePath,
                destPath: testCopyPath,
              }),
            )
          }
        />
        <ApiButton
          title="saveFile()"
          color="#3730a3"
          onPress={() =>
            run('saveFile', () =>
              getFileSystemManager().saveFile({
                tempFilePath: localFilePath,
              }),
            )
          }
        />
        <ApiButton
          title="getFileInfo()"
          color="#312e81"
          onPress={() =>
            run('getFileInfo', () =>
              getFileInfo({
                filePath: localFilePath || testFilePath,
              }),
            )
          }
        />
        <ApiButton
          title="rename()"
          color="#581c87"
          onPress={() =>
            run('rename', () =>
              getFileSystemManager().rename({
                oldPath: testFilePath,
                newPath: testRenamePath,
              }),
            )
          }
        />
        <ApiButton
          title="readdir()"
          color="#6b21a8"
          onPress={() =>
            run('readdir', () =>
              getFileSystemManager().readdir({
                dirPath: sandboxRoot,
              }),
            )
          }
        />
        <ApiButton
          title="unlink()"
          color="#7e22ce"
          onPress={() =>
            run('unlink', () =>
              getFileSystemManager().unlink({
                filePath: testCopyPath,
              }),
            )
          }
        />
        <ApiButton
          title="rmdir()"
          color="#86198f"
          onPress={() =>
            run('rmdir', () =>
              getFileSystemManager().rmdir({
                dirPath: testDirPath,
                recursive: true,
              }),
            )
          }
        />
        <ApiButton
          title="removeFile()"
          color="#7f1d1d"
          onPress={() =>
            run('removeFile', () =>
              removeFile({
                filePath: testRenamePath,
              }),
            )
          }
        />
      </ApiCard>

      <ApiCard title="Transfer Tasks">
        <ApiInput
          label="Download URL"
          value={downloadUrl}
          onChangeText={setDownloadUrl}
        />
        <ApiButton
          title="downloadFile()"
          color="#0f766e"
          onPress={() => run('downloadFile', runDownload)}
        />
        <ApiInput
          label="Upload URL"
          value={uploadUrl}
          onChangeText={setUploadUrl}
        />
        <ApiButton
          title="uploadFile()"
          color="#0d9488"
          onPress={() => run('uploadFile', runUpload)}
        />
        <TextHint text={`Latest local file: ${localFilePath || '(none)'}`} />
      </ApiCard>
    </ApiTestPage>
  );
}

function TextHint({ text }: { text: string }) {
  return <Text style={styles.textHint}>{text}</Text>;
}

const styles = StyleSheet.create({
  textHint: {
    fontSize: 12,
    color: '#475569',
  },
});
