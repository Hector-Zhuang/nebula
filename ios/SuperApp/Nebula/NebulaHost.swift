//
//  NebulaHost.swift
//  SuperApp - Nebula Mini-App Container
//
//  Main entry point for Nebula framework
//

import Foundation
import UIKit

@objc public final class NebulaHost: NSObject {
    
    // MARK: - Singleton
    
    @objc public static let shared = NebulaHost()
    
    // MARK: - Properties
    
    private var containerPool: [String: NebulaContainerController] = [:]
    private let poolQueue = DispatchQueue(label: "com.nebula.host.pool", attributes: .concurrent)
    
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
    
    /// Open a mini-app
    @objc public func openApp(_ appId: String,
                              from viewController: UIViewController,
                              initialProps: [String: Any]? = nil,
                              animated: Bool = true) {
        NebulaPerformanceMonitor.shared.startMeasure("openApp:\(appId)")
        
        // Try to get existing container from pool
        var container: NebulaContainerController?
        poolQueue.sync {
            container = containerPool[appId]
        }
        
        // Check if container exists and is not already in navigation stack
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
                title: initialProps?["title"] as? String
            )
            
            // Add to pool
            poolQueue.async(flags: .barrier) { [weak self, weak container] in
                guard let container = container else { return }
                self?.containerPool[appId] = container
                print("[Nebula] Added container for \(appId) to pool (total: \(self?.containerPool.count ?? 0))")
            }
        }
        
        guard let finalContainer = container else { return }
        
        if let navigationController = viewController.navigationController {
            navigationController.pushViewController(finalContainer, animated: animated)
        } else {
            viewController.present(finalContainer, animated: animated)
        }
        
        NebulaPerformanceMonitor.shared.endMeasure("openApp:\(appId)")
    }
    
    /// Preload a mini-app for faster startup
    @objc public func preloadApp(_ appId: String) {
        NebulaAppManager.shared.warmUp(appId: appId)
    }
    
    /// Close and invalidate a mini-app
    @objc public func closeApp(_ appId: String) {
        NebulaAppManager.shared.invalidate(appId: appId)
        
        // Remove from container pool
        poolQueue.async(flags: .barrier) { [weak self] in
            if let removed = self?.containerPool.removeValue(forKey: appId) {
                print("[Nebula] Removed container for \(appId) from pool")
                // Force deallocation by ensuring it's not retained
                DispatchQueue.main.async {
                    _ = removed
                }
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
                // Load manifest (app.json) after successful installation
                let sandboxPath = NebulaConfig.shared.sandboxPath(for: appId)
                _ = NebulaManifestManager.shared.loadManifest(forAppId: appId, sandboxPath: sandboxPath)
            }
            completion(success, error)
        }
    }

    /// Install a mini-app with explicit runtime mode
    @objc public func installApp(_ appId: String,
                                 bundleURL: String,
                                 mode: NebulaConfig.RuntimeMode,
                                 completion: @escaping (Bool, Error?) -> Void) {
        NebulaConfig.shared.downloadBundle(
            for: appId,
            from: bundleURL,
            mode: mode
        ) { [weak self] success, error in
            if success {
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
    
    private override init() {
        super.init()
    }
}
