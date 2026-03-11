/**
 * @see https://facebook.github.io/react-native/docs/scrollview.html
 *
 * Notes:
 *   Usually ScrollView should be wrapped by a View with explicit height,
 *   otherwise it may appear full-height and seem not scrollable.
 *   Hack: if scrollTop is set repeatedly after user scroll, state may not change,
 *   so a temporary negative value can force an update.
 *
 * ✔ scrollX(scroll-x): Either-or
 * ✘ scrollY(scroll-y): Either-or
 * ✔ upperThreshold(upper-threshold)
 * ✔ lowerThreshold(lower-threshold)
 * ✔ scrollTop(scroll-top)
 * ✔ scrollLeft(scroll-left)
 * ✘ scroll-into-view
 * ✔ scrollWithAnimation(scroll-with-animation)
 * ✔ enableBackToTop(enable-back-to-top)
 * ✔ onScrollToUpper(bindscrolltoupper)
 * ✔ onScrollToLower(bindscrolltolower)
 * ✔ onScroll(bindscroll)
 */

import * as React from 'react'
import {
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  ViewStyle
} from 'react-native'

import { noop, omit } from '../../utils'
import { ScrollMetrics, ScrollViewProps, ScrollViewState } from './PropsType'

// const SCROLLVIEW_CONT_STYLE = [
//   // Source code of ScrollView, ['alignItems','justifyContent']
//   'alignItems',
//   'justifyContent',
//   // Other
// ]

