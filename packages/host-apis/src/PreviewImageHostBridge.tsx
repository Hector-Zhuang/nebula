import { createHostModalApiFeature } from '@nebula-rn/sdk';
import NebulaHostPreviewImageModal from './NebulaHostPreviewImageModal';
import { previewImageChannel } from './previewImageRuntime';

export type PreviewImagePayload = {
  urls: string[];
  current?: string;
  showMenu?: boolean;
  saveMediaText?: string;
  cancelText?: string;
};

export const previewImageHostApi = createHostModalApiFeature<
  PreviewImagePayload,
  PreviewImagePayload
>({
  apiName: 'previewImage',
  description: {
    summary:
      'Open a host-managed fullscreen image preview modal for one or more image URLs.',
    description:
      'Supports selecting the initial image and optionally showing save actions in the preview UI.',
    tags: ['media', 'image', 'modal'],
  },
  component: NebulaHostPreviewImageModal,
  channel: previewImageChannel,
  createRequest: payload => ({
    urls: payload.urls,
    current: payload.current,
    showMenu: payload.showMenu,
    saveMediaText: payload.saveMediaText,
    cancelText: payload.cancelText,
  }),
  onUnmountErrorMessage:
    'previewImage:fail host preview was unmounted before completion',
});
