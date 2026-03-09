//
//  NebulaUsageExample.swift
//  SuperApp - Nebula Mini-App Container
//
//  Usage examples for Nebula framework
//

import UIKit

// MARK: - Example 1: Initialize Nebula in AppDelegate

extension AppDelegate {
    
    func setupNebula() {
        // Initialize Nebula framework
        NebulaHost.shared.initialize()
        
        // Optional: Configure settings
        NebulaConfig.shared.enableDebugLogging = true
        NebulaConfig.shared.maxConcurrentApps = 3
    }
}

// MARK: - Example 2: Download and Open a Mini-App

class ExampleViewController: UIViewController {
    
    func downloadAndOpenMiniApp() {
        let appId = "weather-app"
        let bundleURL = "https://cdn.example.com/miniapps/weather/index.bundle"
        
        // Show loading
        let loadingAlert = UIAlertController(title: "下载中...", message: nil, preferredStyle: .alert)
        present(loadingAlert, animated: true)
        
        // Download and install
        NebulaHost.shared.installApp(appId, bundleURL: bundleURL) { [weak self] success, error in
            loadingAlert.dismiss(animated: true) {
                if success {
                    // Open the mini-app
                    NebulaHost.shared.openApp(
                        appId,
                        from: self!,
                        initialProps: [
                            "title": "天气小程序",
                            "city": "Beijing"
                        ]
                    )
                } else {
                    print("Download failed: \(error?.localizedDescription ?? "unknown")")
                }
            }
        }
    }
}

// MARK: - Example 3: Preload Mini-Apps

class AppLaunchController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Preload frequently used mini-apps
        NebulaHost.shared.preloadApp("home-app")
        NebulaHost.shared.preloadApp("shopping-app")
        NebulaHost.shared.preloadApp("payment-app")
    }
}

// MARK: - Example 4: Direct Open with NavigationController

class MiniAppListViewController: UIViewController {
    
    func openMiniApp(appId: String) {
        // Simple open
        NebulaHost.shared.openApp(
            appId,
            from: self,
            initialProps: ["userId": "12345"],
            animated: true
        )
    }
}

// MARK: - Example 5: JavaScript Side Usage

/*
// In your mini-app JavaScript code:

// 1. Use the global __NebulaNativeInvoke object

// Sync invoke
const deviceInfo = __NebulaNativeInvoke.invokeSync('getDeviceInfo', '{}');
console.log('Device:', JSON.parse(deviceInfo));

// Async invoke with callbacks
__NebulaNativeInvoke.invokeAsync(
  'request',
  JSON.stringify({ url: 'https://api.example.com/data' }),
  {
    onSuccess: (data) => {
      console.log('Success:', data);
    },
    onFail: (error) => {
      console.error('Failed:', error);
    }
  }
);

// 2. Use the navigation API (wx-style)

// Navigate to another mini-app or page
__NebulaNativeInvoke.invokeAsync(
  'navigateTo',
  JSON.stringify({ url: 'nebula://product-app/detail?id=123' }),
  {
    onSuccess: () => console.log('Navigation success'),
    onFail: (err) => console.error('Navigation failed:', err)
  }
);

// Show toast
__NebulaNativeInvoke.invokeAsync(
  'showToast',
  JSON.stringify({ title: 'Hello from mini-app!' }),
  {
    onSuccess: () => console.log('Toast shown'),
    onFail: (err) => console.error('Toast failed:', err)
  }
);

// 3. Use the RCTBridgeModule API (alternative)

import { NativeModules } from 'react-native';
const { NebulaRouterModule } = NativeModules;

// Navigate using Promise
NebulaRouterModule.navigateTo('nebula://another-app/page')
  .then(() => console.log('Navigation success'))
  .catch(err => console.error('Navigation failed:', err));

// Navigate back
NebulaRouterModule.navigateBack()
  .then(() => console.log('Back success'))
  .catch(err => console.error('Back failed:', err));
*/

// MARK: - Example 6: Managing Mini-App Lifecycle

class MiniAppManagerViewController: UIViewController {
    
    func showInstalledApps() {
        let apps = NebulaHost.shared.installedApps()
        print("Installed mini-apps: \(apps)")
    }
    
    func uninstallApp(appId: String) {
        do {
            try NebulaHost.shared.uninstallApp(appId)
            print("Successfully uninstalled \(appId)")
        } catch {
            print("Failed to uninstall: \(error)")
        }
    }
    
    func closeRunningApp(appId: String) {
        NebulaHost.shared.closeApp(appId)
    }
}
