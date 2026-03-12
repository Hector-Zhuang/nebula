import { Animated, StyleProp, ViewStyle } from 'react-native'

type CommonEventFunction<T = any> = (event: { detail: T }) => void

interface BaseProgressProps {
  percent?: number
  showInfo?: boolean
  borderRadius?: number | string
  fontSize?: number | string
  strokeWidth?: number | string
  color?: string
  activeColor?: string
  backgroundColor?: string
  active?: boolean
  activeMode?: 'backwards' | 'forwards'
  duration?: number
  ariaLabel?: string
  onActiveEnd?: CommonEventFunction
}

export interface ProgressState {
  percent: number
  prevPercent: number
  valve: Animated.Value
}

export interface ProgressProps extends BaseProgressProps {
  style: StyleProp<ViewStyle> | any
  percent: number
}
