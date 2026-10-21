import { useEffect, useRef, FC } from 'react';
import {
  Animated,
  DimensionValue,
  Easing,
  Text,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

export interface ProgressActiveEvent {
  percent: number;
}

export interface ProgressProps {
  style?: StyleProp<ViewStyle>;
  percent: number;
  showInfo?: boolean;
  borderRadius?: number | string;
  fontSize?: number | string;
  strokeWidth?: number | string;
  activeColor?: string;
  backgroundColor?: string;
  active?: boolean;
  activeMode?: 'backwards' | 'forwards';
  /** Loop a sweep animation for unknown progress. Overrides percent-driven animation. */
  indeterminate?: boolean;
  onActiveEnd?: (event: ProgressActiveEvent) => void;
}

export const Progress: FC<ProgressProps> = ({
  style,
  percent = 0,
  showInfo,
  borderRadius = 0,
  strokeWidth = 6,
  activeColor = '#09BB07',
  backgroundColor = '#EBEBEB',
  active,
  activeMode = 'backwards',
  indeterminate,
  onActiveEnd,
}) => {
  const valve = useRef(new Animated.Value(0)).current;
  const prevPercentRef = useRef(0);

  useEffect(() => {
    if (indeterminate) {
      valve.setValue(0);
      const loop = Animated.loop(
        Animated.timing(valve, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      );
      loop.start();
      return () => loop.stop();
    }

    const toValue = percent / 100;

    if (!active || (activeMode !== 'backwards' && activeMode !== 'forwards')) {
      Animated.timing(valve, {
        toValue,
        duration: 0,
        useNativeDriver: false,
      }).start();
      prevPercentRef.current = percent;
      return;
    }

    const sequence: Animated.CompositeAnimation[] = [];
    const duration =
      ((activeMode === 'forwards'
        ? Math.abs(percent - prevPercentRef.current)
        : percent) /
        100) *
      1000;

    if (activeMode === 'backwards') {
      sequence.push(
        Animated.timing(valve, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      );
    }

    sequence.push(
      Animated.timing(valve, {
        toValue,
        easing: Easing.linear,
        duration,
        useNativeDriver: false,
      }),
    );

    const onCompleteAnimation = () => {
      if (onActiveEnd) {
        onActiveEnd({ percent });
      }
    };

    Animated.sequence(sequence).start(onCompleteAnimation);
    prevPercentRef.current = percent;
  }, [active, activeMode, indeterminate, percent, valve, onActiveEnd]);

  const width = valve.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.wrapper, style]}>
      <View
        style={[
          styles.bar,
          {
            height: strokeWidth as DimensionValue,
            backgroundColor,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.barThumb,
            {
              width,
              height: '100%',
              backgroundColor: activeColor,
              borderBottomRightRadius: Number(borderRadius),
              borderTopRightRadius: Number(borderRadius),
            },
          ]}
        />
      </View>
      {showInfo && <Text style={styles.info}>{percent}%</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    flexGrow: 1,
  },
  barThumb: {},
  info: {
    marginLeft: 15,
  },
});
