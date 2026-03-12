import { ReactNode } from 'react'

interface FormItemProps {
  name?: string
}

type CommonEventFunction<T = any> = (event: { detail: T }) => void

interface PickerStandardProps extends FormItemProps {
  children?: ReactNode
  headerText?: string
  mode?: 'selector' | 'multiSelector' | 'time' | 'date' | 'region'
  disabled?: boolean
  onCancel?: () => void
  textProps?: {
    okText?: string
    cancelText?: string
  }
}

interface PickerSelectorProps extends PickerStandardProps {
  mode?: 'selector'
  range: string[] | number[] | Record<string, any>[]
  rangeKey?: string
  value?: number
  defaultValue?: number
  itemStyle?: any
  indicatorStyle?: any
  onChange?: CommonEventFunction<{ value: string | number }>
}

interface PickerMultiSelectorProps extends PickerStandardProps {
  mode: 'multiSelector'
  range: Array<string[]> | Array<number[]> | Array<Record<string, any>[]>
  rangeKey?: string
  value: number[] | string[] | Record<string, any>[]
  itemStyle?: any
  indicatorStyle?: any
  onChange?: CommonEventFunction<{ value: number[] }>
  onColumnChange?: CommonEventFunction<{ column: number; value: number }>
}

interface PickerTimeProps extends PickerStandardProps {
  mode?: 'time'
  value?: string
  defaultValue?: string
  start?: string
  end?: string
  onChange?: CommonEventFunction<{ value: string }>
}

interface PickerDateProps extends PickerStandardProps {
  mode?: 'date'
  value?: string
  defaultValue?: string
  start?: string
  end?: string
  fields?: 'year' | 'month' | 'day'
  onChange?: CommonEventFunction<{ value: string }>
}

interface PickerRegionProps extends PickerStandardProps {
  mode?: 'region'
  value?: string[]
  defaultValue?: string[]
  customItem?: string
  level?: 'province' | 'city' | 'region' | 'sub-district'
  regionData?: RegionObj[]
  onChange?: CommonEventFunction<{ value: string[]; code: string[]; postcode?: string }>
}

export interface BaseState<T> {
  /** Current selected value. */
  value: T
  /** Previously selected value. */
  pValue: T | undefined
}

export type SelectorProps = Partial<PickerSelectorProps>

export interface SelectorState extends BaseState<number | string> {
  pRange: any[] | undefined
  range: any[]
  isInOnChangeUpdate: boolean
}

export type TimeProps = Partial<PickerTimeProps>
export type TimeState = BaseState<string> & { isInOnChangeUpdate: boolean }

export type DateProps = Partial<PickerDateProps>
export type DateState = BaseState<string> & { isInOnChangeUpdate: boolean }

export interface RegionProps extends Partial<PickerRegionProps> {
  customItem?: string
  regionData?: RegionObj[]
}
export type RegionState = BaseState<string[]> & { isInOnChangeUpdate: boolean }
export interface RegionObj {
  value: string
  code: string
  postcode?: string
  children?: RegionObj[]
}

export interface MultiSelectorProps extends Partial<PickerMultiSelectorProps> {
  value: number[]
}
export interface MultiSelectorState extends BaseState<any[]> {
  cols: number
  pRange: any[]
  range: any[]
}
