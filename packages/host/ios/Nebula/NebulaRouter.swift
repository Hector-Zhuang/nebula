//
//  NebulaRouter.swift
//  SuperApp - Nebula Mini-App Container
//
//  Router for handling navigation between mini-apps and native pages
//

import UIKit
import React

@objc public final class NebulaRouter: NSObject {
    
    // MARK: - Singleton
    
    @objc public static let shared = NebulaRouter()
    
    // MARK: - Properties
    
    // Primary storage: instanceId -> controller
    private var containerRegistry: [String: WeakContainer] = [:]
    // Secondary index: appId -> [instanceIds]
    private var appIdToInstances: [String: Set<String>] = [:]
    private let queue = DispatchQueue(label: "com.nebula.router", attributes: .concurrent)
    
    // MARK: - Types
    
    private struct WeakContainer {
        weak var controller: NebulaContainerController?
    }

    private enum NavigationAction {
        case push
        case replaceTop
        case relaunch
    }
    
    // MARK: - Container Registry
    
    func registerContainer(_ controller: NebulaContainerController, instanceId: String, appId: String) {
        queue.async(flags: .barrier) { [weak self] in
            guard let self = self else { return }
            self.containerRegistry[instanceId] = WeakContainer(controller: controller)
            
            // Update appId mapping
            if self.appIdToInstances[appId] == nil {
                self.appIdToInstances[appId] = Set<String>()
            }
            self.appIdToInstances[appId]?.insert(instanceId)
            
            print("[Nebula] Registered container: appId=\(appId), instanceId=\(instanceId)")
        }
    }
    
    func unregisterContainer(for instanceId: String) {
        queue.async(flags: .barrier) { [weak self] in
            guard let self = self else { return }
            
            // Find and remove from appId mapping
            for (appId, instanceIds) in self.appIdToInstances {
                if instanceIds.contains(instanceId) {
                    self.appIdToInstances[appId]?.remove(instanceId)
                    if self.appIdToInstances[appId]?.isEmpty == true {
                        self.appIdToInstances.removeValue(forKey: appId)
                    }
                    break
                }
            }
            
            self.containerRegistry.removeValue(forKey: instanceId)
            print("[Nebula] Unregistered container: instanceId=\(instanceId)")
        }
    }
    
    // Find container by instanceId or appId (finds topmost visible instance)
    private func findContainer(byInstanceId instanceId: String? = nil, orAppId appId: String? = nil) -> NebulaContainerController? {
        var result: NebulaContainerController?
        
        queue.sync {
            // First try instanceId (most specific)
            if let instanceId = instanceId {
                result = containerRegistry[instanceId]?.controller
                return
            }
            
            // Fallback to appId - find the topmost visible instance
            if let appId = appId, let instanceIds = appIdToInstances[appId] {
                var topmost: NebulaContainerController?
                var topmostLevel = -1
                
                for instanceId in instanceIds {
                    guard let controller = containerRegistry[instanceId]?.controller else { continue }
                    
                    // Find the navigation level (how deep in the stack)
                    if let navController = controller.navigationController,
                       let index = navController.viewControllers.firstIndex(of: controller) {
                        if index > topmostLevel {
                            topmost = controller
                            topmostLevel = index
                        }
                    } else if topmost == nil {
                        // No nav controller, just use first found
                        topmost = controller
                    }
                }
                
                result = topmost
            }
        }
        
        return result
    }

    // MARK: - Navigation
    
    /// Navigate to a URL (mini-app or native page)
    @objc public func navigateToURL(_ url: String,
                                     fromAppId: String,
                                     completion: @escaping (Bool, Error?) -> Void) {
        guard let parsedURL = NebulaURL.parse(url) else {
            let error = NSError(
                domain: "com.nebula.router",
                code: -1,
                userInfo: [NSLocalizedDescriptionKey: "Invalid URL: \(url)"]
            )
            completion(false, error)
            return
        }
        
        DispatchQueue.main.async { [weak self] in
            self?.handleNavigation(parsedURL, fromAppId: fromAppId, action: .push, completion: completion)
        }
    }

    /// Replace current page with target page
    @objc public func redirectToURL(_ url: String,
                                    fromAppId: String,
                                    completion: @escaping (Bool, Error?) -> Void) {
        guard let parsedURL = NebulaURL.parse(url) else {
            let error = NSError(
                domain: "com.nebula.router",
                code: -1,
                userInfo: [NSLocalizedDescriptionKey: "Invalid URL: \(url)"]
            )
            completion(false, error)
            return
        }

        DispatchQueue.main.async { [weak self] in
            self?.handleNavigation(parsedURL, fromAppId: fromAppId, action: .replaceTop, completion: completion)
        }
    }

