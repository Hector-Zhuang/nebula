//
//  NebulaDevLoading.swift
//  SuperApp - Nebula Mini-App Container
//
//  Dev loading configuration, default view, and presenter
//

import Foundation
import SwiftUI
import UIKit
import QuartzCore
import React
import React_RCTAppDelegate

@objc public protocol NebulaAppDelegate: NSObjectProtocol {
    @objc optional func nebulaNavigationController(
        _ host: NebulaHost
    ) -> UINavigationController?

    @objc optional func nebulaRootViewFactory(
        _ host: NebulaHost
    ) -> RCTRootViewFactory?

    @objc optional func nebulaHost(
        _ host: NebulaHost,
        makeHostViewController moduleName: String,
        initialProperties: [AnyHashable: Any]?,
        title: String?
    ) -> UIViewController?

    @objc optional func nebulaHost(
        _ host: NebulaHost,
        configureDevLoading configuration: NebulaDevLoadingConfiguration
    ) -> NebulaDevLoadingConfiguration

    @objc optional func nebulaHost(
        _ host: NebulaHost,
        makeDevLoadingView configuration: NebulaDevLoadingConfiguration
    ) -> NebulaDevLoadingView
}

@objcMembers public final class NebulaDevLoadingConfiguration: NSObject, NSCopying {
    public var title: String
    public var message: String
    public var progress: NSNumber?
    public var accentColor: UIColor
    public var backgroundColor: UIColor
    public var titleColor: UIColor
    public var messageColor: UIColor
    public var showsActivityIndicator: Bool
    public var showsDismissHint: Bool
    public var cornerRadius: CGFloat
    public var maximumWidth: CGFloat
    public var contentInsets: UIEdgeInsets

    public init(
        title: String,
        message: String,
        progress: NSNumber? = nil,
        accentColor: UIColor = UIColor(red: 0.10, green: 0.47, blue: 0.95, alpha: 1.0),
        backgroundColor: UIColor = .systemBackground,
        titleColor: UIColor = .label,
        messageColor: UIColor = .secondaryLabel,
        showsActivityIndicator: Bool = true,
        showsDismissHint: Bool = false,
        cornerRadius: CGFloat = 18,
        maximumWidth: CGFloat = 320,
        contentInsets: UIEdgeInsets = UIEdgeInsets(top: 14, left: 14, bottom: 14, right: 14)
    ) {
        self.title = title
        self.message = message
        self.progress = progress
        self.accentColor = accentColor
        self.backgroundColor = backgroundColor
        self.titleColor = titleColor
        self.messageColor = messageColor
        self.showsActivityIndicator = showsActivityIndicator
        self.showsDismissHint = showsDismissHint
        self.cornerRadius = cornerRadius
        self.maximumWidth = maximumWidth
        self.contentInsets = contentInsets
        super.init()
    }

    public func copy(with zone: NSZone? = nil) -> Any {
        NebulaDevLoadingConfiguration(
            title: title,
            message: message,
            progress: progress,
            accentColor: accentColor,
            backgroundColor: backgroundColor,
            titleColor: titleColor,
            messageColor: messageColor,
            showsActivityIndicator: showsActivityIndicator,
            showsDismissHint: showsDismissHint,
            cornerRadius: cornerRadius,
            maximumWidth: maximumWidth,
            contentInsets: contentInsets
        )
    }
}

@objcMembers public class NebulaDevLoadingView: UIView {
    public func render(with configuration: NebulaDevLoadingConfiguration) {
    }
}

@objcMembers public final class NebulaDefaultDevLoadingView: NebulaDevLoadingView {
    private let hostingController = UIHostingController(
        rootView: NebulaDefaultDevLoadingContentView(configuration: .init(title: "", message: ""))
    )
    private var maximumWidthConstraint: NSLayoutConstraint?

    public override init(frame: CGRect) {
        super.init(frame: frame)
        translatesAutoresizingMaskIntoConstraints = false
        alpha = 0
        transform = CGAffineTransform(translationX: 0, y: -10)

        hostingController.view.translatesAutoresizingMaskIntoConstraints = false
        hostingController.view.backgroundColor = .clear
        addSubview(hostingController.view)
        NSLayoutConstraint.activate([
            hostingController.view.topAnchor.constraint(equalTo: topAnchor),
            hostingController.view.bottomAnchor.constraint(equalTo: bottomAnchor),
            hostingController.view.leadingAnchor.constraint(equalTo: leadingAnchor),
            hostingController.view.trailingAnchor.constraint(equalTo: trailingAnchor),
        ])
    }

    public required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    public override func render(with configuration: NebulaDevLoadingConfiguration) {
        backgroundColor = .clear
        hostingController.rootView = NebulaDefaultDevLoadingContentView(
            configuration: configuration
        )
        maximumWidthConstraint?.isActive = false
        maximumWidthConstraint = widthAnchor.constraint(lessThanOrEqualToConstant: configuration.maximumWidth)
        maximumWidthConstraint?.isActive = true
    }
}

private struct NebulaDefaultDevLoadingContentView: View {
    let configuration: NebulaDevLoadingConfiguration

