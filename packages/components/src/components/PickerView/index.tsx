import AntPickerView from '@ant-design/react-native/lib/picker-view'
import * as React from 'react'

import { noop } from '../../utils'
import { PickerViewProps } from './PropsType'

const joinString = (data: string | any[] | React.ReactElement): string => {
  return (Array.isArray(data) ? data : [data]).join('')
}

const getLabelFromChildren = (child: React.ReactElement): string => {
  return child.props && child.props.children ? getLabelFromChildren(child.props.children) : joinString(child)
}

const handleChildren = (children: React.ReactChild[]): any[] => {
  return children.map((child: any, index: number) => ({
    label: getLabelFromChildren(child),
    value: index
  }))
}

const getDataFromChildren = (children: React.ReactNode): any[] => {
  return (Array.isArray(children) ? children : [children]).map((child: any) => {
    return handleChildren(child.props && child.props.children ? child.props.children : [child])
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
