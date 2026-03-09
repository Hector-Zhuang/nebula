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
    
    private var containerRegistry: [String: WeakContainer] = [:]
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
    
    func registerContainer(_ controller: NebulaContainerController, for appId: String) {
        queue.async(flags: .barrier) { [weak self] in
            self?.containerRegistry[appId] = WeakContainer(controller: controller)
        }
    }
    
    func unregisterContainer(for appId: String) {
        queue.async(flags: .barrier) { [weak self] in
            self?.containerRegistry.removeValue(forKey: appId)
        }
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
            
            // Find the container
            var container: NebulaContainerController?
            self.queue.sync {
                container = self.containerRegistry[fromAppId]?.controller
            }
            
            guard let container = container else {
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
    
    // MARK: - Private Methods
    
    private func handleNavigation(_ url: NebulaURL,
                                  fromAppId: String,
                                  action: NavigationAction,
                                  completion: @escaping (Bool, Error?) -> Void) {
        // Find source container
        var sourceContainer: NebulaContainerController?
        queue.sync {
            sourceContainer = containerRegistry[fromAppId]?.controller
        }
        
        guard let sourceContainer = sourceContainer,
              let navigationController = sourceContainer.navigationController else {
            completion(false, NSError(
                domain: "com.nebula.router",
                code: -2,
                userInfo: [NSLocalizedDescriptionKey: "Navigation controller not found"]
            ))
            return
        }
        
        switch url.scheme {
        case .miniApp:
            // Navigate to another mini-app
            let targetAppId = url.appId ?? fromAppId
            let routeProps = buildRouteInitialProps(url: url)
            let targetVC = NebulaContainerController(
                appId: targetAppId,
                initialProps: routeProps,
                title: routeProps?["title"] as? String
            )
            applyNavigationAction(action, targetVC: targetVC, navigationController: navigationController)
            completion(true, nil)
            
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

    private func buildRouteInitialProps(url: NebulaURL) -> [String: Any]? {
        var props = url.params ?? [:]
        if let path = url.path {
            props["__routePath"] = path
        }
        props["__routeUrl"] = url.originalURL
        return props.isEmpty ? nil : props
    }

    private func applyNavigationAction(_ action: NavigationAction,
                                       targetVC: UIViewController,
                                       navigationController: UINavigationController) {
        switch action {
        case .push:
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
            applyNavigationAction(action, targetVC: settingsVC, navigationController: navigationController)
            completion(true, nil)
            
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
