import Nebula from '../../index'

declare module '../../index' {
  
  interface MediaContainer {
    
    addTrack(
      
      track: MediaTrack,
    ): void
    
    destroy(): void
    
    export(): void
    
    extractDataSource(option: MediaContainer.ExtractDataSourceOption): void
    
    removeTrack(
      
      track: MediaTrack,
    ): void
  }

  namespace MediaContainer {
    interface ExtractDataSourceOption {
      
      source: string
    }
  }

  
  interface MediaTrack {
    
    kind: keyof MediaTrack.Kind
    
    duration: number
    
    volume: number
  }
  namespace MediaTrack {
    interface Kind {
      
      audio
      
      video
    }
  }

  interface NebulaStatic {
    
    createMediaContainer(): MediaContainer
  }
}
