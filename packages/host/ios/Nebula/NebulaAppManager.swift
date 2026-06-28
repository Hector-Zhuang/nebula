//
//  NebulaAppManager.swift
//  SuperApp - Nebula Mini-App Container
//
//  Mini-app preload manager with lifecycle control
//

import Foundation
import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

private final class NebulaPreloadReactDelegate: RCTDefaultReactNativeFactoryDelegate {
    private let miniBundleURL: URL

    init(bundleURL: URL) {
        self.miniBundleURL = bundleURL
        super.init()
    }

    override func bundleURL() -> URL? {
        return miniBundleURL
    }
}

/// Thread-safe manager for a single preloaded mini-app root view
@objc public final class NebulaAppManager: NSObject {
    
    // MARK: - Singleton
    
    @objc public static let shared = NebulaAppManager()
    
    // MARK: - Properties
    
    private let queue = DispatchQueue(label: "com.nebula.appmanager", attributes: .concurrent)
    private var preloadedAppId: String?
    private var preloadedView: UIView?
    private var preloadedFactory: RCTReactNativeFactory?
    private var preloadedDelegate: NebulaPreloadReactDelegate?
    private var preloadContainer: UIView?
    private var activeFactories: [String: RCTReactNativeFactory] = [:]
    private var activeFactoryDelegates: [String: NebulaPreloadReactDelegate] = [:]
    private var activeFactoryRefCounts: [String: Int] = [:]
    private var pendingPreloadAppId: String?
    private var preloadGeneration: UInt64 = 0
    private let semaphore = DispatchSemaphore(value: 1)

    private func removeViewOnMain(_ view: UIView?) {
        guard let view = view else { return }
        if Thread.isMainThread {
            view.removeFromSuperview()
        } else {
            DispatchQueue.main.async {
                view.removeFromSuperview()
            }
        }
    }

    // MARK: - Initialization
    
    private override init() {
        super.init()
        setupPreloadContainer()
    }
    
    private func setupPreloadContainer() {
        DispatchQueue.main.async {
            guard let window = UIApplication.shared.keyWindow else {
                print("[Nebula] Warning: Cannot setup preload container - no key window")
                return
            }
            
            let container = UIView()
            container.backgroundColor = .clear
            container.isUserInteractionEnabled = false
            container.frame = window.bounds
            container.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            
            // Insert at the very bottom layer of the key window
            window.insertSubview(container, at: 0)
            
            self.semaphore.wait()
            self.preloadContainer = container
            self.semaphore.signal()
            
            print("[Nebula] Preload container initialized at bottom layer")
        }
    }
    
    // MARK: - Public API
    
    /// Warm-up: preload a mini-app root view for faster startup
    @objc public func warmUp(appId: String) {
        preloadRootView(for: appId, moduleName: "NebulaApp", initialProps: nil)
    }

