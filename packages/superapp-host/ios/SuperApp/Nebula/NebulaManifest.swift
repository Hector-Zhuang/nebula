//
//  NebulaManifest.swift
//  SuperApp - Nebula Mini-App Container
//
//  Mini-app manifest (app.json) parser and registry
//

import Foundation

/// Structure representing a mini-app's manifest (app.json)
struct NebulaManifest: Codable {
    let pages: [String: String]  // path -> componentName
    let window: WindowConfig?
    
    struct WindowConfig: Codable {
        let navigationBarTitleText: String?
    }
    
    /// Get the component name for a given route path
    func getComponentName(forPath path: String) -> String? {
        let normalizedPath = normalizePath(path)
        
        // Exact match first
        if let component = pages[normalizedPath] {
            return component
        }
        
        // Try without leading slash
        let withoutSlash = normalizedPath.hasPrefix("/") 
            ? String(normalizedPath.dropFirst()) 
            : normalizedPath
        if let component = pages[withoutSlash] {
            return component
        }
        
        // Try with leading slash
        let withSlash = normalizedPath.hasPrefix("/") 
            ? normalizedPath 
            : "/\(normalizedPath)"
        if let component = pages[withSlash] {
            return component
        }
        
        return nil
    }
    
    private func normalizePath(_ path: String) -> String {
        return path.trimmingCharacters(in: .whitespaces).lowercased()
    }
}

/// Manager for mini-app manifests
@objc public final class NebulaManifestManager: NSObject {
    
    // MARK: - Singleton
    
    @objc public static let shared = NebulaManifestManager()
    
    // MARK: - Properties
    
    private var manifests: [String: NebulaManifest] = [:]
    private let queue = DispatchQueue(label: "com.nebula.manifest", attributes: .concurrent)
    
    private override init() {
        super.init()
    }
    
    // MARK: - Public Methods
    
    /// Load manifest for an app from its sandbox directory
    @objc public func loadManifest(forAppId appId: String, sandboxPath: String) -> Bool {
        let manifestPath = (sandboxPath as NSString).appendingPathComponent("app.json")
        
        guard FileManager.default.fileExists(atPath: manifestPath) else {
            print("[Nebula] No app.json found for \(appId) at \(manifestPath)")
            return false
        }
        
        do {
            let data = try Data(contentsOf: URL(fileURLWithPath: manifestPath))
            let decoder = JSONDecoder()
            let manifest = try decoder.decode(NebulaManifest.self, from: data)
            
            queue.async(flags: .barrier) { [weak self] in
                self?.manifests[appId] = manifest
            }
            
            print("[Nebula] Loaded manifest for \(appId): \(manifest.pages.count) pages")
            return true
        } catch {
            print("[Nebula] Failed to load manifest for \(appId): \(error)")
            return false
        }
    }
    
    /// Get component name for a route path in a specific app
    @objc public func getComponentName(forAppId appId: String, path: String) -> String? {
        var result: String?
        queue.sync {
            result = manifests[appId]?.getComponentName(forPath: path)
        }
        return result
    }
    
    /// Get the default/home component for an app
    @objc public func getDefaultComponent(forAppId appId: String) -> String {
        var result: String?
        queue.sync {
            result = manifests[appId]?.getComponentName(forPath: "/")
        }
        return result ?? "NebulaApp"  // Fallback to default
    }
    
    /// Register manifest directly from a dictionary (called by mini-app JS at startup)
    @objc public func registerManifest(forAppId appId: String, pages: [String: String]) {
        let manifest = NebulaManifest(pages: pages, window: nil)
        queue.async(flags: .barrier) { [weak self] in
            self?.manifests[appId] = manifest
        }
        print("[Nebula] Registered manifest for \(appId): \(pages.count) routes")
    }

    /// Remove manifest when app is uninstalled
    @objc public func removeManifest(forAppId appId: String) {
        queue.async(flags: .barrier) { [weak self] in
            self?.manifests.removeValue(forKey: appId)
        }
        print("[Nebula] Removed manifest for \(appId)")
    }
}
