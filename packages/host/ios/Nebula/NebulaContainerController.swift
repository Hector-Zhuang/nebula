//
//  NebulaContainerController.swift
//  SuperApp - Nebula Mini-App Container
//
//  Container view controller for displaying mini-app instances
//

import UIKit
import React
import React_RCTAppDelegate

private let nebulaLoadingExitAnimationDuration: TimeInterval = 0.24
var miniappLoadingDelay: TimeInterval = 0

@objc public final class NebulaContainerController: UIViewController, UIGestureRecognizerDelegate {
    
    // MARK: - Properties
    
    let appId: String
    public let instanceId: String
    private var initialProps: [AnyHashable: Any]?
    private let shouldDelayContentEntrance: Bool
    private let installedAppSignature: String?
    private var miniAppFactory: RCTReactNativeFactory?
    private var pageStyle: [String: Any] = [:]
    private var backgroundEffectView: UIView?
    private weak var rootContentView: UIView?
    private weak var miniappLoadingView: UIView?
    private var rootContentConstraints: [NSLayoutConstraint] = []
    private var willResignActiveObserver: NSObjectProtocol?
    private var didBecomeActiveObserver: NSObjectProtocol?
    private var contentDidAppearObserver: NSObjectProtocol?
    private var hasDismissedLoadingOverlay = false
    private var minimumLoadingDismissDate: Date?
    
    /// Custom per-controller navigation bar (replaces the shared system nav bar).
    private let customNavBar = NebulaNavigationBar()
    
    private let loadingIndicator: UIActivityIndicatorView = {
        let indicator = UIActivityIndicatorView(style: .large)
        indicator.translatesAutoresizingMaskIntoConstraints = false
        indicator.hidesWhenStopped = true
        return indicator
    }()

    // MARK: - Initialization
    
    @objc public init(appId: String, initialProps: [AnyHashable: Any]? = nil) {
        self.appId = appId
        self.instanceId = UUID().uuidString
        self.initialProps = initialProps
        self.shouldDelayContentEntrance = false
        self.installedAppSignature = NebulaHost.shared.installedAppRuntimeSignature(appId)
        super.init(nibName: nil, bundle: nil)
        self.title = appId
        if let pageStyle = initialProps?["__pageConfig"] as? [String: Any] {
            self.pageStyle = pageStyle
        }
        
        // Store reference to allow JS-side navigation using unique instanceId
        NebulaRouter.shared.registerContainer(self, instanceId: instanceId, appId: appId)
    }

    @objc public init(appId: String,
                      initialProps: [AnyHashable: Any]? = nil,
                      delayContentEntrance: Bool) {
        self.appId = appId
        self.instanceId = UUID().uuidString
        self.initialProps = initialProps
        self.shouldDelayContentEntrance = delayContentEntrance
        self.installedAppSignature = NebulaHost.shared.installedAppRuntimeSignature(appId)
        super.init(nibName: nil, bundle: nil)
        self.title = appId
        if let pageStyle = initialProps?["__pageConfig"] as? [String: Any] {
            self.pageStyle = pageStyle
        }
        
        // Store reference to allow JS-side navigation using unique instanceId
        NebulaRouter.shared.registerContainer(self, instanceId: instanceId, appId: appId)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    deinit {
        dismissLoading()
        NotificationCenter.default.post(
            name: NSNotification.Name("NebulaContainerDidUnload"),
            object: nil,
            userInfo: [
                "appId": appId,
                "instanceId": instanceId,
                "routePath": initialProps?["__routePath"] as? String ?? "/"
            ]
        )
        if let observer = willResignActiveObserver {
            NotificationCenter.default.removeObserver(observer)
        }
        if let observer = didBecomeActiveObserver {
            NotificationCenter.default.removeObserver(observer)
        }
        if let observer = contentDidAppearObserver {
            NotificationCenter.default.removeObserver(observer)
        }
        NebulaRouter.shared.unregisterContainer(for: instanceId)
        NebulaAppManager.shared.releaseConsumedResources(appId: appId)
        print("[Nebula] Container deallocated for \(appId) (instance: \(instanceId))")
    }
    
    // MARK: - Lifecycle
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        applyBaseBackgroundColor()

        // Always hide the system navigation bar – it is shared across all
        // controllers in the stack and cannot be styled per-page reliably.
        navigationController?.setNavigationBarHidden(true, animated: false)

        // Set up our own per-controller navigation bar.
        setupCustomNavBar()

        applyPageStyle()
        registerAppStateObservers()
        
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

        // Ensure the system nav bar stays hidden (another controller may have
        // shown it while this one was off-screen).
        navigationController?.setNavigationBarHidden(true, animated: false)

        applyPageStyle()

        // Show / hide the back button based on navigation stack depth.
        let canGoBack = (navigationController?.viewControllers.count ?? 0) > 1
        customNavBar.setBackButtonVisible(canGoBack)
        customNavBar.applyPageStyle(pageStyle)

        // Keep the interactive pop gesture working.
        if let navigationController {
            navigationController.interactivePopGestureRecognizer?.delegate = self
            navigationController.interactivePopGestureRecognizer?.isEnabled = canGoBack
        }
        
        // Notify JS about lifecycle
        NotificationCenter.default.post(
            name: NSNotification.Name("NebulaContainerWillAppear"),
            object: nil,
            userInfo: [
                "appId": appId,
                "instanceId": instanceId,
                "routePath": initialProps?["__routePath"] as? String ?? "/"
            ]
        )
    }
    
