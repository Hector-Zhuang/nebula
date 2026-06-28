import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Video } from '@nebula-rn/components';
import {
  chooseMedia,
  compressImage,
  type ChooseMediaFile,
  getImageInfo,
  previewImages,
  saveMedia,
  scanCode,
  scanCodeSafe,
} from '@nebula-rn/client';
import {
  ApiButton,
  ApiCard,
  ApiInput,
  ApiTestPage,
  useApiResultState,
} from './ApiTestUtils';

export default function ApiMediaPage() {
  const { result, run } = useApiResultState();
  const [imageUrl, setImageUrl] = useState(
    'https://picsum.photos/seed/nebula-preview/720/1280',
  );
  const [localAssetPath, setLocalAssetPath] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<ChooseMediaFile | null>(
    null,
  );
  const previewSamples = [
    'https://picsum.photos/seed/nebula-preview-1/720/1280',
    'https://picsum.photos/seed/nebula-preview-2/900/900',
    'https://picsum.photos/seed/nebula-preview-3/1080/720',
  ];

  return (
    <ApiTestPage
      title="Media & Modal APIs"
      subtitle="Validate pickers, image helpers, preview modal, scanCode modal, and save-to-album."
      result={result}
    >
      <ApiCard title="Media Selection">
        <ApiButton
          title="chooseMedia()"
          color="#ea580c"
          onPress={() =>
            run('chooseMedia', async () => {
              const res = await chooseMedia({
                count: 1,
                mediaType: ['mix'],
                sourceType: ['album', 'camera'],
              });
              const first = res.tempFiles[0];
              if (first?.tempFilePath) {
                setLocalAssetPath(first.tempFilePath);
                setSelectedMedia(first);
              }
              return res;
            })
          }
        />
        {selectedMedia ? (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Selected media preview</Text>
            <Text style={styles.previewMeta}>
              {selectedMedia.fileType} · {selectedMedia.width ?? '?'} x{' '}
              {selectedMedia.height ?? '?'}
            </Text>
            {selectedMedia.fileType === 'video' ? (
              <Video
                src={selectedMedia.tempFilePath}
                controls
                style={styles.videoPreview}
              />
            ) : (
              <Image
                source={{ uri: selectedMedia.tempFilePath }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
            )}
            <Text style={styles.previewPath}>{selectedMedia.tempFilePath}</Text>
          </View>
        ) : null}
        <ApiButton
          title="compressImage()"
          color="#c2410c"
          onPress={() =>
            run('compressImage', async () => {
              if (selectedMedia?.fileType === 'video') {
                throw new Error(
                  'compressImage only supports image assets. Choose an image first.',
                );
              }

              return compressImage({
                src: localAssetPath || imageUrl,
                quality: 70,
                compressedWidth: 320,
                compressedHeight: 320,
              });
            })
          }
        />
        <ApiButton
          title="getImageInfo()"
          color="#9a3412"
          onPress={() =>
            run('getImageInfo', () =>
              getImageInfo({
                src: localAssetPath || imageUrl,
              }),
            )
          }
        />
      </ApiCard>

      <ApiCard title="Modal APIs">
        <ApiInput
          label="Preview Image URL"
          value={imageUrl}
          onChangeText={setImageUrl}
        />
        <ApiButton
          title="Load built-in preview samples"
          color="#fb923c"
          onPress={() => {
            setImageUrl(previewSamples[0]);
            run('previewSamples', async () => ({
              urls: previewSamples,
            })).catch(() => {});
          }}
        />
        <ApiButton
          title="previewImages() single image"
          color="#f97316"
          onPress={() =>
            run('previewImages', () =>
              previewImages({
                urls: [imageUrl],
                current: imageUrl,
                showMenu: true,
              }),
            )
          }
        />
        <ApiButton
          title="previewImages() multiple samples"
          color="#ea580c"
          onPress={() =>
            run('previewImages multi', () =>
              previewImages({
                urls: previewSamples,
                current: previewSamples[1],
                showMenu: true,
              }),
            )
          }
        />
        <ApiButton
          title="scanCode()"
          color="#16a34a"
          onPress={() =>
            run('scanCode', () =>
              scanCode({
                scanType: ['qr', 'ean-13', 'code-128'],
              }),
            )
          }
        />
        <ApiButton
          title="scanCodeSafe()"
          color="#15803d"
          onPress={() =>
            run('scanCodeSafe', () =>
              scanCodeSafe({
                scanType: ['qr', 'ean-13', 'code-128'],
              }),
            )
          }
        />
      </ApiCard>

      <ApiCard title="Album Save">
        <ApiButton
          title="saveMedia()"
          color="#2563eb"
          onPress={() =>
            run('saveMedia', () =>
              saveMedia(localAssetPath || imageUrl, 'photo', {
                album: 'Nebula',
              }),
            )
          }
        />
      </ApiCard>
    </ApiTestPage>
  );
}

const styles = StyleSheet.create({
  previewCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fdba74',
    gap: 8,
  },
  previewTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9a3412',
  },
  previewMeta: {
    fontSize: 13,
    color: '#7c2d12',
  },
  imagePreview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: '#fed7aa',
  },
  videoPreview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#111827',
  },
  previewPath: {
    fontSize: 12,
    color: '#9a3412',
  },
});
