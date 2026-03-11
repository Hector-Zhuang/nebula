/**
 * ✔ onChange(bindchange)
 *
 * @warn No support of props FOR, you must put checkbox below label straightly.
 */

import * as React from 'react'
import {
  View,
} from 'react-native'

import { noop } from '../../utils'
import { CheckboxGroupProps, EventOnChange, ValueProps } from './PropsType'

const CheckboxGroup = (props: CheckboxGroupProps): JSX.Element => {
  const { children, style, onChange = noop, _onGroupDataInitial = noop } = props
  const valuesRef = React.useRef<ValueProps[]>([])
  const tmpIndexRef = React.useRef(0)

  const getDataFromValues = React.useCallback((): ValueProps[] => {
    return valuesRef.current
      .filter((item) => item.checked)
      .map((item) => item.value)
  }, [])

  const toggleChange = React.useCallback((e: EventOnChange, index: number): void => {
    valuesRef.current[index] = {
      value: e.value,
      checked: e.checked
    }
    onChange({
      detail: {
        value: getDataFromValues()
      }
    })
  }, [getDataFromValues, onChange])

  const findAndAttachCb = React.useCallback((childrenNode: React.ReactNode): React.ReactNode => {
    return React.Children.toArray(childrenNode).map((child: any) => {
      if (!child.type) return child

      const childTypeName = child.type.displayName
      if (childTypeName === '_Checkbox') {
        const { value, disabled, checked, color } = child.props
        const index = tmpIndexRef.current++
        valuesRef.current[index] = { value, checked }
        return React.cloneElement(child, {
          onChange: (e: EventOnChange) => toggleChange(e, index),
          value,
          disabled,
          checked,
          color
        })
      }
      return React.cloneElement(child, { ...child.props }, findAndAttachCb(child.props.children))
    })
  }, [toggleChange])

  tmpIndexRef.current = 0
  const mappedChildren = findAndAttachCb(children)
  _onGroupDataInitial(getDataFromValues())

  return <View style={style}>{mappedChildren}</View>
}

CheckboxGroup.displayName = '_CheckboxGroup'

export default CheckboxGroup
