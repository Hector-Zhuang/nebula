import { useState, FC } from 'react';
import { Switch as RNSwitch, View, StyleSheet } from 'react-native';

export interface SwitchChangeEvent {
  value: boolean;
}

export interface SwitchProps {
  /** Checked state for controlled usage. */
  checked?: boolean;
  /** Initial checked state for uncontrolled usage. */
  defaultChecked?: boolean;
  disabled?: boolean;
  /** Accent color of the switch when checked. */
  color?: string;
  onChange?: (event: SwitchChangeEvent) => void;
}

export const Switch: FC<SwitchProps> = props => {
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

  const handleChange = (nextValue: boolean) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    if (onChange) {
      onChange({ value: nextValue });
    }
  };

  return (
    <View style={styles.wrapper}>
      <RNSwitch
        value={value}
        disabled={!!disabled}
        trackColor={{ true: color, false: undefined }}
        onValueChange={handleChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'flex-start',
  },
});
