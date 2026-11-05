import type { NebulaPageStyle } from './specs/NativeNebulaModule';

export type MiniAppPageConfig = {
  route?: string;
  backgroundColor?: string;
  navigationBarBackgroundColor?: string;
  navigationBarTextColor?: string;
  navigationBarTitleText?: string;
  navigationStyle?: 'default' | 'custom';
  visualEffectInBackground?: 'blur' | 'none';
};

export type ResolvedMiniAppPageConfig = Omit<
  NebulaPageStyle,
  'navigationStyle' | 'visualEffectInBackground'
> & {
  navigationStyle: 'default' | 'custom';
  visualEffectInBackground: 'blur' | 'none';
};

/**
 * Resolves a page config into the page style consumed by the mini-app page,
 * applying the SDK defaults and dropping manifest-only keys such as `route`.
 * The host may deliver `__pageConfig` as an untyped bridge value, so anything
 * that is not a plain object resolves to the defaults.
 */
export function resolvePageConfig(
  config?: MiniAppPageConfig | null,
): ResolvedMiniAppPageConfig {
  const source: Partial<MiniAppPageConfig> =
    config && typeof config === 'object' && !Array.isArray(config)
      ? config
      : {};

  return {
    backgroundColor: source.backgroundColor,
    navigationBarBackgroundColor: source.navigationBarBackgroundColor,
    navigationBarTextColor: source.navigationBarTextColor,
    navigationBarTitleText: source.navigationBarTitleText,
    navigationStyle: source.navigationStyle ?? 'default',
    visualEffectInBackground: source.visualEffectInBackground ?? 'none',
  };
}

export function definePageConfig<T extends MiniAppPageConfig>(config: T): T {
  return config;
}
