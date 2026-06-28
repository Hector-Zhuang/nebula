//
//  NebulaNativeModuleBridge.m
//  SuperApp - Nebula Mini-App Container
//
//  Objective-C bridge for NebulaNativeModule
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTViewManager.h>
#import <React/UIView+React.h>
#import <objc/message.h>
#import <objc/runtime.h>
#import <UIKit/UIKit.h>

#if RCT_DEV_MENU
#import <React/RCTConvert.h>
#import <React/RCTDevLoadingView.h>
#import <React/RCTJavaScriptLoader.h>

static void NebulaSwizzleInstanceMethod(Class cls, SEL originalSelector, SEL swizzledSelector)
{
  Method originalMethod = class_getInstanceMethod(cls, originalSelector);
  Method swizzledMethod = class_getInstanceMethod(cls, swizzledSelector);
  
  if (originalMethod == NULL || swizzledMethod == NULL) {
    return;
  }
  
  BOOL added = class_addMethod(
                               cls,
                               originalSelector,
                               method_getImplementation(swizzledMethod),
                               method_getTypeEncoding(swizzledMethod));
  if (added) {
    class_replaceMethod(
                        cls,
                        swizzledSelector,
                        method_getImplementation(originalMethod),
                        method_getTypeEncoding(originalMethod));
  } else {
    method_exchangeImplementations(originalMethod, swizzledMethod);
  }
}

static id NebulaSharedDevLoadingPresenter(void)
{
  Class presenterClass = NSClassFromString(@"NebulaDevLoadingPresenter");
  if (presenterClass == Nil) {
    NSString *moduleName = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleName"];
    if (moduleName.length > 0) {
      presenterClass = NSClassFromString([NSString stringWithFormat:@"%@.%@", moduleName, @"NebulaDevLoadingPresenter"]);
    }
  }
  if (presenterClass == Nil) {
    NSString *executableName = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleExecutable"];
    if (executableName.length > 0) {
      presenterClass = NSClassFromString([NSString stringWithFormat:@"%@.%@", executableName, @"NebulaDevLoadingPresenter"]);
    }
  }
  if (presenterClass == Nil) {
    return nil;
  }
  
  SEL sharedSelector = NSSelectorFromString(@"shared");
  if (![presenterClass respondsToSelector:sharedSelector]) {
    return nil;
  }
  
  return ((id(*)(id, SEL))objc_msgSend)(presenterClass, sharedSelector);
}

static void NebulaShowDevLoading(
                                 NSString *title,
                                 NSString *message,
                                 NSNumber *progress,
                                 UIColor *titleColor,
                                 UIColor *messageColor,
                                 UIColor *backgroundColor,
                                 BOOL dismissButton)
{
  id presenter = NebulaSharedDevLoadingPresenter();
  SEL selector = NSSelectorFromString(@"showWithTitle:message:progress:titleColor:messageColor:backgroundColor:dismissButton:");
  if (presenter == nil || ![presenter respondsToSelector:selector]) {
    return;
  }
  
  ((void(*)(id, SEL, NSString *, NSString *, NSNumber *, UIColor *, UIColor *, UIColor *, BOOL))objc_msgSend)(
                                                                                                              presenter,
                                                                                                              selector,
                                                                                                              title,
                                                                                                              message,
                                                                                                              progress,
                                                                                                              titleColor,
                                                                                                              messageColor,
                                                                                                              backgroundColor,
                                                                                                              dismissButton);
}

static void NebulaHideDevLoading(void)
{
  id presenter = NebulaSharedDevLoadingPresenter();
  SEL selector = NSSelectorFromString(@"hide");
  if (presenter == nil || ![presenter respondsToSelector:selector]) {
    return;
  }
  
  ((void(*)(id, SEL))objc_msgSend)(presenter, selector);
}

@interface RCTDevLoadingView (NebulaHook)
@end

@implementation RCTDevLoadingView (NebulaHook)

+ (void)load
{
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    NebulaSwizzleInstanceMethod(self, @selector(showWithURL:), @selector(nebula_showWithURL:));
    NebulaSwizzleInstanceMethod(self, @selector(updateProgress:), @selector(nebula_updateProgress:));
    NebulaSwizzleInstanceMethod(
        self,
        @selector(showMessage:color:backgroundColor:),
        @selector(nebula_showMessage:color:backgroundColor:));
    NebulaSwizzleInstanceMethod(self, @selector(hide), @selector(nebula_hide));
  });
}

- (void)nebula_showWithURL:(NSURL *)URL
{
  if (URL.fileURL) {
    NebulaHideDevLoading();
    return;
  }

  NebulaShowDevLoading(@"Nebula Bundling", @"Connecting to Metro…", nil, nil, nil, nil, NO);
}

- (void)nebula_updateProgress:(RCTLoadingProgress *)progress
{
  if (progress == nil) {
    return;
  }
  
  NSString *status = progress.status.length > 0 ? progress.status : @"Bundling";
  NSString *message = progress.description.length > 0 ? progress.description : status;
  
  CGFloat ratio = -1.0;
  NSInteger total = progress.total.integerValue;
  NSInteger done = progress.done.integerValue;
  if (total > 0) {
    ratio = MIN(MAX((CGFloat)done / (CGFloat)total, 0.0), 1.0);
  }
  
  NSNumber *progressValue = ratio >= 0.0 ? @(ratio) : nil;
  NebulaShowDevLoading(status, message, progressValue, nil, nil, nil, NO);
}

