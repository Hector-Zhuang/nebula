import Nebula from '../../index'

declare module '../../index' {
  namespace canvasToTempFilePath {
    interface Option {
      
      canvas?: Canvas
      
      canvasId?: string
      
      quality?: number
      
      
      destHeight?: number
      
      destWidth?: number
      
      
      fileType?: keyof FileType
      
      height?: number
      
      
      width?: number
      
      x?: number
      
      y?: number
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      tempFilePath: string
      
      apFilePath?: string
      
      errMsg: string
    }
    interface FileType {
      
      jpg
      
      png
    }
    interface CanvasProps {
      
      type?: string
      
      canvasId?: string
      
      disableScroll?: boolean
      
      onTouchStart?: NebulaGeneral.CommonEventFunction
      
      onTouchMove?: NebulaGeneral.CommonEventFunction
      
      onTouchEnd?: NebulaGeneral.CommonEventFunction
      
      onTouchCancel?: NebulaGeneral.CommonEventFunction
      
      onLongTap?: NebulaGeneral.CommonEventFunction
      
      onError?: NebulaGeneral.CommonEventFunction<CanvasProps.onErrorEventDetail>
    }

    namespace CanvasProps {
      interface onErrorEventDetail {
        errMsg: string
      }
    }
  }
  namespace canvasPutImageData {
    interface Option {
      
      canvasId: string
      
      data: Uint8ClampedArray
      
      height: number
      
      width: number
      
      x: number
      
      y: number
      
      
      
    }
  }
  namespace canvasGetImageData {
    interface Option {
      
      canvasId: string
      
      height: number
      
      width: number
      
      x: number
      
      y: number
      
      
      
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      data: Uint8ClampedArray
      
      height: number
      
      width: number
      
      errMsg: string
    }
  }

  namespace createOffscreenCanvas {
    interface Option {
      
      type?: 'webgl' | '2d'
      
      height?: number
      
      width?: number
      
      compInst?: NebulaGeneral.IAnyObject,
    }
  }

  namespace toTempFilePath {
    interface Option {
      
      x?: number
      
      y?: number
      
      width?: number
      
      height?: number
      
      destHeight?: number
      
      destWidth?: number
      
      fileType?: keyof FileType
      
      quality?: number
      
      
      
    }
    interface FileType {
      
      jpg
      
      png
    }
    interface SuccessCallbackResult extends NebulaGeneral.CallbackResult {
      
      tempFilePath: string
    }
  }

  
  interface Canvas {
    
    height: number
    
    width: number
    
    cancelAnimationFrame(requestID: number): void
    
    createImageData(): ImageData
    
    createImage(): Image
    
    createPath2D(
      path: Path2D
    ): Path2D
    
    getContext(contextType: string): RenderingContext
    
    requestAnimationFrame(
      
      callback: (...args: any[]) => any,
    ): number
    
    toDataURL(
      
      type: string,
      
      encoderOptions: number
    ): string
    
    toTempFilePath(oprion: toTempFilePath.Option): void
  }

  
  interface CanvasContext {
    
    fillStyle: string
    
    strokeStyle: string
    
    shadowOffsetX: number
    
    shadowOffsetY: number
    
    shadowBlur: number
    
    shadowColor: string
    
    lineWidth: number
    
    lineCap: keyof CanvasContext.LineCap
    
    lineJoin: keyof CanvasContext.LineJoin
    
    miterLimit: number
    
    lineDashOffset: number
    
    font: string
    
    globalAlpha: number
    
    globalCompositeOperation: string
    
    arc(
      
      x: number,
      
      y: number,
      
      r: number,
      
      sAngle: number,
      
      eAngle: number,
      
      counterclockwise?: boolean,
      
      anticlockwise?: boolean
    ): void
    
    arcTo(
      
      x1: number,
      
      y1: number,
      
      x2: number,
      
      y2: number,
      
      radius: number,
    ): void
    
    beginPath(): void
    
    bezierCurveTo(
      
      cp1x: number,
      
      cp1y: number,
      
      cp2x: number,
      
      cp2y: number,
      
      x: number,
      
      y: number,
    ): void
    