    /// Close all mini-app pages and open target page
    @objc public func reLaunchURL(_ url: String,
                                  fromAppId: String,
                                  completion: @escaping (Bool, Error?) -> Void) {
        guard let parsedURL = NebulaURL.parse(url) else {
            let error = NSError(
                domain: "com.nebula.router",
                code: -1,
                userInfo: [NSLocalizedDescriptionKey: "Invalid URL: \(url)"]
            )
            completion(false, error)
            return
        }

        DispatchQueue.main.async { [weak self] in
            self?.handleNavigation(parsedURL, fromAppId: fromAppId, action: .relaunch, completion: completion)
        }
    }
    
    /// Navigate back
    @objc public func navigateBack(fromAppId: String,
                                   delta: Int = 1,
                                   completion: @escaping (Bool, Error?) -> Void) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else {
                completion(false, nil)
                return
            }
            
            // Find the container by appId (will find topmost instance)
            guard let container = self.findContainer(orAppId: fromAppId) else {
                completion(false, NSError(
                    domain: "com.nebula.router",
                    code: -2,
                    userInfo: [NSLocalizedDescriptionKey: "Container not found for appId: \(fromAppId)"]
                ))
                return
            }

            guard let navigationController = container.navigationController else {
                completion(false, NSError(
                    domain: "com.nebula.router",
                    code: -2,
                    userInfo: [NSLocalizedDescriptionKey: "Navigation controller not found"]
                ))
                return
            }

            let normalizedDelta = max(1, delta)
            let stack = navigationController.viewControllers
            guard stack.count > 1 else {
                completion(false, NSError(
                    domain: "com.nebula.router",
                    code: -6,
                    userInfo: [NSLocalizedDescriptionKey: "Cannot navigateBack: already at root"]
                ))
                return
            }

