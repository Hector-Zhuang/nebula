import { useVideoPlayer, type VideoContentFit } from 'expo-video';
import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';
import {
  Image,
  type ImageStyle,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { type VideoProps } from './PropsType';
import { formatTime } from './utils';

export const Video = (props: VideoProps): JSX.Element => {
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

  // Initialize player
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
    return;
    if (!player) return;

    const subs = [
      player.addListener('playingChange', ({ isPlaying: playing }) => {
        setIsPlaying(playing);
        if (playing) {
          setIsFirst(false);
          onPlay?.({});
        } else if (!isFirst) {
          onPause?.({});
        }
      }),
      player.addListener('playToEnd', () => {
        onEnded?.({});
      }),
      player.addListener('statusChange', event => {
        if (event.error?.message) {
          onError?.({ errMsg: event.error.message });
        }
      }),
      player.addListener('sourceLoad', event => {
        const loadedDurationMs = (event.duration || 0) * 1000;
        setDurationMs(loadedDurationMs);
        onLoad?.();

        const firstTrack = event.availableVideoTracks?.[0];
        onLoadedMetaData?.({
          width: firstTrack?.size?.width ?? 0,
          height: firstTrack?.size?.height ?? 0,
          duration: loadedDurationMs,
          durationMillis: loadedDurationMs,
        });
      }),
      player.addListener('timeUpdate', ({ currentTime }) => {
        onTimeUpdate?.({
          currentTime: currentTime * 1000,
          duration: durationMs ?? player.duration * 1000,
        });
      }),
    ];

    return () => {
      subs.forEach(s => s.remove());
    };
  }, [
    // player,
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

  const onVideoPlay = useCallback(() => {
    // player.play();
  }, []);

  const onVideoEnterFullscreen = useCallback(() => {
    setIsFullScreen(true);
    onFullscreenChange?.({ fullScreen: true, direction: 'vertical' });
  }, [onFullscreenChange]);

  const onVideoExitFullscreen = useCallback(() => {
    setIsFullScreen(false);
    onFullscreenChange?.({ fullScreen: false, direction: 'vertical' });
  }, [onFullscreenChange]);

  const contentFit = useMemo((): VideoContentFit => {
    const map: Record<string, VideoContentFit> = {
      contain: 'contain',
      cover: 'cover',
      fill: 'fill',
    };
    return (map[objectFit] || 'contain') as VideoContentFit;
  }, [objectFit]);

  const computedDuration = formatTime(durationProp || durationMs || 0);
  const showPlayBtn = (isFirst || showCenterPlayBtn) && !isPlaying;

  return (
    <View style={[styles.video, style]}>
      <View
        style={[styles.videoContainer, isFullScreen && styles.videoFullscreen]}
      >
        {/* Guard: Only render VideoView if player is initialized */}
        {/* {player && (
          <VideoView
            player={player}
            style={styles.fullSize}
            nativeControls={controls}
            contentFit={contentFit}
            allowsPictureInPicture
            onFullscreenEnter={onVideoEnterFullscreen}
            onFullscreenExit={onVideoExitFullscreen}
          />
        )} */}

        {showPlayBtn && (
          <View style={styles.videoCover}>
            {poster && isFirst && (
              <Image
                source={{ uri: poster }}
                style={styles.absoluteFull}
                resizeMode="cover"
              />
            )}
            <Pressable onPress={onVideoPlay}>
              <Image
                source={require('../../assets/video/play.png')}
                style={styles.videoCoverPlayButton as ImageStyle}
              />
            </Pressable>
            {computedDuration && (
              <Text style={styles.videoCoverDuration}>{computedDuration}</Text>
            )}
          </View>
        )}
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullSize: {
    flex: 1,
  },
  absoluteFull: {
    ...StyleSheet.absoluteFillObject,
  },
  video: {
    width: '100%',
    height: 225,
    overflow: 'hidden',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoFullscreen: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  videoCover: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  videoCoverPlayButton: {
    width: 40,
    height: 40,
  },
  videoCoverDuration: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
  },
});
