# Nebula Mini-App Container Framework

A high-performance iOS SuperApp container framework for running multiple React Native mini-apps with isolated sandboxes and JSI-powered native communication.

## 🚀 Features

### Core Capabilities

- **Multi-Instance Management**: Run multiple React Native instances with independent sandboxes
- **JSI Bridge**: Ultra-fast native communication via C++ JSI (`__NebulaNativeInvoke`)
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
│         NebulaJSIGateway (Objective-C++)                     │
│  Injects: __NebulaNativeInvoke.invokeSync/invokeAsync       │
└──────────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────┐
│             JavaScript Runtime (JSI)                         │
│  Global: __NebulaNativeInvoke with C++ bindings             │
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

### 2. Verify Bridging Header

Ensure `SuperApp/SuperApp-Bridging-Header.h` includes:

```objc
#import "NebulaJSIGateway.h"
```

### 3. Initialize in AppDelegate

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

### Global __NebulaNativeInvoke (Advanced)

For direct JSI access:

```javascript
// Synchronous call
const result = __NebulaNativeInvoke.invokeSync('getDeviceInfo', '{}');

// Asynchronous call
__NebulaNativeInvoke.invokeAsync('request', JSON.stringify(params), {
  onSuccess: (result) => console.log('Success:', result),
  onFail: (error) => console.error('Error:', error)
});

// Metadata
console.log(__NebulaNativeInvoke.appId);    // Current appId
console.log(__NebulaNativeInvoke.version); // Framework version
```

## 🏗️ File Structure

```
SuperApp/Nebula/
├── NebulaHost.swift                    # Main API entry point
├── NebulaAppManager.swift              # Bridge instance manager
├── NebulaContainerController.swift     # View controller container
├── NebulaRouter.swift                  # Navigation router
├── NebulaConfig.swift                  # Configuration & sandbox
├── NebulaJSIGateway.h/.mm             # C++ JSI bridge
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

## 🐛 Debugging

Enable debug logging in `NebulaConfig`:

```swift
NebulaConfig.shared.enableDebugLogging = true
```

Check logs:
```
[Nebula] Creating bridge for my-mini-app with bundle: /path/to/bundle
[Nebula] JSI Gateway installed for appId: my-mini-app
[Nebula:JSI] syncInvoke: getDeviceInfo with params: {}
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
│   ├── NebulaJSIGateway.h
│   └── NebulaJSIGateway.mm
└── SuperApp-Bridging-Header.h
```

### 2. Configure Xcode Project

1. **Bridging Header**: Set `SuperApp-Bridging-Header.h` in Build Settings
2. **Other Linker Flags**: Add `-ObjC -lc++`
3. **Enable C++ Exceptions**: YES
4. **Enable RTTI**: YES (for JSI)

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

### Global JSI Object: `__NebulaNativeInvoke`

#### Synchronous Invoke

```javascript
// Get device info synchronously
const deviceInfo = __NebulaNativeInvoke.invokeSync('getDeviceInfo', '{}');
console.log(JSON.parse(deviceInfo)); 
// { model: "iPhone 17 Pro", systemVersion: "18.0", platform: "iOS" }

// Get current app ID
const appId = __NebulaNativeInvoke.invokeSync('getAppId', '{}');
console.log(appId); // "weather-app"
```

#### Asynchronous Invoke

```javascript
// Network request
__NebulaNativeInvoke.invokeAsync(
  'request',
  JSON.stringify({ 
    url: 'https://api.example.com/weather',
    method: 'GET'
  }),
  {
    onSuccess: (data) => {
      const result = JSON.parse(data);
      console.log('Weather data:', result);
    },
    onFail: (error) => {
      console.error('Request failed:', error);
    }
  }
);

// Show toast
__NebulaNativeInvoke.invokeAsync(
  'showToast',
  JSON.stringify({ title: 'Hello Nebula!' }),
  {
    onSuccess: () => console.log('Toast displayed'),
    onFail: (err) => console.error('Toast failed:', err)
  }
);
```

### Navigation (WeChat-style)

```javascript
// Navigate to another mini-app
__NebulaNativeInvoke.invokeAsync(
  'navigateTo',
  JSON.stringify({ url: 'nebula://product-app/detail?id=123' }),
  {
    onSuccess: () => console.log('Navigation success'),
    onFail: (err) => console.error('Navigation failed:', err)
  }
);

// Navigate to native page
__NebulaNativeInvoke.invokeAsync(
  'navigateTo',
  JSON.stringify({ url: 'native://settings' }),
  {
    onSuccess: () => console.log('Opened settings'),
    onFail: (err) => console.error('Failed to open settings:', err)
  }
);

// Open external URL
__NebulaNativeInvoke.invokeAsync(
  'navigateTo',
  JSON.stringify({ url: 'https://www.example.com' }),
  {
    onSuccess: () => console.log('Opened browser'),
    onFail: (err) => console.error('Failed to open URL:', err)
  }
);
```

### Alternative: React Native Module API

```javascript
import { NativeModules } from 'react-native';
const { NebulaRouterModule } = NativeModules;

// Navigate with Promise
NebulaRouterModule.navigateTo('nebula://another-app/page')
  .then(() => console.log('Success'))
  .catch(err => console.error('Failed:', err));

// Navigate back
NebulaRouterModule.navigateBack()
  .then(() => console.log('Back'))
  .catch(err => console.error('Failed:', err));
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
const appId = __NebulaNativeInvoke.invokeSync('getAppId', '{}');
const sandboxPath = __NebulaNativeInvoke.invokeSync('getSandboxPath', '{}');
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
```

## 🔧 Advanced Configuration

```swift
// Configure in AppDelegate
let config = NebulaConfig.shared
config.enableDebugLogging = true
config.maxConcurrentApps = 3
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

### Add Custom Native Methods

Edit `NebulaJSIGateway.mm`:

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

### Issue: JSI not working

```
ReferenceError: __NebulaNativeInvoke is not defined
```

**Solution**: Check bridging header and ensure JSI gateway is in `extraModules`:
- Verify `SuperApp-Bridging-Header.h` is set in Build Settings
- Rebuild project

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for high-performance SuperApps**
