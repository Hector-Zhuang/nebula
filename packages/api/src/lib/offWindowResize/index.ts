import { callbackManager, removeListener } from '../window'

export const offWindowResize = (callback: offWindowResize.Callback): void => {
  callbackManager.remove(callback)
  if (callbackManager.count() === 0) {
    removeListener()
  }
}
