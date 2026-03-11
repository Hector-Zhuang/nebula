import AntDatePicker from '@ant-design/react-native/lib/date-picker'
import * as React from 'react'

import { noop } from '../../utils'
import { DateProps } from './PropsType'

function formatTimeStr(time = ''): Date {
  let [year, month, day]: any = time.split('-')
  year = ~~year || 2000
  month = ~~month || 1
  day = ~~day || 1
  return new Date(year, month - 1, day)
}

function dateToString (date: Date, fields: 'day' | 'month' | 'year' = 'day'): string {
  const yyyy: string = date.getFullYear() + ''
  const MM: string = ('0' + (date.getMonth() + 1)).slice(-2)
  const dd: string = ('0' + date.getDate()).slice(-2)
  let ret: string = yyyy
  if (fields === 'month' || fields === 'day') {
    ret += `-${MM}`
    if (fields === 'day') {
      ret += `-${dd}`
    }
  }
  return ret
}

const DateSelector = (props: DateProps): JSX.Element => {
  const {
    children,
    start = '1970-01-01',
    end = '2999-01-01',
    fields = 'day',
    disabled,
    onChange = noop,
    onCancel = noop,
    value: incomingValue,
    defaultValue
  } = props

  const [value, setValue] = React.useState<string>('')
  const [pValue, setPValue] = React.useState<any>('')
  const [isInOnChangeUpdate, setIsInOnChangeUpdate] = React.useState(false)

  React.useEffect(() => {
    // eslint-disable-next-line eqeqeq
    const isControlled = incomingValue != undefined
    if (isControlled) {
      if (incomingValue !== pValue) {
        setValue(incomingValue as string)
        setPValue(incomingValue)
      } else if (isInOnChangeUpdate && incomingValue !== value) {
        setValue(incomingValue as string)
        setIsInOnChangeUpdate(false)
      }
      return
    }
    if (incomingValue !== pValue) {
      setValue(defaultValue ?? dateToString(new Date()))
      setPValue(incomingValue)
    }
  }, [defaultValue, incomingValue, isInOnChangeUpdate, pValue, value])

  const mode = React.useMemo(() => {
    if (fields === 'year') return 'year'
    if (fields === 'month') return 'month'
    return 'date'
  }, [fields])

  return (
    <AntDatePicker
      mode={mode as any}
      value={formatTimeStr(value)}
      minDate={formatTimeStr(start)}
      maxDate={formatTimeStr(end)}
      onChange={(date: Date) => {
        const nextValue = dateToString(date, fields)
        setIsInOnChangeUpdate(true)
        setValue(nextValue)
        onChange({ detail: { value: nextValue } })
      }}
      onDismiss={onCancel}
      disabled={disabled}
    >
      {children}
    </AntDatePicker>
  )
}

export default DateSelector
