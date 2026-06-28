export type RuntimeManifest = {
  appId: string;
  bundlePath: string;
  bundleEntryFile?: string;
  entryPagePath: string;
  pageConfigs?: Record<string, unknown>;
  pages?: Record<string, string>;
  updateStrategy?: 'auto' | 'manual';
  version: string;
  window?: {
    navigationBarTitleText?: string;
    navigationBarBackgroundColor?: string;
    navigationBarTextColor?: string;
    backgroundColor?: string;
  };
};

export type RunnerLoadedState = {
  manifest: RuntimeManifest;
  serviceOnline: boolean;
  status: string;
};

export type RunnerHistoryItem = {
  appId: string;
  baseUrl: string;
  bundleUrl?: string | null;
  manifestUrl?: string | null;
  title: string;
  version: string;
};
