import { useState, useEffect, useRef, FC } from 'react';
import { Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import RNSlider from '@react-native-community/slider';

export interface SliderChangeEvent {
  value: number;
}

export interface SliderProps {
  name?: string;
  style?: StyleProp<ViewStyle>;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  value?: number;
  defaultValue?: number;
  activeColor?: string;
  backgroundColor?: string;
  blockColor?: string;
  showValue?: boolean;
  onChange?: (event: SliderChangeEvent) => void;
  onChanging?: (event: SliderChangeEvent) => void;
}

export const Slider: FC<SliderProps> = props => {
  const {
    style,
    min = 0,
    max = 100,
    step = 1,
    disabled,
    activeColor = '#1aad19',
    backgroundColor = '#e9e9e9',
    blockColor = '#fff',
    showValue,
    onChange,
    onChanging,
    value,
    defaultValue,
  } = props;

  const isControlled = value !== undefined;
  const [currentValue, setCurrentValue] = useState<number>(
    defaultValue ?? (value || 0),
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value || 0);
    }
  }, [value]);

  useEffect(() => {
    if (!isControlled) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      if (value !== currentValue) {
        setCurrentValue(value || 0);
      }
    }, 50);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentValue, isControlled, value]);

  const onSlidingCompleteHandler = (nextValue: number) => {
    if (onChange) {
      onChange({ value: nextValue });
    }
  };

  const onValueChangeHandler = (nextValue: number) => {
    setCurrentValue(nextValue);
    if (onChanging) {
      onChanging({ value: nextValue });
    }
  };

  return (
    <View style={styles.wrapper}>
      <RNSlider
        minimumValue={min}
        maximumValue={max}
        step={step}
        disabled={!!disabled}
        value={currentValue}
        minimumTrackTintColor={activeColor}
        maximumTrackTintColor={backgroundColor}
        thumbTintColor={blockColor}
        onSlidingComplete={onSlidingCompleteHandler}
        onValueChange={onValueChangeHandler}
        style={[styles.bar, style as any]}
      />
      {showValue && <Text style={styles.info}>{currentValue}</Text>}
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
  info: {
    marginLeft: 15,
  },
});
