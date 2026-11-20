import { act, type ReactElement } from 'react';
import { Text } from 'react-native';
import TestRenderer, { type ReactTestRenderer } from 'react-test-renderer';
import { Checkbox } from '../src/Checkbox';

// React 19 schedules the initial render asynchronously, so every
// TestRenderer.create call must be wrapped in act() to flush it.
const create = (element: ReactElement): ReactTestRenderer => {
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = TestRenderer.create(element);
  });
  return renderer;
};

// Pressable is wrapped in React.memo, so its rendered node type does not match
// the imported reference; find it by its accessibility role instead.
const getPressableProps = (renderer: ReactTestRenderer) =>
  renderer.root.findByProps({ accessibilityRole: 'checkbox' }).props;

const getBoxElement = (renderer: ReactTestRenderer): ReactElement =>
  getPressableProps(renderer).children;

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    const renderer = create(<Checkbox />);
    expect(getPressableProps(renderer).accessibilityState).toEqual({
      checked: false,
      disabled: false,
    });
    expect(renderer.root.findAllByType(Text)).toHaveLength(0);
  });

  it('uses defaultChecked for uncontrolled initial state', () => {
    const renderer = create(<Checkbox defaultChecked />);
    expect(getPressableProps(renderer).accessibilityState.checked).toBe(true);
  });

  it('reflects the checked prop in controlled mode', () => {
    const renderer = create(<Checkbox checked />);
    expect(getPressableProps(renderer).accessibilityState.checked).toBe(true);
  });

  it('applies color as the checked box background and border', () => {
    const renderer = create(<Checkbox checked color="#ff0000" />);
    const style = getBoxElement(renderer).props.style;
    expect(style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: '#ff0000',
          borderColor: '#ff0000',
        }),
      ]),
    );
  });

  it('updates uncontrolled value and reports changes on toggle', () => {
    const onChange = jest.fn();
    const renderer = create(<Checkbox onChange={onChange} />);

    act(() => {
      getPressableProps(renderer).onPress();
    });

    expect(onChange).toHaveBeenCalledWith({ value: true });
    expect(getPressableProps(renderer).accessibilityState.checked).toBe(true);
  });

  it('reports changes without flipping state in controlled mode', () => {
    const onChange = jest.fn();
    const renderer = create(<Checkbox checked={false} onChange={onChange} />);

    act(() => {
      getPressableProps(renderer).onPress();
    });

    expect(onChange).toHaveBeenCalledWith({ value: true });
    expect(getPressableProps(renderer).accessibilityState.checked).toBe(false);
  });

  it('disables interaction when disabled', () => {
    const renderer = create(<Checkbox disabled />);
    expect(getPressableProps(renderer).disabled).toBe(true);
    expect(getPressableProps(renderer).accessibilityState).toEqual({
      checked: false,
      disabled: true,
    });
  });
});
