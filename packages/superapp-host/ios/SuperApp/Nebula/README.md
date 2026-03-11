# Nebula Mini-App Container Framework

A high-performance iOS SuperApp container framework for running multiple React Native mini-apps with isolated sandboxes and TurboModule native communication.

## 🚀 Features

### Core Capabilities

- **Multi-Instance Management**: Run multiple React Native instances with independent sandboxes
- **TurboModule Bridge**: Fast native communication via React Native TurboModules
- **Smart Routing**: WeChat-style navigation (`wx.navigateTo`) with URL scheme support
- **Sandbox Isolation**: Each mini-app has its own private filesystem
- **Lifecycle Control**: Warm-up, preloading, and intelligent memory management
- **Thread-Safe**: Lock-free concurrent access to bridge registry

### Architecture Highlights

```
┌─────────────────────────────────────────────────────────────┐
│                     NebulaHost API                          │
│  (Swift - Public Interface)                                 │
└─────────────────────────────────────────────────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ NebulaAppManager │  │ NebulaRouter     │  │ NebulaConfig     │
│ (Bridge Pool)    │  │ (Navigation)     │  │ (Sandbox Mgmt)   │
└──────────────────┘  └──────────────────┘  └──────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
┌──────────────────────────────────────────────────────────────┐
│           NebulaContainerController                          │
│  (UIViewController - RCTRootView Host)                       │
└──────────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────┐
│      NebulaNativeModule (TurboModule)                       │
│  Navigation & Device APIs via React Native Bridge           │
└──────────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────┐
│        JavaScript Runtime (React Native)                     │
│  wx.navigateTo, MiniAppAPI via TurboModule                  │
└──────────────────────────────────────────────────────────────┘
```

## 📦 Installation

### 1. Add Nebula Files to Xcode

```bash
cd /Users/hectorchong/Project/superapp/ios
chmod +x integrate_nebula.sh
./integrate_nebula.sh
```

Then manually add the Nebula folder to Xcode:
1. Open `SuperApp.xcodeproj` in Xcode
2. Right-click `SuperApp` folder → `Add Files to SuperApp...`
3. Select `SuperApp/Nebula/` folder
4. Ensure **"Create groups"** and **"SuperApp" target** are checked
5. Click **"Add"**

### 2. Initialize in AppDelegate

The framework is already integrated in `AppDelegate.swift`:

```swift
func application(_ application: UIApplication, 
                 didFinishLaunchingWithOptions launchOptions: ...) -> Bool {
    // Nebula initialization
    NebulaHost.shared.initialize()
    
    // ... rest of app setup
}
```

## 📖 Usage

### From Main React Native App

```javascript
import { NebulaAPI } from './src/nebula/NebulaAPI';

// 1. Install a mini-app from remote bundle
await NebulaAPI.installMiniApp(
  'shopping-cart',
  'https://cdn.example.com/mini-apps/shopping-cart.bundle'
);

// 2. Open the mini-app
await NebulaAPI.openMiniApp('shopping-cart', {
  title: 'Shopping Cart',
  userId: '123',
  initialRoute: '/cart'
});

// 3. Preload for faster startup (optional)
await NebulaAPI.preloadMiniApp('product-detail');

// 4. Get installed mini-apps
const { apps } = await NebulaAPI.getInstalledMiniApps();
console.log('Installed apps:', apps);
```

### Inside Mini-App

Create your mini-app entry point:

```javascript
// index.js - Mini-App Entry Point
import React from 'react';
import { AppRegistry, View, Text, Button } from 'react-native';
import { MiniAppAPI, wx } from './NebulaAPI';

function NebulaApp({ appId, sandboxPath, ...initialProps }) {
  const [deviceInfo, setDeviceInfo] = React.useState(null);
  
  React.useEffect(() => {
    // Get device info synchronously
    const info = MiniAppAPI.getDeviceInfo();
    setDeviceInfo(info);
    
    console.log('Mini-app started:', appId);
    console.log('Sandbox:', sandboxPath);
    console.log('Initial props:', initialProps);
  }, []);
  
  const handleNavigate = async () => {
    try {
      await wx.navigateTo({ url: 'nebula://another-app/page' });
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  };
  
  const handleShowToast = async () => {
    await wx.showToast({ title: 'Hello from mini-app!' });
  };
  
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Mini-App ID: {appId}</Text>
      <Text>Device: {deviceInfo?.model}</Text>
      <Text>iOS Version: {deviceInfo?.systemVersion}</Text>
      
      <Button title="Navigate to Another App" onPress={handleNavigate} />
      <Button title="Show Toast" onPress={handleShowToast} />
      <Button 
        title="Open Native Settings" 
        onPress={() => wx.navigateTo({ url: 'native://settings' })}
      />
    </View>
  );
}

// IMPORTANT: Register component as "NebulaApp"
AppRegistry.registerComponent('NebulaApp', () => NebulaApp);
```