            let targetIndex = max(0, stack.count - 1 - normalizedDelta)
            let targetVC = stack[targetIndex]
            navigationController.popToViewController(targetVC, animated: true)
            completion(true, nil)
        }
    }

    @objc public func closeApp(
        _ appId: String,
        completion: @escaping (Bool, Error?) -> Void
    ) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else {
                completion(false, nil)
                return
            }

            guard let container = self.findContainer(orAppId: appId) else {
                completion(false, NSError(
                    domain: "com.nebula.router",
                    code: -7,
                    userInfo: [NSLocalizedDescriptionKey: "Container not found for appId: \(appId)"]
                ))
                return
            }

            container.dismissLoading()

            if let navigationController = container.navigationController,
               navigationController.topViewController === container {
                navigationController.popViewController(animated: true)
                completion(true, nil)
                return
            }

            if container.presentingViewController != nil {
                container.dismiss(animated: true) {
                    completion(true, nil)
                }
                return
            }

            completion(false, NSError(
                domain: "com.nebula.router",
                code: -8,
                userInfo: [NSLocalizedDescriptionKey: "Miniapp container is not currently closable"]
            ))
        }
    }

    @objc public func updatePageStyle(forAppId appId: String,
                                      style: NSDictionary,
                                      completion: @escaping (Bool, Error?) -> Void) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self,
                  let container = self.findContainer(orAppId: appId) else {
                completion(false, NSError(
                    domain: "com.nebula.router",
                    code: -8,
                    userInfo: [NSLocalizedDescriptionKey: "Container not found for appId: \(appId)"]
                ))
                return
            }

            container.updatePageStyle(style as? [String: Any] ?? [:])
            completion(true, nil)
        }
    }
    
    // MARK: - Private Methods
    
    private func handleNavigation(_ url: NebulaURL,
                                  fromAppId: String,
                                  action: NavigationAction,
                                  completion: @escaping (Bool, Error?) -> Void) {
        // Find source container by appId (will find topmost instance)
        guard let sourceContainer = findContainer(orAppId: fromAppId),
              let navigationController = sourceContainer.navigationController else {
            completion(false, NSError(
                domain: "com.nebula.router",
                code: -2,
                userInfo: [NSLocalizedDescriptionKey: "Navigation controller not found for appId: \(fromAppId)"]
            ))
            return
        }
        
        switch url.scheme {
        case .miniApp:
            // Navigate to another mini-app
            let targetAppId = url.appId ?? fromAppId
            let targetPath = url.path ?? NebulaManifestManager.shared.getEntryPagePath(forAppId: targetAppId) ?? "/"
            guard NebulaManifestManager.shared.getComponentName(forAppId: targetAppId, path: targetPath) != nil else {
                completion(false, NSError(
                    domain: "com.nebula.router",
                    code: -4,
                    userInfo: [NSLocalizedDescriptionKey: "No component registered for route '\(targetPath)' in app '\(targetAppId)'"]
                ))
                return
            }
            let routeProps = buildRouteInitialProps(url: url, appId: targetAppId)
            let targetVC = NebulaContainerController(
                appId: targetAppId,
                initialProps: routeProps,
                delayContentEntrance: false
            )
            do {
                try applyNavigationAction(action, targetVC: targetVC, navigationController: navigationController)
                completion(true, nil)
            } catch {
                completion(false, error)
            }
            
        case .native:
            // Navigate to native page (custom implementation)
            handleNativeNavigation(url,
                                   action: action,
                                   navigationController: navigationController,
                                   completion: completion)
            
        case .external:
            // Open external URL
            if let externalURL = URL(string: url.originalURL) {
                UIApplication.shared.open(externalURL, options: [:]) { success in
                    completion(success, nil)
                }
            } else {
                completion(false, NSError(
                    domain: "com.nebula.router",
                    code: -3,
                    userInfo: [NSLocalizedDescriptionKey: "Invalid external URL"]
                ))
            }
        }
    }

    private func buildRouteInitialProps(url: NebulaURL, appId: String) -> [String: Any]? {
        var props = url.params ?? [:]
        if let path = url.path {
            props["__routePath"] = path
            if let pageConfig = NebulaManifestManager.shared.getPageConfig(forAppId: appId, path: path) as? [String: Any] {
                props["__pageConfig"] = pageConfig
            }
            print("[Nebula] Routing \(appId):\(path)")
        }
        props["__routeUrl"] = url.originalURL
        return props.isEmpty ? nil : props
    }

    private func applyNavigationAction(_ action: NavigationAction,
                                       targetVC: UIViewController,
                                       navigationController: UINavigationController) throws {
        switch action {
        case .push:
            let maxDepth = NebulaConfig.shared.maxNavigationStackDepth
            let stack = navigationController.viewControllers
            
            // Get appId from target container (if it's a mini-app page)
            var targetAppId: String?
            if let targetContainer = targetVC as? NebulaContainerController {
                targetAppId = targetContainer.appId
            }
            
            // Count only mini-app pages with the same appId (don't count host app pages)
            let miniAppPageCount: Int
            if let appId = targetAppId {
                miniAppPageCount = stack.filter { vc in
                    guard let container = vc as? NebulaContainerController else { return false }
                    return container.appId == appId
                }.count
            } else {
                // For non-mini-app pages, count all pages
                miniAppPageCount = stack.count
            }
            
            // Reject navigation if this mini-app's stack is already at max depth
            if miniAppPageCount >= maxDepth {
                let appIdLabel = targetAppId ?? "unknown"
                print("[Nebula] Navigation rejected: mini-app \(appIdLabel) stack at max depth (\(miniAppPageCount)/\(maxDepth))")
                throw NSError(
                    domain: "com.nebula.router",
                    code: -7,
                    userInfo: [NSLocalizedDescriptionKey: "Navigation stack limit reached for this mini-app (max: \(maxDepth)). Cannot push more pages."]
                )
            }
            
            // Add the new page
            navigationController.pushViewController(targetVC, animated: true)
            
        case .replaceTop:
            var stack = navigationController.viewControllers
            if !stack.isEmpty {
                stack.removeLast()
            }
            stack.append(targetVC)
            navigationController.setViewControllers(stack, animated: true)
        case .relaunch:
            if let root = navigationController.viewControllers.first {
                navigationController.setViewControllers([root, targetVC], animated: true)
            } else {
                navigationController.setViewControllers([targetVC], animated: true)
            }
        }
    }
    
    private func handleNativeNavigation(_ url: NebulaURL,
                                        action: NavigationAction,
                                        navigationController: UINavigationController,
                                        completion: @escaping (Bool, Error?) -> Void) {
        // Example: Handle native://settings, native://profile, etc.
        guard let path = url.path else {
            completion(false, NSError(
                domain: "com.nebula.router",
                code: -4,
                userInfo: [NSLocalizedDescriptionKey: "Missing path in native URL"]
            ))
            return
        }
        
        switch path {
        case "settings":
            // Navigate to native settings page
            let settingsVC = UIViewController()
            settingsVC.title = "Settings"
            settingsVC.view.backgroundColor = .systemBackground
            do {
                try applyNavigationAction(action, targetVC: settingsVC, navigationController: navigationController)
                completion(true, nil)
            } catch {
                completion(false, error)
            }
            
        default:
            completion(false, NSError(
                domain: "com.nebula.router",
                code: -5,
                userInfo: [NSLocalizedDescriptionKey: "Unknown native path: \(path)"]
            ))
        }
    }
    
    private override init() {
        super.init()
    }
}

