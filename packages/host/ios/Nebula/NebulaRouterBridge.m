//
//  NebulaRouterBridge.m
//  SuperApp - Nebula Mini-App Container
//
//  Objective-C bridge for NebulaRouterModule
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NebulaRouterModule, NSObject)

RCT_EXTERN_METHOD(navigateTo:(NSString *)url
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(navigateBack:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

@end