### Navigation Schemes

```javascript
// 1. Navigate to another mini-app
await wx.navigateTo({ url: 'nebula://product-detail/page?id=123' });

// 2. Navigate to native page
await wx.navigateTo({ url: 'native://settings' });

// 3. Open external URL
await wx.navigateTo({ url: 'https://example.com' });

// 4. Navigate back
await MiniAppAPI.invokeAsync('navigateBack', {});
```

## 🔧 API Reference

### NebulaAPI (Main App)

| Method | Description | Returns |
|--------|-------------|---------|
| `openMiniApp(appId, initialProps)` | Open a mini-app | `Promise<{success, appId}>` |
| `preloadMiniApp(appId)` | Preload bridge for faster startup | `Promise<{success, appId}>` |
| `installMiniApp(appId, bundleURL)` | Download and install bundle | `Promise<{success, appId}>` |
| `getInstalledMiniApps()` | List installed apps | `Promise<{apps: string[]}>` |

### MiniAppAPI (Inside Mini-App)

#### Synchronous Methods

```javascript
// Get device information
const deviceInfo = MiniAppAPI.getDeviceInfo();
// Returns: { model, systemVersion, platform }

// Get current appId
const appId = MiniAppAPI.getAppId();

// Get sandbox path
const path = MiniAppAPI.getSandboxPath();
```

#### Asynchronous Methods

```javascript
// Generic async invoke
await MiniAppAPI.invokeAsync('methodName', { param1: 'value' });

// Navigate
await MiniAppAPI.navigateTo('nebula://another-app/page');

// Show toast
await MiniAppAPI.showToast('Hello!');
```

## 🏗️ File Structure

```
SuperApp/Nebula/
├── NebulaHost.swift                    # Main API entry point
├── NebulaAppManager.swift              # Bridge instance manager
├── NebulaContainerController.swift     # View controller container
├── NebulaRouter.swift                  # Navigation router
├── NebulaConfig.swift                  # Configuration & sandbox
├── NebulaRouterBridge.m               # Router module export
├── NebulaNativeModule.swift           # Main app module
├── NebulaNativeModuleBridge.m         # Main app module export
├── NebulaPerformanceMonitor.swift     # Performance tracking
├── src/nebula/NebulaAPI.ts            # TypeScript API
└── README.md                          # This file
```

## 🎯 Mini-App Development Workflow

### 1. Create Mini-App Project

```bash
npx react-native init MyMiniApp
cd MyMiniApp
```

### 2. Modify index.js

```javascript
import { AppRegistry } from 'react-native';
import App from './App';

// Register as "NebulaApp" (required)
AppRegistry.registerComponent('NebulaApp', () => App);
```

### 3. Build Bundle

```bash
# iOS bundle
npx react-native bundle \
  --platform ios \
  --dev false \
  --entry-file index.js \
  --bundle-output ./build/index.bundle \
  --assets-dest ./build
```

### 4. Install to SuperApp

```javascript
// In SuperApp
await NebulaAPI.installMiniApp(
  'my-mini-app',
  'file:///path/to/index.bundle'
  // Or use HTTP URL for remote installation
);
```

## 🔒 Security & Isolation

- **Sandbox Isolation**: Each mini-app runs in its own directory (`Documents/MiniApps/{appId}/`)
- **Bridge Isolation**: Each mini-app has its own `RCTBridge` instance
- **No Shared State**: Mini-apps cannot access each other's data directly
- **URL Validation**: All navigation URLs are validated before execution

## ⚡ Performance Tips

1. **Preload frequently used mini-apps**:
   ```javascript
   await NebulaAPI.preloadMiniApp('homepage');
   ```

2. **Use synchronous APIs for fast operations**:
   ```javascript
   const info = MiniAppAPI.getDeviceInfo(); // No Promise overhead
   ```