- (void)nebula_showMessage:(NSString *)message
                     color:(UIColor *)color
           backgroundColor:(UIColor *)backgroundColor
             dismissButton:(BOOL)dismissButton
{
  NSString *title = dismissButton ? @"Nebula Message" : @"Nebula Bundling";
  NSString *resolvedMessage = message.length > 0 ? message : @"Loading…";
  UIColor *resolvedTextColor = color ?: UIColor.labelColor;
  UIColor *resolvedBackgroundColor = backgroundColor ?: UIColor.systemBackgroundColor;
  NebulaShowDevLoading(
                       title,
                       resolvedMessage,
                       nil,
                       resolvedTextColor,
                       resolvedTextColor,
                       resolvedBackgroundColor,
                       dismissButton);
}

- (void)nebula_showMessage:(NSString *)message
                     color:(UIColor *)color
           backgroundColor:(UIColor *)backgroundColor
{
  NSString *resolvedMessage = message.length > 0 ? message : @"Loading…";
  UIColor *resolvedTextColor = color ?: UIColor.labelColor;
  UIColor *resolvedBackgroundColor = backgroundColor ?: UIColor.systemBackgroundColor;
  NebulaShowDevLoading(
                       @"Nebula Message",
                       resolvedMessage,
                       nil,
                       resolvedTextColor,
                       resolvedTextColor,
                       resolvedBackgroundColor,
                       false);
}

- (void)nebula_showMessage:(NSString *)message
                 withColor:(NSNumber *)color
       withBackgroundColor:(NSNumber *)backgroundColor
         withDismissButton:(NSNumber *)dismissButton
{
  NSString *title = dismissButton.boolValue ? @"Nebula Message" : @"Nebula Bundling";
  NSString *resolvedMessage = message.length > 0 ? message : @"Loading…";
  UIColor *resolvedTextColor =
      color != nil ? [RCTConvert UIColor:color] : UIColor.labelColor;
  UIColor *resolvedBackgroundColor =
      backgroundColor != nil ? [RCTConvert UIColor:backgroundColor] : UIColor.systemBackgroundColor;
  NebulaShowDevLoading(
      title,
      resolvedMessage,
      nil,
      resolvedTextColor,
      resolvedTextColor,
      resolvedBackgroundColor,
      dismissButton.boolValue);
}

- (void)nebula_hide
{
  NebulaHideDevLoading();
}

@end
#endif

@interface RCT_EXTERN_MODULE(NebulaNativeModule, RCTEventEmitter)

RCT_EXTERN_METHOD(openMiniApp:(NSString *)appId
                  initialProps:(NSDictionary *)initialProps
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(openMiniAppWithBundleURL:(NSString *)appId
                  bundleURL:(NSString *)bundleURL
                  connectToURLMetroServer:(BOOL)connectToURLMetroServer
                  initialProps:(NSDictionary *)initialProps
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(preloadMiniApp:(NSString *)appId
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(preloadMiniAppWithBundleURL:(NSString *)appId
                  bundleURL:(NSString *)bundleURL
                  connectToURLMetroServer:(BOOL)connectToURLMetroServer
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(installMiniApp:(NSString *)appId
                  bundleURL:(NSString *)bundleURL
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(installMiniAppWithBundleURL:(NSString *)appId
                  bundleURL:(NSString *)bundleURL
                  connectToURLMetroServer:(BOOL)connectToURLMetroServer
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(installMiniAppFromURLs:(NSString *)appId
                  bundleURL:(NSString *)bundleURL
                  manifestURL:(NSString *)manifestURL
                  assetsURL:(NSString *)assetsURL
                  connectToURLMetroServer:(BOOL)connectToURLMetroServer
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(closeMiniApp:(NSString *)appId
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(uninstallMiniApp:(NSString *)appId
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(registerRoutes:(NSString *)appId
                  routes:(NSDictionary *)routes
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(registerManifest:(NSString *)appId
                  manifest:(NSDictionary *)manifest
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

RCT_EXTERN_METHOD(getInstalledMiniAppInfo:(NSString *)appId
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(getServerBaseURL:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(setServerBaseURL:(NSString * _Nullable)serverBaseURL
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(setMiniappLoadingDelay:(NSNumber * _Nullable)delayMs
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(setMiniappLoadingEnterContentDelay:(NSNumber * _Nullable)delayMs
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(setMiniappLoadingEnabled:(BOOL)enabled
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(bringHostToFront:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(restoreMiniApp:(NSString * _Nullable)token
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(presentHostModal:(NSString *)moduleName
                  props:(NSDictionary *)props
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(dismissHostModal:(RCTPromiseResolveBlock)resolver
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

RCT_EXTERN_METHOD(setPageStyle:(NSString *)appId
                  style:(NSDictionary *)style
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(showToast:(NSString *)title
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(getDeviceInfo)

@end