const ScrollViewComp = React.forwardRef<any, ScrollViewProps<any>>((props, ref): JSX.Element => {
  const {
    children,
    style,
    scrollX,
    enableBackToTop = false,
    contentContainerStyle,
    data,
    renderItem,
    upperThreshold = 50,
    lowerThreshold = 50,
    scrollTop,
    scrollLeft,
    scrollWithAnimation,
    onScrollToUpper,
    onScrollToLower,
    onScroll = noop,
  } = props

  const [snapState, setSnapState] = React.useState<ScrollViewState>({
    snapScrollTop: 0,
    snapScrollLeft: 0
  })

  const scrollMetricsRef = React.useRef<ScrollMetrics>({
    contentLength: 0,
    dOffset: 0,
    dt: 10,
    offset: 0,
    offsetX: 0,
    offsetY: 0,
    timestamp: 0,
    velocity: 0,
    visibleLength: 0
  })
  const scrollViewRef = React.useRef<any>(null)
  const hasCallScrollToUpperInRangeRef = React.useRef(true)
  const hasCallScrollToLowerInRangeRef = React.useRef(false)
  const initialScrollTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useImperativeHandle(ref, () => ({
    scrollToOffset: (x = 0, y = 0) => {
      const node = scrollViewRef.current
      if (!node) return
      if (data && renderItem) {
        (node as FlatList<any>).scrollToOffset({ offset: scrollX ? x : y, animated: !!scrollWithAnimation })
      } else {
        (node as ScrollView).scrollTo({ x, y, animated: !!scrollWithAnimation })
      }
    }
  }), [data, renderItem, scrollWithAnimation, scrollX])

  React.useEffect(() => {
    if (snapState.snapScrollTop !== (scrollTop || 0) || snapState.snapScrollLeft !== (scrollLeft || 0)) {
      setSnapState({
        snapScrollTop: scrollTop || 0,
        snapScrollLeft: scrollLeft || 0
      })
    }
  }, [scrollLeft, scrollTop, snapState.snapScrollLeft, snapState.snapScrollTop])

  const selectLength = React.useCallback((metrics: { height: number, width: number }): number => {
    return !scrollX ? metrics.height : metrics.width
  }, [scrollX])

  const selectOffset = React.useCallback((metrics: { x: number, y: number }): number => {
    return !scrollX ? metrics.y : metrics.x
  }, [scrollX])

  const maybeCallOnStartReached = React.useCallback((): void => {
    const { offset } = scrollMetricsRef.current
    if (onScrollToUpper && offset <= upperThreshold) {
      if (!hasCallScrollToUpperInRangeRef.current) {
        onScrollToUpper({ distanceFromTop: offset })
        hasCallScrollToUpperInRangeRef.current = true
      }
    } else {
      hasCallScrollToUpperInRangeRef.current = false
    }
  }, [onScrollToUpper, upperThreshold])

  const maybeCallOnEndReached = React.useCallback((): void => {
    const { contentLength, visibleLength, offset } = scrollMetricsRef.current
    const distanceFromEnd = contentLength - visibleLength - offset
    if (onScrollToLower && distanceFromEnd < lowerThreshold) {
      if (!hasCallScrollToLowerInRangeRef.current) {
        hasCallScrollToLowerInRangeRef.current = true
        onScrollToLower({ distanceFromEnd })
      }
    } else {
      hasCallScrollToLowerInRangeRef.current = false
    }
  }, [lowerThreshold, onScrollToLower])

  const scrollToOffset = React.useCallback((x = 0, y = 0): void => {
    const node = scrollViewRef.current
    if (!node) return
    if (data && renderItem) {
      (node as FlatList<any>).scrollToOffset({ offset: scrollX ? x : y, animated: !!scrollWithAnimation })
    } else {
      (node as ScrollView).scrollTo({ x, y, animated: !!scrollWithAnimation })
    }
  }, [data, renderItem, scrollWithAnimation, scrollX])

  React.useEffect(() => {
    if (snapState.snapScrollTop || snapState.snapScrollLeft) {
      initialScrollTimeoutRef.current = setTimeout(() => {
        scrollToOffset(snapState.snapScrollLeft, snapState.snapScrollTop)
      }, 0)
    }
    return () => {
      if (initialScrollTimeoutRef.current) {
        clearTimeout(initialScrollTimeoutRef.current)
      }
    }
  }, [scrollToOffset, snapState.snapScrollLeft, snapState.snapScrollTop])

  React.useEffect(() => {
    const metrics = scrollMetricsRef.current
    const shouldSync = scrollTop !== undefined
      ? (metrics.offsetY !== snapState.snapScrollTop || metrics.offsetX !== snapState.snapScrollLeft)
      : true
    if (shouldSync) {
      scrollToOffset(snapState.snapScrollLeft, snapState.snapScrollTop)
    }
  }, [scrollToOffset, scrollTop, snapState.snapScrollLeft, snapState.snapScrollTop])

  const flattenStyle: ViewStyle & { [key: string]: any } = StyleSheet.flatten(style)
  const wrapperStyle: ViewStyle = omit(flattenStyle, ['alignItems', 'justifyContent'])
  const normalizedContentStyle: ViewStyle & { [key: string]: any } = {}
  if (flattenStyle) {
    flattenStyle.alignItems && (normalizedContentStyle.alignItems = flattenStyle.alignItems)
    flattenStyle.justifyContent && (normalizedContentStyle.justifyContent = flattenStyle.justifyContent)
  }

  const scrollElementProps = {
    horizontal: scrollX,
    onContentSizeChange: (width: number, height: number) => {
      scrollMetricsRef.current.contentLength = selectLength({ height, width })
    },
    onLayout: (e: LayoutChangeEvent) => {
      scrollMetricsRef.current.visibleLength = selectLength(e.nativeEvent.layout)
    },
    onScrollEndDrag: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { velocity } = e.nativeEvent
      if (velocity) {
        scrollMetricsRef.current.velocity = selectOffset(velocity)
      }
    },
    onMomentumScrollEnd: () => {
      scrollMetricsRef.current.velocity = 0
    },
    onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollLeftValue: number = e.nativeEvent.contentOffset.x
      const scrollTopValue: number = e.nativeEvent.contentOffset.y
      const scrollHeight: number = e.nativeEvent.contentSize.height
      const scrollWidth: number = e.nativeEvent.contentSize.width
      const prevMetrics = scrollMetricsRef.current

      onScroll({
        detail: {
          scrollLeft: scrollLeftValue,
          scrollTop: scrollTopValue,
          scrollHeight,
          scrollWidth,
          deltaX: scrollLeftValue - prevMetrics.offsetX,
          deltaY: scrollTopValue - prevMetrics.offsetY
        }
      })

      const timestamp: number = e.timeStamp
      const visibleLength: number = selectLength(e.nativeEvent.layoutMeasurement)
      const contentLength: number = selectLength(e.nativeEvent.contentSize)
      const offset: number = selectOffset(e.nativeEvent.contentOffset)
      const dt: number = Math.max(1, timestamp - prevMetrics.timestamp)
      const dOffset: number = offset - prevMetrics.offset
      const velocity: number = dOffset / dt

      scrollMetricsRef.current = {
        contentLength,
        dt,
        dOffset,
        offset,
        offsetX: scrollLeftValue,
        offsetY: scrollTopValue,
        timestamp,
        velocity,
        visibleLength
      }
      maybeCallOnStartReached()
      maybeCallOnEndReached()
    },
    scrollEventThrottle: 50,
    scrollsToTop: !!enableBackToTop,
    style: wrapperStyle,
    contentContainerStyle: [normalizedContentStyle, contentContainerStyle],
    ...omit(props, [
      'style',
      'scrollX',
      'upperThreshold',
      'lowerThreshold',
      'scrollTop',
      'scrollLeft',
      'scrollWithAnimation',
      'enableBackToTop',
      'onScrollToUpper',
      'onScrollToLower',
      'onScroll',
      'contentContainerStyle',
      'horizontal',
      'onContentSizeChange',
      'onLayout',
      'onScrollEndDrag',
      'onMomentumScrollEnd',
      'scrollsToTop',
      'data',
      'renderItem',
      'keyExtractor'
    ]),
    ref: scrollViewRef
  }

  return data && renderItem ? (
    <FlatList
      {...scrollElementProps}
      data={data}
      renderItem={renderItem}
      keyExtractor={(_item, index) => index + ''}
    />
  ) : (
    <ScrollView {...scrollElementProps}>{children}</ScrollView>
  )
})

export default ScrollViewComp
