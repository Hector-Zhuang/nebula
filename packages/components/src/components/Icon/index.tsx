import React from 'react'
import { Text } from 'react-native'

type IconProps = {
  type?: string
  size?: number
  color?: string
  style?: any
}

const Icon: React.FC<IconProps> = ({ size = 16, color = '#333', style }) => {
  return <Text style={[{ fontSize: size, color }, style]}>✓</Text>
}

export default Icon