    /// Preload root view with custom module name and initial props
    @objc public func preloadRootView(for appId: String,
                                      moduleName: String = "NebulaApp",
                                      initialProps: [String: Any]? = nil) {
        let bundleURL: URL
        if let devURL = NebulaConfig.shared.devURL(for: appId) {
            bundleURL = devURL
        } else if let bundlePath = NebulaConfig.shared.bundlePath(for: appId) {
            bundleURL = URL(fileURLWithPath: bundlePath)
        } else {
            print("[Nebula] Warm-up skipped for \(appId): bundle not found")
            return
        }

        // Clear any existing preload cache before creating new one (single-slot cache)
        let generation: UInt64
        var staleViewToRemove: UIView?
        semaphore.wait()
        preloadGeneration &+= 1
        generation = preloadGeneration
        pendingPreloadAppId = appId
        if preloadedAppId != nil {
            staleViewToRemove = preloadedView
            preloadedAppId = nil
            preloadedView = nil
            preloadedFactory = nil
            print("[Nebula] Cleared existing preload cache before preloading \(appId)")
        }
        semaphore.signal()
        removeViewOnMain(staleViewToRemove)

        DispatchQueue.main.async {
            self.semaphore.wait()
            let isCanceledBeforeCreate = (self.preloadGeneration != generation) || (self.pendingPreloadAppId != appId)
            self.semaphore.signal()
            if isCanceledBeforeCreate {
                print("[Nebula] Skipped stale preload task for \(appId)")
                return
            }

            let delegate = NebulaPreloadReactDelegate(bundleURL: bundleURL)
            delegate.dependencyProvider = RCTAppDependencyProvider()
            let factory = RCTReactNativeFactory(delegate: delegate)

            var props: [String: Any] = [
                "appId": appId,
                "sandboxPath": NebulaConfig.shared.sandboxPath(for: appId)
            ]
            if let initialProps = initialProps {
                props.merge(initialProps) { _, new in new }
            }

            let rootView = factory.rootViewFactory.view(
                withModuleName: moduleName,
                initialProperties: props
            )
            
            rootView.backgroundColor = .systemBackground

            self.semaphore.wait()
            let container = self.preloadContainer
            self.semaphore.signal()

            // Mount preloaded view to global bottom-layer container
            guard let container = container else {
                print("[Nebula] Warning: Preload container not ready, view not mounted")
                self.semaphore.wait()
                if self.preloadGeneration != generation || self.pendingPreloadAppId != appId {
                    self.semaphore.signal()
                    print("[Nebula] Dropped stale preload cache for \(appId) before store")
                    return
                }
                self.preloadedAppId = appId
                self.preloadedFactory = factory
                self.preloadedDelegate = delegate
                self.preloadedView = rootView
                self.pendingPreloadAppId = nil
                self.semaphore.signal()
                print("[Nebula] Preloaded root view for \(appId), module=\(moduleName) (not mounted)")
                return
            }

            self.semaphore.wait()
            let isStaleBeforeMount = (self.preloadGeneration != generation) || (self.pendingPreloadAppId != appId)
            self.semaphore.signal()
            if isStaleBeforeMount {
                print("[Nebula] Skipped mounting stale preload view for \(appId)")
                return
            }

            rootView.frame = container.bounds
            rootView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            
            // Ensure preload container is clean before adding new view
            for subview in container.subviews {
                subview.removeFromSuperview()
            }
            
            container.addSubview(rootView)
            
            // Force layout pass to ensure RN rendering pipeline is triggered
            rootView.setNeedsLayout()
            rootView.layoutIfNeeded()

            self.semaphore.wait()
            if self.preloadGeneration != generation || self.pendingPreloadAppId != appId {
                self.semaphore.signal()
                print("[Nebula] Dropped stale preloaded root view for \(appId) before cache commit")
                return
            }
            self.preloadedAppId = appId
            self.preloadedFactory = factory
            self.preloadedDelegate = delegate
            self.preloadedView = rootView
            self.pendingPreloadAppId = nil
            self.semaphore.signal()

            print("[Nebula] Preloaded root view for \(appId), module=\(moduleName) (mounted at bottom layer)")
        }
    }

    /// Consume and remove the preloaded root view from bottom layer (single-use)
    @objc public func consumePreloadedRootView(for appId: String) -> UIView? {
        semaphore.wait()
        guard preloadedAppId == appId else {
            // If preload is still pending for this app, cancel it to avoid stale bottom-layer mount.
            if pendingPreloadAppId == appId {
                preloadGeneration &+= 1
                pendingPreloadAppId = nil
                print("[Nebula] Canceled pending preload for \(appId) while opening app")
            }
            semaphore.signal()
            return nil
        }

        let view = preloadedView

        if let factory = preloadedFactory {
            // Keep factory alive while container is using the consumed rootView.
            activeFactories[appId] = factory
            if let delegate = preloadedDelegate {
                activeFactoryDelegates[appId] = delegate
            }
            activeFactoryRefCounts[appId, default: 0] += 1
        }
        preloadedAppId = nil
        preloadedView = nil
        preloadedFactory = nil
        preloadedDelegate = nil
        pendingPreloadAppId = nil
        semaphore.signal()
        // Remove from bottom-layer preload container on main thread.
        removeViewOnMain(view)
        return view
    }

