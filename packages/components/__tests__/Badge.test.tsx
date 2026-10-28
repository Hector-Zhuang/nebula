import { act, type ReactElement } from 'react';
import { Text, View } from 'react-native';
import TestRenderer, { type ReactTestRenderer } from 'react-test-renderer';
import { Badge } from '../src/Badge';

// React 19 schedules the initial render asynchronously, so every
// TestRenderer.create call must be wrapped in act() to flush it.
const create = (element: ReactElement): ReactTestRenderer => {
  let renderer!: ReactTestRenderer;
  act(() => {
    renderer = TestRenderer.create(element);
  });
  return renderer;
};

describe('Badge', () => {
  it('renders string content', () => {
    const renderer = create(<Badge text="new" />);
    expect(renderer.root.findByType(Text).props.children).toBe('new');
  });

  it('renders numeric content', () => {
    const renderer = create(<Badge text={5} />);
    expect(renderer.root.findByType(Text).props.children).toBe(5);
  });

  it('collapses numeric content above maxCount into `${maxCount}+`', () => {
    const renderer = create(<Badge text={100} maxCount={99} />);
    expect(renderer.root.findByType(Text).props.children).toBe('99+');
  });

  it('keeps numeric content equal to maxCount as is', () => {
    const renderer = create(<Badge text={99} maxCount={99} />);
    expect(renderer.root.findByType(Text).props.children).toBe(99);
  });

  it('renders a dot without text in dot mode', () => {
    const renderer = create(<Badge dot />);
    expect(renderer.root.findAllByType(View).length).toBeGreaterThan(0);
    expect(renderer.root.findAllByType(Text)).toHaveLength(0);
  });

  it('renders nothing when there is no content', () => {
    const renderer = create(<Badge />);
    expect(renderer.toJSON()).toBeNull();
  });

  it('renders nothing for empty string content', () => {
    const renderer = create(<Badge text="" />);
    expect(renderer.toJSON()).toBeNull();
  });
});
