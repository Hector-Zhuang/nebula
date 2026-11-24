import { act, type ReactElement } from 'react';
import TestRenderer, { type ReactTestRenderer } from 'react-test-renderer';
import { Radio } from '../src/Radio';

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
  renderer.root.findByProps({ accessibilityRole: 'radio' }).props;

const getCircleElement = (renderer: ReactTestRenderer): ReactElement =>
  getPressableProps(renderer).children;

const getDotElement = (renderer: ReactTestRenderer): ReactElement =>
  getCircleElement(renderer).props.children;

describe('Radio', () => {
  it('renders unchecked by default', () => {
    const renderer = create(<Radio />);
    expect(getPressableProps(renderer).accessibilityState).toEqual({
      checked: false,
      disabled: false,
    });
    expect(getCircleElement(renderer).props.children).toBeFalsy();
  });

  it('uses defaultChecked for uncontrolled initial state', () => {
    const renderer = create(<Radio defaultChecked />);
    expect(getPressableProps(renderer).accessibilityState.checked).toBe(true);
  });

  it('reflects the checked prop in controlled mode', () => {
    const renderer = create(<Radio checked />);
    expect(getPressableProps(renderer).accessibilityState.checked).toBe(true);
  });

  it('applies color as the checked circle border and dot background', () => {
    const renderer = create(<Radio checked color="#ff0000" />);
    expect(getCircleElement(renderer).props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ borderColor: '#ff0000' })]),
    );
    expect(getDotElement(renderer).props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: '#ff0000' })]),
    );
  });

  it('selects an unchecked radio and reports the change', () => {
    const onChange = jest.fn();
    const renderer = create(<Radio onChange={onChange} />);

    act(() => {
      getPressableProps(renderer).onPress();
    });

    expect(onChange).toHaveBeenCalledWith({ value: true });
    expect(getPressableProps(renderer).accessibilityState.checked).toBe(true);
  });

  it('reports changes without flipping state in controlled mode', () => {
    const onChange = jest.fn();
    const renderer = create(<Radio checked={false} onChange={onChange} />);

    act(() => {
      getPressableProps(renderer).onPress();
    });

    expect(onChange).toHaveBeenCalledWith({ value: true });
    expect(getPressableProps(renderer).accessibilityState.checked).toBe(false);
  });

  it('ignores presses when already checked', () => {
    const onChange = jest.fn();
    const renderer = create(<Radio defaultChecked onChange={onChange} />);

    act(() => {
      getPressableProps(renderer).onPress();
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(getPressableProps(renderer).accessibilityState.checked).toBe(true);
  });

  it('disables interaction when disabled', () => {
    const renderer = create(<Radio disabled />);
    expect(getPressableProps(renderer).disabled).toBe(true);
    expect(getPressableProps(renderer).accessibilityState).toEqual({
      checked: false,
      disabled: true,
    });
  });
});
