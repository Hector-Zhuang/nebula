
import * as React from 'react'
import { FlatList, ListRenderItemInfo, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import { noop } from '../../utils'
import { ScrollViewProps } from '../ScrollView/PropsType'
import { VirtualListProps } from './PropsType'

const VirtualList = React.forwardRef<any, VirtualListProps & ScrollViewProps<any>>((props, ref): JSX.Element => {
  const {
    itemData,
    itemSize,
    item,
    layout = 'vertical',
    overscanCount = 1,
    children,
    onScroll = noop,
    onScrollNative = noop,
    scrollWithAnimation,
    ...restProps
  } = props

  const listRef = React.useRef<any>(null)
  const scrollViewStartOffsetY = React.useRef(0)
  const scrollUpdateWasRequested = React.useRef(false)

  const scrollTo = React.useCallback(({ offset }: { offset: number }): void => {
    const node = listRef.current
    if (node) {
      (node as FlatList<any>).scrollToOffset({ offset, animated: !!scrollWithAnimation })
    }
  }, [scrollWithAnimation])

  const scrollToItem = React.useCallback(({ offset }: { offset: number }): void => {
    const node = listRef.current
    if (node) {
      (node as FlatList<any>).scrollToOffset({ offset, animated: !!scrollWithAnimation })
    }
  }, [scrollWithAnimation])

  React.useImperativeHandle(ref, () => ({
    scrollTo,
    scrollToItem
  }), [scrollTo, scrollToItem])

  const onScrollBeginDrag = React.useCallback((e: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const offsetY = e.nativeEvent.contentOffset[layout === 'vertical' ? 'y' : 'x']
    scrollViewStartOffsetY.current = offsetY
  }, [layout])

  const handleScroll = React.useCallback((e: NativeSyntheticEvent<NativeScrollEvent>): void => {
    onScrollNative(e)
    const offsetY = e.nativeEvent.contentOffset[layout === 'vertical' ? 'y' : 'x']
    onScroll({
      onScroll: scrollViewStartOffsetY.current < offsetY ? 'forward' : 'backward',
      scrollOffset: Math.abs(scrollViewStartOffsetY.current - offsetY),
      scrollUpdateWasRequested: scrollUpdateWasRequested.current
    })
  }, [layout, onScroll, onScrollNative])

  const itemStyle = layout === 'vertical' ? { height: itemSize } : { width: itemSize }
  // Keep any because item type is user-defined (string or JSX.Element).
  const itemCom = item || children
  const itemRow = ({ item: rowItem, index, separators }: ListRenderItemInfo<any>) =>
    React.createElement(itemCom, {
      data: itemData,
      key: index,
      index,
      item: rowItem,
      separators,
      style: {
        ...itemStyle
      }
    })

  return (
    <FlatList
      scrollEventThrottle={50}
      {...restProps}
      data={itemData}
      windowSize={overscanCount}
      horizontal={layout === 'horizontal'}
      ref={listRef}
      onScroll={handleScroll}
      onScrollBeginDrag={onScrollBeginDrag}
      renderItem={itemRow}
      keyExtractor={(_item: Record<string, unknown>, index: number) => index + ''}
    />
  )
})

export default VirtualList
