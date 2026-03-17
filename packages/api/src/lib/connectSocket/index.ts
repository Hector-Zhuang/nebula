import SocketTask from './socketTask'
let socketsCounter = 1
let socketTasks: any[] = []

export function connectSocket(opts: connectSocket.Option): Promise<SocketTask> {
  return new Promise((resolve, reject) => {
    const { url } = opts
    let { protocols } = opts
    const res: any = { errMsg: 'connectSocket:ok' }

    if (typeof url !== 'string') {
      const error = new Error('connectSocket:fail parameter error: parameter.url should be String')
      res.errMsg = error.message
      return reject(res)
    }

    if (Object.prototype.toString.call(protocols) !== '[object Array]') {
      protocols = undefined
    }

    const task: any = new SocketTask(url, protocols)
    task._destroyWhenClose = () => {
      socketTasks = socketTasks.filter(socketTask => { return socketTask !== task })
    }
    socketTasks.push(task)

    res.socketTaskId = socketsCounter++
    res.socketTask = task


    return resolve(task)
  })
}

function onSocketOpen (): void {
  console.warn('Deprecated. Please use socketTask.onOpen instead.')
}

function onSocketError (): void {
  console.warn('Deprecated. Please use socketTask.onError instead.')
}

function sendSocketMessage (): void {
  console.warn('Deprecated. Please use socketTask.send instead.')
}

function onSocketMessage (): void {
  console.warn('Deprecated. Please use socketTask.onMessage instead.')
}

function closeSocket (): void {
  console.warn('Deprecated. Please use socketTask.close instead.')
}

function onSocketClose (): void {
  console.warn('Deprecated. Please use socketTask.onClose instead.')
}

export default {
  connectSocket,
  onSocketOpen,
  onSocketError,
  sendSocketMessage,
  onSocketMessage,
  closeSocket,
  onSocketClose
}
