# React Native Setup Analysis - SuperApp Project

## Executive Summary

This SuperApp project uses React Native 0.76+ with **New Architecture enabled** but **NOT in bridgeless mode**. The architecture uses the `RCTReactNativeFactory` pattern with `RCTDefaultReactNativeFactoryDelegate` for host and mini-app initialization, with JSI custom bindings for inter-app communication.

---

## 1. Main App (Host) React Native Setup

### File: [ios/SuperApp/AppDelegate.swift](ios/SuperApp/AppDelegate.swift)

**Key Pattern: RCTReactNativeFactory with Dependency Injection**

```swift
import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?
  static var sharedRootViewFactory: RCTRootViewFactory?
  static weak var sharedNavigationController: UINavigationController?

  private var reactNativeDelegate: ReactNativeDelegate?
  private var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Initialize Nebula Mini-App Framework
    NebulaHost.shared.initialize()
    
    let delegate = ReactNativeDelegate()
    delegate.dependencyProvider = RCTAppDependencyProvider()

    let reactNativeFactory = RCTReactNativeFactory(delegate: delegate)
    reactNativeDelegate = delegate
    self.reactNativeFactory = reactNativeFactory
    AppDelegate.sharedRootViewFactory = reactNativeFactory.rootViewFactory

    let hostViewController = RNInstanceViewController(moduleName: "SuperApp", title: "Host RN")
    let navigationController = UINavigationController(rootViewController: hostViewController)
    AppDelegate.sharedNavigationController = navigationController

    window = UIWindow(frame: UIScreen.main.bounds)
    window?.rootViewController = navigationController
    window?.makeKeyAndVisible()

    return true
  }
}

final class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
```

**Setup Pattern Overview:**
- Uses `RCTReactNativeFactory` (React 0.76+ factory pattern)
- Implements `RCTDefaultReactNativeFactoryDelegate` for bundle URL configuration
- Injects `RCTAppDependencyProvider()` for New Architecture dependency management
- **Bridgeless mode disabled** (see override in mini-app delegates below)
- Creates `RCTRootViewFactory` for rendering React components

---

## 2. New Architecture Configuration

### iOS Info.plist: [ios/SuperApp/Info.plist](ios/SuperApp/Info.plist)

```xml
<key>RCTNewArchEnabled</key>
<true/>
```

### Android gradle.properties: [android/gradle.properties](android/gradle.properties)

```properties
newArchEnabled=true
```

**Status:** ✅ New Architecture enabled globally

---

## 3. Android Main Activity Setup

### File: [android/app/src/main/java/com.SuperApp/MainActivity.kt](android/app/src/main/java/com/rntest/MainActivity.kt)

```kotlin
package com.SuperApp

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "SuperApp"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
```

**Setup Pattern:**
- Uses `DefaultReactActivityDelegate` (standard New Architecture delegate)
- Fabric rendering enabled via `fabricEnabled` flag
- No custom bridgeless implementation (uses defaults)

---

## 4. JSI Setup & Custom Bindings

### File: [ios/SuperApp/Nebula/NebulaJSIGateway.h](ios/SuperApp/Nebula/NebulaJSIGateway.h)

```objective-c
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTBridge.h>

@interface NebulaJSIGateway : NSObject <RCTBridgeModule>

- (instancetype)initWithAppId:(NSString *)appId;

+ (void)installBindingsForBridge:(RCTBridge *)bridge appId:(NSString *)appId;
+ (void)installBindingsForFactory:(id)factory appId:(NSString *)appId;

@end
```

### File: [ios/SuperApp/Nebula/NebulaJSIGateway.mm](ios/SuperApp/Nebula/NebulaJSIGateway.mm) - Implementation

**Key Components:**

1. **Module Registration**
```objc
RCT_EXPORT_MODULE(NebulaJSIGateway)

+ (BOOL)requiresMainQueueSetup {
    return YES;
}
```

2. **Bridge Access Pattern**
```objc
- (void)setBridge:(RCTBridge *)bridge {
    _bridge = bridge;
    [self installForBridge:bridge];
}

- (void)installForBridge:(RCTBridge *)bridge {
    if (_installed || !bridge) {
        return;
    }

    RCTCxxBridge *cxxBridge = (RCTCxxBridge *)bridge;
    if (cxxBridge.runtime) {
        [self installJSIBindings:cxxBridge];
        _installed = YES;
    } else {
        NSLog(@"[Nebula] bridge.runtime is nil, skip JSI install");
    }
}
```

