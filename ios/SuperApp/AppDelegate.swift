import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?
  static var sharedRootViewFactory: RCTRootViewFactory?
  static weak var sharedNavigationController: UINavigationController?

  private var reactNativeDelegate: ReactNativeDelegate?
  private var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Initialize Nebula Mini-App Framework
    NebulaHost.shared.initialize()
    
    let delegate = ReactNativeDelegate()
    delegate.dependencyProvider = RCTAppDependencyProvider()

    let reactNativeFactory = RCTReactNativeFactory(delegate: delegate)
    reactNativeDelegate = delegate
    self.reactNativeFactory = reactNativeFactory
    AppDelegate.sharedRootViewFactory = reactNativeFactory.rootViewFactory

    let hostViewController = RNInstanceViewController(moduleName: "SuperApp", title: "Host RN")
    let navigationController = UINavigationController(rootViewController: hostViewController)
    AppDelegate.sharedNavigationController = navigationController

    window = UIWindow(frame: UIScreen.main.bounds)
    window?.rootViewController = navigationController
    window?.makeKeyAndVisible()

    return true
  }
}

final class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
