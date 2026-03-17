import Nebula from '../../index'

declare module '../../index' {
  
  interface EntryList {
    
    getEntries(): PerformanceEntry[]
    
    getEntriesByName(name: string, entryType: string): PerformanceEntry[]
    
    getEntriesByType(entryType: string): PerformanceEntry[]
  }

  
  interface Performance {
    
    createObserver(callback: NebulaGeneral.TFunc): PerformanceObserver
    
    getEntries(): PerformanceEntry[]
    
    getEntriesByName(name: string, entryType: string): PerformanceEntry[]
    
    getEntriesByType(entryType: string): PerformanceEntry[]
    
    setBufferSize(size: number): void
  }

  
  interface PerformanceEntry {
    
    entryType: keyof PerformanceEntry.EntryType
    
    name: keyof PerformanceEntry.EntryName
    
    startTime: number
    
    duration: number
    
    path: string
    
    navigationStart: number
    
    navigationType: string
    
    moduleName: string
    
    fileList: string[]
    
    viewLayerReadyTime: number
    
    initDataSendTime: number
    
    initDataRecvTime: number
    
    viewLayerRenderStartTime: number
    
    viewLayerRenderEndTime: number
  }

  
  interface PerformanceObserver {
    
    supportedEntryTypes: PerformanceEntry[]
    
    disconnect(): void
    
    observe(option: PerformanceObserver.observe.Option): void
  }

  namespace PerformanceEntry {
    
    interface EntryType {
      
      navigation
      
      render
      
      script
    }
    
    interface EntryName {
      
      appLaunch
      
      route
      
      firstRender
      
      firstPaint
      
      firstContentfulPaint
      
      evaluateScript
    }
  }

  namespace PerformanceObserver {
    namespace observe {
      interface Option {
        
        type: keyof EntryType
        
        entryTypes: (keyof EntryType)[]
      }
      interface EntryType {
        
        navigation
        
        render
        
        script
      }
    }
  }

  namespace preloadWebview {
    interface Option {
      
      
      
    }
  }

  namespace preloadSkylineView {
    interface Option {
      
      
      
    }
  }

  namespace preloadAssets {
    interface AssetsObjectType {
      
      font
      
      image
    }
    interface AssetsObject {
      
      type: keyof AssetsObjectType
      
      src: string
    }
    interface Option {
      data: AssetsObject[]
      
      
      
    }
  }

  interface NebulaStatic {
    
    reportPerformance(
      
      id: number,
      
      value: number,
      
      dimensions?: string | string[],
    ): void

    
    preloadWebview(option: preloadWebview.Option): Promise<NebulaGeneral.CallbackResult>

    
    preloadSkylineView(option: preloadSkylineView.Option): Promise<NebulaGeneral.CallbackResult>

    
    preloadAssets(option: preloadAssets.Option): Promise<NebulaGeneral.CallbackResult>
    
    getPerformance(): Performance
  }
}
