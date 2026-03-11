/**
 * ✔ percent
 * ✔ showInfo(show-info)
 * ✔ strokeWidth(stroke-width)
 * - color
 * ✔ activeColor
 * ✔ backgroundColor
 * ✔ active
 * ✔ activeMode(active-mode)
 *
 * @warn Height and width accept percentages after 0.42
 *
 * @example
 *  <Progress
 *    percent={this.state.progressPercent}
 *    showInfo={true}
 *    activeColor="orange"
 *    backgroundColor="pink"
 *    active={true}
 *    activeMode="forwards"
 *    style={{ marginTop: 10 }}
 *  />
 */

import * as React from 'react'
import {
  Animated,
  DimensionValue,
  Easing,
  Text,
  View,
} from 'react-native'

import { ProgressProps } from './PropsType'
import styles from './styles'

const Progress = (props: ProgressProps): JSX.Element => {
  const {
    style,
    percent = 0,
    showInfo,
    borderRadius = 0,
    strokeWidth = 6,
    activeColor = '#09BB07',
    backgroundColor = '#EBEBEB',
    active,
    activeMode = 'backwards',
  } = props

  const valve = React.useRef(new Animated.Value(0)).current
  const prevPercentRef = React.useRef(0)

  React.useEffect(() => {
    const toValve = percent / 100

    if (!active || (activeMode !== 'backwards' && activeMode !== 'forwards')) {
      Animated.timing(valve, {
        toValue: toValve,
        duration: 0,
        useNativeDriver: false
      }).start()
      prevPercentRef.current = percent
      return
    }

    const sequence: Animated.CompositeAnimation[] = []
    const duration = (activeMode === 'forwards' ? Math.abs(percent - prevPercentRef.current) : percent) / 100 * 1000

    if (activeMode === 'backwards') {
      sequence.push(Animated.timing(valve, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false
      }))
    }
    sequence.push(Animated.timing(valve, {
      toValue: toValve,
      easing: Easing.linear,
      duration,
      useNativeDriver: false
    }))

    Animated.sequence(sequence).start()
    prevPercentRef.current = percent
  }, [active, activeMode, percent, valve])

  const width = valve.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  })

  return (
    <View style={[styles.wrapper, style]}>
      <View
        style={[
          styles.bar, {
            height: strokeWidth as (DimensionValue | undefined),
            backgroundColor
          }
        ]}
      >
        <Animated.View style={[
          styles.barThumb, {
            width,
            height: '100%',
            backgroundColor: activeColor,
            borderBottomRightRadius: Number(borderRadius),
            borderTopRightRadius: Number(borderRadius),
          }
        ]} />
      </View>
      {showInfo && <Text style={styles.info}>{percent}%</Text>}
    </View>
  )
}

export default Progress