3. **JSI Runtime Binding Installation**
```objc
- (void)installJSIBindings:(RCTCxxBridge *)bridge {
    if (!bridge || !bridge.runtime) {
        NSLog(@"[Nebula] Cannot install JSI: bridge or runtime is nil");
        return;
    }
    
    __weak NebulaJSIGateway *weakSelf = self;
    NSString *appId = _appId;
    
    RCTExecuteOnMainQueue(^{
        if (!bridge.runtime) {
            return;
        }
        
        Runtime &runtime = *(Runtime *)bridge.runtime;
        
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
                        throw JSError(rt, "[Nebula] invokeSync requires 2 arguments");
                    }
                    
                    string method = args[0].asString(rt).utf8(rt);
                    string paramsJson = args[1].asString(rt).utf8(rt);
                    
                    NSString *result = [weakSelf handleSyncInvoke:@(method.c_str())
                                                       paramsJson:@(paramsJson.c_str())
                                                            appId:appId];
                    
                    return result ? Value(rt, String::createFromUtf8(rt, [result UTF8String]))
                                  : Value::null();
                }
            }
        );
        nativeInvoke.setProperty(runtime, "invokeSync", syncInvoke);
        
        // Install async invoke method
        auto asyncInvoke = Function::createFromHostFunction(
            runtime,
            PropNameID::forAscii(runtime, "invokeAsync"),
            3,
            [weakSelf, appId, &bridge](Runtime &rt, const Value &thisValue, const Value *args, size_t count) -> Value {
                @autoreleasepool {
                    if (count < 3) {
                        throw JSError(rt, "[Nebula] invokeAsync requires 3 arguments");
                    }
                    
                    // Callback handling...
                    [weakSelf handleAsyncInvoke:@(method.c_str())
                                     paramsJson:@(paramsJson.c_str())
                                          appId:appId
                                      onSuccess:^(NSString * _Nonnull result) {
                        RCTExecuteOnMainQueue(^{
                            if (onSuccess && bridge.runtime) {
                                Runtime &rt2 = *(Runtime *)bridge.runtime;
                                Function successFn = onSuccess->asObject(rt2).asFunction(rt2);
                                Value resultVal = Value(rt2, String::createFromUtf8(rt2, [result UTF8String]));
                                successFn.call(rt2, resultVal);
                            }
                        });
                    } onFail:^(NSString * _Nonnull error) {
                        RCTExecuteOnMainQueue(^{
                            if (onFail && bridge.runtime) {
                                Runtime &rt2 = *(Runtime *)bridge.runtime;
                                Function failFn = onFail->asObject(rt2).asFunction(rt2);
                                Value errorVal = Value(rt2, String::createFromUtf8(rt2, [error UTF8String]));
                                failFn.call(rt2, errorVal);
                            }
                        });
                    }];
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
    });
}
```

4. **Native Handler Methods**
```objc
- (NSString *)handleSyncInvoke:(NSString *)method paramsJson:(NSString *)paramsJson appId:(NSString *)appId {
    if ([method isEqualToString:@"getDeviceInfo"]) {
        return [self getDeviceInfo];
    } else if ([method isEqualToString:@"getAppId"]) {
        return appId;
    } else if ([method isEqualToString:@"getSandboxPath"]) {
        return [self getSandboxPathForAppId:appId];
    }
    return nil;
}

- (void)handleAsyncInvoke:(NSString *)method
               paramsJson:(NSString *)paramsJson
                    appId:(NSString *)appId
                onSuccess:(void (^)(NSString *))onSuccess
                   onFail:(void (^)(NSString *))onFail {
    if ([method isEqualToString:@"request"]) {
        [self handleNetworkRequest:paramsJson onSuccess:onSuccess onFail:onFail];
    } else if ([method isEqualToString:@"navigateTo"]) {
        [self handleNavigateTo:paramsJson appId:appId onSuccess:onSuccess onFail:onFail];
    } else if ([method isEqualToString:@"showToast"]) {
        [self showToast:paramsJson onSuccess:onSuccess onFail:onFail];
    }
}
```

**JSI Binding Pattern Analysis:**
- ✅ Accessed via `cxxBridge.runtime` (direct JSI runtime access)
- ✅ Custom C++ functions using `facebook::jsi::Function::createFromHostFunction`
- ✅ Both sync (`invokeSync`) and async (`invokeAsync`) patterns
- ✅ Main queue enforcement via `RCTExecuteOnMainQueue`
- ✅ Global object injection: `__NebulaNativeInvoke` 
- ❌ **NOT using bridgeless mode** - still relies on `RCTBridge` and `RCTCxxBridge`
- ❌ Not using `ContextContainer` or `TurboModuleRegistry` directly

