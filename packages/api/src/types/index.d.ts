

/// <reference path="global.d.ts" />

/// <reference path="nebula.api.d.ts" />
/// <reference path="nebula.component.d.ts" />
/// <reference path="nebula.config.d.ts" />
/// <reference path="nebula.lifecycle.d.ts" />
/// <reference path="nebula.runtime.d.ts" />

/// <reference types="@tarojs/plugin-platform-alipay/types/shims-alipay" />
/// <reference types="@tarojs/plugin-platform-jd/types/shims-jd" />
/// <reference types="@tarojs/plugin-platform-swan/types/shims-swan" />
/// <reference types="@tarojs/plugin-platform-tt/types/shims-tt" />
/// <reference types="@tarojs/plugin-platform-weapp/types/shims-weapp" />
/// <reference types="@tarojs/taro-h5/types/overlay" />
/// <reference types="@tarojs/taro-rn/types/overlay" />

export = Nebula
export as namespace Nebula

declare const Nebula: Nebula.NebulaStatic

declare namespace Nebula {
  interface NebulaStatic {}
}
declare global {
  const defineAppConfig: (config: Nebula.AppConfig) => Nebula.AppConfig
  const definePageConfig: (config: Nebula.PageConfig) => Nebula.Config
  const importNativeComponent: <T> (path: string, name = '', exportName = 'default') => Awaited<T>
}
