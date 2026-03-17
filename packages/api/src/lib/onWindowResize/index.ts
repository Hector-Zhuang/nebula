import { addListener, callbackManager } from '../window'



export const onWindowResize = (callback: onWindowResize.Callback): void => {
  callbackManager.add(callback)
  if (callbackManager.count() === 1) {
    addListener()
  }
}