---

## 5. Mini-App Initialization & Bridge Creation

### File: [ios/SuperApp/Nebula/NebulaContainerController.swift](ios/SuperApp/Nebula/NebulaContainerController.swift)

```swift
private func setupRootView() {
    // Clean old root content
    for subview in view.subviews where subview != loadingIndicator {
        subview.removeFromSuperview()
    }
    
    if let preloadedRootView = NebulaAppManager.shared.consumePreloadedRootView(for: appId) {
        preloadedRootView.frame = view.bounds
        preloadedRootView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.addSubview(preloadedRootView)
        view.bringSubviewToFront(preloadedRootView)
        loadingIndicator.stopAnimating()
        print("[Nebula] Consumed preloaded root view for \(appId)")
        return
    }

    let bundleURL: URL
    if let devURL = NebulaConfig.shared.devURL(for: appId) {
        bundleURL = devURL
    } else if let bundlePath = NebulaConfig.shared.bundlePath(for: appId) {
        bundleURL = URL(fileURLWithPath: bundlePath)
    } else {
        showError(NSError(domain: "com.nebula.container", code: -1))
        return
    }

    let miniDelegate = NebulaMiniAppReactDelegate(bundleURL: bundleURL)
    miniDelegate.dependencyProvider = RCTAppDependencyProvider()
    let miniFactory = RCTReactNativeFactory(delegate: miniDelegate)
    
    // **CRITICAL: Eagerly create bridge BEFORE JS execution**
    let forcedBridge = miniDelegate.createBridge(with: miniDelegate, launchOptions: [:])
    miniFactory.bridge = forcedBridge
    NebulaJSIGateway.installBindings(for: forcedBridge, appId: appId)
    self.miniAppFactory = miniFactory

    let moduleName = (initialProps?["moduleName"] as? String) ?? "NebulaApp"

    let rootView = miniFactory.rootViewFactory.view(
        withModuleName: moduleName,
        initialProperties: buildInitialProps()
    )
    
    rootView.backgroundColor = .systemBackground
    rootView.frame = view.bounds
    rootView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    view.addSubview(rootView)
    view.bringSubviewToFront(rootView)
    
    loadingIndicator.stopAnimating()
    loadingIndicator.removeFromSuperview()
    
    print("[Nebula] Container loaded for \(appId), module=\(moduleName)")
}

private final class NebulaMiniAppReactDelegate: RCTDefaultReactNativeFactoryDelegate {
    private let miniBundleURL: URL

    init(bundleURL: URL) {
        self.miniBundleURL = bundleURL
        super.init()
    }

    override func bundleURL() -> URL? {
        return miniBundleURL
    }

    override func bridgelessEnabled() -> Bool {
        return false  // ← Explicitly NOT bridgeless
    }

    override func createBridge(with delegate: RCTBridgeDelegate, launchOptions: [AnyHashable : Any]) -> RCTBridge {
        return RCTBridge(delegate: delegate, launchOptions: launchOptions)
    }
}
```

**Key Module Initialization Pattern:**
1. Create delegate with `bundleURL`
2. Inject `RCTAppDependencyProvider()` for dependency management
3. Create `RCTReactNativeFactory` with delegate
4. **Eagerly create bridge** to enable JSI binding installation
5. Install JSI bindings **before** JS code runs
6. Create root view factory and render module

---

## 6. Mini-App Preloading Strategy

### File: [ios/SuperApp/Nebula/NebulaAppManager.swift](ios/SuperApp/Nebula/NebulaAppManager.swift)

