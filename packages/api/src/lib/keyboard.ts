import { Keyboard } from 'react-native'

import { createCallbackManager } from '../utils'
const hideKeyboard = (opts: hideKeyboard.Option = {}): Promise<CallbackResult> => {
  try {
    Keyboard.dismiss()
    const res = { errMsg: 'hideKeyboard:ok' }
    return Promise.resolve(res)
  } catch (err) {
    const res = { errMsg: err.message }
    return Promise.reject(res)
  }
}

const _cbManager = createCallbackManager()
let _hasListener = false

const keyboardHeightListener = (height: number) => {
  _cbManager.trigger({ height })
}


const onKeyboardHeightChange = (callback: onKeyboardHeightChange.Callback): void => {
  _cbManager.add(callback)
  if (!_hasListener) {
    Keyboard.addListener('keyboardDidShow', (e) => {
      keyboardHeightListener(e.endCoordinates.height)
    })
    Keyboard.addListener('keyboardDidHide', () => {
      keyboardHeightListener(0)
    })
    _hasListener = true
  }
}


const offKeyboardHeightChange = (callback?: onKeyboardHeightChange.Callback): void => {
  if (callback && typeof callback === 'function') {
    _cbManager.remove(callback)
  } else if (callback === undefined) {
    _cbManager.clear()
  } else {
    console.warn('offKeyboardHeightChange failed')
  }
  if (_cbManager.count() === 0) {
    Keyboard.removeAllListeners('keyboardDidShow')
    Keyboard.removeAllListeners('keyboardDidHide')
    _hasListener = false
  }
}

export { hideKeyboard, offKeyboardHeightChange, onKeyboardHeightChange }
