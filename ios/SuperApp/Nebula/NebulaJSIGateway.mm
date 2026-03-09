//
//  NebulaJSIGateway.mm
//  SuperApp - Nebula Mini-App Container
//
//  C++ JSI Gateway - Injects global __NebulaNativeInvoke object
//

#import "NebulaJSIGateway.h"
#import <React/RCTBridge+Private.h>
#import <React/RCTBridgeProxy.h>
#import <React/RCTUtils.h>
#import <React-RCTAppDelegate/RCTDefaultReactNativeFactoryDelegate.h>
#import <React-callinvoker/ReactCommon/CallInvoker.h>
#import <ReactCommon/RCTTurboModule.h>
#import <jsi/jsi.h>
#if __has_include("SuperApp-Swift.h")
#import "SuperApp-Swift.h"
#endif

using namespace facebook::jsi;
using namespace std;

@interface RCTBridgeProxy (JSIRuntime)
- (void *)runtime;
@end

@interface RCTBridgeProxy (RCTTurboModule)
- (std::shared_ptr<facebook::react::CallInvoker>)jsCallInvoker;
@end

@implementation NebulaJSIGateway {
    NSString *_appId;
    __weak id _runtimeCarrier;
    BOOL _installed;
}

static NSMutableDictionary<NSString *, NebulaJSIGateway *> *sGatewayRegistry;

+ (void)initialize {
    if (self == [NebulaJSIGateway class]) {
        sGatewayRegistry = [NSMutableDictionary new];
    }
}

RCT_EXPORT_MODULE(NebulaJSIGateway)

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (instancetype)initWithAppId:(NSString *)appId {
    if (self = [super init]) {
        _appId = appId;
    }
    return self;
}

- (void)setBridge:(RCTBridge *)bridge {
    [self setRuntimeCarrier:bridge];
}

- (void)setRuntimeCarrier:(id)carrier {
    _runtimeCarrier = carrier;
    [self installForCarrier:carrier];
}

+ (void)installBindingsForBridge:(RCTBridge *)bridge appId:(NSString *)appId {
    [NebulaJSIGateway installBindingsForCarrier:bridge appId:appId];
}

+ (void)installBindingsForCarrier:(id)carrier appId:(NSString *)appId {
    if (!carrier || appId.length == 0) {
        return;
    }

    NSString *key = [NSString stringWithFormat:@"%p::%@", carrier, appId];
    NebulaJSIGateway *gateway = sGatewayRegistry[key];
    if (!gateway) {
        gateway = [[NebulaJSIGateway alloc] initWithAppId:appId];
        sGatewayRegistry[key] = gateway;
    }

    [gateway setRuntimeCarrier:carrier];
}

+ (void *)runtimePointerFromCarrier:(id)carrier {
    if (!carrier) {
        NSLog(@"[Nebula] runtimePointerFromCarrier: carrier is nil");
        return nullptr;
    }

    if ([carrier isKindOfClass:[RCTBridge class]]) {
        RCTCxxBridge *cxxBridge = (RCTCxxBridge *)carrier;
        void *runtime = cxxBridge.runtime;
        NSLog(@"[Nebula] runtimePointerFromCarrier: got runtime %p from RCTCxxBridge", runtime);
        return runtime;
    }

    // For RCTBridgeProxy (NSProxy subclass), use string comparison
    NSString *className = NSStringFromClass([carrier class]);
    NSLog(@"[Nebula] runtimePointerFromCarrier: carrier class = %@", className);
    
    if ([className isEqualToString:@"RCTBridgeProxy"]) {
        @try {
            RCTBridgeProxy *bridgeProxy = (RCTBridgeProxy *)carrier;
            void *runtime = bridgeProxy.runtime;
            NSLog(@"[Nebula] runtimePointerFromCarrier: got runtime %p from RCTBridgeProxy", runtime);
            return runtime;
        } @catch (NSException *exception) {
            NSLog(@"[Nebula] runtimePointerFromCarrier: exception accessing bridgeProxy.runtime: %@", exception);
            return nullptr;
        }
    }

    NSLog(@"[Nebula] runtimePointerFromCarrier: unknown carrier class, returning nullptr");
    return nullptr;
}

