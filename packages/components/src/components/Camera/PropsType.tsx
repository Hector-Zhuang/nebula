import { ReactNode } from 'react'

type CommonEventFunction<T = any> = (event: { detail: T }) => void

export interface CameraProps {
  id?: string
  className?: string
  style?: string | Record<string, unknown>
  children?: ReactNode
  mode?: 'normal' | 'scanCode'
  resolution?: 'low' | 'medium' | 'high'
  devicePosition?: 'front' | 'back'
  flash?: 'auto' | 'on' | 'off' | 'torch'
  frameSize?: 'small' | 'medium' | 'large'
  outputDimension?: '360P' | '540P' | '720P' | '1080P' | 'max'
  onStop?: CommonEventFunction
  onError?: CommonEventFunction
  onInitDone?: CommonEventFunction<CameraProps.onInitDoneEventDetail>
  onReady?: CommonEventFunction<CameraProps.onInitDoneEventDetail>
  onScanCode?: CommonEventFunction<CameraProps.onScanCodeEventDetail>
  ratio?: string
}

export namespace CameraProps {
  export interface onInitDoneEventDetail {
    maxZoom: number
  }

  export interface onScanCodeEventDetail {
    charSet: string
    rawData: string
    type: string
    result: string
    fullResult: string
  }
}

export interface CameraState {
  hasPermission: boolean | null
}