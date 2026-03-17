import Nebula from '../../index'

declare module '../../index' {
  interface NebulaStatic {
    
    nextTick(callback: (...args: any[]) => any): void
  }
}