+ (std::shared_ptr<facebook::react::CallInvoker>)callInvokerFromCarrier:(id)carrier {
    if (!carrier) {
        return nullptr;
    }

    SEL jsCallInvokerSelector = @selector(jsCallInvoker);
    if ([carrier respondsToSelector:jsCallInvokerSelector]) {
        typedef std::shared_ptr<facebook::react::CallInvoker> (*CallInvokerGetter)(id, SEL);
        CallInvokerGetter getter = (CallInvokerGetter)[carrier methodForSelector:jsCallInvokerSelector];
        if (getter) {
            return getter(carrier, jsCallInvokerSelector);
        }
    }

    return nullptr;
}

+ (void)runOnJSForCarrier:(id)carrier task:(std::function<void(Runtime &)>)task {
    if (!carrier) {
        NSLog(@"[Nebula] runOnJSForCarrier: carrier is nil");
        return;
    }

    auto callInvoker = [NebulaJSIGateway callInvokerFromCarrier:carrier];
    if (callInvoker) {
        __weak id weakCarrier = carrier;
        callInvoker->invokeAsync([weakCarrier, task = std::move(task)]() mutable {
            id strongCarrier = weakCarrier;
            if (!strongCarrier) {
                NSLog(@"[Nebula] runOnJSForCarrier: strongCarrier deallocated");
                return;
            }
            void *runtimePtr = [NebulaJSIGateway runtimePointerFromCarrier:strongCarrier];
            if (!runtimePtr) {
                NSLog(@"[Nebula] runOnJSForCarrier: runtimePtr is nil");
                return;
            }
            NSLog(@"[Nebula] runOnJSForCarrier: executing task with runtime %p", runtimePtr);
            @try {
                Runtime &runtime = *(Runtime *)runtimePtr;
                task(runtime);
                NSLog(@"[Nebula] runOnJSForCarrier: task completed successfully");
            } @catch (NSException *exception) {
                NSLog(@"[Nebula] runOnJSForCarrier: exception during task execution: %@", exception);
            }
        });
        return;
    }

    // Fallback path when CallInvoker is unavailable.
    NSLog(@"[Nebula] runOnJSForCarrier: CallInvoker unavailable, using main queue fallback");
    RCTExecuteOnMainQueue(^{
        void *runtimePtr = [NebulaJSIGateway runtimePointerFromCarrier:carrier];
        if (!runtimePtr) {
            return;
        }
        Runtime &runtime = *(Runtime *)runtimePtr;
        task(runtime);
    });
}

+ (void)installBindingsForFactory:(id)factory appId:(NSString *)appId {
    if (!factory || appId.length == 0) {
        return;
    }

    RCTBridge *bridge = nil;
    @try {
        bridge = [factory valueForKey:@"bridge"];
    } @catch (NSException *exception) {
        NSLog(@"[Nebula] Failed to read factory.bridge for appId=%@: %@", appId, exception.reason);
        return;
    }

    if (!bridge) {
        NSLog(@"[Nebula] factory.bridge is nil, skip JSI install for appId=%@", appId);
        return;
    }

    [NebulaJSIGateway installBindingsForCarrier:bridge appId:appId];
}

- (void)installForCarrier:(id)carrier {
    if (_installed || !carrier) {
        return;
    }

    void *runtimePtr = [NebulaJSIGateway runtimePointerFromCarrier:carrier];
    if (runtimePtr) {
        [self installJSIBindings:carrier];
        _installed = YES;
    } else {
        NSLog(@"[Nebula] runtime is nil, skip JSI install for appId=%@", _appId ?: @"unknown");
    }
}

#pragma mark - JSI Installation

