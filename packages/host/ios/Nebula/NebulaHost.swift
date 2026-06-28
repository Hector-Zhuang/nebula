//
//  NebulaHost.swift
//  SuperApp - Nebula Mini-App Container
//
//  Main entry point for Nebula framework
//

import Foundation
import UIKit
import React
import React_RCTAppDelegate

private let miniappLoadingModuleName = "NebulaInternalMiniappLoading"
var miniappLoadingEnterContentDelay: TimeInterval = 0
var miniappLoadingEnabled: Bool = false

@objc public final class NebulaHost: NSObject {
    private struct ReviewInstallBundles: Decodable {
        let ios: String
        let android: String
    }

    private struct ReviewInstallAssetsUrls: Decodable {
        let ios: String
        let android: String
    }

    private struct ReviewInstallPayload: Decodable {
        let appId: String
        let appName: String
        let versionId: String
        let version: String
        let bundleUrl: String?
        let bundles: ReviewInstallBundles?
        let assetsUrl: ReviewInstallAssetsUrls
        let manifestUrl: String
    }
    
    // MARK: - Singleton
    
    @objc public static let shared = NebulaHost()
    
    // MARK: - Properties
    
    private var containerPool: [String: NebulaContainerController] = [:]
    private var elevatedHostStacks: [String: [UIViewController]] = [:]
    private let poolQueue = DispatchQueue(label: "com.nebula.host.pool", attributes: .concurrent)
    public weak var appDelegate: NebulaAppDelegate?
    
    // MARK: - Public API
    
