import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { NebulaAPI } from '@nebula-rn/sdk';
import { createHostApiFailure, createHostApiSuccess } from './hostApiBridge';
import { previewImageChannel } from './previewImageRuntime';
import { saveMediaHost } from './coreHostApis';
import { downloadFileHost } from './taskHosts';

function PreviewImageLoading(): React.ReactElement {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#999" />
    </View>
  );
}

function renderPreviewImageLoading() {
  return <PreviewImageLoading />;
}

export default function NebulaHostPreviewImageModal(): React.ReactElement | null {
  const [request, setRequest] = useState(previewImageChannel.getCurrent());
  const didCloseRef = useRef(false);

  useEffect(() => {
    return previewImageChannel.subscribe(nextRequest => {
      didCloseRef.current = false;
      setRequest(nextRequest);
    });
  }, []);

  const imageUrls = useMemo(
    () => request?.urls.map(url => ({ url })) ?? [],
    [request],
  );

  if (!request) {
    return null;
  }

  const initialIndex = request.current
    ? request.urls.indexOf(request.current)
    : 0;
  const index = initialIndex === -1 ? 0 : initialIndex;

  const close = (
    result:
      | ReturnType<typeof createHostApiSuccess<{ dismissed: boolean }>>
      | ReturnType<typeof createHostApiFailure> = createHostApiSuccess({
      dismissed: true,
    }),
  ) => {
    if (didCloseRef.current) {
      return;
    }
    didCloseRef.current = true;
    NebulaAPI.dismissHostModal()
      .catch(() => {})
      .finally(() => {
        previewImageChannel.settle(result);
      });
  };

  return (
    <View style={styles.container}>
      <ImageViewer
        imageUrls={imageUrls}
        index={index}
        onCancel={() => close()}
        onClick={() => close()}
        onSwipeDown={() => close()}
        enableSwipeDown
        useNativeDriver
        loadingRender={renderPreviewImageLoading}
        onSave={async uri => {
          try {
            const download = await downloadFileHost({
              url: uri,
            });
            await saveMediaHost({
              url: download.tempFilePath,
              type: 'photo',
            });
          } catch (error) {
            close(
              createHostApiFailure(
                'PREVIEW_IMAGE_SAVE_FAILED',
                error instanceof Error
                  ? error.message
                  : 'previewImage:fail unable to save image',
              ),
            );
          }
        }}
        menuContext={
          request.showMenu === false
            ? undefined
            : {
                saveToLocal: request.saveMediaText ?? 'Save Image',
                cancel: request.cancelText ?? 'Cancel',
              }
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
