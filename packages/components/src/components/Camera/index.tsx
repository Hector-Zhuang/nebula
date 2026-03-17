import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, View } from 'react-native';
import {
  BarcodeScanningResult,
  Camera,
  CameraMountError,
  CameraView,
  PermissionStatus,
} from 'expo-camera';

import { CameraProps, CameraState } from './PropsType';
import styles from './styles';

const CameraComponent: React.FC<CameraProps> = props => {
  const [hasPermission, setHasPermission] =
    useState<CameraState['hasPermission']>(null);
  const expoCameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    let active = true;
    const requestPermission = async () => {
      const permission = await Camera.requestCameraPermissionsAsync();
      if (active) {
        setHasPermission(permission?.status === PermissionStatus.GRANTED);
      }
    };
    requestPermission();
    return () => {
      active = false;
    };
  }, []);

  const onCameraError = useCallback(
    (event: CameraMountError): void => {
      props.onError && props.onError(event as any);
    },
    [props],
  );

  const onCameraInitDone = useCallback((): void => {
    global._taroCamera = expoCameraRef.current;
    const event: any = {};
    props.onInitDone && props.onInitDone(event);
  }, [props]);

  const onCameraScanCode = useCallback(
    (event: BarcodeScanningResult): void => {
      const { data } = event;
      props.onScanCode &&
        props.onScanCode({
          detail: {
            result: data,
          },
          ...event,
        } as any);
    },
    [props],
  );

  const { devicePosition, style, mode, flash } = props;
  const facing = devicePosition ?? 'back';
  const normalizedFlash = flash === 'torch' ? 'on' : flash;
  const cameraStyle = typeof style === 'string' ? undefined : (style as any);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const barCodeScannerSettings =
    mode === 'scanCode'
      ? {
          barCodeScannerSettings: {
            barCodeTypes: ['qr'] as const,
          },
          onBarCodeScanned: onCameraScanCode,
        }
      : {};

  return (
    <CameraView
      ref={expoCameraRef}
      facing={facing}
      flash={normalizedFlash}
      onMountError={onCameraError}
      onCameraReady={onCameraInitDone}
      {...barCodeScannerSettings}
      style={[styles.camera, cameraStyle]}
    />
  );
};

export default CameraComponent;
