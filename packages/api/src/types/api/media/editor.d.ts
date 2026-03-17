import Nebula from '../../index'

declare module '../../index' {
  
  interface EditorContext {
    
    blur(option?: EditorContext.BlurOption): void
    
    clear(option?: EditorContext.ClearOption): void
    
    format(
      
      name: string,
      
      value?: string,
    ): void
    
    getContents(option?: EditorContext.GetContentsOption): void
    
    getSelectionText(option?: EditorContext.getSelectionText.Option): void
    
    insertDivider(option?: EditorContext.InsertDividerOption): void
    
    insertImage(option: EditorContext.InsertImageOption): void
    
    insertText(option: EditorContext.InsertTextOption): void
    
    redo(option?: EditorContext.RedoOption): void
    
    removeFormat(option?: EditorContext.RemoveFormatOption): void
    
    scrollIntoView(): void
    
    setContents(option: EditorContext.SetContentsOption): void
    
    undo(option?: EditorContext.UndoOption): void
  }

  namespace EditorContext {
    interface BlurOption {
      
      
      
    }
    interface ClearOption {
      
      
      
    }
    interface GetContentsOption {
      
      
      
    }
    namespace getSelectionText {
      interface Option {
        
        
        
      }
      interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
        
        text: string
      }
    }
    interface InsertDividerOption {
      
      
      
    }
    interface InsertImageOption {
      
      src: string
      
      nowrap?: boolean
      
      alt?: string
      
      
      data?: NebulaGeneral.IAnyObject
      
      extClass?: string
      
      
      height?: string
      
      
      width?: string
    }
    interface InsertTextOption {
      
      
      
      
      text?: string
    }
    interface RedoOption {
      
      
      
    }
    interface RemoveFormatOption {
      
      
      
    }
    interface SetContentsOption {
      
      
      delta?: NebulaGeneral.IAnyObject
      
      
      html?: string
      
    }
    interface UndoOption {
      
      
      
    }
  }
}
