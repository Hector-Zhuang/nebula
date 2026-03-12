import { PickerData } from '@ant-design/react-native/lib/picker/PropsType'
import { PickerViewProps as __PickerViewProps } from '@ant-design/react-native/lib/picker-view/PickerView'
import { ReactNode } from 'react'

interface LegacyPickerViewProps {
  value?: number[]
  defaultValue?: number[]
  indicatorStyle?: string
  indicatorClass?: string
  maskStyle?: string
  maskClass?: string
  immediateChange?: boolean
  title?: string
  ariaLabel?: string
  onChange?: (event: { detail: { value: number[] } }) => void
  onPickStart?: (event: unknown) => void
  onPickEnd?: (event: unknown) => void
}

export interface PickerViewProps extends LegacyPickerViewProps, __PickerViewProps {
  children?: ReactNode
  data: PickerData[] | PickerData[][]
  style: any
  indicatorStyle?: any
  onChange?: () => void
  value: any[]
}
