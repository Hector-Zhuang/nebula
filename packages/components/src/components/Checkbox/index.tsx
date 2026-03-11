/**
 * Semi-controlled component.
 *
 * ✔ value
 * ✔ disabled
 * ✔ checked
 * ✔ color
 * ✔ onChange
 *
 * @see https://wechat.design/brand/color
 */

import * as React from 'react';

import { noop } from '../../utils';
import Icon from '../Icon';
import { CheckboxProps } from './PropsType';
import styles from './styles';
import { Pressable, View } from 'react-native';

export interface CheckboxHandle {
  _simulateNativePress: () => void;
}

const Checkbox = React.forwardRef<CheckboxHandle, CheckboxProps>(
  (props, ref): JSX.Element => {
    const {
      disabled,
      onChange = noop,
      value,
      style,
      color = '#09BB07',
      children,
      checked: checkedProp,
    } = props;
    const [checked, setChecked] = React.useState<boolean>(!!checkedProp);

    React.useEffect(() => {
      if (checkedProp !== undefined && checkedProp !== checked) {
        setChecked(!!checkedProp);
      }
    }, [checkedProp, checked]);

    const onPress = React.useCallback((): void => {
      if (disabled) return;
      const nextChecked = !checked;
      onChange({ value, checked: nextChecked });
      setChecked(nextChecked);
    }, [checked, disabled, onChange, value]);

    React.useImperativeHandle(
      ref,
      () => ({
        _simulateNativePress: onPress,
      }),
      [onPress],
    );

    return (
      <Pressable style={styles.container} onPress={onPress}>
        <View style={[styles.wrapper, style, checked && styles.wrapperChecked]}>
          <Icon
            type="success_no_circle"
            size={18}
            color={color}
            style={[styles.wrapperIcon, checked && styles.wrapperCheckedIcon]}
          />
        </View>
        <View style={{ flexGrow: 0 }}>{children}</View>
      </Pressable>
    );
  },
);

Checkbox.displayName = '_Checkbox';

export default Checkbox;
