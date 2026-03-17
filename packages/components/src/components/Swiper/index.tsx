import * as React from 'react';
import { StyleSheet } from 'react-native';

import Carousel from './carousel';
import { SwiperProps } from './PropsType';

const Swiper = (props: SwiperProps): JSX.Element => {
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

  return (
    <Carousel
      style={StyleSheet.flatten(style)}
      dots={Boolean(indicatorDots)}
      dotStyle={{ backgroundColor: indicatorColor }}
      dotActiveStyle={{ backgroundColor: indicatorActiveColor }}
      autoplay={Boolean(autoplay)}
      selectedIndex={current}
      autoplayInterval={interval}
      infinite={Boolean(circular)}
      vertical={Boolean(vertical)}
      afterChange={(index: number) => {
        onChange?.(index);
        onAnimationFinish?.(index);
      }}
    >
      {children}
    </Carousel>
  );
};

export default Swiper;
