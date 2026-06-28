import UIKit
import NebulaHost

final class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene,
          let navigationController = AppDelegate.sharedNavigationController else {
      return
    }

    let window = UIWindow(windowScene: windowScene)
    window.rootViewController = navigationController
    self.window = window
    window.makeKeyAndVisible()

    for context in connectionOptions.urlContexts {
      _ = NebulaHost.shared.handleIncomingURL(context.url, from: navigationController)
    }
  }

  func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    for context in URLContexts {
      _ = NebulaHost.shared.handleIncomingURL(
        context.url,
        from: AppDelegate.sharedNavigationController
      )
    }
  }

  func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    guard userActivity.activityType == NSUserActivityTypeBrowsingWeb,
          let url = userActivity.webpageURL else {
      return
    }

    _ = NebulaHost.shared.handleIncomingURL(
      url,
      from: AppDelegate.sharedNavigationController
    )
  }
}
