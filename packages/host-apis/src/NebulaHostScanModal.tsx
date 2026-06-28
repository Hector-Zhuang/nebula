import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import type { Code, CodeType } from 'react-native-vision-camera';
import { NebulaAPI } from '@nebula-rn/sdk';
import type { NebulaApiInvokeResult } from '@nebula-rn/sdk';
import { scanCodeChannel } from './scanCodeRuntime';

const { width, height } = Dimensions.get('screen');

function createFailureResult(
  code:
    | 'PERMISSION_DENIED'
    | 'USER_CANCELLED'
    | 'UNSUPPORTED_SOURCE'
    | 'SCAN_FAILED',
  message: string,
): NebulaApiInvokeResult {
  return {
    ok: false,
    error: {
      code,
      message,
    },
  };
}

function createSuccessResult(code: Code): NebulaApiInvokeResult {
  return {
    ok: true,
    data: {
      result: code.value,
      scanType: code.type,
      rawData: code,
    },
  };
}

export default function NebulaHostScanModal(): React.ReactElement | null {
  const [request, setRequest] = useState(scanCodeChannel.getCurrent());
  const [isActive, setIsActive] = useState(true);
  const [hasPermission, setHasPermission] = useState(Platform.OS !== 'android');
  const didHandleScanRef = useRef(false);
  const device = useCameraDevice('back');
  const scanTypes = (request?.scanTypes ?? [
    'qr',
    'ean-13',
    'code-128',
  ]) as CodeType[];
  const codeScanner = useCodeScanner({
    codeTypes: scanTypes,
    onCodeScanned: codes => {
      if (!codes[0] || !isActive || didHandleScanRef.current) {
        return;
      }

      didHandleScanRef.current = true;
      setIsActive(false);
      closeWithResult(createSuccessResult(codes[0]));
    },
  });

  const closeWithResult = (result: NebulaApiInvokeResult) => {
    NebulaAPI.dismissHostModal()
      .catch(() => {})
      .finally(() => {
        scanCodeChannel.settle(result);
      });
  };

  useEffect(() => {
    return scanCodeChannel.subscribe(nextRequest => {
      didHandleScanRef.current = false;
      setRequest(nextRequest);
      setIsActive(true);
      setHasPermission(Platform.OS !== 'android');
    });
  }, []);

  useEffect(() => {
    if (!request) {
      return;
    }

    return () => {
      if (didHandleScanRef.current) {
        return;
      }
      didHandleScanRef.current = true;
      scanCodeChannel.settle(
        createFailureResult('USER_CANCELLED', 'scanCode:fail cancel'),
      );
    };
  }, [request]);

  useEffect(() => {
    if (Platform.OS !== 'android' || !request) {
      return;
    }

    let cancelled = false;

    const requestAndroidPermission = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      if (cancelled || didHandleScanRef.current) {
        return;
      }

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasPermission(true);
        return;
      }

      didHandleScanRef.current = true;
      closeWithResult(
        createFailureResult(
          'PERMISSION_DENIED',
          'scanCode:fail permission denied',
        ),
      );
    };

    requestAndroidPermission().catch(() => {
      if (cancelled || didHandleScanRef.current) {
        return;
      }
      didHandleScanRef.current = true;
      closeWithResult(
        createFailureResult(
          'SCAN_FAILED',
          'scanCode:fail unable to request camera permission',
        ),
      );
    });

    return () => {
      cancelled = true;
    };
  }, [request]);

  if (!request) {
    return null;
  }

  if (Platform.OS === 'android' && !hasPermission) {
    return <View style={styles.container} />;
  }

  if (!device) {
    return <View style={styles.container} />;
  }

  const safePaddingTop = Platform.OS === 'ios' ? 54 : 20;

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Camera
        codeScanner={codeScanner}
        device={device}
        isActive={isActive}
        style={StyleSheet.absoluteFill}
      />

      <TouchableOpacity
        style={[styles.closeIcon, { paddingTop: safePaddingTop }]}
        onPress={() => {
          if (didHandleScanRef.current) {
            return;
          }
          didHandleScanRef.current = true;
          closeWithResult(
            createFailureResult('USER_CANCELLED', 'scanCode:fail cancel'),
          );
        }}
      >
        <Image
          source={require('./assets/icon_close.png')}
          style={styles.closeImg}
        />
      </TouchableOpacity>

      {!request.onlyFromCamera ? (
        <TouchableOpacity
          style={styles.albumIcon}
          onPress={() => {
            if (didHandleScanRef.current) {
              return;
            }
            didHandleScanRef.current = true;
            closeWithResult(
              createFailureResult(
                'UNSUPPORTED_SOURCE',
                'scanCode:fail album selection not implemented',
              ),
            );
          }}
        >
          <Image
            source={require('./assets/icon_pic.png')}
            style={styles.albumImg}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: '#000',
  },
  closeIcon: {
    position: 'absolute',
    left: 20,
    top: 0,
    zIndex: 1010,
  },
  closeImg: {
    width: 26,
    height: 26,
    tintColor: '#FFF',
  },
  albumIcon: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    zIndex: 1010,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 30,
  },
  albumImg: {
    width: 24,
    height: 24,
    tintColor: '#FFF',
  },
});
