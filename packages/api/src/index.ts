import * as api from './api'
import * as lib from './lib'

const Nebula = {
  ...api,
  ...lib
}

export * from './api'
export * from './lib'
export { Nebula }

export default Nebula
