//
//  NebulaNativeModuleBridge.m
//  SuperApp - Nebula Mini-App Container
//
//  Objective-C bridge for NebulaNativeModule
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NebulaNativeModule, NSObject)

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

RCT_EXTERN_METHOD(getInstalledMiniApps:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(installJSI:(NSString *)appId)

@end
