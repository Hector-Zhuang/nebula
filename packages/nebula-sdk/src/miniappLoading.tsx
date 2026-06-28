import { AppRegistry } from 'react-native';
import { NEBULA_INTERNAL_MINIAPP_LOADING_MODULE } from './nebulaNative';
import type {
  InstalledMiniAppInfo,
  MiniappLoadingResolveContext,
  MiniappLoadingResolvedProps,
  MiniappLoadingStatus,
} from './nebulaTypes';
import { createElement, useEffect, useState } from 'react';

type MiniappLoadingState = {
  appId: string | null;
  mode: 'development' | 'production';
  status: MiniappLoadingStatus;
  title?: string | null;
  iconUrl?: string | null;
  installedInfo?: InstalledMiniAppInfo | null;
  errorMessage?: string | null;
  visible: boolean;
};

let miniappLoadingDelayMs = 0;

let internalMiniappLoadingRegistered = false;
let miniappLoadingComponent: React.ComponentType<MiniappLoadingResolveContext> | null =
  null;
let miniappLoadingResolveProps:
  | ((context: MiniappLoadingResolveContext) => MiniappLoadingResolvedProps)
  | null = null;

let miniappLoadingState: MiniappLoadingState = {
  appId: null,
  mode: 'production',
  status: 'loading',
  title: null,
  iconUrl: null,
  installedInfo: null,
  errorMessage: null,
  visible: false,
};

const miniappLoadingListeners = new Set<() => void>();

function emitMiniappLoadingState() {
  miniappLoadingListeners.forEach(listener => listener());
}

export function configureMiniappLoadingComponent(
  component: React.ComponentType<MiniappLoadingResolveContext> | null,
  resolveProps?:
    | ((context: MiniappLoadingResolveContext) => MiniappLoadingResolvedProps)
    | null,
  delayMs?: number | null,
) {
  miniappLoadingComponent = component;
  miniappLoadingResolveProps = resolveProps ?? null;
  miniappLoadingDelayMs =
    typeof delayMs === 'number' && Number.isFinite(delayMs)
      ? Math.max(0, Math.round(delayMs))
      : 0;
}

export function setMiniappLoadingState(
  nextState: Partial<MiniappLoadingState>,
) {
  miniappLoadingState = {
    ...miniappLoadingState,
    ...nextState,
  };
  emitMiniappLoadingState();
}

const EXIT_ANIMATION_DURATION_MS = 300;

export function hideMiniappLoading(appId?: string | null) {
  if (
    appId &&
    miniappLoadingState.appId &&
    miniappLoadingState.appId !== appId
  ) {
    return;
  }

  setMiniappLoadingState({
    status: 'ready',
    errorMessage: null,
  });

  setTimeout(() => {
    setMiniappLoadingState({
      visible: false,
      title: null,
      iconUrl: null,
      installedInfo: null,
    });
  }, EXIT_ANIMATION_DURATION_MS);
}

export function getMiniappLoadingDelayMs() {
  return miniappLoadingDelayMs;
}

export function ensureInternalMiniappLoadingComponentRegistered() {
  if (internalMiniappLoadingRegistered) {
    return;
  }

  AppRegistry.registerComponent(NEBULA_INTERNAL_MINIAPP_LOADING_MODULE, () => {
    const NebulaInternalMiniappLoading = () => {
      const [, forceUpdate] = useState(0);

      useEffect(() => {
        const listener = () => forceUpdate(value => value + 1);
        miniappLoadingListeners.add(listener);
        return () => {
          miniappLoadingListeners.delete(listener);
        };
      }, []);

      if (!miniappLoadingState.visible || !miniappLoadingState.appId) {
        return null;
      }

      const Component = miniappLoadingComponent;
      if (!Component) {
        return null;
      }

      const resolvedProps = miniappLoadingResolveProps
        ? miniappLoadingResolveProps({
            appId: miniappLoadingState.appId,
            mode: miniappLoadingState.mode,
            status: miniappLoadingState.status,
            title: miniappLoadingState.title,
            iconUrl: miniappLoadingState.iconUrl,
            errorMessage: miniappLoadingState.errorMessage,
            installedInfo: miniappLoadingState.installedInfo,
          })
        : null;

      return createElement(Component, {
        appId: miniappLoadingState.appId,
        mode: miniappLoadingState.mode,
        status: miniappLoadingState.status,
        title: resolvedProps?.title ?? miniappLoadingState.title,
        iconUrl: resolvedProps?.iconUrl ?? miniappLoadingState.iconUrl,
        errorMessage: miniappLoadingState.errorMessage,
        installedInfo: miniappLoadingState.installedInfo,
      });
    };

    return NebulaInternalMiniappLoading;
  });

  internalMiniappLoadingRegistered = true;
}
