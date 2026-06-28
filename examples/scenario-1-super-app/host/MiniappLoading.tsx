import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ViewStyle,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { NebulaAPI, type MiniappLoadingResolveContext } from '@nebula-rn/sdk';

interface ExtendedMiniappLoadingProps extends MiniappLoadingResolveContext {
  style?: ViewStyle;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RADIUS = 50;
const STROKE_WIDTH = 1;
const CONTAINER_SIZE = (RADIUS + STROKE_WIDTH) * 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function MiniappLoadingScreen({
  appId,
  status,
  title,
  iconUrl,
  errorMessage,
  style,
}: ExtendedMiniappLoadingProps) {
  const { height: screenHeight } = useWindowDimensions();

  const progress = useSharedValue(0);
  const screenEntryProgress = useSharedValue(0);
  const [isTimeout, setIsTimeout] = useState(false);

  const currentProgressTarget = useRef(0);

  useEffect(() => {
    screenEntryProgress.value = withTiming(1, {
      duration: 550,
      easing: Easing.bezier(0.25, 1, 0.5, 1),
    });
  }, []);

  useEffect(() => {
    let timeoutTimer: NodeJS.Timeout;
    let intervalTimer: NodeJS.Timeout;

    if (status === 'installing' || status === 'loading') {
      setIsTimeout(false);

      timeoutTimer = setTimeout(() => {
        setIsTimeout(true);
      }, 10000);

      if (status === 'installing') {
        progress.value = withTiming(0.2, {
          duration: 1200,
          easing: Easing.linear,
        });
      } else if (status === 'loading') {
        cancelAnimation(progress);

        currentProgressTarget.current =
          progress.value >= 1 ? 0 : progress.value;

        intervalTimer = setInterval(() => {
          if (currentProgressTarget.current < 0.8) {
            const increment = 0.05 + Math.random() * 0.08;
            currentProgressTarget.current = Math.min(
              0.8,
              currentProgressTarget.current + increment,
            );

            progress.value = withTiming(currentProgressTarget.current, {
              duration: 600,
              easing: Easing.out(Easing.quad),
            });
          } else {
            clearInterval(intervalTimer);
          }
        }, 1000);
      }
    } else if (status === 'ready') {
      if (intervalTimer) clearInterval(intervalTimer);
      cancelAnimation(progress);
      progress.value = withTiming(1, { duration: 300 });
    } else if (status === 'error') {
      if (intervalTimer) clearInterval(intervalTimer);
      cancelAnimation(progress);
      progress.value = withTiming(0, { duration: 300 });
    }

    return () => {
      if (timeoutTimer) clearTimeout(timeoutTimer);
      if (intervalTimer) clearInterval(intervalTimer);
    };
  }, [status]);

  const onSelectClose = () => {
    NebulaAPI.closeMiniApp(appId);
  };

  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
    };
  });

  const animatedDotStyle = useAnimatedStyle(() => {
    const angle = progress.value * 2 * Math.PI - Math.PI / 2;
    const x = RADIUS * Math.cos(angle);
    const y = RADIUS * Math.sin(angle);

    return {
      opacity: status === 'error' ? withTiming(0) : withTiming(1),
      transform: [{ translateX: x }, { translateY: y }],
    };
  });

  const animatedScreenStyle = useAnimatedStyle(() => {
    const translateY = (1 - screenEntryProgress.value) * screenHeight;
    return {
      opacity: screenEntryProgress.value,
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedScreenStyle, style]}>
      <View style={styles.logoContainer}>
        <Svg width={CONTAINER_SIZE} height={CONTAINER_SIZE} style={styles.svg}>
          <Circle
            cx={CONTAINER_SIZE / 2}
            cy={CONTAINER_SIZE / 2}
            r={RADIUS}
            stroke="#f5f5f5"
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
          />
          {status !== 'error' && (
            <AnimatedCircle
              cx={CONTAINER_SIZE / 2}
              cy={CONTAINER_SIZE / 2}
              r={RADIUS}
              stroke="#07c160"
              strokeWidth={STROKE_WIDTH}
              fill="transparent"
              strokeDasharray={CIRCUMFERENCE}
              animatedProps={animatedCircleProps}
              strokeLinecap="round"
              rotation="-90"
              origin={`${CONTAINER_SIZE / 2}, ${CONTAINER_SIZE / 2}`}
            />
          )}
        </Svg>

        <View style={[styles.logoBg, status === 'error' && styles.errorLogoBg]}>
          {iconUrl ? (
            <Image source={{ uri: iconUrl }} style={styles.logoImage} />
          ) : (
            <Text style={styles.logoText}>
              {status === 'error' ? '!' : 'V'}
            </Text>
          )}
        </View>

        <Animated.View style={[styles.dot, animatedDotStyle]} />
      </View>

      <Text style={styles.title}>
        {status === 'error' ? 'Loading Failed' : title}
      </Text>

      {status === 'error' && errorMessage && (
        <Text style={styles.errorSubText}>{errorMessage}</Text>
      )}

      {isTimeout && (status === 'installing' || status === 'loading') && (
        <View style={styles.timeoutContainer}>
          <Text style={styles.timeoutText}>
            Taking too long to load, close it?
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onSelectClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeButtonText}>Close Mini Program</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    zIndex: 999,
  },
  logoContainer: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  logoBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorLogoBg: {
    backgroundColor: '#e53935',
  },
  logoText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  logoImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#07c160',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  title: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: '600',
    color: '#323233',
    textAlign: 'center',
  },
  errorSubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#969799',
    textAlign: 'center',
  },
  timeoutContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  timeoutText: {
    fontSize: 14,
    color: '#969799',
    marginBottom: 12,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  closeButtonText: {
    color: '#dc3545',
    fontSize: 14,
    fontWeight: '500',
  },
});