```swift
private final class NebulaPreloadReactDelegate: RCTDefaultReactNativeFactoryDelegate {
    private let miniBundleURL: URL

    init(bundleURL: URL) {
        self.miniBundleURL = bundleURL
        super.init()
    }

    override func bundleURL() -> URL? {
        return miniBundleURL
    }

    override func bridgelessEnabled() -> Bool {
        return false
    }

    override func createBridge(with delegate: RCTBridgeDelegate, launchOptions: [AnyHashable : Any]) -> RCTBridge {
        return RCTBridge(delegate: delegate, launchOptions: launchOptions)
    }
}

@objc public func preloadRootView(for appId: String,
                                  moduleName: String = "NebulaApp",
                                  initialProps: [String: Any]? = nil) {
    let bundleURL: URL
    if let devURL = NebulaConfig.shared.devURL(for: appId) {
        bundleURL = devURL
    } else if let bundlePath = NebulaConfig.shared.bundlePath(for: appId) {
        bundleURL = URL(fileURLWithPath: bundlePath)
    } else {
        print("[Nebula] Warm-up skipped for \(appId): bundle not found")
        return
    }

    // Create preload context
    DispatchQueue.main.async {
        let delegate = NebulaPreloadReactDelegate(bundleURL: bundleURL)
        delegate.dependencyProvider = RCTAppDependencyProvider()
        let factory = RCTReactNativeFactory(delegate: delegate)
        
        // **Eagerly create bridge for JSI installation**
        let forcedBridge = delegate.createBridge(with: delegate, launchOptions: [:])
        factory.bridge = forcedBridge
        NebulaJSIGateway.installBindings(for: forcedBridge, appId: appId)

        var props: [String: Any] = [
            "appId": appId,
            "sandboxPath": NebulaConfig.shared.sandboxPath(for: appId)
        ]
        if let initialProps = initialProps {
            props.merge(initialProps) { _, new in new }
        }

        let rootView = factory.rootViewFactory.view(
            withModuleName: moduleName,
            initialProperties: props
        )
        rootView.backgroundColor = .systemBackground

        // Mount preloaded view to bottom-layer container
        guard let container = container else {
            // Store factory/view without mounting
            self.preloadedAppId = appId
            self.preloadedFactory = factory
            self.preloadedView = rootView
            return
        }

        rootView.frame = container.bounds
        rootView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        container.addSubview(rootView)
        
        self.postJavaScriptDidLoad(for: factory.bridge, appId: appId, moduleName: moduleName)
        
        print("[Nebula] Preloaded root view for \(appId), module=\(moduleName)")
    }
}
```

**Preloading Pattern Highlights:**
- Single-slot preload cache (clears previous when starting new preload)
- Bridge created eagerly before view creation
- JSI bindings installed during preload, not on-demand
- Views mounted to hidden bottom-layer for pre-rendering

---

## 7. Native Module Registration

### File: [ios/SuperApp/Nebula/NebulaNativeModule.swift](ios/SuperApp/Nebula/NebulaNativeModule.swift)

```swift
@objc(NebulaNativeModule)
class NebulaNativeModule: NSObject {

    @objc static func moduleName() -> String {
        return "NebulaNativeModule"
    }
    
    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc var bridge: RCTBridge!
    
    /// Open a mini-app from the main React Native app
    @objc func openMiniApp(_ appId: String,
                           initialProps: NSDictionary?,
                           resolver: @escaping RCTPromiseResolveBlock,
                           rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            guard let window = UIApplication.shared.keyWindow,
                  let rootVC = window.rootViewController else {
                rejecter("NO_ROOT_VC", "Cannot find root view controller", nil)
                return
            }
            
            var topVC = rootVC
            while let presented = topVC.presentedViewController {
                topVC = presented
            }
            
            let sourceVC = (topVC as? UINavigationController)?.topViewController ?? topVC
            let props = initialProps as? [String: Any]
            NebulaHost.shared.openApp(appId, from: sourceVC, initialProps: props)
            
            resolver(["success": true, "appId": appId])
        }
    }
    
    /// Preload a mini-app
    @objc func preloadMiniApp(_ appId: String,
                              resolver: @escaping RCTPromiseResolveBlock,
                              rejecter: @escaping RCTPromiseRejectBlock) {
        NebulaHost.shared.preloadApp(appId)
        resolver(["success": true, "appId": appId])
    }
    
    /// Install and preload a mini-app with explicit runtime mode
    @objc func preloadMiniAppWithMode(_ appId: String,
                                      bundleURL: String,
                                      mode: String,
                                      resolver: @escaping RCTPromiseResolveBlock,
                                      rejecter: @escaping RCTPromiseRejectBlock) {
        guard let runtimeMode = parseRuntimeMode(mode, rejecter: rejecter) else {
            return
        }

        NebulaHost.shared.installApp(appId, bundleURL: bundleURL, mode: runtimeMode) { success, error in
            if success {
                NebulaHost.shared.preloadApp(appId)
                resolver(["success": true, "appId": appId, "mode": mode.lowercased()])
            } else {
                rejecter("PRELOAD_ERROR", error?.localizedDescription ?? "Failed to preload", error)
            }
        }
    }
    
    /// Install a mini-app from URL
    @objc func installMiniApp(_ appId: String,
                              bundleURL: String,
                              resolver: @escaping RCTPromiseResolveBlock,
                              rejecter: @escaping RCTPromiseRejectBlock) {
        NebulaHost.shared.installApp(appId, bundleURL: bundleURL) { success, error in
            if success {
                resolver(["success": true, "appId": appId])
            } else {
                rejecter("INSTALL_ERROR", error?.localizedDescription ?? "Failed to install", error)
            }
        }
    }
}
```

