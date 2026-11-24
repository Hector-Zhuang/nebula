import { useState, FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export interface RadioChangeEvent {
  value: boolean;
}

export interface RadioProps {
  /** Checked state for controlled usage. */
  checked?: boolean;
  /** Initial checked state for uncontrolled usage. */
  defaultChecked?: boolean;
  disabled?: boolean;
  /** Accent color of the radio when checked. */
  color?: string;
  onChange?: (event: RadioChangeEvent) => void;
}

export const Radio: FC<RadioProps> = props => {
  const {
    checked,
    defaultChecked = false,
    disabled,
    color = '#09BB07',
    onChange,
  } = props;

  const isControlled = checked !== undefined;
  const [internalValue, setInternalValue] = useState(defaultChecked);

  const value = isControlled ? checked : internalValue;

  const handlePress = () => {
    if (value) return;
    if (!isControlled) {
      setInternalValue(true);
    }
    if (onChange) {
      onChange({ value: true });
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={!!disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: value, disabled: !!disabled }}
      style={styles.wrapper}
    >
      <View style={[styles.circle, value ? { borderColor: color } : undefined]}>
        {value && <View style={[styles.dot, { backgroundColor: color }]} />}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'flex-start',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#b2b2b2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
