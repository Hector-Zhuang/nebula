import { EventOnLineChange, InputProps } from '../Input/PropsType'

interface FormItemProps {
  name?: string
}

export interface TextareaProps extends InputProps, FormItemProps {
  autoHeight?: boolean
  autoFocus?: boolean
  onLineChange?: (evt: EventOnLineChange) => void
}
