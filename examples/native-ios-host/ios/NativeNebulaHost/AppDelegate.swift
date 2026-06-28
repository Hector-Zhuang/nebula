import React
import ReactAppDependencyProvider
import React_RCTAppDelegate
import UIKit
import NebulaHost

@main
final class AppDelegate: UIResponder, UIApplicationDelegate, NebulaAppDelegate {
  static var navigationController: UINavigationController?

  private var reactNativeDelegate: ReactNativeDelegate?
  private var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    delegate.dependencyProvider = RCTAppDependencyProvider()
    let factory = RCTReactNativeFactory(delegate: delegate)
    reactNativeDelegate = delegate
    reactNativeFactory = factory

    NebulaHost.shared.initialize(appDelegate: self)
    NebulaHost.shared.setServerBaseURL("http://localhost:3001/api")
    return true
  }

  func application(
    _ application: UIApplication,
    configurationForConnecting connectingSceneSession: UISceneSession,
    options: UIScene.ConnectionOptions
  ) -> UISceneConfiguration {
    UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
  }

  func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    NebulaHost.shared.handleIncomingURL(url, from: Self.navigationController)
  }

  func nebulaNavigationController(_ host: NebulaHost) -> UINavigationController? {
    Self.navigationController
  }

  func nebulaRootViewFactory(_ host: NebulaHost) -> RCTRootViewFactory? {
    reactNativeFactory?.rootViewFactory
  }
}

private final class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    bridge.bundleURL
  }
}
