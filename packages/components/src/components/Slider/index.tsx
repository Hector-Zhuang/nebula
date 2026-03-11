/**
 * Semi-controlled component.
 *
 * ✔ min
 * ✔ max
 * ✔ step
 * ✔ disabled
 * ✔ value
 * - color
 * - selected-color
 * ✔ activeColor
 * ✔ backgroundColor
 * ✘ blockSize(block-size)
 * ✔ blockColor(block-color)
 * ✔ showValue(show-value)
 * ✔ onChange(bindchange)
 * ✔ onChanging(bindchanging)
 */

import Slider from '@react-native-community/slider'
import * as React from 'react'
import { Text, View } from 'react-native'

import { noop } from '../../utils'
import { SliderProps } from './PropsType'
import styles from './styles'

const SliderComp = (props: SliderProps): JSX.Element => {
  const {
    style,
    min = 0,
    max = 100,
    step = 1,
    disabled,
    activeColor = '#1aad19',
    backgroundColor = '#e9e9e9',
    blockColor = '#fff',
    showValue,
    onChange = noop,
    onChanging = noop,
    value,
    defaultValue
  } = props

  // eslint-disable-next-line eqeqeq
  const isControlled = value != undefined
  const [currentValue, setCurrentValue] = React.useState<number>(defaultValue ?? (value || 0))
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value || 0)
    }
  }, [value])

  React.useEffect(() => {
    if (!isControlled) return

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      if (value !== currentValue) {
        setCurrentValue(value || 0)
      }
    }, 50)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [currentValue, isControlled, value])

  return (
    <View style={styles.wrapper}>
      <Slider
        minimumValue={min}
        maximumValue={max}
        step={step}
        disabled={!!disabled}
        value={currentValue}
        minimumTrackTintColor={activeColor}
        maximumTrackTintColor={backgroundColor}
        thumbTintColor={blockColor}
        onSlidingComplete={(nextValue: number) => onChange({ detail: { value: nextValue } })}
        onValueChange={(nextValue: number) => {
          onChanging({ detail: { value: nextValue } })
          setCurrentValue(nextValue)
        }}
        style={[styles.bar, style as Record<string, unknown>]}
      />
      {showValue && <Text style={styles.info}>{currentValue}</Text>}
    </View>
  )
}

SliderComp.displayName = '_Slider'

export default SliderComp
