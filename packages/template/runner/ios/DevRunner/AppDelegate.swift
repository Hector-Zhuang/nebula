import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import NebulaHost

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  static var sharedRootViewController: UIViewController?

  private let reactNativeDelegate = ReactNativeDelegate()
  private let reactNativeFactory: RCTReactNativeFactory

  override init() {
    reactNativeFactory = RCTReactNativeFactory(delegate: reactNativeDelegate)
    super.init()
  }

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let rootView = reactNativeFactory.rootViewFactory.view(
      withModuleName: "__COMPONENT_NAME__",
      initialProperties: nil,
      launchOptions: launchOptions
    )

    let viewController = UIViewController()
    viewController.view = rootView
    AppDelegate.sharedRootViewController = viewController

    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }

  func dependencyProvider() -> (any RCTDependencyProvider)? {
    RCTAppDependencyProvider()
  }
}
