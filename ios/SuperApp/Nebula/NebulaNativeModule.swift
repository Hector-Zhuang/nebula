//
//  NebulaNativeModule.swift
//  SuperApp - Nebula Mini-App Container
//
//  Native module for main app to open mini-apps
//

import Foundation
import React

@objc(NebulaNativeModule)
class NebulaNativeModule: NSObject {

    private func parseRuntimeMode(_ mode: String,
                                  rejecter: @escaping RCTPromiseRejectBlock) -> NebulaConfig.RuntimeMode? {
        switch mode.lowercased() {
        case "development", "dev", "hot":
            return .development
        case "production", "prod":
            return .production
        default:
            rejecter("INVALID_MODE", "mode must be 'development' or 'production'", nil)
            return nil
        }
    }
    
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
            
            // Find the topmost view controller
            var topVC = rootVC
            while let presented = topVC.presentedViewController {
                topVC = presented
            }
            
            // If it's a navigation controller, use it
            let sourceVC = (topVC as? UINavigationController)?.topViewController ?? topVC
            
            // Open mini-app
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

    /// Install a mini-app with explicit runtime mode
    @objc func installMiniAppWithMode(_ appId: String,
                                      bundleURL: String,
                                      mode: String,
                                      resolver: @escaping RCTPromiseResolveBlock,
                                      rejecter: @escaping RCTPromiseRejectBlock) {
        guard let runtimeMode = parseRuntimeMode(mode, rejecter: rejecter) else {
            return
        }

        NebulaHost.shared.installApp(appId, bundleURL: bundleURL, mode: runtimeMode) { success, error in
            if success {
                resolver(["success": true, "appId": appId, "mode": mode.lowercased()])
            } else {
                rejecter("INSTALL_ERROR", error?.localizedDescription ?? "Failed to install", error)
            }
        }
    }
    
    /// Get list of installed mini-apps
    @objc func getInstalledMiniApps(_ resolver: @escaping RCTPromiseResolveBlock,
                                    rejecter: @escaping RCTPromiseRejectBlock) {
        let apps = NebulaHost.shared.installedApps()
        resolver(["apps": apps])
    }
    
    // MARK: - Mini-App Navigation APIs
    
    @objc func navigateTo(_ appId: String,
                         url: String,
                         resolver: @escaping RCTPromiseResolveBlock,
                         rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            NebulaRouter.shared.navigateToURL(url, fromAppId: appId) { success, error in
                if success {
                    resolver(["errMsg": "navigateTo:ok"])
                } else {
                    resolver(["errMsg": "navigateTo:fail \(error?.localizedDescription ?? "unknown")"])
                }
            }
        }
    }
    
    @objc func redirectTo(_ appId: String,
                         url: String,
                         resolver: @escaping RCTPromiseResolveBlock,
                         rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            NebulaRouter.shared.redirectToURL(url, fromAppId: appId) { success, error in
                if success {
                    resolver(["errMsg": "redirectTo:ok"])
                } else {
                    resolver(["errMsg": "redirectTo:fail \(error?.localizedDescription ?? "unknown")"])
                }
            }
        }
    }
    
    @objc func reLaunch(_ appId: String,
                       url: String,
                       resolver: @escaping RCTPromiseResolveBlock,
                       rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            NebulaRouter.shared.reLaunchURL(url, fromAppId: appId) { success, error in
                if success {
                    resolver(["errMsg": "reLaunch:ok"])
                } else {
                    resolver(["errMsg": "reLaunch:fail \(error?.localizedDescription ?? "unknown")"])
                }
            }
        }
    }
    
    @objc func navigateBack(_ appId: String,
                           delta: Int,
                           resolver: @escaping RCTPromiseResolveBlock,
                           rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            NebulaRouter.shared.navigateBack(fromAppId: appId, delta: delta) { success, error in
                if success {
                    resolver(["errMsg": "navigateBack:ok"])
                } else {
                    resolver(["errMsg": "navigateBack:fail \(error?.localizedDescription ?? "unknown")"])
                }
            }
        }
    }
    
    @objc func showToast(_ title: String,
                        resolver: @escaping RCTPromiseResolveBlock,
                        rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            guard let window = UIApplication.shared.windows.first(where: { $0.isKeyWindow }),
                  let rootVC = window.rootViewController else {
                resolver(["errMsg": "showToast:fail no_active_window"])
                return
            }
            
            let alert = UIAlertController(title: nil, message: title, preferredStyle: .alert)
            rootVC.presentedViewController?.present(alert, animated: true)
            ?? rootVC.present(alert, animated: true)
            
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                alert.dismiss(animated: true)
            }
            
            resolver(["errMsg": "showToast:ok"])
        }
    }
    
    @objc func getDeviceInfo() -> NSDictionary {
        let device = UIDevice.current
        return [
            "model": device.model,
            "systemVersion": device.systemVersion,
            "platform": "iOS"
        ]
    }
}
