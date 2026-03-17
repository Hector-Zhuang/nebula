import Nebula from '../../index'

declare module '../../index' {
  interface NebulaStatic {
    
    canIUse(
      
      schema: string
    ): boolean

    
    canIUseWebp(): boolean

    
    base64ToArrayBuffer (
      
      base64: string,
    ): ArrayBuffer

    
    arrayBufferToBase64 (
      
      buffer: ArrayBuffer,
    ): string

    
    preload (options: Record<string, any>)

    
    preload (key: string, value: any)

    
    preloadData: Record<string, any>
  }
}
