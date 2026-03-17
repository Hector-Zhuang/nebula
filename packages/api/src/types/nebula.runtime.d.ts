import type { options } from '@tarojs/runtime'

import Nebula from './index'

declare module './index' {
  interface NebulaStatic {
    options: typeof options
  }
}