    var body: some View {
        VStack(spacing: 0) {
            HStack(alignment: .top, spacing: 10) {
                if configuration.showsActivityIndicator {
                    ProgressView()
                        .progressViewStyle(.circular)
                        .tint(Color(configuration.accentColor))
                        .padding(.top, 2)
                }

                VStack(alignment: .leading, spacing: 2) {
                    Text(configuration.title)
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(Color(configuration.titleColor))

                    Text(configuration.message)
                        .font(.system(size: 11, weight: .medium, design: .monospaced))
                        .foregroundStyle(Color(configuration.messageColor))
                        .lineLimit(2)

                    if configuration.showsDismissHint {
                        Text("Tap to dismiss")
                            .font(.system(size: 10, weight: .semibold))
                            .foregroundStyle(Color(configuration.titleColor).opacity(0.72))
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(.top, 4)
                    }

                    if let progress = configuration.progress {
                        ProgressView(value: progress.doubleValue)
                            .tint(Color(configuration.accentColor))
                            .padding(.top, 10)
                    }
                }
            }
        }
        .padding(EdgeInsets(configuration.contentInsets))
        .background(
            ZStack {
                RoundedRectangle(cornerRadius: configuration.cornerRadius, style: .continuous)
                    .fill(Color(UIColor.label.withAlphaComponent(0.08)))
                RoundedRectangle(cornerRadius: configuration.cornerRadius, style: .continuous)
                    .fill(.ultraThinMaterial)
                RoundedRectangle(cornerRadius: configuration.cornerRadius, style: .continuous)
                    .fill(Color(configuration.backgroundColor).opacity(0.82))
            }
        )
        .compositingGroup()
    }
}

private extension EdgeInsets {
    init(_ insets: UIEdgeInsets) {
        self.init(
            top: insets.top,
            leading: insets.left,
            bottom: insets.bottom,
            trailing: insets.right
        )
    }
}

@objcMembers public final class NebulaDevLoadingPresenter: NSObject {
    public static let shared = NebulaDevLoadingPresenter()

    private var window: UIWindow?
    private weak var loadingView: NebulaDevLoadingView?
    private var showTimestamp: CFTimeInterval?
    private var isHiding = false

    public func show(
        title: String,
        message: String,
        progress: NSNumber?,
        titleColor: UIColor? = nil,
        messageColor: UIColor? = nil,
        backgroundColor: UIColor? = nil,
        dismissButton: Bool = false
    ) {
        let configuration = NebulaHost.shared.resolveDevLoadingConfiguration(
            title: title,
            message: message,
            progress: progress,
            titleColor: titleColor,
            messageColor: messageColor,
            backgroundColor: backgroundColor,
            dismissButton: dismissButton
        )

        DispatchQueue.main.async {
            self.present(configuration: configuration)
        }
    }

    public func hide() {
        DispatchQueue.main.async {
            guard let window = self.window,
                  let loadingView = self.loadingView,
                  !self.isHiding else {
                return
            }

            self.isHiding = true
            let presentedTime = self.showTimestamp.map { CACurrentMediaTime() - $0 } ?? 0
            let delay = max(0, 0.45 - presentedTime)

            UIView.animate(withDuration: 0.22, delay: delay, options: [.curveEaseInOut]) {
                loadingView.alpha = 0
                loadingView.transform = CGAffineTransform(translationX: 0, y: -16)
            } completion: { _ in
                window.isHidden = true
                self.window = nil
                self.loadingView = nil
                self.showTimestamp = nil
                self.isHiding = false
            }
        }
    }

    private func present(configuration: NebulaDevLoadingConfiguration) {
        guard !ProcessInfo.processInfo.environment.keys.contains("XCTestConfigurationFilePath") else {
            return
        }
        guard let mainWindow = UIApplication.shared.connectedScenes
            .compactMap({ $0 as? UIWindowScene })
            .flatMap(\.windows)
            .first(where: \.isKeyWindow) else {
            return
        }

        let window = self.window ?? {
            let overlayWindow: UIWindow
            if let windowScene = mainWindow.windowScene {
                overlayWindow = UIWindow(windowScene: windowScene)
            } else {
                overlayWindow = UIWindow(frame: UIScreen.main.bounds)
            }
            overlayWindow.windowLevel = .statusBar + 1
            let rootViewController = UIViewController()
            rootViewController.view.backgroundColor = .clear
            overlayWindow.rootViewController = rootViewController
            self.window = overlayWindow
            return overlayWindow
        }()

        let contentView: NebulaDevLoadingView
        if let existingLoadingView = loadingView {
            contentView = existingLoadingView
            contentView.render(with: configuration)
        } else {
            contentView = NebulaHost.shared.makeDevLoadingView(configuration: configuration)
            contentView.translatesAutoresizingMaskIntoConstraints = false
            window.rootViewController?.view.addSubview(contentView)
            NSLayoutConstraint.activate([
                contentView.topAnchor.constraint(
                    equalTo: window.rootViewController!.view.topAnchor,
                    constant: mainWindow.safeAreaInsets.top + 10
                ),
                contentView.centerXAnchor.constraint(equalTo: window.rootViewController!.view.centerXAnchor),
                contentView.leadingAnchor.constraint(
                    greaterThanOrEqualTo: window.rootViewController!.view.leadingAnchor,
                    constant: 12
                ),
                contentView.trailingAnchor.constraint(
                    lessThanOrEqualTo: window.rootViewController!.view.trailingAnchor,
                    constant: -12
                ),
            ])
            loadingView = contentView
        }

        window.isHidden = false
        window.layoutIfNeeded()

        if showTimestamp == nil {
            showTimestamp = CACurrentMediaTime()
        }
        isHiding = false

        UIView.animate(withDuration: 0.18, delay: 0, options: [.curveEaseOut]) {
            contentView.alpha = 1
            contentView.transform = .identity
        }
    }
}
