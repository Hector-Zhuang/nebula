/**
 * Key difference:
 * selector stores index in state.value, while multiSelector stores actual value(s).
 */

import AntPicker from '@ant-design/react-native/lib/picker'
import * as React from 'react'

import { noop } from '../../utils'
import { SelectorProps } from './PropsType'

function convertToObj (item?: any, rangeKey = ''): any {
  if (typeof item === 'object') {
    return { value: item[rangeKey], label: item[rangeKey] }
  } else {
    return { value: item, label: item }
  }
}

const Selector = (props: SelectorProps): JSX.Element => {
  const {
    children,
    disabled,
    itemStyle,
    indicatorStyle,
    onChange = noop,
    onCancel = noop,
    range: incomingRange = [],
    rangeKey,
    value: incomingValue,
    defaultValue,
  } = props

  const [range, setRange] = React.useState<any[]>([])
  const [pRange, setPRange] = React.useState<any[]>([])
  const [value, setValue] = React.useState<any>(0)
  const [pValue, setPValue] = React.useState<any>('')
  const [isInOnChangeUpdate, setIsInOnChangeUpdate] = React.useState(false)
  const dismissByOkRef = React.useRef(false)

  React.useEffect(() => {
    if (incomingRange !== pRange) {
      setPRange(incomingRange)
      setRange((incomingRange || []).map((item) => convertToObj(item, rangeKey)))
    }

    // eslint-disable-next-line eqeqeq
    const isControlled = incomingValue != undefined
    if (isControlled) {
      if (incomingValue !== pValue) {
        setValue(incomingValue)
        setPValue(incomingValue)
      } else if (isInOnChangeUpdate && incomingValue !== value) {
        setIsInOnChangeUpdate(false)
        setValue(incomingValue)
      }
      return
    }

    if (pValue !== incomingValue) {
      setPValue(incomingValue)
      setValue(defaultValue ?? 0)
    }
  }, [defaultValue, incomingRange, incomingValue, isInOnChangeUpdate, pRange, pValue, rangeKey, value])

  const selected: any = range[value]

  return (
    // @ts-ignore
    <AntPicker
      data={range}
      value={[selected && selected.value]}
      cols={1}
      itemStyle={itemStyle}
      indicatorStyle={indicatorStyle}
      onChange={() => {
        onChange({ detail: { value } })
        setIsInOnChangeUpdate(true)
      }}
      onPickerChange={(picked: any[]) => {
        let selectedIndex = 0
        for (let i = 0; i < range.length; i++) {
          if (range[i].value === picked[0]) {
            selectedIndex = i
            break
          }
        }
        setValue(selectedIndex)
      }}
      onOk={() => {
        dismissByOkRef.current = true
      }}
      onVisibleChange={(visible: boolean) => {
        if (!visible && !dismissByOkRef.current) {
          onCancel()
        }
        dismissByOkRef.current = false
      }}
      disabled={disabled}
    >
      {children}
    </AntPicker>
  )
}

export default Selector
