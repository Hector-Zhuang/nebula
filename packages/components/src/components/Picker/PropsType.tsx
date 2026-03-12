import { PickerDateProps, PickerMultiSelectorProps, PickerRegionProps, PickerSelectorProps, PickerTimeProps } from '../types/Picker'

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