- (void)installJSIBindings:(id)carrier {
    if (!carrier) {
        NSLog(@"[Nebula] Cannot install JSI: runtime carrier is nil");
        return;
    }
    
    __weak NebulaJSIGateway *weakSelf = self;
    NSString *appId = _appId;
    
    __weak id weakCarrier = carrier;

    [NebulaJSIGateway runOnJSForCarrier:carrier task:[weakSelf, appId, weakCarrier](Runtime &runtime) {
        
        // Create __NebulaNativeInvoke global object
        auto nativeInvoke = Object(runtime);
        
        // Install sync invoke method
        auto syncInvoke = Function::createFromHostFunction(
            runtime,
            PropNameID::forAscii(runtime, "invokeSync"),
            2,
            [weakSelf, appId](Runtime &rt, const Value &thisValue, const Value *args, size_t count) -> Value {
                @autoreleasepool {
                    if (count < 2) {
                        throw JSError(rt, "[Nebula] invokeSync requires 2 arguments: (method, params)");
                    }
                    
                    string method = args[0].asString(rt).utf8(rt);
                    string paramsJson = args[1].asString(rt).utf8(rt);
                    
                    NSLog(@"[Nebula:JSI] syncInvoke: %s with params: %s", method.c_str(), paramsJson.c_str());
                    
                    // Call native handler synchronously
                    NSString *result = [weakSelf handleSyncInvoke:@(method.c_str())
                                                       paramsJson:@(paramsJson.c_str())
                                                            appId:appId];
                    
                    if (!result) {
                        return Value::null();
                    }
                    
                    return Value(rt, String::createFromUtf8(rt, [result UTF8String]));
                }
            }
        );
        nativeInvoke.setProperty(runtime, "invokeSync", syncInvoke);
        
        // Install async invoke method
        auto asyncInvoke = Function::createFromHostFunction(
            runtime,
            PropNameID::forAscii(runtime, "invokeAsync"),
            3,
            [weakSelf, appId, weakCarrier](Runtime &rt, const Value &thisValue, const Value *args, size_t count) -> Value {
                @autoreleasepool {
                    if (count < 3) {
                        throw JSError(rt, "[Nebula] invokeAsync requires 3 arguments: (method, params, callback)");
                    }
                    
                    string method = args[0].asString(rt).utf8(rt);
                    string paramsJson = args[1].asString(rt).utf8(rt);
                    
                    // For now, dispatch async work and ignore callbacks
                    // TODO: Implement proper callback marshalling using Promise or callback ID system
                    NSLog(@"[Nebula:JSI] asyncInvoke: %s with params: %s (callbacks not yet implemented)", method.c_str(), paramsJson.c_str());
                    
                    [weakSelf handleAsyncInvoke:@(method.c_str())
                                     paramsJson:@(paramsJson.c_str())
                                          appId:appId
                                      onSuccess:^(NSString * _Nonnull result) {
                        NSLog(@"[Nebula:JSI] asyncInvoke onSuccess: %@", result);
                    }
                                         onFail:^(NSString * _Nonnull error) {
                        NSLog(@"[Nebula:JSI] asyncInvoke onFail: %@", error);
                    }];
                    
                    return Value::undefined();
                }
            }
        );
        nativeInvoke.setProperty(runtime, "invokeAsync", asyncInvoke);
        
        // Install metadata
        nativeInvoke.setProperty(runtime, "appId", String::createFromUtf8(runtime, [appId UTF8String]));
        nativeInvoke.setProperty(runtime, "version", String::createFromUtf8(runtime, "1.0.0"));
        
        // Inject into global scope
        runtime.global().setProperty(runtime, "__NebulaNativeInvoke", nativeInvoke);
        
        NSLog(@"[Nebula] JSI Gateway installed for appId: %@", appId);
    }];
}

#pragma mark - Native Handlers

