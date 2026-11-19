import { act, type ReactElement } from 'react';
import { Switch as RNSwitch } from 'react-native';
import TestRenderer, { type ReactTestRenderer } from 'react-test-renderer';
import { Switch } from '../src/Switch';

// React 19 schedules the initial render asynchronously, so every
// TestRenderer.create call must be wrapped in act() to flush it.
const create = (element: ReactElement): ReactTestRenderer => {
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = TestRenderer.create(element);
  });
  return renderer;
};

const getNativeProps = (renderer: ReactTestRenderer) =>
  renderer.root.findByType(RNSwitch).props;

describe('Switch', () => {
  it('renders unchecked by default', () => {
    const renderer = create(<Switch />);
    expect(getNativeProps(renderer).value).toBe(false);
  });

  it('uses defaultChecked for uncontrolled initial state', () => {
    const renderer = create(<Switch defaultChecked />);
    expect(getNativeProps(renderer).value).toBe(true);
  });

  it('reflects the checked prop in controlled mode', () => {
    const renderer = create(<Switch checked />);
    expect(getNativeProps(renderer).value).toBe(true);
  });

  it('applies color as the checked track color', () => {
    const renderer = create(<Switch color="#ff0000" />);
    expect(getNativeProps(renderer).trackColor).toEqual({
      true: '#ff0000',
      false: undefined,
    });
  });

  it('updates uncontrolled value and reports changes on toggle', () => {
    const onChange = jest.fn();
    const renderer = create(<Switch onChange={onChange} />);

    act(() => {
      getNativeProps(renderer).onValueChange(true);
    });

    expect(onChange).toHaveBeenCalledWith({ value: true });
    expect(getNativeProps(renderer).value).toBe(true);
  });

  it('reports changes without flipping state in controlled mode', () => {
    const onChange = jest.fn();
    const renderer = create(<Switch checked={false} onChange={onChange} />);

    act(() => {
      getNativeProps(renderer).onValueChange(true);
    });

    expect(onChange).toHaveBeenCalledWith({ value: true });
    expect(getNativeProps(renderer).value).toBe(false);
  });

  it('passes disabled to the native switch', () => {
    const renderer = create(<Switch disabled />);
    expect(getNativeProps(renderer).disabled).toBe(true);
  });
});