    @objc public func acquireFactory(for appId: String,
                                     bundleURL: URL) -> RCTReactNativeFactory {
        semaphore.wait()
        if let existingFactory = activeFactories[appId] {
            activeFactoryRefCounts[appId, default: 0] += 1
            semaphore.signal()
            return existingFactory
        }
        semaphore.signal()

        let delegate = NebulaPreloadReactDelegate(bundleURL: bundleURL)
        delegate.dependencyProvider = RCTAppDependencyProvider()
        let factory = RCTReactNativeFactory(delegate: delegate)

        semaphore.wait()
        if let existingFactory = activeFactories[appId] {
            activeFactoryRefCounts[appId, default: 0] += 1
            semaphore.signal()
            return existingFactory
        }

        activeFactories[appId] = factory
        activeFactoryDelegates[appId] = delegate
        activeFactoryRefCounts[appId] = 1
        semaphore.signal()
        return factory
    }

    /// Release runtime resources held for a consumed preloaded view.
    @objc public func releaseConsumedResources(appId: String) {
        semaphore.wait()
        let nextCount = max(0, (activeFactoryRefCounts[appId] ?? 0) - 1)
        if nextCount == 0 {
            activeFactoryRefCounts.removeValue(forKey: appId)
            activeFactories.removeValue(forKey: appId)
            activeFactoryDelegates.removeValue(forKey: appId)
        } else {
            activeFactoryRefCounts[appId] = nextCount
        }
        semaphore.signal()
    }
    
    /// Invalidate and remove preload cache for one mini-app
    @objc public func invalidate(appId: String) {
        queue.async(flags: .barrier) { [weak self] in
            guard let self = self else { return }

            var staleViewToRemove: UIView?
            self.semaphore.wait()
            if self.preloadedAppId == appId {
                staleViewToRemove = self.preloadedView
                self.preloadedAppId = nil
                self.preloadedView = nil
                self.preloadedFactory = nil
                self.preloadedDelegate = nil
            }
            if self.pendingPreloadAppId == appId {
                self.pendingPreloadAppId = nil
                self.preloadGeneration &+= 1
            }
            self.activeFactoryRefCounts.removeValue(forKey: appId)
            self.activeFactories.removeValue(forKey: appId)
            self.activeFactoryDelegates.removeValue(forKey: appId)
            self.semaphore.signal()

            self.removeViewOnMain(staleViewToRemove)
            print("[Nebula] Invalidated preload cache for \(appId)")
        }
    }
    
    /// Invalidate all preload caches
    @objc public func invalidateAll() {
        queue.async(flags: .barrier) { [weak self] in
            guard let self = self else { return }

            var staleViewToRemove: UIView?
            self.semaphore.wait()
            staleViewToRemove = self.preloadedView
            self.preloadedAppId = nil
            self.preloadedView = nil
            self.preloadedFactory = nil
            self.preloadedDelegate = nil
            self.pendingPreloadAppId = nil
            self.preloadGeneration &+= 1
            self.activeFactoryRefCounts.removeAll()
            self.activeFactories.removeAll()
            self.activeFactoryDelegates.removeAll()
            self.semaphore.signal()

            self.removeViewOnMain(staleViewToRemove)
            print("[Nebula] Invalidated all preload caches")
        }
    }

    /// Check whether a preloaded root view is available
    @objc public func hasPreloadedRootView(appId: String) -> Bool {
        semaphore.wait()
        let result = (preloadedAppId == appId) && (preloadedView != nil)
        semaphore.signal()
        return result
    }
}
