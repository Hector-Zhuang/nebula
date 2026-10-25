import { invokeHostApi } from '../runtime/host';

export const vibrateShort = () => invokeHostApi<boolean>('vibrateShort');

export const vibrateLong = () => invokeHostApi<boolean>('vibrateLong');
