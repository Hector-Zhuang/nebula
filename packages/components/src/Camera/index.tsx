import React, {
  useEffect,
  useCallback,
  FC,
  useMemo,
  PropsWithChildren,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Camera as RNCamera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
  Code,
  CodeType,
} from 'react-native-vision-camera';

export interface CameraInitEventDetail {
  maxZoom: number;
}

export interface CameraScanCodeEventDetail {
  charSet: string;
  rawData: string;
  type: CodeType | 'unknown';
  result: string;
  fullResult: string;
}

export interface CameraError {
  message: string;
  code?: string;
  nativeError?: unknown;
}

export interface CameraProps {
  id?: string;
  className?: string;
  style?: any;
  mode?: 'normal' | 'scanCode';
  resolution?: 'low' | 'medium' | 'high';
  devicePosition?: 'front' | 'back';
  flash?: 'auto' | 'on' | 'off' | 'torch';
  onInitDone?: (event: CameraInitEventDetail) => void;
  onReady?: (event: CameraInitEventDetail) => void;
  onScanCode?: (event: CameraScanCodeEventDetail) => void;
  onError?: (error: CameraError) => void;
}

export const Camera: FC<PropsWithChildren<CameraProps>> = props => {
  const {
    devicePosition = 'back',
    style,
    mode,
    flash,
    onScanCode,
    onError,
    onInitDone,
  } = props;

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice(devicePosition);

  useEffect(() => {
    onHandlePermissionRequest();
  }, []);

  const onHandlePermissionRequest = useCallback(async () => {
    if (!hasPermission) {
      try {
        const granted = await requestPermission();
        if (!granted && onError) {
          onError({
            message: 'Camera permission denied',
            code: 'PERMISSION_DENIED',
          });
        }
      } catch (error) {
        if (onError) {
          onError({
            message: error instanceof Error ? error.message : 'Unknown error',
            code: 'PERMISSION_ERROR',
            nativeError: error,
          });
        }
      }
    }
  }, [hasPermission, requestPermission, onError]);

  const onHandleCodeScanned = useCallback(
    (codes: Code[]) => {
      if (mode === 'scanCode' && codes.length > 0 && onScanCode) {
        const code = codes[0];
        onScanCode({
          result: code.value || '',
          type: code.type,
          charSet: '',
          rawData: code.value || '',
          fullResult: code.value || '',
        });
      }
    },
    [mode, onScanCode],
  );

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: onHandleCodeScanned,
  });

  const onHandleError = useCallback(
    (error: unknown) => {
      if (onError) {
        if (error && typeof error === 'object' && 'message' in error) {
          onError({ message: (error as any).message, nativeError: error });
        } else {
          onError({ message: 'Unknown error', nativeError: error });
        }
      }
    },
    [onError],
  );

  const onHandleInitialized = useCallback(() => {
    if (onInitDone) {
      onInitDone({ maxZoom: device?.maxZoom ?? 1 });
    }
  }, [onInitDone, device]);

  const torchState = useMemo(() => {
    if (flash === 'on' || flash === 'torch') return 'on';
    return 'off';
  }, [flash]);

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.center}>
        <Text>No camera device found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <RNCamera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive
        codeScanner={mode === 'scanCode' ? codeScanner : undefined}
        torch={torchState}
        onError={onHandleError}
        onInitialized={onHandleInitialized}
      />
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
