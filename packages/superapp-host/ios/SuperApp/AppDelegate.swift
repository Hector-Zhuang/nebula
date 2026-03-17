import UIKit
internal import Expo
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: ExpoAppDelegate {
  var window: UIWindow?
  static var sharedRootViewFactory: RCTRootViewFactory?
  static weak var sharedNavigationController: UINavigationController?

  private var reactNativeDelegate: ReactNativeDelegate?
  private var reactNativeFactory: ExpoReactNativeFactory?

  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Initialize Nebula Mini-App Framework
    NebulaHost.shared.initialize()
    
    let delegate = ReactNativeDelegate()
    delegate.dependencyProvider = RCTAppDependencyProvider()

    let reactNativeFactory = ExpoReactNativeFactory(delegate: delegate)
    reactNativeDelegate = delegate
    self.reactNativeFactory = reactNativeFactory
    AppDelegate.sharedRootViewFactory = reactNativeFactory.rootViewFactory

    let hostViewController = RNInstanceViewController(moduleName: "SuperApp", title: "Host RN")
    let navigationController = UINavigationController(rootViewController: hostViewController)
    AppDelegate.sharedNavigationController = navigationController

    window = UIWindow(frame: UIScreen.main.bounds)
    window?.rootViewController = navigationController
    window?.makeKeyAndVisible()

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}

final class ReactNativeDelegate: ExpoReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    bridge.bundleURL ?? bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
