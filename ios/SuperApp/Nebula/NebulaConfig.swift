//
//  NebulaConfig.swift
//  SuperApp - Nebula Mini-App Container
//
//  Configuration and sandbox management
//

import Foundation

@objc public final class NebulaConfig: NSObject {

    @objc public enum RuntimeMode: Int {
        case development = 0
        case production = 1
    }
    
    // MARK: - Singleton
    
    @objc public static let shared = NebulaConfig()
    
    // MARK: - Properties
    
    @objc public var enableDebugLogging: Bool = true
    @objc public var maxConcurrentApps: Int = 3
    @objc public var maxNavigationStackDepth: Int = 10
    @objc public var cachePolicy: CachePolicy = .memory
    
    @objc public enum CachePolicy: Int {
        case memory = 0      // Only keep in memory
        case persistent = 1  // Persist to disk
        case hybrid = 2      // Memory + disk
    }
    
    // MARK: - Sandbox Management
    
    /// Get the sandbox directory for a mini-app
    @objc public func sandboxPath(for appId: String) -> String {
        let fileManager = FileManager.default
        guard let documentsPath = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first else {
            return ""
        }
        
        let sandboxPath = documentsPath
            .appendingPathComponent("MiniApps")
            .appendingPathComponent(appId)
        
        // Create directory if needed
        try? fileManager.createDirectory(at: sandboxPath, withIntermediateDirectories: true, attributes: nil)
        
        return sandboxPath.path
    }
    
    /// Get the bundle path for a mini-app
    @objc public func bundlePath(for appId: String) -> String? {
        let sandboxPath = self.sandboxPath(for: appId)
        let bundlePath = "\(sandboxPath)/index.bundle"
        
        if FileManager.default.fileExists(atPath: bundlePath) {
            return bundlePath
        }
        
        return nil
    }
    
    /// Get the development URL for a mini-app (for hot reload)
    @objc public func devURL(for appId: String) -> URL? {
        let sandboxPath = self.sandboxPath(for: appId)
        let devURLPath = "\(sandboxPath)/dev.url"
        
        guard let urlString = try? String(contentsOfFile: devURLPath, encoding: .utf8),
              let url = URL(string: urlString.trimmingCharacters(in: .whitespacesAndNewlines)) else {
            return nil
        }
        
        return url
    }
    
    /// Save development URL for hot reload
    private func saveDevURL(_ urlString: String, for appId: String) {
        let sandboxPath = self.sandboxPath(for: appId)
        let devURLPath = "\(sandboxPath)/dev.url"
        try? urlString.write(toFile: devURLPath, atomically: true, encoding: .utf8)
    }

    /// Clear development URL to force local bundle loading
    private func clearDevURL(for appId: String) {
        let sandboxPath = self.sandboxPath(for: appId)
        let devURLPath = "\(sandboxPath)/dev.url"
        try? FileManager.default.removeItem(atPath: devURLPath)
    }
    
    /// Check if a URL is a development server
    private func isDevelopmentURL(_ urlString: String) -> Bool {
        return urlString.contains("127.0.0.1") || urlString.contains("localhost")
    }
    
    /// Download and install a mini-app bundle
    @objc public func downloadBundle(for appId: String,
                                     from urlString: String,
                                     completion: @escaping (Bool, Error?) -> Void) {
        let mode: RuntimeMode = isDevelopmentURL(urlString) ? .development : .production
        downloadBundle(for: appId, from: urlString, mode: mode, completion: completion)
    }

    /// Install a mini-app with explicit runtime mode
    @objc public func downloadBundle(for appId: String,
                                     from urlString: String,
                                     mode: RuntimeMode,
                                     completion: @escaping (Bool, Error?) -> Void) {
        guard let url = URL(string: urlString) else {
            let error = NSError(
                domain: "com.nebula.config",
                code: -1,
                userInfo: [NSLocalizedDescriptionKey: "Invalid bundle URL"]
            )
            completion(false, error)
            return
        }
        
        if mode == .development {
            saveDevURL(urlString, for: appId)
            print("[Nebula] Saved development URL for \(appId): \(urlString)")
            completion(true, nil)
            return
        }

        // Production mode must always use local file bundle.
        clearDevURL(for: appId)
        
        let task = URLSession.shared.downloadTask(with: url) { [weak self] location, response, error in
            guard let self = self else {
                completion(false, nil)
                return
            }
            
            if let error = error {
                completion(false, error)
                return
            }
            
            guard let location = location else {
                let error = NSError(
                    domain: "com.nebula.config",
                    code: -2,
                    userInfo: [NSLocalizedDescriptionKey: "Download failed: no data"]
                )
                completion(false, error)
                return
            }
            
            // Move to sandbox
            let sandboxPath = self.sandboxPath(for: appId)
            let destinationURL = URL(fileURLWithPath: sandboxPath).appendingPathComponent("index.bundle")
            
            do {
                // Remove existing bundle
                try? FileManager.default.removeItem(at: destinationURL)
                
                // Move downloaded file to sandbox
                try FileManager.default.moveItem(at: location, to: destinationURL)
                
                print("[Nebula] Bundle installed for \(appId) at \(destinationURL.path)")
                completion(true, nil)
            } catch {
                completion(false, error)
            }
        }
        
        task.resume()
    }
    
    /// Clear sandbox for a mini-app
    @objc public func clearSandbox(for appId: String) throws {
        let sandboxPath = self.sandboxPath(for: appId)
        let sandboxURL = URL(fileURLWithPath: sandboxPath)
        
        if FileManager.default.fileExists(atPath: sandboxPath) {
            try FileManager.default.removeItem(at: sandboxURL)
            print("[Nebula] Cleared sandbox for \(appId)")
        }
    }
    
    /// Clear all mini-app sandboxes
    @objc public func clearAllSandboxes() throws {
        let fileManager = FileManager.default
        guard let documentsPath = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first else {
            return
        }
        
        let miniAppsPath = documentsPath.appendingPathComponent("MiniApps")
        try fileManager.removeItem(at: miniAppsPath)
        print("[Nebula] Cleared all sandboxes")
    }
    
    /// List all installed mini-apps
    @objc public func listInstalledApps() -> [String] {
        let fileManager = FileManager.default
        guard let documentsPath = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first else {
            return []
        }
        
        let miniAppsPath = documentsPath.appendingPathComponent("MiniApps")
        
        guard let contents = try? fileManager.contentsOfDirectory(atPath: miniAppsPath.path) else {
            return []
        }
        
        return contents.filter { appId in
            let bundlePath = miniAppsPath
                .appendingPathComponent(appId)
                .appendingPathComponent("index.bundle")
                .path
            return fileManager.fileExists(atPath: bundlePath)
        }
    }
    
    private override init() {
        super.init()
    }
}
