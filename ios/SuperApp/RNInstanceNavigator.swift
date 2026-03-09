import UIKit

@objc(RNInstanceNavigator)
final class RNInstanceNavigator: NSObject {
  @objc
  static func requiresMainQueueSetup() -> Bool {
    true
  }

  @objc(openInstance:props:)
  func openInstance(_ moduleName: String, props: NSDictionary?) {
    DispatchQueue.main.async {
      guard let navigationController = AppDelegate.sharedNavigationController else {
        return
      }

      let initialProps = props as? [AnyHashable: Any]
      let viewController = RNInstanceViewController(
        moduleName: moduleName,
        initialProperties: initialProps,
        title: moduleName
      )
      navigationController.pushViewController(viewController, animated: true)
    }
  }

  @objc
  func popInstance() {
    DispatchQueue.main.async {
      guard let navigationController = AppDelegate.sharedNavigationController else {
        return
      }
      navigationController.popViewController(animated: true)
    }
  }
}
