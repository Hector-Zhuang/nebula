//
//  NebulaConfig.swift
//  SuperApp - Nebula Mini-App Container
//
//  Configuration and sandbox management
//

import Foundation
import ZIPFoundation

@objc public final class NebulaConfig: NSObject {
    private static let serverBaseURLDefaultsKey = "NebulaServerBaseURL"

    struct InstalledMiniAppInfo: Codable {
        let appId: String
        let mode: String
        let bundlePath: String
        let sourceUrl: String
        let version: String?
        let updateStrategy: String
    }

    // MARK: - Singleton
    
    @objc public static let shared = NebulaConfig()
    
    // MARK: - Properties
    
    @objc public var enableDebugLogging: Bool = true
    @objc public var maxConcurrentApps: Int = 3
    @objc public var maxNavigationStackDepth: Int = 10
    @objc public var cachePolicy: CachePolicy = .memory

    @objc public var serverBaseURL: String? {
        get {
            guard let value = UserDefaults.standard.string(forKey: Self.serverBaseURLDefaultsKey),
                  !value.isEmpty else {
                return nil
            }
            return value
        }
        set {
            let normalized = Self.normalizeServerBaseURL(newValue)
            if let normalized {
                UserDefaults.standard.set(normalized, forKey: Self.serverBaseURLDefaultsKey)
            } else {
                UserDefaults.standard.removeObject(forKey: Self.serverBaseURLDefaultsKey)
            }
        }
    }
    
    @objc public enum CachePolicy: Int {
        case memory = 0      // Only keep in memory
        case persistent = 1  // Persist to disk
        case hybrid = 2      // Memory + disk
    }

