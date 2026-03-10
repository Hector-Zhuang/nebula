//
//  NebulaNativeModuleBridge.m
//  SuperApp - Nebula Mini-App Container
//
//  Objective-C bridge for NebulaNativeModule
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(NebulaNativeModule, RCTEventEmitter)

RCT_EXTERN_METHOD(openMiniApp:(NSString *)appId
                  initialProps:(NSDictionary *)initialProps
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(preloadMiniApp:(NSString *)appId
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(preloadMiniAppWithMode:(NSString *)appId
                  bundleURL:(NSString *)bundleURL
                  mode:(NSString *)mode
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(installMiniApp:(NSString *)appId
                  bundleURL:(NSString *)bundleURL
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(installMiniAppWithMode:(NSString *)appId
                  bundleURL:(NSString *)bundleURL
                  mode:(NSString *)mode
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(registerRoutes:(NSString *)appId
                  routes:(NSDictionary *)routes
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(postMessageToHost:(NSString *)appId
                  message:(NSDictionary *)message
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(postMessageToMiniApp:(NSString *)appId
                  message:(NSDictionary *)message
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(getInstalledMiniApps:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(navigateTo:(NSString *)appId
                  url:(NSString *)url
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(redirectTo:(NSString *)appId
                  url:(NSString *)url
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(reLaunch:(NSString *)appId
                  url:(NSString *)url
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(navigateBack:(NSString *)appId
                  delta:(NSInteger)delta
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(showToast:(NSString *)title
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(getDeviceInfo)

@end