3. **Invalidate unused bridges**:
   ```swift
   NebulaHost.shared.closeApp("old-app")
   ```

4. **Monitor memory usage**:
   - Framework automatically handles memory warnings
   - Max concurrent apps: configurable via `NebulaConfig.shared.maxConcurrentApps`
   - Max navigation stack depth: configurable via `NebulaConfig.shared.maxNavigationStackDepth` (default: 10)
   - When stack limit is reached, `navigateTo` will fail with error code -7

## 🐛 Debugging

Enable debug logging in `NebulaConfig`:

```swift
NebulaConfig.shared.enableDebugLogging = true
```

Check logs:
```
[Nebula] Creating bridge for my-mini-app with bundle: /path/to/bundle
[Nebula] TurboModule ready for appId: my-mini-app
[Nebula] navigateTo called with url: /pages/index
[Nebula:Performance] openApp:my-mini-app: 234.567ms
```

## 📝 License

Proprietary - SuperApp Internal Framework


### 1. Add Framework Files

Copy the `Nebula/` folder to your Xcode project:

```
SuperApp/
├── Nebula/
│   ├── NebulaHost.swift
│   ├── NebulaAppManager.swift
│   ├── NebulaContainerController.swift
│   ├── NebulaRouter.swift
│   ├── NebulaRouterBridge.m
│   ├── NebulaConfig.swift
│   ├── NebulaNativeModule.swift
│   └── NebulaNativeModuleBridge.m
└── SuperApp-Bridging-Header.h
```

### 2. Configure Xcode Project

1. **Bridging Header**: Set `SuperApp-Bridging-Header.h` in Build Settings
2. **Other Linker Flags**: Add `-ObjC`
3. **Enable C++ Exceptions**: YES (for React Native)

### 3. Initialize in AppDelegate

```swift
import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // Initialize Nebula
        NebulaHost.shared.initialize()
        
        return true
    }
}
```

## 🎯 Usage Guide

### Basic: Open a Mini-App

```swift
class HomeViewController: UIViewController {
    
    @IBAction func openMiniApp() {
        NebulaHost.shared.openApp(
            "weather-app",
            from: self,
            initialProps: ["city": "Beijing"],
            animated: true
        )
    }
}
```

### Advanced: Download and Install

```swift
func installMiniApp() {
    let appId = "shopping-app"
    let bundleURL = "https://cdn.example.com/miniapps/shopping/index.bundle"
    
    NebulaHost.shared.installApp(appId, bundleURL: bundleURL) { success, error in
        if success {
            print("Installed successfully!")
            NebulaHost.shared.openApp(appId, from: self)
        } else {
            print("Installation failed: \(error?.localizedDescription ?? "unknown")")
        }
    }
}
```

### Warm-Up for Performance

```swift
// Preload frequently used mini-apps at app launch
NebulaHost.shared.preloadApp("home-app")
NebulaHost.shared.preloadApp("payment-app")
```

## 🔌 JavaScript API

### MiniAppAPI (TypeScript Wrapper)

```javascript
import { MiniAppAPI } from './src/nebula/NebulaAPI';

// Get device info
const deviceInfo = MiniAppAPI.getDeviceInfo();
console.log(deviceInfo); 
// { model: "iPhone 17 Pro", systemVersion: "18.0", platform: "iOS" }

// Get current app ID
const appId = MiniAppAPI.getAppId();
console.log(appId); // "weather-app"

// Show toast
await MiniAppAPI.showToast('Hello Nebula!');

// Navigation
await MiniAppAPI.navigateTo('nebula://product-app/detail?id=123');
await MiniAppAPI.redirectTo('/pages/home');
await MiniAppAPI.navigateBack();
```

### WeChat-Compatible API

```javascript
import { wx } from './src/nebula/NebulaAPI';

// Navigate to another mini-app
await wx.navigateTo({ url: 'nebula://product-app/detail?id=123' });

// Show toast
await wx.showToast({ title: 'Hello!' });

// Get system info
const systemInfo = await wx.getSystemInfo();
console.log(systemInfo);

// Navigate back
await wx.navigateBack({ delta: 1 });
```

### Direct TurboModule Access

```javascript
import { NativeModules } from 'react-native';
const { NebulaNativeModule } = NativeModules;

// Call navigation methods directly
await NebulaNativeModule.navigateTo('my-app', '/pages/detail');
await NebulaNativeModule.showToast('Success!');
const deviceInfo = NebulaNativeModule.getDeviceInfo();
```

