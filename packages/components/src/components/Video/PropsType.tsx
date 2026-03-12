import * as React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

type CommonEventFunction<T = any> = (event: { detail: T }) => void

export interface VideoProps {
  id?: string
  src: string
  duration?: number
  controls?: boolean
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  initialTime?: number
  objectFit?: 'contain' | 'fill' | 'cover'
  poster?: string
  showCenterPlayBtn?: boolean
  style?: any
  children?: React.ReactNode
  onLoad?: () => void
  onPlay?: CommonEventFunction
  onPause?: CommonEventFunction
  onEnded?: CommonEventFunction
  onError?: CommonEventFunction<{ errMsg: string }>
  onTimeUpdate?: CommonEventFunction<VideoProps.onTimeUpdateEventDetail>
  onFullscreenChange?: CommonEventFunction<VideoProps.onFullscreenChangeEventDetail>
  onLoadedMetaData?: CommonEventFunction<VideoProps.onLoadedMetaDataEventDetail>
}

export namespace VideoProps {
  export interface onTimeUpdateEventDetail {
    currentTime: number
    duration: number
  }

  export interface onFullscreenChangeEventDetail {
    direction: 'vertical' | 'horizontal'
    fullScreen: number | boolean
  }

  export interface onLoadedMetaDataEventDetail {
    width: number
    height: number
    duration: number
    durationMillis?: number
  }
}

export interface ViewProps {
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
}

export interface onFullscreenChangeEventDetail extends VideoProps.onFullscreenChangeEventDetail {
  fullscreenUpdate: 0 | 1 | 2 | 3
}

export interface ControlsProps {
  controls?: boolean
  currentTime?: number
  duration?: number
  isPlaying?: boolean
  pauseFunc?: () => void
  playFunc?: () => void
  seekFunc?: () => void
  showPlayBtn?: boolean
  showProgress?: boolean
}