- (NSString *)handleSyncInvoke:(NSString *)method paramsJson:(NSString *)paramsJson appId:(NSString *)appId {
    // Example: handle storage, device info, etc.
    if ([method isEqualToString:@"getDeviceInfo"]) {
        return [self getDeviceInfo];
    } else if ([method isEqualToString:@"getAppId"]) {
        return appId;
    } else if ([method isEqualToString:@"getSandboxPath"]) {
        return [self getSandboxPathForAppId:appId];
    }
    
    NSLog(@"[Nebula] Unknown sync method: %@", method);
    return nil;
}

- (void)handleAsyncInvoke:(NSString *)method
               paramsJson:(NSString *)paramsJson
                    appId:(NSString *)appId
                onSuccess:(void (^)(NSString *))onSuccess
                   onFail:(void (^)(NSString *))onFail {
    
    // Example: handle network, storage, navigation, etc.
    if ([method isEqualToString:@"request"]) {
        [self handleNetworkRequest:paramsJson onSuccess:onSuccess onFail:onFail];
    } else if ([method isEqualToString:@"navigateTo"]) {
        [self handleNavigateTo:paramsJson appId:appId onSuccess:onSuccess onFail:onFail];
    } else if ([method isEqualToString:@"redirectTo"]) {
        [self handleRedirectTo:paramsJson appId:appId onSuccess:onSuccess onFail:onFail];
    } else if ([method isEqualToString:@"reLaunch"]) {
        [self handleReLaunch:paramsJson appId:appId onSuccess:onSuccess onFail:onFail];
    } else if ([method isEqualToString:@"navigateBack"]) {
        [self handleNavigateBack:paramsJson appId:appId onSuccess:onSuccess onFail:onFail];
    } else if ([method isEqualToString:@"showToast"]) {
        [self showToast:paramsJson onSuccess:onSuccess onFail:onFail];
    } else {
        onFail([NSString stringWithFormat:@"{\"errMsg\":\"Unknown method: %@\"}", method]);
    }
}

#pragma mark - Helper Methods

- (NSString *)getDeviceInfo {
    NSDictionary *info = @{
        @"model": [[UIDevice currentDevice] model],
        @"systemVersion": [[UIDevice currentDevice] systemVersion],
        @"platform": @"iOS"
    };
    
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:info options:0 error:nil];
    return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
}

- (NSString *)getSandboxPathForAppId:(NSString *)appId {
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsPath = paths.firstObject;
    return [NSString stringWithFormat:@"%@/MiniApps/%@", documentsPath, appId];
}

- (void)handleNetworkRequest:(NSString *)paramsJson
                   onSuccess:(void (^)(NSString *))onSuccess
                      onFail:(void (^)(NSString *))onFail {
    // Mock network request
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        onSuccess(@"{\"data\":\"Mock response\"}");
    });
}

- (void)handleNavigateTo:(NSString *)paramsJson
                   appId:(NSString *)appId
               onSuccess:(void (^)(NSString *))onSuccess
                  onFail:(void (^)(NSString *))onFail {
    // Parse URL from params
    NSData *jsonData = [paramsJson dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *params = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:nil];
    NSString *url = params[@"url"];
    
    if (!url) {
        onFail(@"{\"errMsg\":\"Missing url parameter\"}");
        return;
    }
    
    // Delegate to router
    dispatch_async(dispatch_get_main_queue(), ^{
        [[NebulaRouter shared] navigateToURL:url fromAppId:appId completion:^(BOOL success, NSError * _Nullable error) {
            if (success) {
                onSuccess(@"{\"errMsg\":\"navigateTo:ok\"}");
            } else {
                NSString *errorMsg = [NSString stringWithFormat:@"{\"errMsg\":\"navigateTo:fail %@\"}", error.localizedDescription];
                onFail(errorMsg);
            }
        }];
    });
}

