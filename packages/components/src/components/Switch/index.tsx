import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Switch } from 'react-native';

import { noop } from '../../utils';
import Checkbox, { CheckboxHandle } from '../Checkbox';
import { SwitchProps } from './PropsType';

export interface SwitchHandle {
  _simulateNativePress: () => void;
}

const SwitchComp = forwardRef<SwitchHandle, SwitchProps>(
  (props, ref): JSX.Element => {
    const {
      style,
      type = 'switch',
      color = '#04BE02',
      disabled = false,
      checked: checkedProp,
      defaultChecked,
      onChange = noop,
    } = props;

    const touchableRef = useRef<CheckboxHandle | Switch>(null);
    const [checked, setChecked] = useState<boolean>(!!checkedProp);
    const [pChecked, setPChecked] = useState<boolean | undefined>(false);

    useEffect(() => {
      // eslint-disable-next-line eqeqeq
      const isControlled = checkedProp != undefined;
      if (isControlled) {
        if (checkedProp !== pChecked) {
          setChecked(!!checkedProp);
          setPChecked(checkedProp);
        } else if (checkedProp !== checked) {
          setChecked(!!checkedProp);
        }
      } else if (pChecked !== checkedProp) {
        setPChecked(checkedProp);
        setChecked(defaultChecked ?? false);
      }
    }, [checked, checkedProp, defaultChecked, pChecked]);

    const onCheckedChange = useCallback(
      (isChecked: boolean): void => {
        onChange({ detail: { value: isChecked } });
        setChecked(isChecked);
      },
      [onChange],
    );

    const simulateNativePress = useCallback((): void => {
      if (type === 'checkbox') {
        const node = touchableRef.current as CheckboxHandle;
        node && node._simulateNativePress?.();
      } else {
        setChecked(prev => !prev);
      }
    }, [type]);

    useImperativeHandle(
      ref,
      () => ({
        _simulateNativePress: simulateNativePress,
      }),
      [simulateNativePress],
    );

    if (type === 'checkbox') {
      return (
        <Checkbox
          value={checked}
          onChange={(item: { checked: boolean }) =>
            onCheckedChange(item.checked)
          }
          checked={checked}
          disabled={disabled}
          ref={touchableRef as React.RefObject<CheckboxHandle>}
        />
      );
    }

    return (
      <Switch
        value={checked}
        onValueChange={disabled ? undefined : onCheckedChange}
        trackColor={{ false: '#FFFFFF', true: color }}
        ios_backgroundColor="#FFFFFF"
        style={style}
        disabled={disabled}
        ref={touchableRef as React.RefObject<Switch>}
      />
    );
  },
);

SwitchComp.displayName = '_Switch';

export default SwitchComp;
