import Nebula from '../../index'

declare module '../../index' {
  namespace setTopBarText {
    interface Option {
      
      text: string
      
      
      
    }
  }
  interface NebulaStatic {
    
    setTopBarText(option: setTopBarText.Option): Promise<NebulaGeneral.CallbackResult>
  }
}
