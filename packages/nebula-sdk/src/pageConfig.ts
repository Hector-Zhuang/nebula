export type MiniAppPageConfig = {
  route?: string;
  backgroundColor?: string;
  navigationBarBackgroundColor?: string;
  navigationBarTextColor?: string;
  navigationBarTitleText?: string;
  navigationStyle?: 'default' | 'custom';
  visualEffectInBackground?: 'blur' | 'none';
};

export function definePageConfig<T extends MiniAppPageConfig>(config: T): T {
  return config;
}