    clearRect(
      
      x: number,
      
      y: number,
      
      width: number,
      
      height: number,
    ): void
    
    clip(): void
    
    closePath(): void
    
    createCircularGradient(
      
      x: number,
      
      y: number,
      
      r: number,
    ): CanvasGradient
    
    createLinearGradient(
      
      x0: number,
      
      y0: number,
      
      x1: number,
      
      y1: number,
    ): CanvasGradient
    
    createPattern(
      
      image: string,
      
      repetition: keyof CanvasContext.Repetition,
    ): CanvasPattern | null | Promise<CanvasPattern | null>
    
    draw(
      
      reserve?: boolean,
      
      callback?: (...args: any[]) => any,
      
      useHardwareAccelerate?: boolean
    ): void | Promise<void>
    
    drawImage(
      
      imageResource: string,
      
      dx: number,
      
      dy: number,
    ): void
    
    drawImage(
      
      imageResource: string,
      
      dx: number,
      
      dy: number,
      
      dWidth: number,
      
      dHeight: number,
    ): void
    
    drawImage(
      
      imageResource: string,
      
      sx: number,
      
      sy: number,
      
      sWidth: number,
      
      sHeight: number,
      
      dx: number,
      
      dy: number,
      
      dWidth: number,
      
      dHeight: number,
    ): void
    
    fill(): void
    
    fillRect(
      
      x: number,
      
      y: number,
      
      width: number,
      
      height: number,
    ): void
    
    fillText(
      
      text: string,
      
      x: number,
      
      y: number,
      
      maxWidth?: number,
    ): void
    
    lineTo(
      
      x: number,
      
      y: number,
    ): void
    
    measureText(
      
      text: string,
    ): TextMetrics
    
    moveTo(
      
      x: number,
      
      y: number,
    ): void
    
    quadraticCurveTo(
      
      cpx: number,
      
      cpy: number,
      
      x: number,
      
      y: number,
    ): void
    
    rect(
      
      x: number,
      
      y: number,
      
      width: number,
      
      height: number,
    ): void
    
    reset(): void
    
    restore(): void
    
    rotate(
      
      rotate: number,
    ): void
    
    save(): void
    
    scale(
      
      scaleWidth: number,
      
      scaleHeight: number,
    ): void
    
    setFillStyle(
      
      color: string | CanvasGradient,
    ): void
    
    setFontSize(
      
      fontSize: number,
    ): void
    
    setGlobalAlpha(
      
      alpha: number,
    ): void
    
    setLineCap(
      
      lineCap: keyof CanvasContext.LineCap,
    ): void
    
    setLineDash(
      
      pattern: number[],
      
      offset: number,
    ): void
    
    setLineJoin(
      
      lineJoin: keyof CanvasContext.LineJoin,
    ): void
    
    setLineWidth(
      
      lineWidth: number,
    ): void
    
    setMiterLimit(
      
      miterLimit: number,
    ): void
    
    setShadow(
      
      offsetX: number,
      
      offsetY: number,
      
      blur: number,
      
      color: string,
    ): void
    
    setStrokeStyle(
      
      color: string | CanvasGradient,
    ): void
    
    setTextAlign(
      
      align: keyof CanvasContext.Align,
    ): void
    
    setTextBaseline(
      
      textBaseline: keyof CanvasContext.TextBaseline,
    ): void
    
    setTransform(
      
      scaleX: number,
      
      skewX: number,
      
      skewY: number,
      
      scaleY: number,
      
      translateX: number,
      
      translateY: number,
    ): void
    
    setTransform(
      
      scaleX: number,
      
      skewY: number,
      
      skewX: number,
      
      scaleY: number,
      
      translateX: number,
      
      translateY: number,
    ): void
     
     setTransform(
      
      scaleX: number,
      
      scaleY: number,
      
      skewX: number,
      
      skewY: number,
      
      translateX: number,
      
      translateY: number,
    ): void
    
    stroke(): void
    
    strokeRect(
      
      x: number,
      
      y: number,
      
      width: number,
      
      height: number,
    ): void
    
    strokeText(
      
      text: string,
      
      x: number,
      
      y: number,
      
      maxWidth?: number,
    ): void
    
