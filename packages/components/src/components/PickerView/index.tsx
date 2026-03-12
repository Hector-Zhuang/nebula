import AntPickerView from '@ant-design/react-native/lib/picker-view'
import React from 'react'

import { noop } from '../../utils'
import { PickerViewProps } from './PropsType'

const joinString = (data: React.ReactNode): string => {
  const arr = Array.isArray(data) ? data : [data]
  return arr.map(item => (item == null ? '' : String(item))).join('')
}

const getLabelFromChildren = (node: React.ReactNode): string => {
  if (React.isValidElement(node)) {
    const maybeChildren = (node.props as { children?: React.ReactNode })?.children
    return maybeChildren ? getLabelFromChildren(maybeChildren) : ''
  }
  return joinString(node)
}

const handleChildren = (children: React.ReactNode[]): any[] => {
  return children.map((child: any, index: number) => ({
    label: getLabelFromChildren(child),
    value: index
  }))
}

const getDataFromChildren = (children: React.ReactNode): any[] => {
  return (Array.isArray(children) ? children : [children]).map((child: any) => {
    const rawChildren = child?.props?.children
    const list = Array.isArray(rawChildren)
      ? rawChildren
      : rawChildren != null
        ? [rawChildren]
        : [child]
    return handleChildren(list)
  })
}

const PickerView = (props: PickerViewProps): JSX.Element | null => {
  const { data = [], value = [], children, onChange = noop, ...restProps } = props
  if (!children) return null

  return (
    <AntPickerView
      {...restProps}
      cols={1}
      value={value}
      data={data.length > 0 ? data : getDataFromChildren(children)}
      onChange={(val: Record<string, any>) => onChange({ detail: { value: val } })}
      cascade={false}
    />
  )
}

PickerView.defaultProps = {
  data: [],
  value: []
}

export default PickerView
