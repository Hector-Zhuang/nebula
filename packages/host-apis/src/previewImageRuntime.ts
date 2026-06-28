import { createHostModalChannel } from '@nebula-rn/sdk';

export type PreviewImageRequest = {
  urls: string[];
  current?: string;
  showMenu?: boolean;
  saveMediaText?: string;
  cancelText?: string;
};

export const previewImageChannel =
  createHostModalChannel<PreviewImageRequest>();
