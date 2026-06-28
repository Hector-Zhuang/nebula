import React, { useContext, useEffect, useRef } from 'react';
import { PAGE_RESERVED_PROP_KEYS } from './nebulaNative';
import { Miniapp } from './miniappRuntime';
import type {
  MiniAppPageContextValue,
  PageLifecycleEvent,
} from './nebulaTypes';

const MiniAppPageContext = React.createContext<MiniAppPageContextValue | null>(
  null,
);

function extractPageParams(
  props: Record<string, unknown>,
): Record<string, unknown> {
  const params: Record<string, unknown> = {};

  for (const key in props) {
    if (
      Object.prototype.hasOwnProperty.call(props, key) &&
      !PAGE_RESERVED_PROP_KEYS.has(key)
    ) {
      params[key] = props[key];
    }
  }

  return params;
}

function usePageLifecycleSubscription(
  eventType: PageLifecycleEvent['type'],
  callback: () => void,
): void {
  const pageContext = useContext(MiniAppPageContext);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!pageContext?.instanceId) {
      return;
    }
    return Miniapp.onPageLifecycle(event => {
      if (
        event.type === eventType &&
        event.instanceId === pageContext.instanceId
      ) {
        callbackRef.current();
      }
    });
  }, [eventType, pageContext?.instanceId]);
}

export function createMiniAppPage<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
): React.ComponentType<P> {
  return function NebulaMiniAppPage(props: P) {
    const appId =
      typeof props.appId === 'string' && props.appId.length > 0
        ? props.appId
        : null;

    useEffect(() => {
      Miniapp.bootstrap(appId);
    }, [appId]);

    const pageContext: MiniAppPageContextValue = {
      appId,
      instanceId:
        typeof props.instanceId === 'string' && props.instanceId.length > 0
          ? props.instanceId
          : null,
      params: extractPageParams(props),
      routePath:
        typeof props.__routePath === 'string' ? props.__routePath : '/',
      routeUrl: typeof props.__routeUrl === 'string' ? props.__routeUrl : '',
      pageStyle:
        props.__pageConfig &&
        typeof props.__pageConfig === 'object' &&
        !Array.isArray(props.__pageConfig)
          ? (props.__pageConfig as Record<string, unknown>)
          : {},
    };

    return React.createElement(
      MiniAppPageContext.Provider,
      { value: pageContext },
      React.createElement(Component, props),
    );
  };
}

export function usePageOnLoad(
  callback: (params: Record<string, unknown>) => void,
): void {
  const pageContext = useContext(MiniAppPageContext);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    callbackRef.current(pageContext?.params ?? {});
  }, [pageContext?.instanceId]);
}

export function usePageOnShow(callback: () => void): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    callbackRef.current();
  }, []);

  usePageLifecycleSubscription('show', callback);
}

export function usePageOnReady(callback: () => void): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      callbackRef.current();
    });
    return () => cancelAnimationFrame(frame);
  }, []);
}

export function usePageOnHide(callback: () => void): void {
  usePageLifecycleSubscription('hide', callback);
}

export function usePageOnUnload(callback: () => void): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    return () => {
      callbackRef.current();
    };
  }, []);
}
