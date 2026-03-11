import AntDatePicker from '@ant-design/react-native/lib/date-picker'
import * as React from 'react'

import { noop } from '../../utils'
import { TimeProps } from './PropsType'

function formatTimeStr(time = ''): Date {
  const now = new Date()
  let [hour, minute]: any = time.split(':')
  hour = ~~hour
  minute = ~~minute
  now.setHours(hour, minute)
  return now
}

const TimeSelector = (props: TimeProps): JSX.Element => {
  const {
    children,
    start = '00:00',
    end = '23:59',
    disabled,
    onCancel = noop,
    onChange = noop,
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
        setPValue(incomingValue)
        setValue(incomingValue)
      } else if (isInOnChangeUpdate && incomingValue !== value) {
        setValue(incomingValue)
        setIsInOnChangeUpdate(false)
      }
      return
    }

    if (incomingValue !== pValue) {
      setPValue(incomingValue)
      setValue(defaultValue ?? '00:00')
    }
  }, [defaultValue, incomingValue, isInOnChangeUpdate, pValue, value])

  const handleChange = React.useCallback((date: Date): void => {
    const hh: string = ('0' + date.getHours()).slice(-2)
    const mm: string = ('0' + date.getMinutes()).slice(-2)
    const nextValue = `${hh}:${mm}`
    setValue(nextValue)
    onChange({ detail: { value: nextValue } })
    setIsInOnChangeUpdate(true)
  }, [onChange])

  return (
    <AntDatePicker
      mode={'time'}
      value={formatTimeStr(value)}
      minDate={formatTimeStr(start)}
      maxDate={formatTimeStr(end)}
      onChange={handleChange}
      onDismiss={onCancel}
      disabled={disabled}
    >
      {children}
    </AntDatePicker>
  )
}

export default TimeSelector
