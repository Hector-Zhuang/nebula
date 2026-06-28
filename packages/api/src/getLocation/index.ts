import { invokeHostApi } from '../runtime/host';

export interface GetLocationOption {
  altitude?: boolean;
  isHighAccuracy?: boolean;
  highAccuracyExpireTime?: number;
}

export interface GetLocationResult {
  latitude: number;
  longitude: number;
  speed: number;
  accuracy: number;
  altitude: number;
  verticalAccuracy: number;
  horizontalAccuracy: number;
}

export const getLocation = (
  options: GetLocationOption = {},
): Promise<GetLocationResult> => {
  return invokeHostApi<GetLocationResult>('getLocation', options);
};