// MARK: - URL Parser

private struct NebulaURL {
    enum Scheme {
        case miniApp    // nebula://appId/path
        case native     // native://path
        case external   // http://, https://
    }
    
    let scheme: Scheme
    let appId: String?
    let path: String?
    let params: [String: Any]?
    let originalURL: String
    
    static func parse(_ urlString: String) -> NebulaURL? {
        guard let url = URL(string: urlString) else {
            return nil
        }
        
        var scheme: Scheme
        var appId: String?
        var path: String?
        var params: [String: Any] = [:]
        
        // Parse scheme
        if urlString.hasPrefix("nebula://") {
            scheme = .miniApp
            appId = url.host
            path = url.path.isEmpty ? nil : url.path
        } else if urlString.hasPrefix("native://") {
            scheme = .native
            path = url.host
        } else if urlString.hasPrefix("http://") || urlString.hasPrefix("https://") {
            scheme = .external
        } else {
            // Default to mini-app with relative path
            scheme = .miniApp
            path = urlString
        }
        
        // Parse query parameters
        if let components = URLComponents(string: urlString),
           let queryItems = components.queryItems {
            for item in queryItems {
                params[item.name] = item.value
            }
        }
        
        return NebulaURL(
            scheme: scheme,
            appId: appId,
            path: path,
            params: params.isEmpty ? nil : params,
            originalURL: urlString
        )
    }
}

// MARK: - Router Module (RCTBridgeModule)

@objc(NebulaRouterModule)
final class NebulaRouterModule: NSObject {
    
    private let appId: String
    
    @objc static func moduleName() -> String! {
        return "NebulaRouterModule"
    }
    
    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    init(appId: String) {
        self.appId = appId
        super.init()
    }
    
    @objc func navigateTo(_ url: String,
                          resolver: @escaping RCTPromiseResolveBlock,
                          rejecter: @escaping RCTPromiseRejectBlock) {
        NebulaRouter.shared.navigateToURL(url, fromAppId: appId) { success, error in
            if success {
                resolver(["success": true])
            } else {
                rejecter("NAVIGATION_ERROR", error?.localizedDescription ?? "Unknown error", error)
            }
        }
    }

    @objc func redirectTo(_ url: String,
                          resolver: @escaping RCTPromiseResolveBlock,
                          rejecter: @escaping RCTPromiseRejectBlock) {
        NebulaRouter.shared.redirectToURL(url, fromAppId: appId) { success, error in
            if success {
                resolver(["success": true])
            } else {
                rejecter("NAVIGATION_ERROR", error?.localizedDescription ?? "Unknown error", error)
            }
        }
    }

    @objc func reLaunch(_ url: String,
                        resolver: @escaping RCTPromiseResolveBlock,
                        rejecter: @escaping RCTPromiseRejectBlock) {
        NebulaRouter.shared.reLaunchURL(url, fromAppId: appId) { success, error in
            if success {
                resolver(["success": true])
            } else {
                rejecter("NAVIGATION_ERROR", error?.localizedDescription ?? "Unknown error", error)
            }
        }
    }
    
    @objc func navigateBack(_ resolver: @escaping RCTPromiseResolveBlock,
                            rejecter: @escaping RCTPromiseRejectBlock) {
        NebulaRouter.shared.navigateBack(fromAppId: appId, delta: 1) { success, error in
            if success {
                resolver(["success": true])
            } else {
                rejecter("NAVIGATION_ERROR", error?.localizedDescription ?? "Unknown error", error)
            }
        }
    }

    @objc func navigateBackWithDelta(_ delta: NSNumber,
                                     resolver: @escaping RCTPromiseResolveBlock,
                                     rejecter: @escaping RCTPromiseRejectBlock) {
        NebulaRouter.shared.navigateBack(fromAppId: appId, delta: delta.intValue) { success, error in
            if success {
                resolver(["success": true])
            } else {
                rejecter("NAVIGATION_ERROR", error?.localizedDescription ?? "Unknown error", error)
            }
        }
    }
}
