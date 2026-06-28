import { FC, PropsWithChildren } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { Carousel } from './carousel';

export interface SwiperEvent {
  current: number;
}

export interface SwiperProps {
  style?: StyleProp<ViewStyle>;
  indicatorDots?: boolean;
  indicatorColor?: string;
  indicatorActiveColor?: string;
  autoplay?: boolean;
  current?: number;
  interval?: number;
  circular?: boolean;
  vertical?: boolean;
  onChange?: (event: SwiperEvent) => void;
  onAnimationFinish?: (event: SwiperEvent) => void;
}

export const Swiper: FC<PropsWithChildren<SwiperProps>> = props => {
  const {
    children,
    style,
    indicatorDots,
    indicatorColor = 'rgba(0,0,0,0.3)',
    indicatorActiveColor = '#000',
    autoplay,
    current = 0,
    interval = 5000,
    circular,
    vertical,
    onChange,
    onAnimationFinish,
  } = props;

  const onAfterChangeHandler = (index: number) => {
    if (onChange) {
      onChange({ current: index });
    }
    if (onAnimationFinish) {
      onAnimationFinish({ current: index });
    }
  };

  return (
    <Carousel
      style={style}
      dots={indicatorDots}
      dotStyle={{ backgroundColor: indicatorColor }}
      dotActiveStyle={{ backgroundColor: indicatorActiveColor }}
      autoplay={autoplay}
      selectedIndex={current}
      autoplayInterval={interval}
      infinite={circular}
      vertical={vertical}
      afterChange={onAfterChangeHandler}
    >
      {children}
    </Carousel>
  );
};