- (void)handleRedirectTo:(NSString *)paramsJson
                   appId:(NSString *)appId
               onSuccess:(void (^)(NSString *))onSuccess
                  onFail:(void (^)(NSString *))onFail {
    NSData *jsonData = [paramsJson dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *params = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:nil];
    NSString *url = params[@"url"];

    if (!url) {
        onFail(@"{\"errMsg\":\"Missing url parameter\"}");
        return;
    }

    dispatch_async(dispatch_get_main_queue(), ^{
        [[NebulaRouter shared] redirectToURL:url fromAppId:appId completion:^(BOOL success, NSError * _Nullable error) {
            if (success) {
                onSuccess(@"{\"errMsg\":\"redirectTo:ok\"}");
            } else {
                NSString *errorMsg = [NSString stringWithFormat:@"{\"errMsg\":\"redirectTo:fail %@\"}", error.localizedDescription];
                onFail(errorMsg);
            }
        }];
    });
}

- (void)handleReLaunch:(NSString *)paramsJson
                 appId:(NSString *)appId
             onSuccess:(void (^)(NSString *))onSuccess
                onFail:(void (^)(NSString *))onFail {
    NSData *jsonData = [paramsJson dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *params = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:nil];
    NSString *url = params[@"url"];

    if (!url) {
        onFail(@"{\"errMsg\":\"Missing url parameter\"}");
        return;
    }

    dispatch_async(dispatch_get_main_queue(), ^{
        [[NebulaRouter shared] reLaunchURL:url fromAppId:appId completion:^(BOOL success, NSError * _Nullable error) {
            if (success) {
                onSuccess(@"{\"errMsg\":\"reLaunch:ok\"}");
            } else {
                NSString *errorMsg = [NSString stringWithFormat:@"{\"errMsg\":\"reLaunch:fail %@\"}", error.localizedDescription];
                onFail(errorMsg);
            }
        }];
    });
}

- (void)handleNavigateBack:(NSString *)paramsJson
                     appId:(NSString *)appId
                 onSuccess:(void (^)(NSString *))onSuccess
                    onFail:(void (^)(NSString *))onFail {
    NSData *jsonData = [paramsJson dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *params = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:nil];
    NSNumber *deltaNumber = params[@"delta"];
    NSInteger delta = deltaNumber ? [deltaNumber integerValue] : 1;

    dispatch_async(dispatch_get_main_queue(), ^{
        [[NebulaRouter shared] navigateBackFromAppId:appId delta:delta completion:^(BOOL success, NSError * _Nullable error) {
            if (success) {
                onSuccess(@"{\"errMsg\":\"navigateBack:ok\"}");
            } else {
                NSString *errorMsg = [NSString stringWithFormat:@"{\"errMsg\":\"navigateBack:fail %@\"}", error.localizedDescription];
                onFail(errorMsg);
            }
        }];
    });
}

- (void)showToast:(NSString *)paramsJson
        onSuccess:(void (^)(NSString *))onSuccess
           onFail:(void (^)(NSString *))onFail {
    // Parse message
    NSData *jsonData = [paramsJson dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *params = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:nil];
    NSString *message = params[@"title"] ?: @"";
    
    dispatch_async(dispatch_get_main_queue(), ^{
        // Get window from connected scenes (iOS 13+)
        UIWindow *window = nil;
        if (@available(iOS 13.0, *)) {
            for (UIWindowScene *scene in [UIApplication sharedApplication].connectedScenes) {
                if (scene.activationState == UISceneActivationStateForegroundActive) {
                    window = scene.windows.firstObject;
                    break;
                }
            }
        } else {
            window = [UIApplication sharedApplication].keyWindow;
        }
        
        if (!window || !window.rootViewController) {
            onFail(@"{\"errMsg\":\"showToast:no_active_window\"}");
            return;
        }
        
        // Simple alert as toast
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:nil
                                                                       message:message
                                                                preferredStyle:UIAlertControllerStyleAlert];
        
        [window.rootViewController presentViewController:alert animated:YES completion:nil];
        
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [alert dismissViewControllerAnimated:YES completion:nil];
        });
        
        onSuccess(@"{\"errMsg\":\"showToast:ok\"}");
    });
}

@end