    @objc public func resolveRemoteURL(_ rawURL: String) -> String {
        let trimmedURL = rawURL.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmedURL.isEmpty else {
            return rawURL
        }

        if trimmedURL.hasPrefix("file://") {
            return trimmedURL
        }

        guard let serverBaseURL,
              let baseComponents = URLComponents(string: serverBaseURL) else {
            return trimmedURL
        }

        if trimmedURL.hasPrefix("/") {
            var resolved = baseComponents
            resolved.path = trimmedURL
            return resolved.url?.absoluteString ?? trimmedURL
        }

        if let rawComponents = URLComponents(string: trimmedURL),
           let scheme = rawComponents.scheme?.lowercased(),
           scheme == "http" || scheme == "https" {
            if Self.shouldReplaceRemoteHost(rawComponents.host) {
                var resolved = rawComponents
                resolved.scheme = baseComponents.scheme
                resolved.host = baseComponents.host
                resolved.port = baseComponents.port
                return resolved.url?.absoluteString ?? trimmedURL
            }
            return trimmedURL
        }

        var resolved = baseComponents
        let basePath = baseComponents.path.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        let relativePath = trimmedURL.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        resolved.path = ([basePath, relativePath].filter { !$0.isEmpty }).joined(separator: "/")
        if !resolved.path.hasPrefix("/") {
            resolved.path = "/\(resolved.path)"
        }
        return resolved.url?.absoluteString ?? trimmedURL
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

    private func metadataURL(for appId: String) -> URL {
        URL(fileURLWithPath: sandboxPath(for: appId)).appendingPathComponent("installation.json")
    }

    func installedAppInfo(for appId: String) -> InstalledMiniAppInfo? {
        let metadataURL = self.metadataURL(for: appId)
        guard let data = try? Data(contentsOf: metadataURL) else {
            return nil
        }
        return try? JSONDecoder().decode(InstalledMiniAppInfo.self, from: data)
    }

    private func saveInstalledAppInfo(_ info: InstalledMiniAppInfo, for appId: String) {
        let metadataURL = self.metadataURL(for: appId)
        guard let data = try? JSONEncoder().encode(info) else {
            return
        }
        try? data.write(to: metadataURL, options: .atomic)
    }

    private func saveInstalledAppInfo(for appId: String,
                                      connectToURLMetroServer: Bool,
                                      sourceURL: String,
                                      manifest: NebulaManifest?) {
        let info = InstalledMiniAppInfo(
            appId: appId,
            mode: connectToURLMetroServer ? "development" : "production",
            bundlePath: self.bundlePath(for: appId) ?? "",
            sourceUrl: sourceURL,
            version: connectToURLMetroServer ? nil : manifest?.version,
            updateStrategy: connectToURLMetroServer ? "manual" : (manifest?.updateStrategy ?? "manual")
        )
        saveInstalledAppInfo(info, for: appId)
    }

    private func deriveManifestURL(from bundleURL: URL) -> URL? {
        var components = URLComponents(url: bundleURL, resolvingAgainstBaseURL: false)
        let path = components?.path ?? ""
        if path.isEmpty {
            return nil
        }
        let parent = (path as NSString).deletingLastPathComponent
        components?.path = "\(parent)/app.json"
        components?.query = nil
        components?.fragment = nil
        return components?.url
    }

    private func downloadManifestIfAvailable(for appId: String,
                                             from bundleURL: URL,
                                             completion: @escaping (NebulaManifest?) -> Void) {
        guard let manifestURL = deriveManifestURL(from: bundleURL) else {
            completion(nil)
            return
        }
        downloadManifestIfAvailable(for: appId, manifestURL: manifestURL, completion: completion)
    }

    private func downloadManifestIfAvailable(for appId: String,
                                             manifestURL: URL,
                                             completion: @escaping (NebulaManifest?) -> Void) {

        let sandboxPath = self.sandboxPath(for: appId)
        let manifestDest = URL(fileURLWithPath: sandboxPath).appendingPathComponent("app.json")
        try? FileManager.default.removeItem(at: manifestDest)

        let manifestTask = URLSession.shared.dataTask(with: manifestURL) { data, response, error in
            guard let data = data,
                  error == nil,
                  (response as? HTTPURLResponse)?.statusCode == 200 else {
                completion(nil)
                return
            }

            do {
                try data.write(to: manifestDest)
                _ = NebulaManifestManager.shared.loadManifest(forAppId: appId, sandboxPath: sandboxPath)
                let manifest = try JSONDecoder().decode(NebulaManifest.self, from: data)
                completion(manifest)
            } catch {
                completion(nil)
            }
        }
        manifestTask.resume()
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

    static func normalizeServerBaseURL(_ rawURL: String?) -> String? {
        guard let rawURL else {
            return nil
        }

        let trimmedURL = rawURL.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmedURL.isEmpty,
              var components = URLComponents(string: trimmedURL),
              let scheme = components.scheme?.lowercased(),
              (scheme == "http" || scheme == "https"),
              components.host != nil else {
            return nil
        }

        if components.path.isEmpty {
            components.path = ""
        }
        if components.path.count > 1, components.path.hasSuffix("/") {
            components.path.removeLast()
        }
        components.query = nil
        components.fragment = nil
        return components.url?.absoluteString
    }

    private static func shouldReplaceRemoteHost(_ host: String?) -> Bool {
        guard let host = host?.lowercased() else {
            return false
        }
        return host == "localhost" || host == "127.0.0.1" || host == "0.0.0.0"
    }
    
    /// Download and install a mini-app bundle
    @objc public func downloadBundle(for appId: String,
                                     from urlString: String,
                                     completion: @escaping (Bool, Error?) -> Void) {
        let connectToURLMetroServer = isDevelopmentURL(urlString)
        downloadBundle(
            for: appId,
            from: urlString,
            connectToURLMetroServer: connectToURLMetroServer,
            completion: completion
        )
    }

    /// Install a mini-app with explicit Metro connection preference
    @objc public func downloadBundle(for appId: String,
                                     from urlString: String,
                                     connectToURLMetroServer: Bool,
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
    
        if connectToURLMetroServer {
            saveDevURL(urlString, for: appId)
            print("[Nebula] Saved development URL for \(appId): \(urlString)")
    
            downloadManifestIfAvailable(for: appId, from: url) { manifest in
                self.saveInstalledAppInfo(
                    for: appId,
                    connectToURLMetroServer: true,
                    sourceURL: urlString,
                    manifest: manifest
                )
                completion(true, nil)
            }
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
                self.downloadManifestIfAvailable(for: appId, from: url) { manifest in
                    guard manifest != nil else {
                        let manifestError = NSError(
                            domain: "com.nebula.config",
                            code: -3,
                            userInfo: [NSLocalizedDescriptionKey: "Manifest download failed for \(appId)"]
                        )
                        print("[Nebula] ERROR: \(manifestError.localizedDescription)")
                        completion(false, manifestError)
                        return
                    }
                    self.saveInstalledAppInfo(
                        for: appId,
                        connectToURLMetroServer: false,
                        sourceURL: urlString,
                        manifest: manifest
                    )
                    completion(true, nil)
                }
            } catch {
                completion(false, error)
            }
        }
    
        task.resume()
    }
    
    @objc public func downloadBundle(for appId: String,
                                     from urlString: String,
                                     manifestURL manifestURLString: String,
                                     assetsURL assetsURLString: String,
                                     connectToURLMetroServer: Bool,
                                     completion: @escaping (Bool, Error?) -> Void) {
        guard let url = URL(string: urlString),
              let manifestURL = URL(string: manifestURLString),
              let assetsURL = URL(string: assetsURLString) else {
            let error = NSError(
                domain: "com.nebula.config",
                code: -1,
                userInfo: [NSLocalizedDescriptionKey: "Invalid bundle, manifest, or assets URL"]
            )
            completion(false, error)
            return
        }
    
        if connectToURLMetroServer {
            saveDevURL(urlString, for: appId)
            downloadManifestIfAvailable(for: appId, manifestURL: manifestURL) { manifest in
                self.saveInstalledAppInfo(
                    for: appId,
                    connectToURLMetroServer: true,
                    sourceURL: urlString,
                    manifest: manifest
                )
                completion(true, nil)
            }
            return
        }
    
        clearDevURL(for: appId)
    
        let task = URLSession.shared.downloadTask(with: url) { [weak self] location, _response, error in
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
    
            let sandboxPath = self.sandboxPath(for: appId)
            let destinationURL = URL(fileURLWithPath: sandboxPath).appendingPathComponent("index.bundle")
    
            do {
                try? FileManager.default.removeItem(at: destinationURL)
                try FileManager.default.moveItem(at: location, to: destinationURL)
    
                self.downloadManifestIfAvailable(for: appId, manifestURL: manifestURL) { manifest in
                    guard manifest != nil else {
                        let manifestError = NSError(
                            domain: "com.nebula.config",
                            code: -3,
                            userInfo: [NSLocalizedDescriptionKey: "Manifest download failed for \(appId) from \(manifestURL.absoluteString)"]
                        )
                        print("[Nebula] ERROR: \(manifestError.localizedDescription)")
                        completion(false, manifestError)
                        return
                    }
                    self.downloadAndExtractAssets(for: appId, from: assetsURL) { assetsSuccess in
                        guard assetsSuccess else {
                            let assetsError = NSError(
                                domain: "com.nebula.config",
                                code: -4,
                                userInfo: [NSLocalizedDescriptionKey: "Assets download failed for \(appId) from \(assetsURL.absoluteString)"]
                            )
                            print("[Nebula] ERROR: \(assetsError.localizedDescription)")
                            completion(false, assetsError)
                            return
                        }
                        self.saveInstalledAppInfo(
                            for: appId,
                            connectToURLMetroServer: false,
                            sourceURL: urlString,
                            manifest: manifest
                        )
                        completion(true, nil)
                    }
                }
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

    // MARK: - Assets Download & Extraction

    @objc public func downloadAndExtractAssetsPublic(for appId: String, from assetsURL: URL, completion: @escaping (Bool) -> Void) {
        downloadAndExtractAssets(for: appId, from: assetsURL, completion: completion)
    }

    private func downloadAndExtractAssets(for appId: String, from assetsURL: URL, completion: @escaping (Bool) -> Void) {
        let sandboxPath = self.sandboxPath(for: appId)
        let zipDestination = URL(fileURLWithPath: sandboxPath).appendingPathComponent("assets.zip")

        try? FileManager.default.removeItem(at: zipDestination)

        let task = URLSession.shared.downloadTask(with: assetsURL) { location, response, error in
            guard let location = location, error == nil else {
                print("[Nebula] Failed to download assets for \(appId): \(error?.localizedDescription ?? "unknown")")
                completion(false)
                return
            }

            do {
                try? FileManager.default.removeItem(at: zipDestination)
                try FileManager.default.moveItem(at: location, to: zipDestination)
                try self.extractZip(at: zipDestination, to: URL(fileURLWithPath: sandboxPath))
                try? FileManager.default.removeItem(at: zipDestination)
                 print("[Nebula] Assets extracted for \(appId) to \(sandboxPath)")
                completion(true)
            } catch {
                 print("[Nebula] Failed to extract assets for \(appId): \(error.localizedDescription)")
                try? FileManager.default.removeItem(at: zipDestination)
                completion(false)
            }
        }

        task.resume()
    }

    private func extractZip(at zipURL: URL, to destinationURL: URL) throws {
        try FileManager.default.unzipItem(at: zipURL, to: destinationURL)
    }
}
