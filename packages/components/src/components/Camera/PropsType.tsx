import { CameraProps as _CameraProps } from '../types'

export interface CameraState {
  hasPermission: boolean | null
}   

export interface CameraProps extends _CameraProps {
  ratio?: string
}