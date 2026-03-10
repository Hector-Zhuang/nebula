//
//  NebulaContainerController.swift
//  SuperApp - Nebula Mini-App Container
//
//  Container view controller for displaying mini-app instances
//

import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@objc public final class NebulaContainerController: UIViewController {
    
    // MARK: - Properties
    
    let appId: String
    public let instanceId: String
    private var initialProps: [AnyHashable: Any]?
    private var miniAppFactory: RCTReactNativeFactory?
    
    private let loadingIndicator: UIActivityIndicatorView = {
        let indicator = UIActivityIndicatorView(style: .large)
        indicator.translatesAutoresizingMaskIntoConstraints = false
        indicator.hidesWhenStopped = true
        return indicator
    }()
    
    // MARK: - Initialization
    
    @objc public init(appId: String, initialProps: [AnyHashable: Any]? = nil, title: String? = nil) {
        self.appId = appId
        self.instanceId = UUID().uuidString
        self.initialProps = initialProps
        super.init(nibName: nil, bundle: nil)
        self.title = title ?? appId
        
        // Store reference to allow JS-side navigation using unique instanceId
        NebulaRouter.shared.registerContainer(self, instanceId: instanceId, appId: appId)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    deinit {
        NebulaRouter.shared.unregisterContainer(for: instanceId)
        NebulaAppManager.shared.releaseConsumedResources(appId: appId)
        print("[Nebula] Container deallocated for \(appId) (instance: \(instanceId))")
    }
    
    // MARK: - Lifecycle
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        view.backgroundColor = .systemBackground
        
        // Setup loading indicator
        view.addSubview(loadingIndicator)
        NSLayoutConstraint.activate([
            loadingIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            loadingIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
        loadingIndicator.startAnimating()

        setupRootView()
    }
    
    public override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        // Notify JS about lifecycle
        NotificationCenter.default.post(
            name: NSNotification.Name("NebulaContainerWillAppear"),
            object: nil,
            userInfo: ["appId": appId]
        )
    }
    
    public override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        
        // Notify JS about lifecycle
        NotificationCenter.default.post(
            name: NSNotification.Name("NebulaContainerDidDisappear"),
            object: nil,
            userInfo: ["appId": appId]
        )
    }
    
    // MARK: - Public Methods
    
    /// Update initial props for container reuse
    @objc public func updateInitialProps(_ props: [AnyHashable: Any]) {
        self.initialProps = props
        if let title = props["title"] as? String {
            self.title = title
        }
        print("[Nebula] Updated initialProps for container \(appId) (instance: \(instanceId))")
        // Note: Existing RootView will not be recreated. 
        // For full props update, consider implementing JS-side prop refresh mechanism.
    }
    
    // MARK: - Private Methods
    
    private func setupRootView() {

        // Clean old root content before attaching a new mini-app view.
        for subview in view.subviews where subview != loadingIndicator {
            subview.removeFromSuperview()
        }
        
        if let preloadedRootView = NebulaAppManager.shared.consumePreloadedRootView(for: appId) {
            preloadedRootView.frame = view.bounds
            preloadedRootView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            view.addSubview(preloadedRootView)
            view.bringSubviewToFront(preloadedRootView)
            loadingIndicator.stopAnimating()
            loadingIndicator.removeFromSuperview()
            print("[Nebula] Debug z-order(preloaded): subviews=\(view.subviews.count), top=\(String(describing: view.subviews.last))")
            print("[Nebula] Consumed preloaded root view for \(appId)")
            return
        }

        let bundleURL: URL
        if let devURL = NebulaConfig.shared.devURL(for: appId) {
            bundleURL = devURL
            print("[Nebula] Using development URL for hot reload: \(devURL)")
        } else if let bundlePath = NebulaConfig.shared.bundlePath(for: appId) {
            bundleURL = URL(fileURLWithPath: bundlePath)
            print("[Nebula] Using local bundle: \(bundlePath)")
        } else {
            showError(NSError(
                domain: "com.nebula.container",
                code: -1,
                userInfo: [NSLocalizedDescriptionKey: "Bundle not found for appId: \(appId)"]
            ))
            return
        }

        let miniDelegate = NebulaMiniAppReactDelegate(bundleURL: bundleURL)
        miniDelegate.dependencyProvider = RCTAppDependencyProvider()
        let miniFactory = RCTReactNativeFactory(delegate: miniDelegate)
        self.miniAppFactory = miniFactory

        let moduleName = (initialProps?["moduleName"] as? String) ?? "NebulaApp"

        let rootView = miniFactory.rootViewFactory.view(
            withModuleName: moduleName,
            initialProperties: buildInitialProps()
        )
        
        rootView.backgroundColor = .systemBackground
        rootView.frame = view.bounds
        rootView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        
        // Debug: force mini-app content on top to rule out z-order issues.
        view.addSubview(rootView)
        view.bringSubviewToFront(rootView)
        
        // Hide loading indicator
        loadingIndicator.stopAnimating()
        loadingIndicator.removeFromSuperview()

        print("[Nebula] Debug z-order(new): subviews=\(view.subviews.count), top=\(String(describing: view.subviews.last))")

        // Some RN loading overlays can persist in mixed lifecycle paths; clean once after mount.
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) { [weak self, weak rootView] in
            guard let self = self, let rootView = rootView else { return }
            self.removeInternalLoadingViews(from: rootView)
        }
        
        print("[Nebula] Container loaded for \(appId), module=\(moduleName)")
    }

    private func removeInternalLoadingViews(from view: UIView) {
        for subview in view.subviews {
            let className = String(describing: type(of: subview))
            if subview is UIActivityIndicatorView || className.contains("Loading") || className.contains("RCT") && className.contains("Progress") {
                subview.removeFromSuperview()
                continue
            }
            removeInternalLoadingViews(from: subview)
        }
    }
    
    private func buildInitialProps() -> [AnyHashable: Any] {
        var props: [AnyHashable: Any] = [
            "appId": appId,
            "sandboxPath": getSandboxPath()
        ]
        
        // Merge custom initial props
        if let initialProps = initialProps {
            props.merge(initialProps) { _, new in new }
        }
        
        return props
    }
    
    private func getSandboxPath() -> String {
        return NebulaConfig.shared.sandboxPath(for: appId)
    }
    
    private func showError(_ error: Error) {
        loadingIndicator.stopAnimating()
        
        let label = UILabel()
        label.text = "Load failed\n\(error.localizedDescription)"
        label.textAlignment = .center
        label.numberOfLines = 0
        label.textColor = .systemRed
        label.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(label)
        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            label.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            label.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            label.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20)
        ])
        
        print("[Nebula] Error: \(error.localizedDescription)")
    }
}

private final class NebulaMiniAppReactDelegate: RCTDefaultReactNativeFactoryDelegate {
    private let miniBundleURL: URL

    init(bundleURL: URL) {
        self.miniBundleURL = bundleURL
        super.init()
    }

    override func bundleURL() -> URL? {
        return miniBundleURL
    }
}
