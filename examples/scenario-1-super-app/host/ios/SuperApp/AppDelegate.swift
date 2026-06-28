import React
import ReactAppDependencyProvider
import React_RCTAppDelegate
import UIKit
import NebulaHost

@main
class AppDelegate: UIResponder, UIApplicationDelegate, NebulaAppDelegate {
  var window: UIWindow?
  static var sharedRootViewFactory: RCTRootViewFactory?
  static weak var sharedNavigationController: UINavigationController?

  private var reactNativeDelegate: ReactNativeDelegate?
  private var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    NebulaHost.shared.initialize(appDelegate: self)

    let delegate: ReactNativeDelegate = ReactNativeDelegate()
    delegate.dependencyProvider = RCTAppDependencyProvider()

    let reactNativeFactory = RCTReactNativeFactory(delegate: delegate)
    reactNativeDelegate = delegate
    self.reactNativeFactory = reactNativeFactory
    AppDelegate.sharedRootViewFactory = reactNativeFactory.rootViewFactory

    let hostViewController = RNInstanceViewController(
      rootViewFactory: AppDelegate.sharedRootViewFactory,
      moduleName: "ScenarioSuperappHost",
      prefersNavigationBarHidden: true
    )
    let navigationController = UINavigationController(rootViewController: hostViewController)
    AppDelegate.sharedNavigationController = navigationController

    window = UIWindow(frame: UIScreen.main.bounds)
    window?.rootViewController = navigationController
    window?.makeKeyAndVisible()

    return true
  }

  func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    guard userActivity.activityType == NSUserActivityTypeBrowsingWeb,
          let url = userActivity.webpageURL else {
      return false
    }
    return NebulaHost.shared.handleIncomingURL(url, from: AppDelegate.sharedNavigationController)
  }

  func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    NebulaHost.shared.handleIncomingURL(url, from: AppDelegate.sharedNavigationController)
  }

  func nebulaNavigationController(_ host: NebulaHost) -> UINavigationController? {
    AppDelegate.sharedNavigationController
  }

  func nebulaRootViewFactory(_ host: NebulaHost) -> RCTRootViewFactory? {
    AppDelegate.sharedRootViewFactory
  }

  func nebulaHost(
    _ host: NebulaHost,
    makeHostViewController moduleName: String,
    initialProperties: [AnyHashable: Any]?,
    title: String?
  ) -> UIViewController? {
    RNInstanceViewController(
      rootViewFactory: AppDelegate.sharedRootViewFactory,
      moduleName: moduleName,
      initialProperties: initialProperties,
      title: title
    )
  }
}

final class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    bridge.bundleURL ?? bundleURL()
  }

  override func bundleURL() -> URL? {
    #if DEBUG
      return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
      return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
}
