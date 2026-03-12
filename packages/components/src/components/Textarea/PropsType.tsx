import { FormItemProps } from '../types'

import { EventOnLineChange, InputProps } from '../Input/PropsType'

export interface TextareaProps extends InputProps, FormItemProps {
  autoHeight?: boolean
  autoFocus?: boolean
  onLineChange?: (evt: EventOnLineChange) => void
}
