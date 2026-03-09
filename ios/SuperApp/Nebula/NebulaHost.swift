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
        
        let container = NebulaContainerController(
            appId: appId,
            initialProps: initialProps,
            title: initialProps?["title"] as? String
        )
        
        if let navigationController = viewController.navigationController {
            navigationController.pushViewController(container, animated: animated)
        } else {
            viewController.present(container, animated: animated)
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
    }
    
    /// Download and install a mini-app
    @objc public func installApp(_ appId: String,
                                 bundleURL: String,
                                 completion: @escaping (Bool, Error?) -> Void) {
        NebulaConfig.shared.downloadBundle(
            for: appId,
            from: bundleURL,
            completion: completion
        )
    }

    /// Install a mini-app with explicit runtime mode
    @objc public func installApp(_ appId: String,
                                 bundleURL: String,
                                 mode: NebulaConfig.RuntimeMode,
                                 completion: @escaping (Bool, Error?) -> Void) {
        NebulaConfig.shared.downloadBundle(
            for: appId,
            from: bundleURL,
            mode: mode,
            completion: completion
        )
    }
    
    /// Uninstall a mini-app
    @objc public func uninstallApp(_ appId: String) throws {
        // Close if running
        closeApp(appId)
        
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
        print("[Nebula] Memory warning received - consider invalidating unused preloaded views")
        // Could implement automatic cleanup here
    }
    
    private override init() {
        super.init()
    }
}