    transform(
      
      scaleX: number,
      
      skewX: number,
      
      skewY: number,
      
      scaleY: number,
      
      translateX: number,
      
      translateY: number,
    ): void
    
    transform(
      
      scaleX: number,
      
      skewY: number,
      
      skewX: number,
      
      scaleY: number,
      
      translateX: number,
      
      translateY: number,
    ): void
    
    transform(
      
      scaleX: number,
      
      scaleY: number,
      
      skewX: number,
      
      skewY: number,
      
      translateX: number,
      
      translateY: number,
    ): void
    
    translate(
      
      x: number,
      
      y: number,
    ): void
  }
  namespace CanvasContext {
    
    interface Repetition {
      
      'repeat'
      
      'repeat-x'
      
      'repeat-y'
      
      'no-repeat'
    }

    
    interface LineCap {
      
      butt
      
      round
      
      square
    }
    
    interface LineJoin {
      
      bevel
      
      round
      
      miter
    }
    
    interface Align {
      
      left
      
      center
      
      right
    }
      
    interface TextBaseline {
      
      top
      
      bottom
      
      middle
      /**
       * @supported weapp, alipay, swan, jd, qq, tt, h5
       */
      normal
      
      hanging
      
      alphabetic
      
      ideographic
    }
  }

  
  interface CanvasGradient {
    
    addColorStop(
      
      stop: number,
      
      color: string,
    ): void
  }

  
  interface Color {}

  
  interface Image {
    
    src: string
    
    height: number
    
    width: number
    
    referrerPolicy: string
    
    onerror: (...args: any[]) => any
    
    onload: (...args: any[]) => any
  }

  
  interface ImageData {
    
    width: number
    
    height: number
    
    data: Uint8ClampedArray
  }

  
  interface OffscreenCanvas {
    
    width: number
    
    height: number
    
    createImage(): Image
    
    getContext(contextType: 'webgl' | '2d'): RenderingContext
  }

  
  interface Path2D {
    
    addPath(
      
      path: Path2D
    ): void
    
    arc(
      
      x: number,
      
      y: number,
      
      radius: number,
      
      startAngle: number,
      
      endAngle: number,
      
      counterclockwise: boolean
    ): void
    
    arcTo(
      
      x1: number,
      
      y1: number,
      
      x2: number,
      
      y2: number,
      
      radius: number
    ): void
    
    bezierCurveTo(
      
      cp1x: number,
      
      cp1y: number,
      
      cp2x: number,
      
      cp2y: number,
      
      x: number,
      
      y: number
    ): void
    
    closePath(): void
    
    ellipse(
      
      x: number,
      
      y: number,
      
      radiusX: number,
      
      radiusY: number,
      
      rotation: number,
      
      startAngle: number,
      
      endAngle: number,
      
      counterclockwise: boolean
    ): void
    
    lineTo(
      
      x: number,
      
      y: number
    ): void
    
    moveTo(
      
      x: number,
      
      y: number
    ): void
    
    quadraticCurveTo(
      
      cpx: number,
      
      cpy: number,
      
      x: number,
      
      y: number
    ): void
    
    rect(
      
      x: number,
      
      y: number,
      
      width: number,
      
      height: number
    ): void
  }

  
  interface RenderingContext {}

  interface NebulaStatic {
    
    createOffscreenCanvas(options: createOffscreenCanvas.Option): OffscreenCanvas

    
    createCanvasContext(
      
      canvasId: string,
      
      component?: NebulaGeneral.IAnyObject,
    ): CanvasContext

    
    canvasToTempFilePath(
      option: canvasToTempFilePath.Option,
      
      component?: NebulaGeneral.IAnyObject,
    ): Promise<canvasToTempFilePath.SuccessCallbackResult>

    
    canvasPutImageData(
      option: canvasPutImageData.Option,
      
      component?: NebulaGeneral.IAnyObject,
    ): Promise<NebulaGeneral.CallbackResult>

    
    canvasGetImageData(
      option: canvasGetImageData.Option,
      
      component?: NebulaGeneral.IAnyObject,
    ): Promise<canvasGetImageData.SuccessCallbackResult>
  }
}
