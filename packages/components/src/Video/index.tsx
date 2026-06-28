import { useCallback, useMemo, useRef, useState, FC, ReactNode } from 'react';
import {
  Image,
  ImageStyle,
  Pressable,
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import RNCamera, {
  OnLoadData,
  OnProgressData,
  ResizeMode,
  VideoRef,
} from 'react-native-video';
import { formatTime } from './utils';

export interface VideoTimeUpdateEvent {
  currentTime: number;
  duration: number;
}

export interface VideoFullscreenChangeEvent {
  direction: 'vertical' | 'horizontal';
  fullScreen: boolean;
}

export interface VideoMetaDataEvent {
  width: number;
  height: number;
  duration: number;
  durationMillis?: number;
}

export interface VideoErrorEvent {
  errMsg: string;
}

export interface VideoProps {
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
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  onLoad?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (event: VideoErrorEvent) => void;
  onTimeUpdate?: (event: VideoTimeUpdateEvent) => void;
  onFullscreenChange?: (event: VideoFullscreenChangeEvent) => void;
  onLoadedMetaData?: (event: VideoMetaDataEvent) => void;
}

export const Video: FC<VideoProps> = props => {
  const {
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

  const videoRef = useRef<VideoRef>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isFirst, setIsFirst] = useState(true);
  const [durationMs, setDurationMs] = useState<number | null>(null);

  const onLoadHandler = useCallback(
    (data: OnLoadData) => {
      const loadedDurationMs = data.duration * 1000;
      setDurationMs(loadedDurationMs);

      if (initialTime > 0) {
        videoRef.current?.seek(initialTime / 1000);
      }

      if (onLoad) {
        onLoad();
      }

      if (onLoadedMetaData) {
        onLoadedMetaData({
          width: data.naturalSize.width,
          height: data.naturalSize.height,
          duration: loadedDurationMs,
          durationMillis: loadedDurationMs,
        });
      }
    },
    [initialTime, onLoad, onLoadedMetaData],
  );

  const onProgressHandler = useCallback(
    (data: OnProgressData) => {
      if (onTimeUpdate) {
        onTimeUpdate({
          currentTime: data.currentTime * 1000,
          duration: durationMs || data.seekableDuration * 1000,
        });
      }
    },
    [durationMs, onTimeUpdate],
  );

  const onErrorHandler = useCallback(
    (error: any) => {
      if (onError) {
        onError({
          errMsg: error.error?.localizedDescription || 'Video Error',
        });
      }
    },
    [onError],
  );

  const onEndedHandler = useCallback(() => {
    if (onEnded) {
      onEnded();
    }
  }, [onEnded]);

  const onPlaybackStateHandler = useCallback(
    ({ isPlaying: playing }: { isPlaying: boolean }) => {
      setIsPlaying(playing);
      if (playing) {
        setIsFirst(false);
        if (onPlay) onPlay();
      } else if (!isFirst) {
        if (onPause) onPause();
      }
    },
    [isFirst, onPlay, onPause],
  );

  const onFullscreenWillPresentHandler = useCallback(() => {
    setIsFullScreen(true);
    if (onFullscreenChange) {
      onFullscreenChange({
        fullScreen: true,
        direction: 'vertical',
      });
    }
  }, [onFullscreenChange]);

  const onFullscreenWillDismissHandler = useCallback(() => {
    setIsFullScreen(false);
    if (onFullscreenChange) {
      onFullscreenChange({
        fullScreen: false,
        direction: 'vertical',
      });
    }
  }, [onFullscreenChange]);

  const onPlayVideoHandler = useCallback(() => {
    setIsPlaying(true);
    setIsFirst(false);
  }, []);

  const resizeMode = useMemo(() => {
    const map: Record<string, ResizeMode> = {
      contain: ResizeMode.CONTAIN,
      cover: ResizeMode.COVER,
      fill: ResizeMode.STRETCH,
    };
    return map[objectFit] || ResizeMode.CONTAIN;
  }, [objectFit]);

  const computedDuration = formatTime(durationProp || durationMs || 0);
  const showPlayBtn = (isFirst || showCenterPlayBtn) && !isPlaying;

  return (
    <View style={[styles.video, style]}>
      <View
        style={[
          styles.videoContainer,
          isFullScreen && styles.videoTypeFullscreen,
        ]}
      >
        <RNCamera
          ref={videoRef}
          source={{ uri: src }}
          style={styles.fullSize}
          paused={!isPlaying}
          repeat={loop}
          muted={muted}
          controls={controls}
          resizeMode={resizeMode}
          onLoad={onLoadHandler}
          onProgress={onProgressHandler}
          onEnd={onEndedHandler}
          onError={onErrorHandler}
          onPlaybackStateChanged={onPlaybackStateHandler}
          onFullscreenPlayerWillPresent={onFullscreenWillPresentHandler}
          onFullscreenPlayerWillDismiss={onFullscreenWillDismissHandler}
          progressUpdateInterval={250}
        />

        {showPlayBtn && (
          <View style={styles.videoCover}>
            {poster && isFirst && (
              <Image source={{ uri: poster }} style={styles.videoPoster} />
            )}
            <Pressable onPress={onPlayVideoHandler}>
              <Image
                source={require('../assets/video/play.png')}
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
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: 225,
    overflow: 'hidden',
    position: 'relative',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  videoTypeFullscreen: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 999,
  },
  videoCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(1, 1, 1, 0.5)',
    zIndex: 1,
  },
  videoPoster: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  videoCoverPlayButton: {
    width: 30,
    height: 30,
  },
  videoCoverDuration: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
});
