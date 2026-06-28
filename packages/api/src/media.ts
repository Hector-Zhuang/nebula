import { invokeHostApi } from './runtime/host';

export type MediaType = 'photo' | 'video';

export interface SaveMediaOptions {
  album?: string;
}

export const saveMedia = (
  url: string,
  type: MediaType,
  options?: SaveMediaOptions,
) => {
  return invokeHostApi<string>('saveMedia', {
    url,
    type,
    album: options?.album,
  });
};
