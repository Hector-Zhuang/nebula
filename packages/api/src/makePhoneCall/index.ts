import { invokeHostApi } from '../runtime/host';

export async function makePhoneCall(phoneNumber: string) {
  return invokeHostApi<boolean>('makePhoneCall', { phoneNumber });
}
