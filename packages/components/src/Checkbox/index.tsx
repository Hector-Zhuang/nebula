import { useState, FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface CheckboxChangeEvent {
  value: boolean;
}

export interface CheckboxProps {
  /** Checked state for controlled usage. */
  checked?: boolean;
  /** Initial checked state for uncontrolled usage. */
  defaultChecked?: boolean;
  disabled?: boolean;
  /** Accent color of the checkbox when checked. */
  color?: string;
  onChange?: (event: CheckboxChangeEvent) => void;
}

export const Checkbox: FC<CheckboxProps> = props => {
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
    const nextValue = !value;
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    if (onChange) {
      onChange({ value: nextValue });
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={!!disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value, disabled: !!disabled }}
      style={styles.wrapper}
    >
      <View
        style={[
          styles.box,
          value ? { backgroundColor: color, borderColor: color } : undefined,
        ]}
      >
        {value && <Text style={styles.mark}>✓</Text>}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'flex-start',
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#b2b2b2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    fontSize: 14,
    lineHeight: 16,
    color: '#fff',
  },
});
