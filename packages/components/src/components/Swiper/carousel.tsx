/**
 * Note: Carousel was privatized and adapted from @ant-design/react-native/lib/carousel.
 * https://github.com/ant-design/ant-design-mobile-rn/tree/master/components/carousel
 *
 * Implemented with react-native-pager-view.
 *
 */
import React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import ViewPager from 'react-native-pager-view'

import defaultPagination from './pagination'
import { CarouselProps } from './PropsType'

const styles = StyleSheet.create({
  wrapperStyle: {
    overflow: 'hidden',
  },
})

const INFINITE_BUFFER = 2

const exchangePos = Platform.select({
  ios: INFINITE_BUFFER - 1,
  android: INFINITE_BUFFER - 2
}) as number

export interface CarouselState {
  selectedIndex: number // Index used by ViewPager
}

const Carousel = (props: CarouselProps): JSX.Element => {
  const {
    infinite = false,
    dots = true,
    autoplay = false,
    autoplayInterval = 3000,
    selectedIndex: selectedIndexProp = 0,
    vertical = false,
    pagination = defaultPagination,
    dotStyle = {},
    dotActiveStyle = {},
    children,
    style,
    afterChange,
  } = props

  const viewPager = React.useRef<ViewPager>(null)
  const autoplayTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const isScrollingRef = React.useRef(false)
  const count = children ? React.Children.count(children) || 1 : 0

  const getIndex = React.useCallback((index: number, total: number): number => {
    if (!infinite) return index
    if (index < INFINITE_BUFFER) {
      return total - INFINITE_BUFFER + index
    }
    if (index > total + INFINITE_BUFFER - 1) {
      return index - total - INFINITE_BUFFER
    }
    return index - INFINITE_BUFFER
  }, [infinite])

  const getVirtualIndex = React.useCallback((index: number, infi?: boolean): number => {
    if (count < 2) return index
    const enableInfinite = infi ?? infinite
    if (!enableInfinite) return index
    return index + INFINITE_BUFFER
  }, [count, infinite])

  const [selectedIndex, setSelectedIndex] = React.useState<number>(
    getVirtualIndex(Math.min(selectedIndexProp as number, count - 1))
  )

  const goTo = React.useCallback((index: number): void => {
    viewPager.current?.setPage(index)
  }, [])

  const runAutoplay = React.useCallback((stop = false) => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current)
    }
    if (stop) return
    if (!Array.isArray(children) || !autoplay || isScrollingRef.current || count < 2) {
      return
    }

    autoplayTimerRef.current = setTimeout(() => {
      let newIndex = selectedIndex < getVirtualIndex(count) ? selectedIndex + 1 : 0
      if (selectedIndex === count - 1) {
        newIndex = 0
        if (!infinite) {
          if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current)
          return
        }
      }
      if (infinite) {
        newIndex = getVirtualIndex(getIndex(newIndex, count))
      }
      goTo(newIndex)
    }, autoplayInterval)
  }, [autoplay, autoplayInterval, children, count, getIndex, getVirtualIndex, goTo, infinite, selectedIndex])

  React.useEffect(() => {
    runAutoplay()
    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current)
      }
    }
  }, [runAutoplay])

  React.useEffect(() => {
    const index = getVirtualIndex(Math.min(selectedIndexProp as number, count - 1), infinite)
    if (index !== selectedIndex) {
      goTo(index)
    }
  }, [count, getVirtualIndex, goTo, infinite, selectedIndex, selectedIndexProp])

  if (!children) {
    return (
      <Text style={{ backgroundColor: 'white' }}>
        You are supposed to add children inside Carousel
      </Text>
    )
  }

  let pages: React.ReactNode
  if (count > 1) {
    const childrenArray = React.Children.toArray(children)
    if (infinite) {
      for (let index = 0; index < INFINITE_BUFFER; index++) {
        childrenArray.push(React.cloneElement(children[index] as React.ReactElement))
        childrenArray.unshift(React.cloneElement(children[count - index - 1] as React.ReactElement))
      }
    }

    pages = childrenArray.map((page, i) => (
      <View key={i}>{page}</View>
    ))
  } else {
    pages = <View>{children}</View>
  }

  return (
    <View style={[styles.wrapperStyle]}>
      <ViewPager
        initialPage={selectedIndex}
        onPageSelected={(e) => {
          if (count < 2) return
          const pos = e.nativeEvent.position
          const prevIndex = getIndex(selectedIndex, count)
          setSelectedIndex(pos)
          runAutoplay()
          const actualIndex = getIndex(pos, count)
          if (afterChange && prevIndex !== actualIndex) {
            afterChange(actualIndex)
          }
        }}
        onPageScroll={(e) => {
          if (count < 2) return
          const pos = e.nativeEvent.position
          if (infinite) {
            if (pos === count + INFINITE_BUFFER) {
              viewPager.current?.setPageWithoutAnimation(INFINITE_BUFFER)
            } else if (pos === exchangePos) {
              viewPager.current?.setPageWithoutAnimation(count + exchangePos + 1)
            }
          }
        }}
        onPageScrollStateChanged={(e) => {
          if (count < 2) return
          switch (e.nativeEvent.pageScrollState) {
            case 'dragging':
              runAutoplay(true)
              isScrollingRef.current = true
              break
            case 'idle':
            case 'settling':
              runAutoplay()
              isScrollingRef.current = false
              break
            default:
              break
          }
        }}
        style={style}
        orientation={vertical ? 'vertical' : 'horizontal'}
        ref={viewPager as any}
      >
        {pages}
      </ViewPager>
      {dots && pagination({
        styles,
        vertical,
        current: getIndex(selectedIndex, count),
        count,
        dotStyle,
        dotActiveStyle,
      })}
    </View>
  )
}

export default Carousel
