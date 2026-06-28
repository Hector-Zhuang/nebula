//
//  NebulaManifest.swift
//  SuperApp - Nebula Mini-App Container
//
//  Mini-app manifest (app.json) parser and registry
//

import Foundation

struct NebulaPageStyle: Codable {
    let backgroundColor: String?
    let navigationBarBackgroundColor: String?
    let navigationBarTextColor: String?
    let navigationBarTitleText: String?
    let navigationStyle: String?
    let visualEffectInBackground: String?

    func merged(with override: NebulaPageStyle?) -> NebulaPageStyle {
        guard let override = override else { return self }
        return NebulaPageStyle(
            backgroundColor: override.backgroundColor ?? backgroundColor,
            navigationBarBackgroundColor: override.navigationBarBackgroundColor ?? navigationBarBackgroundColor,
            navigationBarTextColor: override.navigationBarTextColor ?? navigationBarTextColor,
            navigationBarTitleText: override.navigationBarTitleText ?? navigationBarTitleText,
            navigationStyle: override.navigationStyle ?? navigationStyle,
            visualEffectInBackground: override.visualEffectInBackground ?? visualEffectInBackground
        )
    }

    func asDictionary() -> [String: Any] {
        var result: [String: Any] = [:]
        if let value = backgroundColor { result["backgroundColor"] = value }
        if let value = navigationBarBackgroundColor { result["navigationBarBackgroundColor"] = value }
        if let value = navigationBarTextColor { result["navigationBarTextColor"] = value }
        if let value = navigationBarTitleText { result["navigationBarTitleText"] = value }
        if let value = navigationStyle { result["navigationStyle"] = value }
        if let value = visualEffectInBackground { result["visualEffectInBackground"] = value }
        return result
    }

    init(backgroundColor: String? = nil,
         navigationBarBackgroundColor: String? = nil,
         navigationBarTextColor: String? = nil,
         navigationBarTitleText: String? = nil,
         navigationStyle: String? = nil,
         visualEffectInBackground: String? = nil) {
        self.backgroundColor = backgroundColor
        self.navigationBarBackgroundColor = navigationBarBackgroundColor
        self.navigationBarTextColor = navigationBarTextColor
        self.navigationBarTitleText = navigationBarTitleText
        self.navigationStyle = navigationStyle
        self.visualEffectInBackground = visualEffectInBackground
    }
}

struct NebulaManifest: Codable {
    let entryPagePath: String?
    let pages: [String: String]  // path -> componentName
    let pageConfigs: [String: NebulaPageStyle]?
    let updateStrategy: String?
    let version: String?
    let window: NebulaPageStyle?
    
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

    func getPageStyle(forPath path: String?) -> NebulaPageStyle? {
        guard let path = path else {
            return mergedPageStyle(forPath: entryPagePath ?? "/")
        }
        return mergedPageStyle(forPath: path)
    }

    private func mergedPageStyle(forPath path: String) -> NebulaPageStyle? {
        let normalizedPath = normalizePath(path)
        let withoutSlash = normalizedPath.hasPrefix("/")
            ? String(normalizedPath.dropFirst())
            : normalizedPath
        let withSlash = normalizedPath.hasPrefix("/")
            ? normalizedPath
            : "/\(normalizedPath)"
        let pageStyle = pageConfigs?[normalizedPath]
            ?? pageConfigs?[withoutSlash]
            ?? pageConfigs?[withSlash]
        if let window {
            return window.merged(with: pageStyle)
        }
        return pageStyle
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
    
    /// Check whether a manifest is currently held in memory for the given app
    @objc public func hasManifest(forAppId appId: String) -> Bool {
        var result = false
        queue.sync {
            result = manifests[appId] != nil
        }
        return result
    }

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
            
            queue.sync(flags: .barrier) {
                manifests[appId] = manifest
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
    
    /// Register manifest directly from a dictionary (called by mini-app JS at startup)
    @objc public func registerManifest(forAppId appId: String, pages: [String: String]) {
        let manifest = NebulaManifest(entryPagePath: "/", pages: pages, pageConfigs: nil, updateStrategy: "manual", version: nil, window: nil)
        queue.async(flags: .barrier) { [weak self] in
            self?.manifests[appId] = manifest
        }
        print("[Nebula] Registered manifest for \(appId): \(pages.count) routes")
    }

    func registerManifest(forAppId appId: String, manifest: NebulaManifest) {
        queue.async(flags: .barrier) { [weak self] in
            self?.manifests[appId] = manifest
        }
        print("[Nebula] Registered manifest for \(appId): \(manifest.pages.count) routes")
    }

    @objc public func getEntryPagePath(forAppId appId: String) -> String? {
        var result: String?
        queue.sync {
            result = manifests[appId]?.entryPagePath
        }
        return result
    }

    @objc public func getPageConfig(forAppId appId: String, path: String?) -> NSDictionary? {
        var result: [String: Any]?
        queue.sync {
            result = manifests[appId]?.getPageStyle(forPath: path)?.asDictionary()
        }
        guard let result else { return nil }
        return result as NSDictionary
    }

    /// Remove manifest when app is uninstalled
    @objc public func removeManifest(forAppId appId: String) {
        queue.async(flags: .barrier) { [weak self] in
            self?.manifests.removeValue(forKey: appId)
        }
        print("[Nebula] Removed manifest for \(appId)")
    }
}
