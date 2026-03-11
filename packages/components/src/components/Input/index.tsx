import React from 'react'
import { TextInput } from 'react-native'

type InputProps = React.ComponentProps<typeof TextInput> & {
  _multiline?: boolean
  _autoHeight?: boolean
  _onLineChange?: (event: unknown) => void
  onInput?: (event: { detail: { value: string } }) => void
  onChange?: (event: { detail: { value: string } }) => void
  maxlength?: number
  focus?: boolean
  confirmType?: string
}

const Input: React.FC<InputProps> = ({
  _multiline,
  _autoHeight,
  _onLineChange,
  onInput,
  onChange,
  maxlength,
  focus,
  confirmType,
  multiline,
  onChangeText,
  ...rest
}) => {
  return (
    <TextInput
      multiline={_multiline ?? multiline}
      autoFocus={focus ?? rest.autoFocus}
      maxLength={maxlength ?? rest.maxLength}
      onChangeText={(value) => {
        onChangeText?.(value)
        onInput?.({ detail: { value } })
        onChange?.({ detail: { value } })
      }}
      onContentSizeChange={(e) => {
        _onLineChange?.(e)
        rest.onContentSizeChange?.(e)
      }}
      {...rest}
    />
  )
}

export default Input
