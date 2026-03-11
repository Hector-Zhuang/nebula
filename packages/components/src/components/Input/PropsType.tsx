export type EventOnLineChange = (event: unknown) => void

export interface InputProps {
  value?: string
  defaultValue?: string
  placeholder?: string
  maxlength?: number
  focus?: boolean
  autoFocus?: boolean
  confirmType?: string
  onInput?: (event: { detail: { value: string } }) => void
  onChange?: (event: { detail: { value: string } }) => void
  onBlur?: () => void
  style?: any
}
