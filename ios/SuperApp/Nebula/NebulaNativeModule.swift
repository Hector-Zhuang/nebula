//
//  NebulaNativeModule.swift
//  SuperApp - Nebula Mini-App Container
//
//  Native module for main app to open mini-apps
//

import Foundation
import React

@objc(NebulaNativeModule)
class NebulaNativeModule: RCTEventEmitter {

    private enum BridgeMessageDirection: String {
        case toHost
        case toMiniApp
    }

    private static let messageNotificationName = Notification.Name("NebulaBridgeMessage")
    private static let hostMessageEvent = "NebulaHostMessage"
    private static let miniAppMessageEvent = "NebulaMiniAppMessage"

    private let emitterId = UUID().uuidString
    private var hasListeners = false
    private var currentRuntimeAppId: String?
    private var messageObserver: NSObjectProtocol?

    override init() {
        super.init()
        messageObserver = NotificationCenter.default.addObserver(
            forName: Self.messageNotificationName,
            object: nil,
            queue: .main
        ) { [weak self] notification in
            self?.handleBridgeMessage(notification)
        }
    }

    deinit {
        if let observer = messageObserver {
            NotificationCenter.default.removeObserver(observer)
        }
    }

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
    
    @objc override class func moduleName() -> String {
        return "NebulaNativeModule"
    }
    
    @objc override class func requiresMainQueueSetup() -> Bool {
        return true
    }

    override func supportedEvents() -> [String]! {
        return [Self.hostMessageEvent, Self.miniAppMessageEvent]
    }

    override func startObserving() {
        hasListeners = true
    }

    override func stopObserving() {
        hasListeners = false
    }
    
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
    
    /// Register route table from mini-app JS at startup
    /// Called by the mini-app itself so native routing knows which component handles each path
    @objc func registerRoutes(_ appId: String,
                              routes: NSDictionary,
                              resolver: @escaping RCTPromiseResolveBlock,
                              rejecter: @escaping RCTPromiseRejectBlock) {
        guard let pages = routes as? [String: String] else {
            rejecter("INVALID_ROUTES", "routes must be a flat object mapping path -> componentName", nil)
            return
        }
        currentRuntimeAppId = appId
        NebulaManifestManager.shared.registerManifest(forAppId: appId, pages: pages)
        resolver(["success": true, "appId": appId, "count": pages.count])
    }

    /// Mini-app -> Host communication
    @objc func postMessageToHost(_ appId: String,
                                 message: NSDictionary,
                                 resolver: @escaping RCTPromiseResolveBlock,
                                 rejecter: @escaping RCTPromiseRejectBlock) {
        currentRuntimeAppId = appId
        publishBridgeMessage(direction: .toHost, appId: appId, message: message)
        resolver(["errMsg": "postMessageToHost:ok"])
    }

    /// Host -> Mini-app communication
    @objc func postMessageToMiniApp(_ appId: String,
                                    message: NSDictionary,
                                    resolver: @escaping RCTPromiseResolveBlock,
                                    rejecter: @escaping RCTPromiseRejectBlock) {
        publishBridgeMessage(direction: .toMiniApp, appId: appId, message: message)
        resolver(["errMsg": "postMessageToMiniApp:ok"])
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

    private func publishBridgeMessage(direction: BridgeMessageDirection,
                                      appId: String,
                                      message: NSDictionary) {
        let payload = message as? [String: Any] ?? [:]
        NotificationCenter.default.post(
            name: Self.messageNotificationName,
            object: nil,
            userInfo: [
                "direction": direction.rawValue,
                "appId": appId,
                "message": payload,
                "sourceEmitterId": emitterId,
                "timestamp": Date().timeIntervalSince1970
            ]
        )
    }

    private func handleBridgeMessage(_ notification: Notification) {
        guard hasListeners,
              let userInfo = notification.userInfo,
              let directionRaw = userInfo["direction"] as? String,
              let direction = BridgeMessageDirection(rawValue: directionRaw),
              let appId = userInfo["appId"] as? String,
              let message = userInfo["message"] as? [String: Any] else {
            return
        }

        let sourceEmitterId = userInfo["sourceEmitterId"] as? String
        if sourceEmitterId == emitterId {
            return
        }

        switch direction {
        case .toHost:
            guard !isMiniAppRuntime() else { return }
            sendEvent(withName: Self.hostMessageEvent, body: [
                "appId": appId,
                "message": message,
                "timestamp": userInfo["timestamp"] ?? Date().timeIntervalSince1970
            ])
        case .toMiniApp:
            guard isMiniAppRuntime(), currentRuntimeAppId == appId else { return }
            sendEvent(withName: Self.miniAppMessageEvent, body: [
                "appId": appId,
                "message": message,
                "timestamp": userInfo["timestamp"] ?? Date().timeIntervalSince1970
            ])
        }
    }

    private func isMiniAppRuntime() -> Bool {
        guard let bundleURLString = bridge?.bundleURL?.absoluteString.lowercased() else {
            return false
        }
        return bundleURLString.contains("/miniapps/")
            || bundleURLString.contains("entryfile=miniapps/")
            || bundleURLString.contains("entryfile=miniapps%2f")
    }
}
