import AntPicker from '@ant-design/react-native/lib/picker'
import * as React from 'react'

import { noop } from '../../utils'
import { MultiSelectorProps, MultiSelectorState } from './PropsType'

/**
 * Compare every value in two arrays.
 *
 * @returns true = same, false = different
 */
function shallowDiffValue(value: number[] = [], lastValue: number[] = []): boolean {
  if (value.length !== lastValue.length) return false
  for (let i = 0; i < value.length; i++) {
    if (value[i] !== lastValue[i]) {
      return false
    }
  }
  return true
}

function convertToObj(item?: any, rangeKey = ''): any {
  if (typeof item === 'object') {
    return { value: item[rangeKey], label: item[rangeKey] }
  } else {
    return { value: item, label: item }
  }
}

// eslint-disable-next-line default-param-last
function formatRange(range: any[][] = [], rangeKey?: string): any[] {
  const result = (range[0] || []).map(item => {
    return convertToObj(item, rangeKey)
  })
  let tmp = result
  for (let i = 1; i < range.length; i++) {
    const nextColData = (range[i] || []).map(item => {
      return convertToObj(item, rangeKey)
    })
    tmp.forEach(item => {
      item.children = nextColData
    })
    tmp = nextColData
  }
  return result
}

function getIndexByValues(range: any[] = [], value: any[] = []): number[] {
  let tmp = range
  return value.map(v => {
    for (let i = 0; i < tmp.length; i++) {
      if (tmp[i].value === v) {
        tmp = tmp[i].children || []
        return i
      }
    }
    return 0
  })
}

// Todo: support defaultValue.
const MultiSelector = (props: MultiSelectorProps): JSX.Element => {
  const {
    range: incomingRange = [],
    rangeKey,
    value: incomingValue = [],
    onChange = noop,
    onColumnChange = noop,
    onCancel = noop,
    children,
    disabled,
    itemStyle,
    indicatorStyle,
  } = props

  const [cols, setCols] = React.useState(3)
  const [pRange, setPRange] = React.useState<any[]>([])
  const [pValue, setPValue] = React.useState<number[]>([])
  const [range, setRange] = React.useState<any[]>([])
  const [value, setValue] = React.useState<any[]>([])
  const dismissByOkRef = React.useRef(false)

  React.useEffect(() => {
    let nextRange = range
    if (incomingRange !== pRange) {
      setCols(incomingRange.length)
      setPRange(incomingRange)
      nextRange = formatRange(incomingRange, rangeKey)
      setRange(nextRange)
    }

    if (!shallowDiffValue(incomingValue, pValue)) {
      setPValue(incomingValue)
      let tmp = nextRange
      const mappedValue = (incomingValue || []).map((valIndex = 0) => {
        const v = tmp[valIndex] && tmp[valIndex].value
        tmp = (tmp[valIndex] && tmp[valIndex].children) || []
        return v
      })
      setValue(mappedValue)
    }
  }, [incomingRange, incomingValue, pRange, pValue, range, rangeKey])

  return (
    // @ts-ignore
    <AntPicker
      data={range}
      value={value}
      cols={cols}
      itemStyle={itemStyle}
      indicatorStyle={indicatorStyle}
      onChange={(nextValue: any[]) => {
        onChange({ detail: { value: getIndexByValues(range, nextValue) } })
      }}
      onPickerChange={(nextValue: any[]) => {
        const indexes = getIndexByValues(range, nextValue)
        // Compare current and next values to find which column changed.
        let changingColIndex = 0
        for (let i = 0; i < value.length; i++) {
          if (value[i] !== nextValue[i]) {
            changingColIndex = i
            break
          }
        }
        onColumnChange({ detail: { column: changingColIndex, value: indexes[changingColIndex] } })
        setValue(nextValue)
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

export default MultiSelector
