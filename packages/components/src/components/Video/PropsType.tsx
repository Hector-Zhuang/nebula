import * as React from 'react';

export interface VideoTimeUpdateEventDetail {
  currentTime: number;
  duration: number;
}

export interface VideoFullscreenChangeEventDetail {
  direction: 'vertical' | 'horizontal';
  fullScreen: number | boolean;
}

export interface VideoLoadedMetaDataEventDetail {
  width: number;
  height: number;
  duration: number;
  durationMillis?: number;
}

export interface VideoProps {
  id?: string;
  src: string;
  duration?: number;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  initialTime?: number;
  objectFit?: 'contain' | 'fill' | 'cover';
  poster?: string;
  showCenterPlayBtn?: boolean;
  style?: any;
  children?: React.ReactNode;
  onLoad?: () => void;
  onPlay?: (event: Record<string, never>) => void;
  onPause?: (event: Record<string, never>) => void;
  onEnded?: (event: Record<string, never>) => void;
  onError?: (event: { errMsg: string }) => void;
  onTimeUpdate?: (event: VideoTimeUpdateEventDetail) => void;
  onFullscreenChange?: (event: VideoFullscreenChangeEventDetail) => void;
  onLoadedMetaData?: (event: VideoLoadedMetaDataEventDetail) => void;
}