**Native Module Pattern:**
- Uses `@objc` macros for Objective-C interop
- Implements module name and main queue requirement
- Bridge property injected by React Native runtime
- Promise-based async methods for native operations

### File: [ios/SuperApp/RNInstanceNavigator.swift](ios/SuperApp/RNInstanceNavigator.swift)

```swift
@objc(RNInstanceNavigator)
final class RNInstanceNavigator: NSObject {
  @objc
  static func requiresMainQueueSetup() -> Bool {
    true
  }

  @objc(openInstance:props:)
  func openInstance(_ moduleName: String, props: NSDictionary?) {
    DispatchQueue.main.async {
      guard let navigationController = AppDelegate.sharedNavigationController else {
        return
      }

      let initialProps = props as? [AnyHashable: Any]
      let viewController = RNInstanceViewController(
        moduleName: moduleName,
        initialProperties: initialProps,
        title: moduleName
      )
      navigationController.pushViewController(viewController, animated: true)
    }
  }

  @objc
  func popInstance() {
    DispatchQueue.main.async {
      guard let navigationController = AppDelegate.sharedNavigationController else {
        return
      }
      navigationController.popViewController(animated: true)
    }
  }
}
```

---

## 8. React Native Bridging Headers

### File: [ios/SuperApp/RNInstanceNavigatorBridge.m](ios/SuperApp/RNInstanceNavigatorBridge.m)

```objective-c
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNInstanceNavigator, NSObject)

RCT_EXTERN_METHOD(openInstance:(NSString *)moduleName
                  props:(NSDictionary *)props)

RCT_EXTERN_METHOD(popInstance)

@end
```

**Module Export Pattern:**
- `RCT_EXTERN_MODULE` declares Objective-C exported module
- `RCT_EXTERN_METHOD` declares exported methods (Swift implementation)
- Auto-bridges Swift native modules to JavaScript

---

## 9. Architecture Decision Points

### ✅ What IS Being Used (Found in Codebase):

1. **RCTReactNativeFactory Pattern** - Modern React Native 0.76+ approach
2. **RCTDefaultReactNativeFactoryDelegate** - Delegate pattern for customization
3. **RCTAppDependencyProvider** - New Architecture dependency injection
4. **Direct JSI Runtime Access** - `cxxBridge.runtime` 
5. **Custom JSI Functions** - `createFromHostFunction` for sync/async invocation
6. **TurboModule Library** - `<ReactCommon/RCTTurboModule.h>` included but not directly used
7. **New Architecture Flag** - Enabled in Info.plist and gradle.properties
8. **Fabric Rendering** - DefaultNewArchitectureEntryPoint.fabricEnabled on Android

### ❌ What IS NOT Being Used:

1. **Bridgeless Mode** - `bridgelessEnabled()` explicitly returns `false`
2. **ContextContainer** - Not referenced anywhere in codebase
3. **Direct TurboModuleRegistry** - Not used; JSI gateway used instead
4. **RCTAppDelegate** - Not directly inherited (using modern factory instead)
5. **Hermes Direct Execution** - Using standard JSI runtime

---

## 10. Module Initialization Sequence (Actual Flow)

```
AppDelegate.didFinishLaunching()
  ↓
NebulaHost.shared.initialize()
  ↓
Create ReactNativeDelegate
  ↓
Set dependencyProvider = RCTAppDependencyProvider()
  ↓
Create RCTReactNativeFactory(delegate: delegate)
  ↓
Get rootViewFactory from factory
  ↓
Create RNInstanceViewController("SuperApp")
  ↓
RNInstanceViewController.loadView()
  ↓
rootViewFactory.view(withModuleName:, initialProperties:)
  ↓
RCTBridge created internally (still using bridge, not bridgeless!)
  ↓
JS Bundle loaded
  ↓
Native modules registered (RNInstanceNavigator, NebulaNativeModule, etc.)
  ↓
JS code executes

For Mini-Apps:
NebulaContainerController.setupRootView()
  ↓
Create NebulaMiniAppReactDelegate
  ↓
Set dependencyProvider = RCTAppDependencyProvider()
  ↓
Create RCTReactNativeFactory(delegate: delegate)
  ↓
**CRITICAL: Eagerly create RCTBridge before rootView creation**
  ↓
NebulaJSIGateway.installBindings(for: bridge, appId: appId)
  ↓
rootViewFactory.view(withModuleName:, initialProperties:)
  ↓
JS Bundle loaded
  ↓
__NebulaNativeInvoke JSI object available to JS
```