    public override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        
        // Notify JS about lifecycle
        NotificationCenter.default.post(
            name: NSNotification.Name("NebulaContainerDidDisappear"),
            object: nil,
            userInfo: [
                "appId": appId,
                "instanceId": instanceId,
                "routePath": initialProps?["__routePath"] as? String ?? "/"
            ]
        )
    }
    
    // MARK: - Public Methods
    
    /// Update initial props for container reuse
    @objc public func updateInitialProps(_ props: [AnyHashable: Any]) {
        self.initialProps = props
        if let pageStyle = props["__pageConfig"] as? [String: Any] {
            self.pageStyle = pageStyle
        } else if let routePath = props["__routePath"] as? String,
                  let manifestPageStyle = NebulaManifestManager.shared.getPageConfig(forAppId: appId, path: routePath) as? [String: Any] {
            self.pageStyle = manifestPageStyle
        }
        applyPageStyle()
        customNavBar.applyPageStyle(self.pageStyle)
        print("[Nebula] Updated initialProps for container \(appId) (instance: \(instanceId))")
        // Note: Existing RootView will not be recreated. 
        // For full props update, consider implementing JS-side prop refresh mechanism.
    }

    @objc public func updatePageStyle(_ nextStyle: [String: Any]) {
        self.pageStyle.merge(nextStyle) { _, new in new }
        if let title = nextStyle["navigationBarTitleText"] as? String {
            self.title = title
        }
        applyPageStyle()
        customNavBar.applyPageStyle(self.pageStyle)
    }

    @objc public func matchesInstalledRuntimeSignature(_ signature: String?) -> Bool {
        return installedAppSignature == signature
    }

    func prepareForPresentation() -> Bool {
        loadViewIfNeeded()
        return shouldDelayContentEntrance && miniappLoadingView != nil
    }

    func shouldAttachMiniappLoadingView() -> Bool {
        return shouldDelayContentEntrance && !isViewLoaded
    }

    func attachMiniappLoadingView(_ loadingView: UIView, minimumDismissDelay: TimeInterval) {
        miniappLoadingView?.removeFromSuperview()
        hasDismissedLoadingOverlay = false
        minimumLoadingDismissDate = Date().addingTimeInterval(minimumDismissDelay)
        miniappLoadingView = loadingView
    }

    @objc public func dismissLoading() {
        hasDismissedLoadingOverlay = true
        minimumLoadingDismissDate = nil
        miniappLoadingView?.removeFromSuperview()
        miniappLoadingView = nil
        loadingIndicator.stopAnimating()
        loadingIndicator.removeFromSuperview()
        if let observer = contentDidAppearObserver {
            NotificationCenter.default.removeObserver(observer)
            contentDidAppearObserver = nil
        }
    }

    // MARK: - Private Methods
    
    private func setupCustomNavBar() {
        customNavBar.translatesAutoresizingMaskIntoConstraints = false
        customNavBar.backButton.addTarget(self, action: #selector(backButtonTapped), for: .touchUpInside)
        view.addSubview(customNavBar)

        NSLayoutConstraint.activate([
            customNavBar.topAnchor.constraint(equalTo: view.topAnchor),
            customNavBar.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            customNavBar.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            // Bottom edge sits at safeAreaTop + 50pt (44pt bar + 6pt padding),
            // covering the status bar area.
            customNavBar.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 50),
        ])
    }

    @objc private func backButtonTapped() {
        navigationController?.popViewController(animated: true)
    }

    private func setupRootView() {

        // Clean old root content before attaching a new mini-app view.
        // Keep the custom nav bar, loading indicator, and loading overlay.
        for subview in view.subviews
            where subview !== customNavBar
               && subview !== loadingIndicator
               && subview !== miniappLoadingView {
            subview.removeFromSuperview()
        }
        
        if let preloadedRootView = NebulaAppManager.shared.consumePreloadedRootView(for: appId) {
            view.addSubview(preloadedRootView)
            attachRootContentView(preloadedRootView)
            view.bringSubviewToFront(preloadedRootView)
            view.bringSubviewToFront(customNavBar)
            bringMiniappLoadingViewToFrontIfNeeded()
            handleMiniappContentReady()
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

        let miniFactory = NebulaAppManager.shared.acquireFactory(
            for: appId,
            bundleURL: bundleURL
        )
        self.miniAppFactory = miniFactory

        // Ensure manifest is loaded from disk before resolving routes.
        // A freshly-launched host may have installed mini-apps whose
        // manifests are not yet in memory.
        if !NebulaManifestManager.shared.hasManifest(forAppId: appId) {
            let sandboxPath = NebulaConfig.shared.sandboxPath(for: appId)
            if !NebulaManifestManager.shared.loadManifest(forAppId: appId, sandboxPath: sandboxPath) {
                print("[Nebula] ERROR: Failed to load manifest for \(appId) from sandbox: \(sandboxPath)")
                showError(NSError(
                    domain: "com.nebula.container",
                    code: -2,
                    userInfo: [NSLocalizedDescriptionKey: "Manifest not found for appId: \(appId)"]
                ))
                return
            }
        }

        let routePath = (initialProps?["__routePath"] as? String)
            ?? (NebulaManifestManager.shared.getEntryPagePath(forAppId: appId) ?? "/")
        guard let moduleName = NebulaManifestManager.shared.getComponentName(forAppId: appId, path: routePath) else {
            print("[Nebula] ERROR: No component found for appId: \(appId), routePath: \(routePath)")
            showError(NSError(
                domain: "com.nebula.container",
                code: -3,
                userInfo: [NSLocalizedDescriptionKey: "No component for route \(routePath) in appId: \(appId)"]
            ))
            return
        }

        let rootView = miniFactory.rootViewFactory.view(
            withModuleName: moduleName,
            initialProperties: buildInitialProps()
        )
        registerContentDidAppearObserver(for: rootView)

        rootView.backgroundColor = resolvedPageBackgroundColor()
        view.addSubview(rootView)
        attachRootContentView(rootView)
        view.bringSubviewToFront(rootView)
        view.bringSubviewToFront(customNavBar)
        bringMiniappLoadingViewToFrontIfNeeded()
        
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

    private func registerContentDidAppearObserver(for rootView: UIView) {
        if let observer = contentDidAppearObserver {
            NotificationCenter.default.removeObserver(observer)
        }

        contentDidAppearObserver = NotificationCenter.default.addObserver(
            forName: NSNotification.Name(rawValue: "RCTContentDidAppearNotification"),
            object: nil,
            queue: .main
        ) { [weak self, weak rootView] notification in
            guard let self,
                  let rootView,
                  let contentView = notification.object as? UIView else {
                return
            }

            if contentView === rootView || contentView.isDescendant(of: rootView) {
                self.handleMiniappContentReady()
            }
        }
    }

    private func handleMiniappContentReady() {
        guard !hasDismissedLoadingOverlay else {
            return
        }
        hasDismissedLoadingOverlay = true
        NotificationCenter.default.post(
            name: NSNotification.Name("NebulaContainerDidBecomeReady"),
            object: nil,
            userInfo: [
                "appId": appId,
                "instanceId": instanceId,
                "routePath": initialProps?["__routePath"] as? String ?? "/"
            ]
        )
        dismissLoadingOverlayIfNeeded()
    }

    private func dismissLoadingOverlayIfNeeded() {
        let remainingEntranceDelay = max(0, minimumLoadingDismissDate?.timeIntervalSinceNow ?? 0)
        let totalDelay = remainingEntranceDelay + miniappLoadingDelay + nebulaLoadingExitAnimationDuration
        DispatchQueue.main.asyncAfter(deadline: .now() + totalDelay) {
            self.dismissLoading()
        }
    }

    private func bringMiniappLoadingViewToFrontIfNeeded() {
        guard let loadingView = miniappLoadingView else { return }
        loadingView.superview?.bringSubviewToFront(loadingView)
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
            "instanceId": instanceId,
            "sandboxPath": getSandboxPath()
        ]

        // Merge caller-provided props first so route/page config resolution uses the actual target page.
        if let initialProps = initialProps {
            props.merge(initialProps) { _, new in new }
        }

        if props["__routePath"] == nil {
            let entryPath = NebulaManifestManager.shared.getEntryPagePath(forAppId: appId) ?? "/"
            props["__routePath"] = entryPath
        }
        if let providedPageStyle = props["__pageConfig"] as? [String: Any] {
            pageStyle = providedPageStyle
        } else if let routePath = props["__routePath"] as? String,
                  let manifestPageStyle = NebulaManifestManager.shared.getPageConfig(forAppId: appId, path: routePath) as? [String: Any] {
            pageStyle = manifestPageStyle
        }
        if !pageStyle.isEmpty {
            props["__pageConfig"] = pageStyle
        }

        return props
    }
    
    private func getSandboxPath() -> String {
        return NebulaConfig.shared.sandboxPath(for: appId)
    }

    // MARK: - UIGestureRecognizerDelegate

    /// Only allow the interactive pop gesture when there is a page to go back to.
    public func gestureRecognizerShouldBegin(_ gestureRecognizer: UIGestureRecognizer) -> Bool {
        guard gestureRecognizer === navigationController?.interactivePopGestureRecognizer else {
            return true
        }
        return (navigationController?.viewControllers.count ?? 0) > 1
    }

    public func gestureRecognizer(
        _ gestureRecognizer: UIGestureRecognizer,
        shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer
    ) -> Bool {
        if gestureRecognizer === navigationController?.interactivePopGestureRecognizer {
            return true
        }
        return false
    }

    private func applyPageStyle() {
        applyBaseBackgroundColor()
        rootContentView?.backgroundColor = resolvedPageBackgroundColor()

        if let title = pageStyle["navigationBarTitleText"] as? String, !title.isEmpty {
            self.title = title
        }

        let navigationStyle = (pageStyle["navigationStyle"] as? String)?.lowercased() ?? "default"
        updateLayoutForNavigationStyle(navigationStyle)
    }

    private func registerAppStateObservers() {
        willResignActiveObserver = NotificationCenter.default.addObserver(
            forName: UIApplication.willResignActiveNotification,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            self?.applyBackgroundVisualEffectIfNeeded()
        }

        didBecomeActiveObserver = NotificationCenter.default.addObserver(
            forName: UIApplication.didBecomeActiveNotification,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            self?.removeBackgroundVisualEffect()
        }
    }

    private func applyBackgroundVisualEffectIfNeeded() {
        let visualEffect = (pageStyle["visualEffectInBackground"] as? String)?.lowercased() ?? "none"
        guard visualEffect == "blur", backgroundEffectView == nil else { return }

        let blurView = UIVisualEffectView(effect: UIBlurEffect(style: .systemChromeMaterial))
        blurView.frame = view.bounds
        blurView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        blurView.isUserInteractionEnabled = false
        blurView.backgroundColor = resolvedPageBackgroundColor().withAlphaComponent(0.15)
        view.addSubview(blurView)
        view.bringSubviewToFront(blurView)
        view.bringSubviewToFront(customNavBar)
        backgroundEffectView = blurView
    }

    private func removeBackgroundVisualEffect() {
        backgroundEffectView?.removeFromSuperview()
        backgroundEffectView = nil
    }

    private func applyBaseBackgroundColor() {
        view.backgroundColor = resolvedPageBackgroundColor()
    }

    private func attachRootContentView(_ rootView: UIView) {
        rootView.translatesAutoresizingMaskIntoConstraints = false
        rootContentView = rootView
        updateLayoutForNavigationStyle(
            (pageStyle["navigationStyle"] as? String)?.lowercased() ?? "default"
        )
    }

    private func updateLayoutForNavigationStyle(_ navigationStyle: String) {
        let isCustomNavStyle = navigationStyle == "custom"

        if isCustomNavStyle {
            edgesForExtendedLayout = [.top, .left, .bottom, .right]
            extendedLayoutIncludesOpaqueBars = true
            customNavBar.isHidden = true
        } else {
            edgesForExtendedLayout = []
            extendedLayoutIncludesOpaqueBars = false
            customNavBar.isHidden = false
        }

        guard let rootContentView, rootContentView.superview === view else { return }

        NSLayoutConstraint.deactivate(rootContentConstraints)

        // Anchor content below the custom nav bar (default) or to the top
        // edge of the view (navigationStyle = "custom").
        let topAnchor = isCustomNavStyle
            ? view.topAnchor
            : customNavBar.bottomAnchor

        rootContentConstraints = [
            rootContentView.topAnchor.constraint(equalTo: topAnchor),
            rootContentView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            rootContentView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            rootContentView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
        ]
        NSLayoutConstraint.activate(rootContentConstraints)
        view.layoutIfNeeded()
    }

    private func resolvedPageBackgroundColor() -> UIColor {
        if let backgroundColorHex = pageStyle["backgroundColor"] as? String,
           let color = UIColor(nebulaHex: backgroundColorHex) {
            return color
        }
        return .systemBackground
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

// MARK: - NebulaNavigationBar

/// A self-contained navigation bar view that belongs to a single
/// `NebulaContainerController`.  Because each controller has its own instance
/// there is no risk of one page overwriting another page's bar styling – the
/// fundamental problem with the shared `UINavigationBar`.
final class NebulaNavigationBar: UIView {

    private let titleLabel: UILabel = {
        let label = UILabel()
        label.font = .systemFont(ofSize: 17, weight: .semibold)
        label.textAlignment = .center
        return label
    }()

    private let separator: UIView = {
        let v = UIView()
        v.backgroundColor = .separator
        return v
    }()

    let backButton: UIButton = {
        let button = UIButton(type: .system)
        if #available(iOS 13.0, *) {
            let config = UIImage.SymbolConfiguration(pointSize: 17, weight: .regular)
            button.setImage(UIImage(systemName: "chevron.left", withConfiguration: config)?
                .withAlignmentRectInsets(UIEdgeInsets(top: 0, left: -4, bottom: 0, right: 0)),
                for: .normal)
        }
        return button
    }()

    override init(frame: CGRect) {
        super.init(frame: frame)
        setupViews()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupViews()
    }

    private func setupViews() {
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        backButton.translatesAutoresizingMaskIntoConstraints = false
        separator.translatesAutoresizingMaskIntoConstraints = false

        addSubview(titleLabel)
        addSubview(backButton)
        addSubview(separator)

        NSLayoutConstraint.activate([
            // Back button – left aligned, vertically centred in the bar area
            backButton.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 8),
            backButton.bottomAnchor.constraint(equalTo: bottomAnchor, constant: -6),
            backButton.heightAnchor.constraint(equalToConstant: 44),

            // Title – centred in the bar area (below safe area)
            titleLabel.centerXAnchor.constraint(equalTo: centerXAnchor),
            titleLabel.centerYAnchor.constraint(equalTo: backButton.centerYAnchor),
            titleLabel.leadingAnchor.constraint(greaterThanOrEqualTo: backButton.trailingAnchor, constant: 8),

            // Separator at the very bottom
            separator.leadingAnchor.constraint(equalTo: leadingAnchor),
            separator.trailingAnchor.constraint(equalTo: trailingAnchor),
            separator.bottomAnchor.constraint(equalTo: bottomAnchor),
            separator.heightAnchor.constraint(equalToConstant: 0.5),
        ])
    }

    // MARK: - Public API

    func setBackButtonVisible(_ visible: Bool) {
        backButton.isHidden = !visible
    }

    func setTitle(_ title: String?) {
        titleLabel.text = title
    }

    func applyPageStyle(_ style: [String: Any]) {
        let navigationStyle = (style["navigationStyle"] as? String)?.lowercased() ?? "default"
        isHidden = (navigationStyle == "custom")

        // Background
        if let hex = style["navigationBarBackgroundColor"] as? String,
           let color = UIColor(nebulaHex: hex) {
            backgroundColor = color
        } else {
            backgroundColor = .systemBackground
        }

        // Text / tint
        let textColor = UIColor(nebulaHex: style["navigationBarTextColor"] as? String ?? "") ?? .label
        titleLabel.textColor = textColor
        backButton.tintColor = textColor

        // Title
        if let title = style["navigationBarTitleText"] as? String, !title.isEmpty {
            titleLabel.text = title
        }
    }
}

// MARK: - UIColor Hex Helper

private extension UIColor {
    convenience init?(nebulaHex: String) {
        var sanitized = nebulaHex
            .trimmingCharacters(in: .whitespacesAndNewlines)
            .replacingOccurrences(of: "#", with: "")

        // Expand 3-digit shorthand (e.g. "ABC" → "AABBCC")
        if sanitized.count == 3,
           sanitized.allSatisfy({ $0.isHexDigit }) {
            sanitized = sanitized.map { String(repeating: $0, count: 2) }.joined()
        }

        // Strip 8-digit alpha channel (e.g. "AABBCCFF" → "AABBCC")
        if sanitized.count == 8 {
            sanitized = String(sanitized.prefix(6))
        }

        guard sanitized.count == 6,
              let value = Int(sanitized, radix: 16) else {
            return nil
        }

        self.init(
            red: CGFloat((value >> 16) & 0xFF) / 255.0,
            green: CGFloat((value >> 8) & 0xFF) / 255.0,
            blue: CGFloat(value & 0xFF) / 255.0,
            alpha: 1.0
        )
    }
}
