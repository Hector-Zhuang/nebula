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
    private static let pageLifecycleEvent = "NebulaPageLifecycle"

    private let emitterId = UUID().uuidString
    private var hasListeners = false
    private var currentRuntimeAppId: String?
    private var messageObserver: NSObjectProtocol?
    private var pageLifecycleObservers: [NSObjectProtocol] = []
    private weak var presentedHostModalViewController: UIViewController?

    override init() {
        super.init()
        messageObserver = NotificationCenter.default.addObserver(
            forName: Self.messageNotificationName,
            object: nil,
            queue: .main
        ) { [weak self] notification in
            self?.handleBridgeMessage(notification)
        }
        pageLifecycleObservers = [
            NotificationCenter.default.addObserver(
                forName: NSNotification.Name("NebulaContainerWillAppear"),
                object: nil,
                queue: .main
            ) { [weak self] notification in
                self?.handlePageLifecycle(notification, type: "show")
            },
            NotificationCenter.default.addObserver(
                forName: NSNotification.Name("NebulaContainerDidDisappear"),
                object: nil,
                queue: .main
            ) { [weak self] notification in
                self?.handlePageLifecycle(notification, type: "hide")
            },
            NotificationCenter.default.addObserver(
                forName: NSNotification.Name("NebulaContainerDidUnload"),
                object: nil,
                queue: .main
            ) { [weak self] notification in
                self?.handlePageLifecycle(notification, type: "unload")
            },
            NotificationCenter.default.addObserver(
                forName: NSNotification.Name("NebulaContainerDidBecomeReady"),
                object: nil,
                queue: .main
            ) { [weak self] notification in
                self?.handlePageLifecycle(notification, type: "ready")
            }
        ]
    }

    deinit {
        if let observer = messageObserver {
            NotificationCenter.default.removeObserver(observer)
        }
        for observer in pageLifecycleObservers {
            NotificationCenter.default.removeObserver(observer)
        }
    }

    private func resolveTopViewController() -> UIViewController? {
        guard let navigationController = NebulaHost.shared.currentNavigationController() else {
            return nil
        }

        var topViewController: UIViewController = navigationController
        while let presented = topViewController.presentedViewController {
            topViewController = presented
        }

        if let navigation = topViewController as? UINavigationController {
            return navigation.topViewController ?? navigation
        }

        return topViewController
    }
    
    @objc override class func moduleName() -> String {
        return "NebulaNativeModule"
    }
    
    @objc override class func requiresMainQueueSetup() -> Bool {
        return true
    }

    override func supportedEvents() -> [String]! {
        return [Self.hostMessageEvent, Self.miniAppMessageEvent, Self.pageLifecycleEvent]
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

    @objc func openMiniAppWithBundleURL(_ appId: String,
                                      bundleURL: String,
                                      connectToURLMetroServer: Bool,
                                      initialProps: NSDictionary?,
                                      resolver: @escaping RCTPromiseResolveBlock,
                                      rejecter: @escaping RCTPromiseRejectBlock) {
        NebulaHost.shared.installApp(
            appId,
            bundleURL: bundleURL,
            connectToURLMetroServer: connectToURLMetroServer
        ) { success, error in
            if success {
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
            } else {
                rejecter("OPEN_ERROR", error?.localizedDescription ?? "Failed to open", error)
            }
        }
    }

    /// Install and preload a mini-app from a bundle URL
    @objc func preloadMiniAppWithBundleURL(_ appId: String,
                                      bundleURL: String,
                                      connectToURLMetroServer: Bool,
                                      resolver: @escaping RCTPromiseResolveBlock,
                                      rejecter: @escaping RCTPromiseRejectBlock) {
        NebulaHost.shared.installApp(
            appId,
            bundleURL: bundleURL,
            connectToURLMetroServer: connectToURLMetroServer
        ) { success, error in
            if success {
                NebulaHost.shared.preloadApp(appId)
                resolver(["success": true, "appId": appId])
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

    /// Install a mini-app from URL with explicit Metro connection preference
    @objc func installMiniAppWithBundleURL(_ appId: String,
                                      bundleURL: String,
                                      connectToURLMetroServer: Bool,
                                      resolver: @escaping RCTPromiseResolveBlock,
                                      rejecter: @escaping RCTPromiseRejectBlock) {
        NebulaHost.shared.installApp(
            appId,
            bundleURL: bundleURL,
            connectToURLMetroServer: connectToURLMetroServer
        ) { success, error in
            if success {
                resolver(["success": true, "appId": appId])
            } else {
                rejecter("INSTALL_ERROR", error?.localizedDescription ?? "Failed to install", error)
            }
        }
    }

    @objc func installMiniAppFromURLs(_ appId: String,
                                      bundleURL: String,
                                      manifestURL: String,
                                      assetsURL: String,
                                      connectToURLMetroServer: Bool,
                                      resolver: @escaping RCTPromiseResolveBlock,
                                      rejecter: @escaping RCTPromiseRejectBlock) {
        NebulaConfig.shared.downloadBundle(
            for: appId,
            from: bundleURL,
            manifestURL: manifestURL,
            assetsURL: assetsURL,
            connectToURLMetroServer: connectToURLMetroServer,
        ) { success, error in
            if success {
                NebulaAppManager.shared.invalidate(appId: appId)
                resolver(["success": true, "appId": appId])
            } else {
                rejecter("INSTALL_ERROR", error?.localizedDescription ?? "Failed to install", error)
            }
        }
    }

    @objc func closeMiniApp(_ appId: String,
                            resolver: @escaping RCTPromiseResolveBlock,
                            rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            NebulaHost.shared.closeApp(appId)
            resolver([
                "success": true,
                "appId": appId
            ])
        }
    }

    @objc func uninstallMiniApp(_ appId: String,
                                resolver: @escaping RCTPromiseResolveBlock,
                                rejecter: @escaping RCTPromiseRejectBlock) {
        do {
            try NebulaHost.shared.uninstallApp(appId)
            resolver(["success": true, "appId": appId])
        } catch {
            rejecter("UNINSTALL_ERROR", error.localizedDescription, error)
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

    @objc func registerManifest(_ appId: String,
                                manifest: NSDictionary,
                                resolver: @escaping RCTPromiseResolveBlock,
                                rejecter: @escaping RCTPromiseRejectBlock) {
        do {
            let data = try JSONSerialization.data(withJSONObject: manifest, options: [])
            let decodedManifest = try JSONDecoder().decode(NebulaManifest.self, from: data)
            currentRuntimeAppId = appId
            NebulaManifestManager.shared.registerManifest(forAppId: appId, manifest: decodedManifest)
            let entryPath = decodedManifest.entryPagePath ?? "/"
            if let pageConfig = NebulaManifestManager.shared.getPageConfig(forAppId: appId, path: entryPath) as? [String: Any] {
                NebulaRouter.shared.updatePageStyle(forAppId: appId, style: pageConfig as NSDictionary) { _, _ in }
            }
            resolver(["success": true, "appId": appId, "count": decodedManifest.pages.count])
        } catch {
            rejecter("INVALID_MANIFEST", "manifest must be a valid Nebula manifest object", error)
        }
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

    @objc func getInstalledMiniAppInfo(_ appId: String,
                                       resolver: @escaping RCTPromiseResolveBlock,
                                       rejecter: @escaping RCTPromiseRejectBlock) {
        guard let info = NebulaHost.shared.installedAppInfo(appId) else {
            resolver([
                "installed": false,
                "app": NSNull()
            ])
            return
        }

        resolver([
            "installed": true,
            "app": [
                "appId": info.appId,
                "mode": info.mode,
                "bundlePath": info.bundlePath,
                "sourceUrl": info.sourceUrl,
                "version": info.version as Any,
                "updateStrategy": info.updateStrategy
            ]
        ])
    }

    @objc func getServerBaseURL(_ resolver: @escaping RCTPromiseResolveBlock,
                                rejecter: @escaping RCTPromiseRejectBlock) {
        resolver([
            "serverBaseURL": NebulaConfig.shared.serverBaseURL
        ])
    }

    @objc func setServerBaseURL(_ serverBaseURL: String?,
                                resolver: @escaping RCTPromiseResolveBlock,
                                rejecter: @escaping RCTPromiseRejectBlock) {
        let trimmedValue = serverBaseURL?.trimmingCharacters(in: .whitespacesAndNewlines)
        if let trimmedValue,
           !trimmedValue.isEmpty,
           NebulaConfig.normalizeServerBaseURL(trimmedValue) == nil {
            rejecter("INVALID_SERVER_URL", "serverBaseURL must be a valid http(s) URL", nil)
            return
        }

        NebulaConfig.shared.serverBaseURL = trimmedValue
        resolver([
            "serverBaseURL": NebulaConfig.shared.serverBaseURL
        ])
    }

    @objc func setMiniappLoadingDelay(_ delayMs: NSNumber?,
                                      resolver: @escaping RCTPromiseResolveBlock,
                                      rejecter: @escaping RCTPromiseRejectBlock) {
        let normalizedDelayMs = max(0, delayMs?.doubleValue ?? 0)
        miniappLoadingDelay = normalizedDelayMs / 1000.0
        resolver([
            "delayMs": normalizedDelayMs
        ])
    }

    @objc func setMiniappLoadingEnterContentDelay(_ delayMs: NSNumber?,
                                                  resolver: @escaping RCTPromiseResolveBlock,
                                                  rejecter: @escaping RCTPromiseRejectBlock) {
        let normalizedDelayMs = max(0, delayMs?.doubleValue ?? 0)
        miniappLoadingEnterContentDelay = normalizedDelayMs / 1000.0
        resolver([
            "delayMs": normalizedDelayMs
        ])
    }

    @objc func setMiniappLoadingEnabled(_ enabled: Bool,
                                        resolver: @escaping RCTPromiseResolveBlock,
                                        rejecter: @escaping RCTPromiseRejectBlock) {
        miniappLoadingEnabled = enabled
        resolver([
            "enabled": enabled
        ])
    }

    @objc func bringHostToFront(_ resolver: @escaping RCTPromiseResolveBlock,
                                rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let token = NebulaHost.shared.bringHostToFront()
            resolver([
                "success": token != nil,
                "token": token
            ])
        }
    }

    @objc func restoreMiniApp(_ token: String?,
                              resolver: @escaping RCTPromiseResolveBlock,
                              rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let success = NebulaHost.shared.restoreMiniApp(with: token)
            resolver([
                "success": success,
                "token": token as Any
            ])
        }
    }

    @objc func presentHostModal(_ moduleName: String,
                                props: NSDictionary,
                                resolver: @escaping RCTPromiseResolveBlock,
                                rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            guard let presenter = self.resolveTopViewController() else {
                resolver(["errMsg": "presentHostModal:fail no_presenter"])
                return
            }

            let initialProps = props as? [AnyHashable: Any]
            guard let modalViewController = NebulaHost.shared.makeHostViewController(
                moduleName: moduleName,
                initialProperties: initialProps,
                title: moduleName
            ) else {
                resolver(["errMsg": "presentHostModal:fail no_host_view_controller"])
                return
            }
            modalViewController.modalPresentationStyle = .overFullScreen
            modalViewController.modalTransitionStyle = .crossDissolve
            modalViewController.view.backgroundColor = .clear
            self.presentedHostModalViewController = modalViewController

            presenter.present(modalViewController, animated: true) {
                resolver(["errMsg": "presentHostModal:ok"])
            }
        }
    }

    @objc func dismissHostModal(_ resolver: @escaping RCTPromiseResolveBlock,
                                rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let modalViewController =
                self.presentedHostModalViewController
                ?? self.resolveTopViewController()?.presentedViewController
                ?? self.resolveTopViewController()

            guard let modalViewController else {
                resolver(["errMsg": "dismissHostModal:ok"])
                return
            }

            modalViewController.dismiss(animated: true) {
                self.presentedHostModalViewController = nil
                resolver(["errMsg": "dismissHostModal:ok"])
            }
        }
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
                    rejecter("navigateTo", error?.localizedDescription ?? "unknown", nil)
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
                    rejecter("redirectTo", error?.localizedDescription ?? "unknown", nil)
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
                    rejecter("reLaunch", error?.localizedDescription ?? "unknown", nil)
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
                    rejecter("navigateBack", error?.localizedDescription ?? "unknown", nil)
                }
            }
        }
    }

    @objc func setPageStyle(_ appId: String,
                            style: NSDictionary,
                            resolver: @escaping RCTPromiseResolveBlock,
                            rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            NebulaRouter.shared.updatePageStyle(forAppId: appId, style: style) { success, error in
                if success {
                    resolver(["errMsg": "setPageStyle:ok"])
                } else {
                    rejecter("setPageStyle", error?.localizedDescription ?? "unknown", nil)
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
            guard !isMiniAppRuntime() else {
                return
            }
            sendEvent(withName: Self.hostMessageEvent, body: [
                "appId": appId,
                "message": message,
                "timestamp": userInfo["timestamp"] ?? Date().timeIntervalSince1970
            ])
        case .toMiniApp:
            let miniAppRuntime = isMiniAppRuntime()
            guard miniAppRuntime, currentRuntimeAppId == appId else {
                return
            }
            sendEvent(withName: Self.miniAppMessageEvent, body: [
                "appId": appId,
                "message": message,
                "timestamp": userInfo["timestamp"] ?? Date().timeIntervalSince1970
            ])
        }
    }

    private func handlePageLifecycle(_ notification: Notification, type: String) {
        guard hasListeners,
              let userInfo = notification.userInfo,
              let appId = userInfo["appId"] as? String,
              (!isMiniAppRuntime() || currentRuntimeAppId == appId),
              let instanceId = userInfo["instanceId"] as? String else {
            return
        }

        sendEvent(withName: Self.pageLifecycleEvent, body: [
            "appId": appId,
            "instanceId": instanceId,
            "routePath": userInfo["routePath"] as? String ?? "/",
            "type": type
        ])
    }

    private func isMiniAppRuntime() -> Bool {
        if let currentRuntimeAppId, !currentRuntimeAppId.isEmpty {
            return true
        }

        guard let bundleURLString = bridge?.bundleURL?.absoluteString.lowercased() else {
            return false
        }
        return bundleURLString.contains("/miniapps/")
            || bundleURLString.contains("entryfile=miniapps/")
            || bundleURLString.contains("entryfile=miniapps%2f")
    }
}
