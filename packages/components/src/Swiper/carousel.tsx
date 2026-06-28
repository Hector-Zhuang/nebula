import React, {
  Children,
  FC,
  PropsWithChildren,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';
import CarouselView, {
  ICarouselInstance,
} from 'react-native-reanimated-carousel';
import { DefaultPagination, PaginationProps } from './pagination';

export interface CarouselProps {
  infinite?: boolean;
  dots?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
  selectedIndex?: number;
  vertical?: boolean;
  pagination?: (props: PaginationProps) => ReactNode;
  dotStyle?: StyleProp<ViewStyle>;
  dotActiveStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  afterChange?: (index: number) => void;
}

export const Carousel: FC<PropsWithChildren<CarouselProps>> = props => {
  const {
    infinite = false,
    dots = true,
    autoplay = false,
    autoplayInterval = 3000,
    selectedIndex = 0,
    vertical = false,
    pagination: Pagination = DefaultPagination,
    dotStyle = {},
    dotActiveStyle = {},
    children,
    style,
    afterChange,
  } = props;

  const carouselRef = useRef<ICarouselInstance>(null);
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const data = useMemo(() => Children.toArray(children), [children]);
  const count = data.length;

  const onLayout = (event: LayoutChangeEvent) => {
    const { width: w, height: h } = event.nativeEvent.layout;
    if (w > 0 && h > 0) {
      setLayout({ width: w, height: h });
    }
  };

  const onSnapToItem = (index: number) => {
    if (afterChange) {
      afterChange(index);
    }
  };

  const width = layout.width;
  const height = layout.height || 200;

  if (!children || count === 0) {
    return (
      <Text style={{ backgroundColor: 'white' }}>
        You are supposed to add children inside Carousel
      </Text>
    );
  }

  return (
    <View onLayout={onLayout} style={[styles.wrapperStyle, style]}>
      {width && (
        <CarouselView
          ref={carouselRef}
          loop={infinite}
          width={width}
          height={height}
          vertical={vertical}
          autoPlay={autoplay}
          autoPlayInterval={autoplayInterval}
          data={data}
          defaultIndex={selectedIndex}
          onSnapToItem={onSnapToItem}
          renderItem={({ item }) => <View style={{ flex: 1 }}>{item}</View>}
        />
      )}

      {dots && (
        <Pagination
          styles={styles}
          vertical={vertical}
          current={selectedIndex}
          count={count}
          dotStyle={dotStyle}
          dotActiveStyle={dotActiveStyle}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperStyle: {
    overflow: 'hidden',
  },
});