    /// Initialize Nebula framework
    @objc public func initialize(config: NebulaConfig = .shared) {
        print("╔═══════════════════════════════════════════════════════╗")
        print("║          Nebula Mini-App Container v1.0.0            ║")
        print("║   High-Performance SuperApp Framework for iOS        ║")
        print("╚═══════════════════════════════════════════════════════╝")
        
        // Setup sandbox directories
        setupSandboxDirectories()
        
        // Register for memory warnings
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleMemoryWarning),
            name: UIApplication.didReceiveMemoryWarningNotification,
            object: nil
        )
        
        print("[Nebula] Framework initialized successfully")
    }

    public func initialize(config: NebulaConfig = .shared, appDelegate: NebulaAppDelegate?) {
        self.appDelegate = appDelegate
        initialize(config: config)
    }
    
    /// Open a mini-app
    @objc public func openApp(_ appId: String,
                              from viewController: UIViewController,
                              initialProps: [String: Any]? = nil,
                              animated: Bool = true) {
        NebulaPerformanceMonitor.shared.startMeasure("openApp:\(appId)")
        let runtimeSignature = installedAppRuntimeSignature(appId)
        
        // Try to get existing container from pool
        var container: NebulaContainerController?
        poolQueue.sync {
            container = containerPool[appId]
        }
        
        // Check if container exists and is not already in navigation stack
        if let existingContainer = container {
            if !existingContainer.matchesInstalledRuntimeSignature(runtimeSignature) {
                print("[Nebula] Discarding pooled container for \(appId) because installed runtime changed")
                discardPooledContainer(appId)
                container = nil
            }
        }

        if let existingContainer = container {
            // Update initialProps if needed
            if let props = initialProps {
                existingContainer.updateInitialProps(props)
            }
            
            // Check if container is already in a navigation stack
            if existingContainer.navigationController != nil {
                print("[Nebula] Container for \(appId) already in navigation stack, creating new instance")
                container = nil
            } else {
                print("[Nebula] Reusing container from pool for \(appId)")
            }
        }
        
        // Create new container if needed
        if container == nil {
            container = NebulaContainerController(
                appId: appId,
                initialProps: initialProps,
                delayContentEntrance: true
            )
            
            // Add to pool
            poolQueue.async(flags: .barrier) { [weak self, weak container] in
                guard let container = container else { return }
                self?.containerPool[appId] = container
                print("[Nebula] Added container for \(appId) to pool (total: \(self?.containerPool.count ?? 0))")
            }
        }
        
        
        guard let finalContainer = container else { return }
        let navigationController = resolveNavigationController(from: viewController)
        attachMiniappLoadingIfNeeded(
            for: appId,
            to: finalContainer,
            in: navigationController?.view ?? viewController.view
        )
        let shouldDelayPresentation = finalContainer.prepareForPresentation()
            && miniappLoadingEnterContentDelay > 0

        let presentContainer = {
            if let navigationController {
                navigationController.pushViewController(finalContainer, animated: animated)
            } else {
                viewController.present(finalContainer, animated: animated)
            }

            NebulaPerformanceMonitor.shared.endMeasure("openApp:\(appId)")
        }
        
        if shouldDelayPresentation {
            DispatchQueue.main.asyncAfter(deadline: .now() + miniappLoadingEnterContentDelay) {
                presentContainer()
            }
        } else {
            presentContainer()
        }
    }
    
    /// Preload a mini-app for faster startup
    @objc public func preloadApp(_ appId: String) {
        NebulaAppManager.shared.warmUp(appId: appId)
    }
    
    /// Close and invalidate a mini-app
    @objc public func closeApp(_ appId: String) {
        let cleanup = { [weak self] in
            NebulaAppManager.shared.invalidate(appId: appId)
            self?.poolQueue.async(flags: .barrier) {
                if let removed = self?.containerPool.removeValue(forKey: appId) {
                    print("[Nebula] Removed container for \(appId) from pool")
                    DispatchQueue.main.async {
                        _ = removed
                    }
                }
            }
        }

        NebulaRouter.shared.closeApp(appId) { success, _ in
            cleanup()
            if !success {
                print("[Nebula] Closed miniapp resources for \(appId) without an active visible container")
            }
        }
    }
    
    /// Clear all cached containers from pool
    @objc public func clearContainerPool() {
        poolQueue.async(flags: .barrier) { [weak self] in
            let count = self?.containerPool.count ?? 0
            self?.containerPool.removeAll()
            print("[Nebula] Cleared container pool (\(count) containers removed)")
        }
    }
    
    /// Download and install a mini-app
    @objc public func installApp(_ appId: String,
                                 bundleURL: String,
                                 completion: @escaping (Bool, Error?) -> Void) {
        NebulaConfig.shared.downloadBundle(
            for: appId,
            from: bundleURL
        ) { [weak self] success, error in
            if success {
                self?.discardPooledContainer(appId)
                NebulaAppManager.shared.invalidate(appId: appId)
                // Load manifest (app.json) after successful installation
                let sandboxPath = NebulaConfig.shared.sandboxPath(for: appId)
                _ = NebulaManifestManager.shared.loadManifest(forAppId: appId, sandboxPath: sandboxPath)
            }
            completion(success, error)
        }
    }

    /// Install a mini-app with explicit Metro connection preference
    @objc public func installApp(_ appId: String,
                                 bundleURL: String,
                                 connectToURLMetroServer: Bool,
                                 completion: @escaping (Bool, Error?) -> Void) {
        NebulaConfig.shared.downloadBundle(
            for: appId,
            from: bundleURL,
            connectToURLMetroServer: connectToURLMetroServer
        ) { [weak self] success, error in
            if success {
                self?.discardPooledContainer(appId)
                NebulaAppManager.shared.invalidate(appId: appId)
                // Load manifest (app.json) after successful installation
                let sandboxPath = NebulaConfig.shared.sandboxPath(for: appId)
                _ = NebulaManifestManager.shared.loadManifest(forAppId: appId, sandboxPath: sandboxPath)
            }
            completion(success, error)
        }
    }
    
    /// Uninstall a mini-app
    @objc public func uninstallApp(_ appId: String) throws {
        // Close if running
        closeApp(appId)
        
        // Remove manifest
        NebulaManifestManager.shared.removeManifest(forAppId: appId)
        
        // Clear sandbox
        try NebulaConfig.shared.clearSandbox(for: appId)
    }
    
    /// Get list of installed apps
    @objc public func installedApps() -> [String] {
        return NebulaConfig.shared.listInstalledApps()
    }

    func installedAppInfo(_ appId: String) -> NebulaConfig.InstalledMiniAppInfo? {
        return NebulaConfig.shared.installedAppInfo(for: appId)
    }

    func installedAppRuntimeSignature(_ appId: String) -> String? {
        guard let info = installedAppInfo(appId) else {
            return nil
        }
        return [info.mode, info.sourceUrl, info.bundlePath].joined(separator: "|")
    }

    private func discardPooledContainer(_ appId: String) {
        poolQueue.async(flags: .barrier) { [weak self] in
            guard let self = self else { return }
            self.containerPool.removeValue(forKey: appId)
        }
    }

    @objc @discardableResult
    public func bringHostToFront(animated: Bool = true) -> String? {
        guard Thread.isMainThread else {
            var token: String?
            DispatchQueue.main.sync {
                token = self.bringHostToFront(animated: animated)
            }
            return token
        }

        guard let navigationController = currentNavigationController() else {
            return nil
        }
        let viewControllers = navigationController.viewControllers
        guard let rootViewController = viewControllers.first else {
            return nil
        }
        guard viewControllers.count > 1 else {
            return UUID().uuidString
        }

        let token = UUID().uuidString
        elevatedHostStacks[token] = viewControllers
        navigationController.setViewControllers([rootViewController], animated: animated)
        return token
    }

    @objc @discardableResult
    public func restoreMiniApp(with token: String?, animated: Bool = true) -> Bool {
        guard Thread.isMainThread else {
            var success = false
            DispatchQueue.main.sync {
                success = self.restoreMiniApp(with: token, animated: animated)
            }
            return success
        }

        guard let navigationController = currentNavigationController() else {
            return false
        }

        let resolvedToken: String?
        if let token, !token.isEmpty {
            resolvedToken = token
        } else {
            resolvedToken = elevatedHostStacks.keys.sorted().last
        }

        guard let snapshotToken = resolvedToken,
              let viewControllers = elevatedHostStacks.removeValue(forKey: snapshotToken),
              !viewControllers.isEmpty else {
            return false
        }

        navigationController.setViewControllers(viewControllers, animated: animated)
        return true
    }

    @objc @discardableResult
    public func handleIncomingURL(_ url: URL, from viewController: UIViewController? = nil) -> Bool {
        return NebulaURLParser.shared.handleIncomingUrl(url: url, viewController: viewController)
    }

    func resolveDevLoadingConfiguration(
        title: String,
        message: String,
        progress: NSNumber?,
        titleColor: UIColor? = nil,
        messageColor: UIColor? = nil,
        backgroundColor: UIColor? = nil,
        dismissButton: Bool = false
    ) -> NebulaDevLoadingConfiguration {
        let baseConfiguration = NebulaDevLoadingConfiguration(
            title: title,
            message: message,
            progress: progress,
            backgroundColor: backgroundColor ?? .systemBackground,
            titleColor: titleColor ?? .label,
            messageColor: messageColor ?? .secondaryLabel,
            showsDismissHint: dismissButton
        )

        guard let appDelegate,
              let customizedConfiguration = appDelegate.nebulaHost?(
                self,
                configureDevLoading: baseConfiguration.copy() as! NebulaDevLoadingConfiguration
              ) else {
            return baseConfiguration
        }
        return customizedConfiguration
    }

    func makeDevLoadingView(
        configuration: NebulaDevLoadingConfiguration
    ) -> NebulaDevLoadingView {
        if let customView = appDelegate?.nebulaHost?(self, makeDevLoadingView: configuration) {
            customView.render(with: configuration)
            return customView
        }

        let defaultView = NebulaDefaultDevLoadingView()
        defaultView.render(with: configuration)
        return defaultView
    }
    
    // MARK: - Private Methods
    
    private func setupSandboxDirectories() {
        let fileManager = FileManager.default
      
        guard let documentsPath = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first else {
            return
        }
        
        let miniAppsPath = documentsPath.appendingPathComponent("MiniApps")
        
        if !fileManager.fileExists(atPath: miniAppsPath.path) {
            try? fileManager.createDirectory(at: miniAppsPath, withIntermediateDirectories: true, attributes: nil)
            print("[Nebula] Created sandbox directory: \(miniAppsPath.path)")
        }
    }
    
    @objc private func handleMemoryWarning() {
        print("[Nebula] Memory warning received - clearing container pool")
        clearContainerPool()
        // Could implement additional cleanup here
    }

    private func resolveNavigationController(from viewController: UIViewController) -> UINavigationController? {
        if let navigationController = viewController as? UINavigationController {
            return navigationController
        }
        if let navigationController = viewController.navigationController {
            return navigationController
        }
        if let tabBarController = viewController as? UITabBarController {
            if let selectedNavigationController = tabBarController.selectedViewController as? UINavigationController {
                return selectedNavigationController
            }
            if let selectedViewController = tabBarController.selectedViewController {
                return resolveNavigationController(from: selectedViewController)
            }
        }
        return nil
    }

    private func attachMiniappLoadingIfNeeded(for appId: String,
                                              to container: NebulaContainerController,
                                              in overlayContainer: UIView?) {
        guard miniappLoadingEnabled,
              container.shouldAttachMiniappLoadingView(),
              let overlayContainer,
              let installedInfo = NebulaConfig.shared.installedAppInfo(for: appId),
              installedInfo.mode == "production",
              let rootViewFactory = currentRootViewFactory() else {
            return
        }

        let loadingView = rootViewFactory.view(
            withModuleName: miniappLoadingModuleName,
            initialProperties: [
                "appId": appId,
                "mode": installedInfo.mode,
                "__transparentBackground": true
            ]
        )
        loadingView.translatesAutoresizingMaskIntoConstraints = false
        loadingView.backgroundColor = .clear
        loadingView.isUserInteractionEnabled = true

        overlayContainer.addSubview(loadingView)
        NSLayoutConstraint.activate([
            loadingView.leadingAnchor.constraint(equalTo: overlayContainer.leadingAnchor),
            loadingView.trailingAnchor.constraint(equalTo: overlayContainer.trailingAnchor),
            loadingView.topAnchor.constraint(equalTo: overlayContainer.topAnchor),
            loadingView.bottomAnchor.constraint(equalTo: overlayContainer.bottomAnchor)
        ])
        overlayContainer.bringSubviewToFront(loadingView)
        container.attachMiniappLoadingView(
            loadingView,
            minimumDismissDelay: miniappLoadingEnterContentDelay
        )
    }

    func currentNavigationController() -> UINavigationController? {
        appDelegate?.nebulaNavigationController?(self)
    }

    func currentRootViewFactory() -> RCTRootViewFactory? {
        appDelegate?.nebulaRootViewFactory?(self)
    }

    func makeHostViewController(
        moduleName: String,
        initialProperties: [AnyHashable: Any]?,
        title: String?
    ) -> UIViewController? {
        appDelegate?.nebulaHost?(
            self,
            makeHostViewController: moduleName,
            initialProperties: initialProperties,
            title: title
        )
    }

    public func installReviewBuild(from installUrl: String, presenter: UIViewController?) {
        let resolvedInstallUrl = NebulaConfig.shared.resolveRemoteURL(installUrl)
        guard let url = URL(string: resolvedInstallUrl) else {
            print("[Nebula] Invalid review install URL: \(installUrl)")
            return
        }

        URLSession.shared.dataTask(with: url) { [weak self] data, _, error in
            guard let self else { return }

            if let error {
                print("[Nebula] Failed to fetch review install payload: \(error.localizedDescription)")
                return
            }

            guard let data else {
                print("[Nebula] Missing review install payload data")
                return
            }

            do {
                let payload = try JSONDecoder().decode(ReviewInstallPayload.self, from: data)
                self.downloadReviewAssets(payload: payload) { success in
                    guard success else { return }
                    DispatchQueue.main.async {
                        guard let presenter = presenter ?? self.currentNavigationController() else { return }
                        self.openApp(payload.appId, from: presenter, animated: true)
                    }
                }
            } catch {
                print("[Nebula] Failed to decode review install payload: \(error)")
            }
        }.resume()
    }

    private func downloadReviewAssets(payload: ReviewInstallPayload, completion: @escaping (Bool) -> Void) {
        let sandboxPath = NebulaConfig.shared.sandboxPath(for: payload.appId)
        let sandboxURL = URL(fileURLWithPath: sandboxPath, isDirectory: true)
        let bundleDestination = sandboxURL.appendingPathComponent("index.bundle")
        let manifestDestination = sandboxURL.appendingPathComponent("app.json")

        let selectedBundleURL = payload.bundles?.ios ?? payload.bundleUrl
        guard let selectedBundleURL else {
            print("[Nebula] Missing iOS review bundle URL for \(payload.appId)")
            completion(false)
            return
        }

        let resolvedBundleURL = NebulaConfig.shared.resolveRemoteURL(selectedBundleURL)
        let resolvedManifestURL = NebulaConfig.shared.resolveRemoteURL(payload.manifestUrl)

        guard let bundleURL = URL(string: resolvedBundleURL),
              let manifestURL = URL(string: resolvedManifestURL) else {
            print("[Nebula] Invalid review asset URLs for \(payload.appId)")
            completion(false)
            return
        }

        let group = DispatchGroup()
        var installError: Error?

        func download(_ sourceURL: URL, to destinationURL: URL) {
            group.enter()
            URLSession.shared.downloadTask(with: sourceURL) { location, _, error in
                defer { group.leave() }

                if let error {
                    installError = error
                    return
                }

                guard let location else {
                    installError = NSError(
                        domain: "com.nebula.review",
                        code: -1,
                        userInfo: [NSLocalizedDescriptionKey: "Missing temporary download file"]
                    )
                    return
                }

                do {
                    try? FileManager.default.removeItem(at: destinationURL)
                    try FileManager.default.moveItem(at: location, to: destinationURL)
                } catch {
                    installError = error
                }
            }.resume()
        }

        download(bundleURL, to: bundleDestination)
        download(manifestURL, to: manifestDestination)

        // Download and extract iOS assets
        let assetsURLString = NebulaConfig.shared.resolveRemoteURL(payload.assetsUrl.ios)
        if let assetsURL = URL(string: assetsURLString) {
            group.enter()
            NebulaConfig.shared.downloadAndExtractAssetsPublic(for: payload.appId, from: assetsURL) { success in
                if !success {
                    installError = NSError(domain: "com.nebula.review", code: -4, userInfo: [NSLocalizedDescriptionKey: "Failed to download/extract assets"])
                }
                group.leave()
            }
        }

        group.notify(queue: .main) {
            if let installError {
                print("[Nebula] Failed to install review build for \(payload.appId): \(installError.localizedDescription)")
                completion(false)
                return
            }

            _ = NebulaManifestManager.shared.loadManifest(forAppId: payload.appId, sandboxPath: sandboxPath)
            print("[Nebula] Installed review build \(payload.appId)@\(payload.version)")
            completion(true)
        }
    }
    
    private override init() {
        super.init()
    }
}
