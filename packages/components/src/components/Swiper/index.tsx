/**
 * Notes:
 *   Do not add `flex: 1` to Swiper.
 *
 * ✔ indicatorDots(indicator-dots)
 * ✔ indicatorColor(indicator-color)
 * ✔ indicatorActiveColor(indicator-active-color)
 * ✔ autoplay
 * ✔ current
 * ✘ currentItemId(current-item-id)
 * ✔ interval
 * ✘ duration
 * ✔ circular
 * ✔ vertical
 * ✘ previousMargin(previous-margin)
 * ✘ nextMargin(next-margin)
 * ✘ displayMultipleItems(display-multiple-items)
 * ✘ skipHiddenItem-layout(skip-hidden-item-layout)
 * ✔ onChange(bindchange): No support for detail.source
 * ✔ onAnimationFinish(bindanimationfinish): No support for detail.source
 *
 * @warn vertical swiper nested in scrollview on android would not work.
 *
 * @example
 * <Swiper
 *   indicatorDots={true}
 *   indicatorColor="white"
 *   indicatorActiveColor="purple"
 *   autoplay={false}
 *   current={1}
 *   interval={6000}
 *   circular={false}
 *   vertical={true}
 *   onChange={() => null}
 *   onAnimationFinish={() => null}
 *   style={{ backgroundColor: 'black' }}
 * >
 *   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'red' }}>
 *     <Text style={styles.text}>Hello Swiper</Text>
 *   </View>
 *   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green' }}>
 *     <Text style={styles.text}>Beautiful</Text>
 *   </View>
 *   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'blue' }}>
 *     <Text style={styles.text}>And simple</Text>
 *   </View>
 * </Swiper>
 */

import * as React from 'react'
import {
  StyleSheet,
} from 'react-native'

import { noop } from '../../utils'
import Carousel from './carousel'
import { SwiperProps } from './PropsType'

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
    onChange = noop,
    onAnimationFinish = noop,
  } = props

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
        onChange({ detail: { current: index } })
        onAnimationFinish({ detail: { current: index } })
      }}
    >
      {children}
    </Carousel>
  )
}

export default Swiper
