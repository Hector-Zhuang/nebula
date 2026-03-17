import Nebula from '../../index'

declare module '../../index' {
  namespace createAnimation {
    interface Option {
      
      duration?: number
      
      timingFunction?: keyof TimingFunction
      
      delay?: number
      /** @default "50% 50% 0" */
      transformOrigin?: string
      
      unit?: string
    }
    interface TimingFunction {
      
      linear
      
      ease
      
      'ease-in'
      
      'ease-in-out'
      
      'ease-out'
      
      'step-start'
      
      'step-end'
    }
  }

  
  interface Animation {
    
    export(): {
      actions: NebulaGeneral.IAnyObject[]
    }
    
    step(option?: Animation.StepOption): Animation
    
    matrix(a: number, b: number, c: number, d: number, tx: number, ty: number): Animation
    
    matrix3d(a1: number, b1: number, c1: number, d1: number, a2: number, b2: number, c2: number, d2: number, a3: number, b3: number, c3: number, d3: number, a4: number, b4: number, c4: number, d4: number): Animation
    
    rotate(
      
      angle: number,
    ): Animation
    
    rotate3d(
      
      x: number,
      
      y?: number,
      
      z?: number,
      
      angle?: number,
    ): Animation
    
    rotateX(
      
      angle: number,
    ): Animation
    
    rotateY(
      
      angle: number,
    ): Animation
    
    rotateZ(
      
      angle: number,
    ): Animation
    
    scale(
      
      sx: number,
      
      sy?: number,
    ): Animation
    
    scale3d(
      
      sx: number,
      
      sy: number,
      
      sz: number,
    ): Animation
    
    scaleX(
      
      scale: number,
    ): Animation
    
    scaleY(
      
      scale: number,
    ): Animation
    
    scaleZ(
      
      scale: number,
    ): Animation
    
    skew(
      
      ax: number,
      
      ay: number,
    ): Animation
    
    skewX(
      
      angle: number,
    ): Animation
    
    skewY(
      
      angle: number,
    ): Animation
    
    translate(
      
      tx?: number,
      
      ty?: number,
    ): Animation
    
    translate3d(
      
      tx?: number,
      
      ty?: number,
      
      tz?: number,
    ): Animation
    
    translateX(
      
      translation: number,
    ): Animation
    
    translateY(
      
      translation: number,
    ): Animation
    
    translateZ(
      
      translation: number,
    ): Animation
    
    opacity(
      
      value: number,
    ): Animation
    
    backgroundColor(
      
      value: string,
    ): Animation
    
    width(
      
      value: number | string,
    ): Animation
    
    height(
      
      value: number | string,
    ): Animation
    
    left(
      
      value: number | string,
    ): Animation
    
    right(
      
      value: number | string,
    ): Animation
    
    top(
      
      value: number | string,
    ): Animation
    
    bottom(
      
      value: number | string,
    ): Animation
  }

  namespace Animation {
    interface StepOption {
      
      delay?: number
      
      duration?: number
      
      timingFunction?: keyof TimingFunction
      transformOrigin?: string
    }
    interface TimingFunction {
      
      linear
      
      ease
      
      'ease-in'
      
      'ease-in-out'
      
      'ease-out'
      
      'step-start'
      
      'step-end'
    }
  }

  /** @ignore */
  interface KeyFrame {
    
    offset?: number
    
    ease?: string
    
    transformOrigin?: string
    
    backgroundColor?: string
    
    bottom?: number | string
    
    height?: number | string
    
    left?: number | string
    
    width?: number | string
    
    opacity?: number | string
    
    right?: number | string
    
    top?: number | string
    
    matrix?: number[]
    
    matrix3d?: number[]
    
    rotate?: number
    
    rotate3d?: number[]
    
    rotateX?: number
    
    rotateY?: number
    
    rotateZ?: number
    
    scale?: number[]
    
    scale3d?: number[]
    
    scaleX?: number
    
    scaleY?: number
    
    scaleZ?: number
    
    skew?: number[]
    
    skewX?: number
    
    skewY?: number
    
    translate?: Array<number | string>
    
    translate3d?: Array<number | string>
    
    translateX?: number | string
    
    translateY?: number | string
    
    translateZ?: number | string
    composite?: 'replace' | 'add' | 'accumulate' | 'auto'
    easing?: string
    [property: string]: any
  }

  /** @ignore */
  type ClearAnimationOptions = Record<keyof KeyFrame, boolean>

  /** @ignore */
  interface ScrollTimelineOption {
    
    scrollSource: string
    
    orientation?: string
    
    startScrollOffset: number
    
    endScrollOffset: number
    
    timeRange: number
  }

  interface NebulaStatic {
    
    createAnimation(option: createAnimation.Option): Animation
  }
}