## 🗂️ Sandbox Structure

Each mini-app has an isolated filesystem:

```
Documents/MiniApps/
├── weather-app/
│   ├── index.bundle          # React Native bundle
│   ├── assets/               # Images, fonts, etc.
│   └── storage/              # Persistent data
├── shopping-app/
│   ├── index.bundle
│   └── ...
└── payment-app/
    ├── index.bundle
    └── ...
```

Access sandbox path in JavaScript:

```javascript
const sandboxPath = MiniAppAPI.getSandboxPath();
console.log(`Sandbox: ${sandboxPath}`);
```

## ⚡ Performance Optimizations

### 1. Bridge Pooling

```swift
// Bridges are reused across navigation
NebulaAppManager.shared.getBridge(for: appId) { bridge, error in
    // Bridge is cached and reused
}
```

### 2. Warm-Up Strategy

```swift
// Preload at app launch
override func viewDidLoad() {
    super.viewDidLoad()
    NebulaHost.shared.preloadApp("home-app")
}
```

### 3. Memory Management

```swift
// Automatic cleanup on memory warning
// Manual cleanup:
NebulaHost.shared.closeApp("unused-app")

// Clear all cached containers
NebulaHost.shared.clearContainerPool()
```

### 4. Container Reuse

```swift
// Containers are automatically cached and reused
// First open: creates new container
NebulaHost.shared.openApp("my-app", from: self)

// Second open: reuses existing container (faster!)
NebulaHost.shared.openApp("my-app", from: self)

// Note: If container is already in navigation stack, 
// a new instance will be created to avoid conflicts
```

## 🔧 Advanced Configuration

```swift
// Configure in AppDelegate
let config = NebulaConfig.shared
config.enableDebugLogging = true
config.maxConcurrentApps = 3
config.maxNavigationStackDepth = 10  // Max pages in navigation stack (WeChat-style)
config.cachePolicy = .hybrid

NebulaHost.shared.initialize(config: config)
```

## 📊 Performance Monitoring

```swift
// Built-in performance tracking
NebulaPerformanceMonitor.shared.startMeasure("loadApp")
// ... perform operation ...
let duration = NebulaPerformanceMonitor.shared.endMeasure("loadApp")
print("Load time: \(duration * 1000)ms")
```

## 🛠️ Extension Points

### Add Custom Native Methods to NebulaNativeModule

Edit `NebulaNativeModule.swift`:

```objc
- (NSString *)handleSyncInvoke:(NSString *)method 
                    paramsJson:(NSString *)paramsJson 
                         appId:(NSString *)appId {
    if ([method isEqualToString:@"myCustomMethod"]) {
        // Your implementation
        return @"{\"result\":\"success\"}";
    }
    // ...
}
```

### Add Custom Navigation Handlers

Edit `NebulaRouter.swift`:

```swift
private func handleNativeNavigation(_ url: NebulaURL,
                                    navigationController: UINavigationController,
                                    completion: @escaping (Bool, Error?) -> Void) {
    switch url.path {
    case "myCustomPage":
        let vc = MyCustomViewController()
        navigationController.pushViewController(vc, animated: true)
        completion(true, nil)
    default:
        // ...
    }
}
```

## 📝 Best Practices

1. **Always preload critical mini-apps** at app launch
2. **Use JSI for performance-critical calls** (synchronous methods)
3. **Implement proper error handling** in async callbacks
4. **Clean up unused bridges** on memory warnings
5. **Version your bundles** for safe updates
6. **Test with multiple concurrent mini-apps** to verify isolation

## 🐛 Troubleshooting

### Issue: Bundle not found

```
[Nebula] ERROR: Bundle not found for weather-app
```

**Solution**: Ensure bundle is downloaded or Metro is running:
```swift
NebulaHost.shared.installApp("weather-app", bundleURL: "...")
```

### Issue: Navigation stack limit reached (Error code: -7)

```
Navigation stack limit reached (max: 10). Cannot push more pages.
```

**Solution**: The navigation stack has reached the maximum depth. Options:
- Use `wx.redirectTo()` instead of `wx.navigateTo()` to replace the current page
- Call `wx.navigateBack()` to go back before navigating forward
- Increase the limit: `NebulaConfig.shared.maxNavigationStackDepth = 15`

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for high-performance SuperApps**