---

## 11. Bridgeless Mode - Current State & Path Forward

### Current State: ❌ NOT Bridgeless

```swift
override func bridgelessEnabled() -> Bool {
    return false  // ← Host and mini-app both explicitly opt-out
}
```

### Why Not Bridgeless?

1. **JSI bindings require bridge runtime access** (`cxxBridge.runtime`)
2. **Native module registration** still uses bridge-based mechanisms
3. **Backward compatibility** with existing RCT modules

### Path to Bridgeless (If Desired):

To enable bridgeless mode, would need:

1. **Change bridgelessEnabled:**
```swift
override func bridgelessEnabled() -> Bool {
    return true  // ← Enable bridgeless
}
```

2. **Use ContextContainer instead of Bridge:**
```swift
// Instead of:
let forcedBridge = miniDelegate.createBridge(with: miniDelegate, launchOptions: [:])

// Would use:
let contextContainer = RCTContextContainer()
// Configure context container with modules
```

3. **TurboModuleRegistry for module management:**
```cpp
// Module registration would use:
auto turboModuleRegistry = std::make_shared<TurboModuleRegistry>(
    [this](const std::string &name) -> std::shared_ptr<TurboModule> {
        // Return TurboModule instances
    }
);
```

4. **JSI without bridge:**
```cpp
// JSI would be accessed directly from ContextContainer
// instead of cxxBridge.runtime
```

---

## 12. React Native Version & Dependencies

**Inferred Version:** React Native 0.76+
- Uses `React_RCTAppDelegate` framework (modern)
- Uses `ReactAppDependencyProvider` (New Architecture)
- Imports `ReactCommon/RCTTurboModule.h` (available in 0.76+)
- Uses `RCTReactNativeFactory` (0.76+ pattern)
- Uses `RCTDefaultReactNativeFactoryDelegate` (0.76+ pattern)

---

## 13. Summary Table

| Aspect | Current Setup | Bridgeless Ready? |
|--------|--------------|----------------|
| Main Bridge | ✅ RCTBridge | ❌ No |
| JSI Runtime | ✅ Direct access via cxxBridge | ⚠️ Would need ContextContainer |
| Custom Bindings | ✅ Implemented | ✅ Pattern supports bridgeless |
| Native Modules | ✅ RCT_EXPORT_MODULE pattern | ⚠️ Needs TurboModule migration |
| Dependency Injection | ✅ RCTAppDependencyProvider | ✅ Already using modern pattern |
| New Architecture | ✅ Enabled | ✅ Yes |
| Fabric | ✅ Enabled | ✅ Yes |

---

## 14. Key Files for Reference

| File | Purpose |
|------|---------|
| [ios/SuperApp/AppDelegate.swift](ios/SuperApp/AppDelegate.swift) | Main app startup, factory setup |
| [ios/SuperApp/Nebula/NebulaJSIGateway.mm](ios/SuperApp/Nebula/NebulaJSIGateway.mm) | JSI custom bindings installation |
| [ios/SuperApp/Nebula/NebulaContainerController.swift](ios/SuperApp/Nebula/NebulaContainerController.swift) | Mini-app lifecycle & bridge creation |
| [ios/SuperApp/Nebula/NebulaAppManager.swift](ios/SuperApp/Nebula/NebulaAppManager.swift) | Mini-app preloading strategy |
| [ios/SuperApp/Nebula/NebulaNativeModule.swift](ios/SuperApp/Nebula/NebulaNativeModule.swift) | Native module for mini-app operations |
| [android/app/src/main/java/com.SuperApp/MainActivity.kt](android/app/src/main/java/com/rntest/MainActivity.kt) | Android entry point |
| [ios/SuperApp/Info.plist](ios/SuperApp/Info.plist) | New Architecture flag |
| [android/gradle.properties](android/gradle.properties) | Android New Architecture flag |

