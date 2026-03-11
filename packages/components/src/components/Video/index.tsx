import { VideoProps } from '@tarojs/components/types/Video';
import {
  useVideoPlayer,
  VideoView,
  VideoContentFit,
  SourceLoadEventPayload,
  StatusChangeEventPayload,
} from 'expo-video';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image as RNImage,
  ImageStyle,
  Pressable,
  StyleSheet,
  Text as RNText,
  View as RNView,
} from 'react-native';

import Styles from './style';
import { formatTime } from './utils';

declare const global: any;
global._taroVideoMap = global._taroVideoMap || {};

interface Props extends VideoProps {
  onLoad?: () => void;
  style?: any;
}

const LocalStyles = StyleSheet.create({
  fullSize: { width: '100%', height: '100%' },
  absoluteFull: { position: 'absolute', width: '100%', height: '100%' },
});

const VideoComp = (props: Props): JSX.Element => {
  const {
    id = '',
    src = '',
    autoplay = false,
    style,
    initialTime = 0,
    loop = false,
    muted = false,
    objectFit = 'contain',
    poster,
    controls = true,
    showCenterPlayBtn = true,
    duration: durationProp,
    onLoad,
    onPlay,
    onPause,
    onEnded,
    onError,
    onLoadedMetaData,
    onFullscreenChange,
    onTimeUpdate,
    children,
  } = props;

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const [durationMs, setDurationMs] = useState<number | null>(null);

  const player = useVideoPlayer(src, instance => {
    instance.loop = loop;
    instance.muted = muted;
    instance.currentTime = initialTime / 1000;
    instance.timeUpdateEventInterval = 0.25;
    if (autoplay) {
      instance.play();
    }
  });

  useEffect(() => {
    if (id) {
      global._taroVideoMap[id] = player;
    }
  }, [id, player]);

  useEffect(() => {
    const subscriptions = [
      player.addListener('playingChange', ({ isPlaying: playing }) => {
        setIsPlaying(playing);
        if (playing) {
          setIsFirst(false);
          onPlay?.({ detail: {} } as any);
        } else if (!isFirst) {
          onPause?.({ detail: {} } as any);
        }
      }),
      player.addListener('playToEnd', () => {
        onEnded?.({ detail: {} } as any);
      }),
      player.addListener('statusChange', (event: StatusChangeEventPayload) => {
        if (event.error?.message) {
          onError?.({
            detail: { errMsg: event.error.message },
          } as any);
        }
      }),
      player.addListener('sourceLoad', (event: SourceLoadEventPayload) => {
        const loadedDurationMs = (event.duration || 0) * 1000;
        setDurationMs(loadedDurationMs);
        onLoad?.();

        const firstTrack = event.availableVideoTracks?.[0];
        onLoadedMetaData?.({
          detail: {
            width: firstTrack?.size?.width,
            height: firstTrack?.size?.height,
            duration: loadedDurationMs,
            durationMillis: loadedDurationMs,
          },
        } as any);
      }),
      player.addListener('playingChange', ({ isPlaying: playing }) => {
        setIsPlaying(playing);
        if (playing) {
          setIsFirst(false);
          onPlay?.({ detail: {} } as any);
        } else if (!isFirst) {
          onPause?.({ detail: {} } as any);
        }
      }),
      player.addListener('timeUpdate', ({ currentTime }) => {
        onTimeUpdate?.({
          detail: {
            currentTime: currentTime * 1000,
            duration: durationMs ?? player.duration * 1000,
          },
        } as any);
      }),
    ];

    return () => {
      subscriptions.forEach(sub => sub.remove());
    };
  }, [
    player,
    onEnded,
    onError,
    onLoad,
    onLoadedMetaData,
    onTimeUpdate,
    isFirst,
    durationMs,
    onPlay,
    onPause,
  ]);

  const onPlayVideo = useCallback(() => {
    player.play();
    setIsFirst(false);
  }, [player]);

  const onEnterFullscreen = useCallback(() => {
    setIsFullScreen(true);
    onFullscreenChange?.({
      detail: { fullScreen: true, direction: 'vertical' },
    } as any);
  }, [onFullscreenChange]);

  const onExitFullscreen = useCallback(() => {
    setIsFullScreen(false);
    onFullscreenChange?.({
      detail: { fullScreen: false, direction: 'vertical' },
    } as any);
  }, [onFullscreenChange]);

  const contentFit = useMemo(() => {
    const map: Record<string, VideoContentFit> = {
      contain: 'contain',
      cover: 'cover',
      fill: 'fill',
    };
    return map[objectFit] || 'contain';
  }, [objectFit]);

  const computedDuration = formatTime(durationProp || durationMs || null);
  const showPlayBtn = (isFirst || showCenterPlayBtn) && !isPlaying;

  return (
    <RNView style={[Styles['taro-video'], style as Record<string, unknown>]}>
      <RNView
        style={[
          Styles['taro-video-container'],
          isFullScreen && Styles['taro-video-type-fullscreen'],
        ]}
      >
        <VideoView
          player={player}
          style={LocalStyles.fullSize}
          fullscreenOptions={{ enable: controls }}
          allowsPictureInPicture
          nativeControls={controls}
          contentFit={contentFit}
          onFullscreenEnter={onEnterFullscreen}
          onFullscreenExit={onExitFullscreen}
        />

        {showPlayBtn && (
          <RNView style={Styles['taro-video-cover']}>
            {poster && isFirst && (
              <RNImage
                source={{ uri: poster }}
                style={[
                  Styles['taro-video-poster'],
                  LocalStyles.absoluteFull,
                ]}
              />
            )}
            <Pressable onPress={onPlayVideo}>
              <RNImage
                source={require('../../assets/video/play.png')}
                style={Styles['taro-video-cover-play-button'] as ImageStyle}
              />
            </Pressable>
            {computedDuration && (
              <RNText style={Styles['taro-video-cover-duration']}>
                {computedDuration}
              </RNText>
            )}
          </RNView>
        )}
        {children}
      </RNView>
    </RNView>
  );
};

export default VideoComp;
